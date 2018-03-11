---
layout: post
title: 什么时候使用XML而不是JSON
date: 2018-03-11
categories: blog
tags: [web]
description: When to use JSON or XML
---
什么时候使用`XML`而不是`JSON`

* 需要命名空间，避免冲突的时候
* 需要属性的时候（类似于`html`中的属性`style`）

所有的`XML`命名空间都通过`XML`保留属性`xmlns`或者`xmlns:prefix`声明，这些属性的值必须是一个合法的命名空间名称。
比如下面的声明将`xhtml`前缀映射到了`XHTML`命名空间
```
xmlns:xhtml="http://www.w3.org/1999/xhtml"
```
任何名字以前缀`xhtml`开头的元素或者属性都被认为是在`XHTML`命名空间中，主要它或者他的父级元素有上面的命名空间声明。

定义一个默认的命名空间也是可能的，比如
```
xmlns="http://www.w3.org/1999/xhtml"
```


### 参考链接
```
[1] http://www.xml.com/pub/1999/01/namespaces.html
```
