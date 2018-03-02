---
layout: post
title: flingfd介绍
date: 2018-01-03
categories: blog
tags: [flingfd]
description: flingfd, a library to pass fd across processes on Linux
---

Github上面对[`flingfd`](https://github.com/sharvil/flingfd)的介绍简明扼要
```
flingfd is a small, standalone C library to pass file descriptors across processes on Linux.
```
用于在Linux平台上进程之间传递文件描述符的`C`语言库。

`flingfd`库主要提供了两个功能调用
```c
bool flingfd_simple_send(const char *path, int fd);
int flingfd_simple_recv(const char *path);
```

如果你想把一个文件描述符从一个进程发送给另一个进程，在发送进程中调用`flingfd_simple_send`，然后在接收进程中调用`flingfd_simple_recv`，同时要确保你在两个进程中的设置的`path`参数相同。

下面的例子把`stdout`从一个进程发送给另一个进程
```c
#include <flingfd.h>


void send_my_stdout() {
  int fd = fileno(stdout);
  flingfd_simple_send("/tmp/some_unique_path", fd);
}
```
接下来另一个进程往发送者的`stdout`写入
```c
#include <flingfd.h>


void write_to_their_stdout() {
  int fd = flingfd_simple_recv("/tmp/some_unique_path");
  write(fd, "Hello world\n", 12);
}
```
编译代码的时候记得加上`-lflingfd`
