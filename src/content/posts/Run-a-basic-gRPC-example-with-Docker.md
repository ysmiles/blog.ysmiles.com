---
layout:     post
title:      "Run a basic gRPC example with Docker"
subtitle:   "Docker learning notes - 1"
author:     "Frederick"
date:       2017-10-05
header-img: 
catalog:    true
header-mask: 
tags:
    - gRPC
    - Docker
    - Linux
    - Network
---

## Introduction
The purpose of this article is very simple. Just run a gRPC example in different Docker containers.
Since it really costed me a lot of time, I'd like to keep records here.

Docker is a very useful container tool, which can be considered as a light virtualization technique comparing to traditional virtual machine tools such as Virtualbox, VMware, etc.
For more details about the differences between them, as well as the Docker's basics, please refer this [Stack Overflow question][SO1], the [Digital Ocean tutorial][DOt1], or the [Docker official introduction][Docker1].

## Install Docker
The [official tutorial][Docker2] is good enough for Ubuntu.
This alternative installation tutorial from [Digital Ocean tutorials][DOt2] also introduces some basic commands and tips, such as executing the docker command without sudo.
I tested them at an Ubuntu 16.04 x64 server, and everything went well.

Install commands for lazy guys who also use Ubuntu x64 release:

```bash
sudo apt-get update
  
sudo apt-get install \
      apt-transport-https \
      ca-certificates \
      curl \
      software-properties-common
  
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  
sudo add-apt-repository \
     "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
     $(lsb_release -cs) \
     stable"
 
sudo apt-get update
 
sudo apt-get install docker-ce
```

## Install gRPC at local host OS
Actually this step is not needed if you want to do all the work inside containers.
But with local installed package, we can test host-to-container communications through gRPC API.

Here, I explicitly use python3.

```bash
python3 -m pip install grpcio
```

or just

```bash
pip3 install grpcio
```

## Get grpc/python Docker image
Here since I did not build my own Docker image but directly use the [official one][grpc-docker].

To get latest Python 3 environment with gRPC, run

```bash
docker pull grpc/python:1.4
```

Note here "1.4" tag is necessary, otherwise it will pull "latest" one, which is Python 2.7 environment.

## Get gRPC examples
Follow the [gRPC official guide][grpc-guide], we can get the example source code.

```bash
# Clone the repository to get the example code:
git clone -b v1.6.x https://github.com/grpc/grpc
# Navigate to the "hello, world" Python example:
cd grpc/examples/python/helloworld
```

## Run in containers
Run the RPC server in docker container

```bash
docker run -itd --rm --name my-running-server \
      -v "$PWD":/usr/src/myapp -w /usr/src/myapp \
      grpc/python:1.4 python3 greeter_server.py
```

Here "d" in `-itd` means "detach". So we can let the container there and run other commands.
We can use `docker attach my-running-server` to see what is going on for server container, and `CTRL-p` `CTRL-q` to detach again.

Then, we can check docker default network using

```bash
docker network inspect bridge
```

From the output, the server container should have the IP "174.17.0.2" at network "bridge".

Small modify from "localhost" to "174.17.0.2" is required.

```python
def run():
    # channel = grpc.insecure_channel('localhost:50051')
    channel = grpc.insecure_channel('174.17.0.2:50051')
...
```

In same terminal (because I was using ssh connection to a server), run the client

```bash
docker run -it --rm --name my-running-client \
      -v "$PWD":/usr/src/myapp -w /usr/src/myapp \
      grpc/python:1.4 python3 greeter_client.py
```

We can get correct output.

Also we can run client locally.

```bash
python3 greeter_client.py
```

The output should be same.

[SO1]: https://stackoverflow.com/questions/16047306/how-is-docker-different-from-a-normal-virtual-machine
[DOt1]: https://www.digitalocean.com/community/tutorials/the-docker-ecosystem-an-introduction-to-common-components
[Docker1]: https://www.docker.com/what-docker
[Docker2]: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#install-using-the-repository
[DOt2]: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04
[grpc-docker]: https://github.com/grpc/grpc-docker-library
[grpc-guide]: https://grpc.io/docs/quickstart/python.html#run-a-grpc-application