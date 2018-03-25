---
layout: post
title: HashMap扩容中的模运算
date: 2018-03-23
categories: blog
tags: [Java]
description: resize of HashMap in Java
---

`Java`中`HashMap`的`resize()`方法有如下说明
> Initializes or doubles table size. If null, allocates in accord with initial capacity target held in field threshold. Otherwise, because we are using power-of-two expansion, the elements from each bin must either stay at same index, or move with a power of two offset in the new table.

在容量扩大一倍之后重新计算哈希，元素的下标要么保持不变，要么在新的`table`中移动`2^n`（实际上也是旧的容量大小）位。

假设`table`当前容量为`2^n`，某个元素的哈希值为`h`
* 扩容之前，下标的值相当于取`h`的低`n`位；
* 扩容之后，容量变为`2^(n+1)`，下标的值相当于取`h`的低`n+1`位。

因此有：
* 如果`h`的第`n+1`位为0，则扩容之后，该元素在`table`中的下标位置不变；
* 如果`h`的第`n+1`为为1，则扩容之后，该元素在`table`中的下标位置往后移动`2^n`个位置；


> 在JDK1.8的实现中，优化了高位运算的算法，通过`hashCode()`的高16位异或低16位实现的：`(h = k.hashCode()) ^ (h >>> 16)`
