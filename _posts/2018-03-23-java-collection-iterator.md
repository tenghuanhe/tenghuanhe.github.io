---
layout: post
title: Java中的迭代器Iterator
date: 2018-03-23
categories: blog
tags: [Java]
description: Java Collection Iterator
---

`Java`中的迭代器允许我们在遍历`Collection`的同时进行删除操作：

```java
List<String> list1 = new ArrayList<>(Arrays.asList("a", "b", "c", "d"));
System.out.println(list1.getClass().getCanonicalName());    // java.util.ArrayList
Iterator<String> it1 = list1.iterator();
while (it1.hasNext()) {
    if (it1.next().equals("c")) {
        it1.remove();   // 利用Iterator我们可以在遍历的时候删除元素。
    }
}

System.out.println(list1);  // 输出[a, b, d]
```

如果我们写成下面这样
```
List<String> list2 = Arrays.asList("a", "b", "c", "d");
        System.out.println(list2.getClass().getCanonicalName());    // java.util.Arrays.ArrayList，
        Iterator<String> it2 = list2.iterator();
        while (it2.hasNext()) {
            if (it2.next().equals("c")) {
                try {
                    it2.remove();   // 抛出java.lang.UnsupportedOperationException异常
                } catch (Exception ex) {    // 这里catch异常并不是正确的做法
                    ex.printStackTrace();
                }
            }
        }

        System.out.println(list2);  // 输出[a, b, c, d]，并没有被修改
```

注意这里`Arrays.asList(..)`返回的`ArrayList`并不是我们平时用到的ArrayList，而是Arrays中的一个私有静态内部类，其iterator的remove方法继承自java.util.AbstractList#remove()方法直接抛出异常，文档中给出的说明如下：
> Arrays.asList Returns a fixed-size list backed by the specified array.(Changes to the returned list "write through" to the array.)
因为背后的数组是固定长度不可变的，所以返回的`ArrayList`既不支持添加也不支持删除操作。

另外一个值得注意的地方是`java.util.Iterator`中只有`remove()`接口，并没有`add()`接口，其中的原因是
* 对于`List`或者`Set`在进行迭代遍历访问的时候，`remove()`操作都是有意义的；
* 而除非是对有序的数据结构`List`，对于无序的`Set`在遍历的同时进行插入并没有很大的意义，因为可以直接插入而无需对集合进行遍历。

值得注意的是，针对`List`有专门的`java.util.ListIterator`支持`add()`接口。
