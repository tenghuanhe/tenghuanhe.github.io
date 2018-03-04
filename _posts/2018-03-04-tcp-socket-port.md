---
layout: post
title: TCP中的Socket端口
date: 2018-03-04
categories: blog
tags: [network]
description: Port sharing in TCP/UDP socket
---

今天在SO上看到了一个[问题](https://stackoverflow.com/questions/11129212/tcp-can-two-different-sockets-share-a-port)，问两个不同的套接字可不可以共用一个端口。提问者希望能够写一个能够同时处理100k并发连接的服务器应用，但是他认为由于操作系统中可以用的端口数量大约有64k，如果每一个连接的套接字都被分配一个新的专用端口的话，可以处理的并发连接数就被端口数给限制了，除非多个套接字可以共用同一个端口，他很疑惑。

最高票回答如下：
> A server socket listens on a single port. All established client connections on that server are associated with the same listening port ON THE SERVER SIDE of the connection. An established connection is uniquely identified by the combination of client-side and server-side IP/Port pairs. Multiple connections ont he same server can shre the same server-side IP/Port pair as long as they are associated with different client-side IP/PORT pairs, and the server would be able to handle as many clients as available system resources allow it to.
On the client side, it is common pratice for new outbound connections to use a random client-side port, in which case it is possible to run out of available ports if you make a lot of connections in a short amount of time.

实际上，操作系统是通过一个5元组唯一确定一个连接的
```
本地IP
本地port
远端IP
远端port
协议(TCP/UDP)
```
只要其中任何一个元素不同，都会被操作系统认为是完全不同的连接，因此只要客户端请求的`IP/Port`不同，服务器端的套接字完全可以使用相同的端口。通过`netstat -anp`命令我们也可以看到使用本地同一个端口的不同连接也有不同的状态，例如监听的主进程（或线程）连接处于`LISTENING`状态，而更多的处理请求的进程（或线程）连接则处于`ESTABLISHED`状态。
