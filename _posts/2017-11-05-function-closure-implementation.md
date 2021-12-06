---
layout: post
title: Closure function
date: 2017-11-05
categories: blog
tags: [language]
description: How function closure can be implemented?
---

How can functions be evaluted in old environments that aren't aroud anymore?

    - The language implementation keeps them (old environments) around as necessary

We can define the semantics of functions as follows:

* A function value has two parts
  * The code part (obviously)
  * The environment part that was current when the function was **defined**
* This is a "pair" like `(func_code, current_env)`, but you cannot access either piece of this pair.
* All you can do is call this "pair"
* This pair is called a `function closure`
* A call evaluates the code part in the environment (extended with the function argument)
