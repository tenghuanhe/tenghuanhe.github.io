---
layout: post
title: 同步异步阻塞非阻塞
date: 2017-09-23
categories: blog
tags: [web]
description: Sync/Async (Non)Blocking
---

# IO分类

## 同步阻塞 `Synchronous Blocking IO`

这种是最常见的

调用`read()`或者`write()`函数，
1. 执行的上下文会切换到内核态
2. 在内核态发生IO操作数据被拷贝到内核缓冲区
3. 数据从内核缓冲区被传输到用户应用程序空间缓冲区
4. 用户应用线程不再被阻塞，可以开始执行并从用户空间缓冲区读取数据


## 同步非阻塞 `Synchronous Non Blocking IO`

其实在打开文件（也就是调用`open()`）或者打开连接的时候可以进行配置为`[non]blocking`，如果配置为`non blocking`那么`read()`或者`write()`的调用会立刻返回，而不会被阻塞。
由应用程序不断的轮询来确定设备准备好了然后读取所有的数据。

当然这么做很低效，因为每一次的轮询不管有没有数据，都会导致执行的上下文切换到内核态然后再切回来。


## 异步非阻塞（事件准备好通知）`Asynchdronous Non Blocking IO with Readiness Events`
`select()/poll()/epoll()`，应用程序首先注册好感兴趣的设备事件，然后在事件发生的时候进行相应的处理
在`Java`里面是`Channel`和`Selector`的概念与此对应
```
Selector selector = Selector.open();

channel.configureBlocking(false);

SelectionKey key = channel.register(selector, SelectionKey.OP_READ);

while(true) {

  int readyChannels = selector.select();

  if(readyChannels == 0) continue;

  Set<SelectionKey> selectedKeys = selector.selectedKeys();

  Iterator<SelectionKey> keyIterator = selectedKeys.iterator();

  while(keyIterator.hasNext()) {

    SelectionKey key = keyIterator.next();

    if(key.isAcceptable()) {
        // a connection was accepted by a ServerSocketChannel.

    } else if (key.isConnectable()) {
        // a connection was established with a remote server.

    } else if (key.isReadable()) {
        // a channel is ready for reading

    } else if (key.isWritable()) {
        // a channel is ready for writing
    }

    keyIterator.remove();
  }
}

```
So the overall idea is to get readiness events in an asynchronous fashion and register some event handlers to handle once such event notifications are triggered. So as you can see all of these can be done in a single  thread while multiplexing among different connections primarily due to the nature of the select() (here I  choose a representative system call) which can return readiness of multiple sockets at a time. This is part of the appeal of this mode of operation where one thread can serve large number of connections at a time. This
mode is what usually known as the “Non Blocking I/O” model.



## 异步非阻塞（事件处理完毕通知）
这个就是`Node.js`的回调函数啦，最常用的原来是最高级的

```
https://www.javacodegeeks.com/2012/08/io-demystified.html
```
