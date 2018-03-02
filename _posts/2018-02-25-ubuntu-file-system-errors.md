---
layout: post
title: Ubuntu文件系统错误
date: 2018-02-25
categories: blog
tags: [Linux]
description: /dev/sda1 contains a file system with errors, check forced
---

启动进入Ubuntu之后界面出现如下错误提示：

```
/dev/sda1 contains a file system with errors, check forced.
Inodes that were part of a corrupted orphan linked list found.

/dev/sda1: UNEXPECTED INCONSISTENCY: RUN fsk MANUALLY.
        (i.e, without -a or -p options)

fsck exited with status code 4
The root filesystem on /dev/sda1 requires a manual fsck

BusyBox v1.22.1 (Ubuntu 1:1.22.0-19ubuntu2) built-in shell (ash)
Enter 'help' for a list of built-in commands.
(ubutramfs)
```

解决办法如下：
执行
```
fsck -f /dev/sda1
```
并按照提示一路`yes`就可以了。