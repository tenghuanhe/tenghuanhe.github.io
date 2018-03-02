---
layout: post
title: 哨兵线性搜索
date: 2018-01-28
categories: blog
tags: [algorithm]
description: 带哨兵的线性搜索算法
---

今天翻看一本算法书的时候，在线性搜索算法中作者给出下面的伪代码：
```c
//  Search a file F with key values K1, ...,Kn for a record Ri such that Ki = K. If there is no such record, i is set to 0

procedure SEQSRCH(F,n,i,K)
  K0 <- K; i <- n
  while Ki != K do
    i <- i - 1
  end
end SEQSRCH
```
并指出：

> Note that the introduction of the dummy record R0 with key K0 = K simplifies the search by eliminating the need for an end of file test (i < 1) in the while loop. While this might appear to be a minor improvement, it actually reduces the running time by 50% for large n (see table 7.1).

一开始看得一头雾水，搜索之后发现原来这个叫做带哨兵的线性搜索算法，思想其实很简单：

标准的线性搜索算法每次在检查每个元素值的同时也会检查当前索引下标来判断是否到了最后一个元素。而哨兵搜索算法则把要搜索的目标值放到最后一个（或者第一个）位置上，这样可以只用对元素的值进行判断而直接跳过对索引下标的检查，从而在每次迭代的时候减少了一次比较。
