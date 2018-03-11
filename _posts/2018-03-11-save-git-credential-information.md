---
layout: post
title: 保存Git用户名密码
date: 2018-03-11
categories: blog
tags: [Git]
description: Git credential information in client
---
默认情况下每次用`git`推送代码我们都需要输入用户名和密码，在需要频繁推送代码的时候这么做很麻烦。

我之前的做法一般是把`git`客户端机器的公钥配置到服务器上去，最近发现了一个更简单的方法
```
git config credential.helper store
```
这样把用户名密码保存到本地，也可以避免每次都重新输入了。
