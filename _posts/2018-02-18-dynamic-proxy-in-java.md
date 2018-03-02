---
layout: post
title: Java动态代理
date: 2018-02-18
categories: blog
tags: [Java]
description: Dynamic Proxy implementation in Java
---

代理是基本的设计模式之一，通过代理我们可以在为实际服务代码添加额外的逻辑，甚至直接修改或者替换实际服务的行为。

首先看一个简单代理的例子（摘自《Java编程思想》）：

```java
interface Interface {
  void doSomething();
  void somethingElse();
}

class RealObject implements Interface {
  public void doSomething() {
    System.out.println("doSomething");
  }
  public void somethingElse(String arg) {
    System.out.println("somethingElse " + arg);
  }
}

class SimpleProxy implements Interface {
  private Interface proxied;
  public SimpleProxy(Interface proxied) {
    this.proxied = proxied;
  }
  public void doSomething() {
    System.out.println("SimpleProxy doSomething");
    proxied.doSomething();
  }
  public void somethingElse(String arg) {
    System.out.println("SimpleProxy somethingElse " + arg);
    proxied.somethingElse(arg);
  }
}

class SimpleProxyDemo {
  public static void consumer(Interface iface) {
    iface.doSomething();
    iface.somethingElse("bonobo");
  }

  public static void main(String[] args) {
    consumer(new RealObject());
    consumer(new SimpleProxy(new RealObject()));
  }
}
```

上面的例子中因为`consumer()`客户端接受的是`Interface`接口，所以它无从得知正在获取的是`RealObject`还是`SimpleProxy`，因为两者都实现了相同的接口。但是在第二次调用中，`SimpleProxy`已经插入到了客户端和实际对象之间，并调用和实际对象相同的方法。

Java中的动态代理支持动态地创建代理对象并动态地处理对被代理方法的调用。在动态代理上所做的所有调用都会被重定向到一个单一的`InvocationHandler`调用处理器上。

下面用动态代理重写上面的例子：

```java
import java.lang.reflect.*;

class DynamicProxyHandler implements InvocationHandler {
  private Object proxied;
  public DynamicProxyHandler(Object proxied) {
    this.proxied = proxied;
  }
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    System.out.println("*** proxy: " + proxy.getClass() + ", method: " + method + ", args: " + args);
    if (args != null) {
      for (Object arg : args) {
        System.out.println(" " + arg);
      }
      return method.invoke(proxied, args);
    }
  }

  class SimpleDynamicProxy {
    public static void consumer(Interface iface) {
      iface.doSomething();
      iface.somethingElse("bonobo");
    }
    public static void main(String[] args) {
      RealObject real = new RealObject();
      consumer(real);
      // 插入代理并再次调用
      Interface proxy = (Interface) Proxy.newProxyInstance(Interface.class.getClassLoader(), new Class[] {Interface.class}, new DynamicProxyHandler(real));
      consumer(proxy);
    }
  }
}
```

为了弄清楚动态代理是如何实现并生效的，我们在运行时加上`-Dsun.misc.ProxyGenerator.saveGeneratedFiles=true`选项，将动态生成的类文件保存下来，并利用反编译工具对文件进行查看：

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.sun.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.lang.reflect.UndeclaredThrowableException;

public final class $Proxy0 extends Proxy implements Interface {
    private static Method m1;
    private static Method m3;
    private static Method m2;
    private static Method m4;
    private static Method m0;

    public $Proxy0(InvocationHandler var1) throws  {
        // this.h = h，将我们编写的handler传递给代理类，以便代理类调用我们期望的行为方法
        super(var1);
    }

    public final boolean equals(Object var1) throws  {
        try {
            return (Boolean)super.h.invoke(this, m1, new Object[]{var1});
        } catch (RuntimeException | Error var3) {
            throw var3;
        } catch (Throwable var4) {
            throw new UndeclaredThrowableException(var4);
        }
    }

    public final void doSomething() throws  {
        try {
            // 调用DynamicProxyHandler的invoke方法
            super.h.invoke(this, m3, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    public final String toString() throws  {
        try {
            return (String)super.h.invoke(this, m2, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    public final void somethingElse(String var1) throws  {
        try {
            super.h.invoke(this, m4, new Object[]{var1});
        } catch (RuntimeException | Error var3) {
            throw var3;
        } catch (Throwable var4) {
            throw new UndeclaredThrowableException(var4);
        }
    }

    public final int hashCode() throws  {
        try {
            return (Integer)super.h.invoke(this, m0, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    static {
        try {
            m1 = Class.forName("java.lang.Object").getMethod("equals", Class.forName("java.lang.Object"));
            m3 = Class.forName("Interface").getMethod("doSomething");
            m2 = Class.forName("java.lang.Object").getMethod("toString");
            m4 = Class.forName("Interface").getMethod("somethingElse", Class.forName("java.lang.String"));
            m0 = Class.forName("java.lang.Object").getMethod("hashCode");
        } catch (NoSuchMethodException var2) {
            throw new NoSuchMethodError(var2.getMessage());
        } catch (ClassNotFoundException var3) {
            throw new NoClassDefFoundError(var3.getMessage());
        }
    }
}
```

通过查看生成的反编译文件，我们可以看到动态代理在执行过程中生成了`$Proxy0.class`的代理类，该代理类实现了接口中的所有方法，并把接口调用转发到了我们事先写好并传入代理类构造器中的`InvocationHandler`上的`invoke`方法，我们在`invoke`方法中通过反射在调用实际服务对象的方法的同时，可以按照自己的需求添加额外的逻辑（如性能监控，日志，权限管理，事务管理等）。
