---
layout: post
title: Java HashMap添加元素
date: 2018-03-24
categories: blog
tags: [Java]
description: HashMap putVal in Java
---

```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
        // 要插入key的hashCode不存在，直接存入
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            // 要插入key已经存在（当然hashCode也一定相同）
            e = p;
        else if (p instanceof TreeNode)
            // 要插入key的hashCode存在，而且这个hashCode产生碰撞的元素足够多并且转成了一棵树
            // 调用树根p的putTreeVal方法，如果找到相同的key，返回对应的元素，否则添加到树上，返回null
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            // 要插入key的hashCode存在，产生碰撞的元素还不够转成一棵树，还是链表的形式
            for (int binCount = 0; ; ++binCount) {
                // 遍历链表的同时统计链表中元素的数量
                if ((e = p.next) == null) {
                    // 到了链表的末尾，把要添加的元素append到链表上
                    p.next = newNode(hash, key, value, null);
                    // 达到了转成一棵树的阈值了，转成一棵树
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    // 在链表中找到了和要插入元素key完全相同的元素
                    break;
                p = e;
            }
        }
        if (e != null) { // existing mapping for key
            // 存在相同的值，替换新新值，返回旧值
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

`putTreeVal`是`TreeNode`的方法
```java
final TreeNode<K,V> putTreeVal(HashMap<K,V> map, Node<K,V>[] tab,
                               int h, K k, V v) {
    Class<?> kc = null;
    boolean searched = false;
    // 如果没有parent则当前node就是树的根节点
    TreeNode<K,V> root = (parent != null) ? root() : this;
    for (TreeNode<K,V> p = root;;) {
        int dir, ph; K pk;
        if ((ph = p.hash) > h)
            // 哈希值太大，往左找
            dir = -1;
        else if (ph < h)
            // 哈希值太小，往右找
            dir = 1;
        else if ((pk = p.key) == k || (k != null && k.equals(pk)))
            // 当前值就是要找的值，key值相同（当然哈希值也相同），直接返回找到的节点
            return p;
        else if ((kc == null &&
                  (kc = comparableClassFor(k)) == null) ||
                 (dir = compareComparables(kc, k, pk)) == 0) {
            // 当前节点和要添加的节点哈希值相等，但是key值不同，则只好分别查找左右子节点
            if (!searched) {
                TreeNode<K,V> q, ch;
                searched = true;  // 只查一次
                if (((ch = p.left) != null &&
                     (q = ch.find(h, k, kc)) != null) ||
                    ((ch = p.right) != null &&
                     (q = ch.find(h, k, kc)) != null))
                    // 找到啦
                    return q;
            }
            dir = tieBreakOrder(k, pk);
        }

        TreeNode<K,V> xp = p;
        if ((p = (dir <= 0) ? p.left : p.right) == null) {
            // 一直找到了叶子节点，也没有完全相同的key，加到树上对应的位置
            Node<K,V> xpn = xp.next;
            TreeNode<K,V> x = map.newTreeNode(h, k, v, xpn);
            if (dir <= 0)
                xp.left = x;
            else
                xp.right = x;
            xp.next = x;
            x.parent = x.prev = xp;
            if (xpn != null)
                ((TreeNode<K,V>)xpn).prev = x;
            // 红黑树中，插入元素之后必要的平衡操作
            moveRootToFront(tab, balanceInsertion(root, x));
            return null;
        }
    }
}
```
