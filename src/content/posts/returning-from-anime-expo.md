---
title: Returning from Anime Expo with a System Design Question
date: 2026-08-14
subtitle: "An engineer walks out of a convention and can't stop thinking about queues. Here's the system design, the trade-offs, and what I'd change."
summary: "What if conventions replaced physical lines with a digital queue system? The design, the trade-offs, and what I'd change — Go, PostgreSQL, Redis, and a few hard-won lessons about consistency."
tags: [System Design, Distributed Systems, Go, Redis, PostgreSQL, Event-Driven, Queueing]
---

## The question

I came back from Anime Expo with sore feet and a loop running in my head. Not the panels — the lines. A 90-minute line for a 50-minute panel. A hallway that became a wall of humans because two popular rooms let out into the same corridor at the same moment. A friend who sat through a panel she didn't care about, just so she'd have a seat for the one she did two hours later.

I've stood in enough of those lines to know the feeling is the *product* at a big convention. But as an engineer, I couldn't stop turning it over: **how would you actually design a system to eliminate physical lines at a 50,000-person, multi-room, multi-day convention?**

Not "what app would you build" — what would you build *if it had to work*. Because the constraints stack up fast:

- **Throughput** — fifty thousand people all trying to reserve the same 500-seat room at the same moment.
- **Consistency** — you can never, ever seat more people than a room holds, under real concurrency.
- **Fairness** — everyone plays by the same visible rules, or nobody trusts the system.
- **Gentle enforcement** — you have to punish no-shows enough that promises mean something, without turning a fan convention into a surveillance state.
- **Physical reality** — the schedule isn't a list of times; it's people moving through corridors.

That's a real distributed-systems problem wearing a fanny pack. Here's how I framed it, what I built, and the trade-offs I'd defend (and a few I'd redo).

## This is not a ticketing problem

The first trap is reaching for a ticketing system. Concert platforms assume assigned seats and one room. A convention is re-seated, multi-room, multi-day, with overlapping events and rooms that often *aren't cleared between sessions*. Different beast.

Strip it down and you're really managing three scarce resources:

1. **Seats** — hard capacity per room. The invariant is *zero overbooking*.
2. **Promises** — reservations and waitlist positions. A reservation has to *mean something*: hold a seat and don't show, and there's a consequence — and the seat gets recycled in seconds, not hours.
3. **Physical space** — the crowd flowing *between* rooms is itself the constraint. Two panels that look independent on a spreadsheet can deadlock a corridor.

Plus one requirement that shapes everything else: **visibility**. Attendees need to know "is the line moving, will I make it, is the room already full." Organizers need to see occupancy in real time instead of discovering the mob from a panicked volunteer's radio call.

Notice what's *not* on that list: "a database that can handle it." The data volume is tiny by Bay Area standards — a convention is tens of thousands of writes a *day*, not a second. The hard part isn't throughput. It's getting three consistency-sensitive state machines (reservation, occupancy, reputation) to agree about what's true — while staying fair and gentle.

## The design

I built it as a **modular monolith** in Go: one binary, with the domain split into bounded contexts that each own their state and talk through an event bus. Postgres for state, Redis for the parts that need atomic ordering (queue positions), Redis Streams for the bus. chi for the router, pgx and go-redis underneath.

The contexts:

- **Identity & Presence** — registration, digital badges (QR/NFC), checkpoint scans, occupancy.
- **Scheduling & Venue** — rooms, zones, floors, sessions, conflict detection, reassignment.
- **Reservation & Waitlist** — reserve, auto check-in, no-show detection, waitlist promotion.
- **Virtual Queue** — doorless lines (signings, exclusives) with position + ETA.
- **Reputation & Enforcement** — strikes, cooldowns, decay.
- Plus read-only **Analytics** and a **Notification** engine for reminders.

The central flow is one scan:

```
badge scan ──▶ resolve token ──▶ write presence + bump occupancy (4 levels)
                                ──▶ publish AttendeeScanned
                                      ├─▶ Reservation: auto check-in
                                      └─▶ SSE hub: fan out to every connected client
```

A scan at a room door does three things in one event: it records presence, updates a *materialized* occupancy count (building → floor → zone → room), and triggers auto check-in for any reservation the attendee holds in that room. That last part is the product's heartbeat — no separate "check in" step, no re-scan, no paper.

The algorithms that matter are each small, but each earns its keep:

- **Atomic capacity claim** — a seat is claimed with a conditional `UPDATE ... WHERE capacity_remaining > 0` inside a transaction, so two people hitting the last seat at once can't both win. My load test *caught a real overbooking bug here* before I fixed it — the kind that only shows up under race.
- **No-show detection** — a cron marks reservations as no-show with an atomic `UPDATE ... WHERE status = 'confirmed'`, so the deadline check can't double-fire.
- **Waitlist promotion** — the moment a seat frees (cancel or no-show), the next person is promoted automatically; the freed seat publishes a `SlotOpened` event so nothing vanishes silently.
- **Virtual queue advance** — Redis sorted sets, score = tier priority + timestamp, `ZPOPMIN` to hand out the next slot, a 2-minute confirm window, and a cron that re-advances when someone ignores the ping.
- **Conflict detection** — three modes: room overlap, adjacent-room congestion (>80% booked, close end/start times), and back-to-back risk with walking distance.
- **Reputation decay** — strikes expire, bans are short, everything is configurable per event.

## The trade-offs

This is the part I actually wanted to write, because it's where the design got interesting.

**Modular monolith vs. microservices.** I drew service boundaries from day one — each context is a package with its own service/repository interfaces — but deployed them in one process, to be extracted later if needed. Why: the failure mode of an early system is never "my services don't scale," it's "I can't refactor across an RPC boundary." The cost is real coupling: contexts read each other's tables through shared-database reader interfaces, which is honest in-process but leaks if you ever split. I'm comfortable with that bet for now.

**Consistency vs. availability — the CAP theorem's CP/AP split — the lesson I'd teach.** This one cost me the most. The CAP theorem says a distributed system can't have both *consistency* and *availability* during a network partition, so every subsystem must pick one: **CP** (consistent, sacrifice availability when the network breaks) or **AP** (available, tolerate temporary drift). The instinct is to treat the whole system as eventually consistent because "it's just crowd data." Wrong. Different subsystems need different consistency:

- **Reservations are CP.** The invariant is *zero overbooking*, and I'll take a hot row and a lock over a double-booked seat every time.
- **Presence and analytics are AP.** If occupancy drifts by a couple of heads for a minute, nobody dies; you reconcile later.

The bug that taught me this: my first event bus was **in-memory and synchronous** — an AP channel carrying CP-effectful writes. When a handler failed, strikes and promotions just *dropped*. And there was a crash window between committing to Postgres and publishing the event. The fix was outbox-style idempotency, then Redis Streams with consumer groups so each event is processed exactly once fleet-wide and a dead consumer's work gets reclaimed. If I could send one message to past me: *name which parts are CP and which are AP before you write the bus.*

**Redis sorted sets vs. Postgres for queues.** A queue position is "where am I in line" — a rank — and Redis sorted sets do rank natively and atomically (`ZADD`, `ZRANK`, `ZPOPMIN`). Postgres would need either a per-queue sequence or a table scan. So positions live in Redis. The trade-off: queue state is now split across two stores, and if they ever disagree you have divergence. There's a reconciler on the roadmap for exactly that. I'll take the atomicity now and pay for the reconciler later — but I'm naming the debt out loud.

**"No room clearing" by default.** Most conventions let you stay in a room across consecutive sessions, so I designed for it: if you're already scanned into Room 201 for the 2 PM panel and hold a reservation for the 4 PM panel in the same room, you're already checked in. This is the single biggest attendee-experience win — it kills seat-squatting in one move — but it meaningfully complicates occupancy and check-in logic. Room clearing becomes an opt-in per-session flag for special cases (signings, VIP events), not the default.

**Fairness vs. utilization.** A first-come system rewards whoever refreshes fastest; a pure lottery is fair but feels arbitrary for low-demand panels. I landed on: first-come for most sessions, a **lottery allocation mode** for oversubscribed ones (pre-deadline tickets, a staff draw with capacity-bounded winners), **per-attendee booking limits** (Disney's 120-minute anti-hoarding rule, generalized), and **bounded waitlists** that honestly say "waitlist full" instead of stringing people along. Every one of those is a knob, because the *right* fairness setting is per-event, not universal.

**Where the throughput actually is.** I measured it, because "we can't handle the scale" is usually a feeling, not a number. 500 concurrent reservation attempts settle in about 114 ms — roughly 4.4k claims/second. The bottleneck isn't the row lock on the hot session; it's the connection pool (about 25 connections ≈ 5k attempts/sec). For a 50–100k-person convention that's *more than enough* — the system is not throughput-bound. The honest open item is the worst-case "ticket drop": 5,000 people hammering a 500-seat room the instant it opens, where I currently spend two round-trips per attempt and need to batch it down. That's the only place raw throughput matters, and it's a known, bounded fix.

## What exists today

Twelve phases in, the core is working and contract-tested:

- **Attendee app + organizer dashboard**, served from the same Go binary (a PWA): schedule, reserve, QR badge, live queue position with a confirm countdown, alerts.
- **Organizer side**: a live occupancy board, queue control, conflict warnings, policy config, analytics, and an emergency switch that pauses everything system-wide.
- **Reservations**: atomic claims, auto check-in on scan, no-show detection with an accommodation grace period, waitlist auto-promotion, transit-time warnings.
- **Fairness controls**: booking limits, bounded waitlists, and lottery allocation.
- **Reminders**: confirmation plus T-24h / T-2h / morning-of — the single most proven no-show reducer (industry numbers: 30–50% no-shows for free reservations, 15–25% for paid; reminders are what close the gap).
- **Analytics**: heatmaps, no-show reports, queue wait times, a crowd-flow forecast, and zone-to-zone journey mapping.
- **Ops**: CI running unit → integration → smoke → load, Kubernetes manifests, an embedded migration runner, an OpenAPI spec (63 paths), and `tenant_id` on all 18 tables as SaaS groundwork.

The honest status line: **this is a solid, contract-tested prototype, not a production system.** It passes a 150/150 load test and a full convention simulation in containers and on my laptop. It has never survived a real convention. Those are different sentences, and I try not to blur them.

## What I'd improve

In rough priority order:

**Short-term engineering.** A reconciler for the Postgres/Redis queue split. The burst-path batching (two round-trips → one). Connection pooling (PgBouncer). And a hygiene backlog that only matters because I know it's there: unvalidated enums, a few error strings leaking internals, a pagination edge case.

**Product.** Real notification channels — SMS and email adapters sit behind an interface today, but actual delivery is still on the roadmap. A proper checkpoint scan kit (the tablet page a volunteer holds at the door). Enforcement for the opt-in room-clearing flag, which is modeled but not yet wired.

**Scale / SaaS.** Multi-tenant auth and row-level-security read-scoping — the `tenant_id` stamping is done, the isolation isn't. Managed Postgres/Redis and CI-driven deploys from the existing manifests. Read replicas if analytics ever outgrows the primary.

**The hard, deliberately-deferred problems.** Offline resilience (local-first, eventual consistency, conflict resolution — a genuinely different architecture). Group reservations (cascade cancellation, partial no-show). VIP tiers (tiered access windows, differentiated grace periods). I deferred these not because they're unimportant, but because each multiplies the fairness problem — and I'd rather nail single-attendee fairness first.

**The test that actually matters.** A pilot: one mid-size convention (5–20k people), free, fully instrumented, measured against a baseline — wait time, no-show rate, capacity utilization, NPS. Everything before that is a dress rehearsal. I can simulate 100k attendees in-process; I can't simulate the moment a real hallway backs up and a real organizer has to make a call.

## The answer

So — how do you design a system to eliminate physical lines at a convention?

Not "use Kafka" or "go microservices." The answer I keep coming back to is four rules:

1. **Name your invariants.** Zero overbooking. Promises have consequences. These are non-negotiable, and they determine your consistency model.
2. **Split CP from AP on purpose.** The parts that must agree live on one path; the parts that can drift live on another. Never run an effectful write through a lossy channel.
3. **Make enforcement gentle and configurable.** Strikes that decay, short bans, per-event knobs — punishment as a scalpel, not a hammer.
4. **Treat physical space as a first-class constraint.** The schedule is a flow problem, not a list of times.

The same engine — *identity + capacity-aware promises + physical-space awareness* — generalizes anywhere people and scarce experiences meet: theme parks, film festivals, book signings, museum exhibits, campus events. But the thing I actually took away from Anime Expo isn't an architecture diagram.

It's that the line isn't a neutral cost. It's a tax on joy, paid disproportionately by the people who care the most. Standing in one for three hours to see something you love for fifty minutes is exactly the problem a system like this is for.

---

*Built with Go, PostgreSQL, and Redis.*
