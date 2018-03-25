---
layout: post
title: 什么是RDF
date: 2018-03-25
categories: blog
tags: [web]
description: What is RDF
---

今天看到`RDF`这个概念，查资料简单学习了一下。

`RDF`全称`Resource Description Framework`（资源描述框架），最初在1999年由W3C作为一种编码元数据的标准提出来。

我们知道，目前建立的Web主要是给人用的，人们在互联网上冲浪，比如阅读文章/听音乐/看视频等等，这些内容基本上是通过`HTML`来展示的。
但是对于机器来说，这些展示出来的内容是难以理解的，我们想要自动化地做任何事情都困难。
比方说你写了一个自动抓取京东商城上商品评论的爬虫，即使抓取下来了所有的评论，要理解这些内容并量化也是很困难的，因为这些评论是人写的，给人看的。
如果京东哪天改变了网页的结构，之前辛苦写好的爬虫也不能用了。

为了解决这个问题，我们可能会想：
**如果所有的买家在网上购物（不论是京东还是淘宝或者Amazon）发表商品评论的时候都愿意接受并遵守某种标准的话，什么样的标准才能让我们上面的工作更容易些呢？**

不难想到，这个标准应该满足下面的要求：
* 足够灵活，能够让人们表达任何信息
  不能说使用了这个标准之后我原来在评论里想表达的信息表达不了了。
* 应该能够连接整个Web上分布的所有信息
  对于同一个商品，不同的买家叫法可能不一样，比如同一本书，有人可能叫《算法导论》，有人称为《算导》，还有的人成为《CLRS》。应该有机制来消除这种不确定性。
  

`RDF`利用一个抽象模型将知识（或者信息）分解为小的部分，每一部分都遵守一些简单的规则。
每个小的部分叫做`Statement`，遵守以下两个规则
>1. Knowledge (or information) is expressed as a list of statements, each statement takes the form of Subject-Predicate-Object, and this order should never be changed.
一个`RDF statement`比如有如下格式
```
subject ---- predicate ----> object
```
>2. The name of a resource must be global and should be identiﬁed by Uniform Resource Identiﬁer (URI).

TBD...
