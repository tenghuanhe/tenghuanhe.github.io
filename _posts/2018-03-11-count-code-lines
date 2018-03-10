---
layout: post
title: 统计代码行数
date: 2018-01-28
categories: blog
tags: [Linux]
description: Linux下统计代码行数
---
下面命令用于统计当前目录下（包括子目录）非空行的`Scala`代码行数
```
find . -name "*.scala" | xargs grep -v "^$" | wc -l
```
