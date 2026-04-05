---
layout:     post
title:      "Multiple routers bridge connection "
subtitle:   "How to visit configure pages of each router?"
author:     "Frederick"
date:       2016-09-23
header-img: 
catalog:    true
header-mask: 
tags:
    - Router
    - Network
---

I have 2 wireless routers (R1, R2) in my local area network (LAN). 
R1 is the main router, has IP 192.168.0.1 and DHCP address pool 192.168.0.100~199.
R2 is in bridge mode and connects with R1.
R2 has IP 192.168.1.253, and DHCP address pool 192.168.1.100~199 (actually DHCP service is now disabled automatically).

I have a problem.
When I use a device, say my PC, to connect to Internet from R2, I get an IP 192.168.0.100.
Now I cannot go to 192.168.1.253 to change the settings of R2.
I cannot visit the page successfully, neither use ping command.

The answer is the subnet mask.
Now I have subnet mask 255.255.255.0, which is the same as R1 and R2's default setting.
This mask treat IPs begin with 192.168.0. and 192.168.1. as different LAN.
The easiest way now is setting all device with subnet mask 255.255.254.0.
```254 = 0b11111110```
Then my devices will treat 192.168.0.xxx and 192.168.1.xxx as a same subnet.
And I can easily go to setting pages of R1 and R2.

Also, now I can open DHCP service with R2.
It can assign IPs among 192.168.1.100~199 to devices directly connected to it.