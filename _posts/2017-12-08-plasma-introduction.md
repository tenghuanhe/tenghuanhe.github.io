---
layout: post
title: Plasma共享内存对象存储介绍
date: 2017-12-08
categories: blog
tags: [plasma]
description: Plasma, a High-Performance Shared-Memory Object Store
---

`plasma`是一个高性能的共享内存存储，最初起源于[`ray`](https://github.com/ray-project/ray)项目，后来被贡献给了[`Apache Arrow`](https://github.com/apache/arrow)项目并成为其中的一部分。

我们先看看`plasma`最初版本的代码长什么样子，执行下面的命令
```
git clone https://github.com/ray-project/ray.git
cd ray
git checkout 97087b079177f6617d242d954fbccac208b369b5
make
cd build
```
在`build`目录下，可以看到`example`和`plasma_store`两个可执行文件，其中`plasma_store`是服务器端程序，`example`则用于演示如何从客户端调用共享内存对象服务。

首先在在当前终端窗口启动服务器程序：
```
➜  build git:(97087b0) ✗ ./plasma_store -s /tmp/plasma_socket
[INFO] (src/plasma_store.c:273) starting server listening on /tmp/plasma_socket
```
其中`-s`用于指定一个套接字名称

接下来，在另一个终端中执行：
```
./example -s /tmp/plasma_socket -g
```
`-g`表示获取事先指定好`object_id`的内存对象，执行之后我们会发现程序卡住不会有任何输出，因为要获取的对象此时在`plasma store`并不存在。

这时候再打开另外一个终端并执行：
```
./example -s /tmp/plasma_socket -c -f
```
其中`-c`表示创建内存对象，`-f`表示通知当前正在等待的客户端对象可用，这个时候前面的`get`程序收到通知并获取对象，然后就会正常结束并退出。
