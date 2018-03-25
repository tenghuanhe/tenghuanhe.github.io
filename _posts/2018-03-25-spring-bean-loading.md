---
layout: post
title: Spring Bean加载机制
date: 2018-03-25
categories: blog
tags: [spring]
description: Sync/Async (Non)Blocking
---

新建一个简单的`Spring Boot`项目：
```
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```
设置好断点并调试进入可以观察到其调用链如下：
`SpringApplication.run() -> SpringApplication.refreshContext() -> SpringApplication.refresh()`，然后进入如下方法`AbstractApplicationContext.refresh()`：
```
public void refresh() throws BeansException, IllegalStateException {
  synchronized (this.startupShutdownMonitor) {
    // Prepare this context for refreshing.
    prepareRefresh();

    // Tell the subclass to refresh the internal bean factory.
    // 创建beanFactory
    ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

    // Prepare the bean factory for use in this context.
    prepareBeanFactory(beanFactory);

    try {
      // Allows post-processing of the bean factory in context subclasses.
      // 
      postProcessBeanFactory(beanFactory);

      // Invoke factory processors registered as beans in the context.
      // 调用被注册为bean的BeanFactoryPostProcessors
      // BeanFactoryPostProcessors允许对application context中的bean definitations进行定制化修改，但是永远不能与bean的实例打交道。
      invokeBeanFactoryPostProcessors(beanFactory);

      // Register bean processors that intercept bean creation.
      // 实例化然后调用所有注册的BeanPostProcessor bean，所有的application bean在实例化之前都要调用这些处理器
      registerBeanPostProcessors(beanFactory);

      // Initialize message source for this context.
      initMessageSource();

      // Initialize event multicaster for this context.
      initApplicationEventMulticaster();

      // Initialize other special beans in specific context subclasses.
      onRefresh();

      // Check for listener beans and register them.
      registerListeners();

      // Instantiate all remaining (non-lazy-init) singletons.
      // 初始化所有单实例的bean（惰性模式bean除外），单例的bean初始化后把bean的引用放在spring容器的缓存中，所有调用者引动同一个对象，任何一个调用者对bean的修改都会影响其他调用者。惰性模式是指，Spring容器启动时不会初始化，而在需要用到该bean时才初始化，具体设置为XML<bean>标签中的lazy-init属性。
      finishBeanFactoryInitialization(beanFactory);

      // Last step: publish corresponding event.
      finishRefresh();
    }
    ... //略掉异常处理代码
}
```

从`BeanFactory`中创建并获取一个由无参构造器调用过程如下：
```
AbstractBeanFactory.getBean()
 -> AbstractBeanFactory.doGetBean()
 -> DefaultSingletonBeanRegistry.getSingleton()
 -> AbstractBeanFactory.getObject()
 -> AbstractAutowireCapableBeanFactory.createBean()
 -> AbstractAutowireCapableBeanFactory.doCreateBean()
 -> AbstractAutowireCapableBeanFactory.createBeanInstance()
 -> AbstractAutowireCapableBeanFactory.instantiateBean()
 -> SimpleInstantiateStrategy.instantiate()
 -> BeanUtils.instantiateClass()
 -> Constructor.newInstance()
 -> DelegatingConstructorAccessorImpl.newInstance()
 -> 调用构造方法创建新的对象实例
```

`https://docs.spring.io/spring/docs/3.2.x/spring-framework-reference/html/beans.html#beans-factory-class`

一个`bean definition`本质上是创建一个或者多个对象的菜谱，实例化`bean`有下面几种方式：
* 用构造器实例化
* 通过静态工厂方法实例化
* 通过实例工厂方法实例化 （其中工厂bean自身也是可以通过依赖注入进行管理和配置的）
