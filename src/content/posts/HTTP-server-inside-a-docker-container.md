---
title: "HTTP server inside a docker container"
subtitle: "Docker learning notes - 2"
date: 2017-12-06
summary: "A short note on exposing an HTTP server from a Docker container with port mapping."
tags:
  - Docker
  - Linux
  - Network
  - HTTP
  - Rust
---

## Introduction

This article mainly focuses on how to run an HTTP server inside a Docker container.
The key point is port mapping.

## Basic setup

I skipped installation of Docker on Ubuntu here. Please refer to my [last Docker note](/posts/run-a-basic-grpc-example-with-docker/).

For server example, I have some in my github.

[C version](https://github.com/ysmiles/ServerClientExamples)

[Python flask](https://github.com/ysmiles/Smart_Intersection)

[Rust version](https://github.com/ysmiles/ServerClientExamples-Rust)

Here I choose Rust version for example.

## Run Rust docker

```bash
# pull rust official image to local
docker pull rust

# run a container
docker run -itd -p 8080:5000 --name httpserver rust
```

Here `-itd` means interactive, TTY, and detached, which are running options for the container.
`-p` sets the port mapping. `8080` is the host port and `5000` is the container port.

So we need the server inside the container to listen for HTTP requests on port `5000`.

Because we run the container in detached mode, we first need to attach to the container.

```bash
# httpserver is our container name
docker attach httpserver
```

Inside the container we can use `Ctrl-P` then `Ctrl-Q` to detach again.

Another way to go into the container is to open another shell.

```bash
# -it has same meaning as 'docker run'
docker exec -it httpserver bash
```

Since we have one more shell now, it is OK to close the other one.

## Setup server

Now assume we are already in the container. Vim and Git might be needed, but I skip their installation here.

To fetch and run the server:

```bash
# clone source code from my github
git clone https://github.com/ysmiles/ServerClientExamples-Rust

# compile and run
cd tcptime/
cargo run
```

It might be necessary to change `main.rs` from `TcpListener::bind("127.0.0.1:8000")` to `TcpListener::bind("0.0.0.0:5000")` before compiling.
That lets the server accept connections from outside the container after the port mapping.

Now detach from the container and test at server local to see the result.

```bash
# curl can give a http request to a specific address
curl http://0.0.0.0:8080
```

The output should be something like below:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Hello!</title>
</head>

<body>
  <h1>Hello!</h1>
  <p>Hi from Rust</p>
  <p>Current server time is:</p>
  <p>2017-12-06 11:20:17</p>
</body>

</html>
```

Then test remotely. The original post embedded a live external server here, but that demo endpoint is no longer reliable and the old `http://` embed was not appropriate to keep in the migrated site.

If you want to verify your own setup instead, open the mapped port in a browser or use `curl` from another machine on the same network.
