---
layout: post
title: Netty中channelRead事件调用链
date: 2018-02-27
categories: blog
tags: [Netty]
description: channelRead event handler in Netty
---

我们从[`Netty User Guide`](http://netty.io/wiki/user-guide-for-4.x.html)中的一个简单例子开始：
```
package io.netty.example.discard;

import io.netty.buffer.ByteBuf;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;

/**
 * Handles a server-side channel.
 */
public class DiscardServerHandler extends ChannelInboundHandlerAdapter { // (1)

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) { // (2)
        // Discard the received data silently.
        ((ByteBuf) msg).release(); // (3)
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) { // (4)
        // Close the connection when an exception is raised.
        cause.printStackTrace();
        ctx.close();
    }
}
```

注意这里的`channelRead`事件处理方法，当接收到新消息的时候这个方法会被调用，而我们关心的则是从接收到新消息到这个方法被调用的整个过程。

Channel在读入字节流之后，首先会将消息转成`ByteBuf`并调用
```
pipeline.fireChannelRead(byteBuf);
```
然后交给提前注册好的各种`ChannelHandler`进行处理。
