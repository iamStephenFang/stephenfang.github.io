---
title: Objective-C 学习笔记(八）
date: 2020-04-24 22:23:20
categories: 
- tech
tags: 
- iOS
- Xcode
- Objective-C
- ARC
copyright: true
---

最近开始学习 `Objective-C` 夯实基础，在此处总结可以方便本人更好地整理学习内容，此文为本系列的第八篇文章，主要复习了自动引用计数与深浅拷贝。

<!--more-->

### 手动引用计数总结
- 若需保持对象不被销毁可以使用 retain，使用完对象后需使用 release 进行释放。
- 给对象发送 release 消息不会必然销毁对象，只有当该对象的引用计数减至0时对象才会被销毁，接着系统会发送 dealloc 消息给这个对象用于释放内存。
- 对使用了 retain 或者 copy、 mutableCopy、alloc 或 new 方法的任何对象，以及具有 retain 和 copy 特性的属性进行释放，需要覆盖 dealloc 方法，使得在对象被释放的时候能够释放这些实例变量。
- 如果在方法中不再需要用到这个对象但需要将其返回，可以给这个对象发送 autorelease 消息以标记这个对象延迟释放。autorelease 消息并不会影响到对象的引用计数。
- 当应用终止时内存中的所有对象都会被释放，不论它们是否在自动释放池中。

### 自动引用计数总结
- 只要某个对象被任一 strong 指针指向，那么它将不会被销毁。如果对象没有被任何 strong 指针指向，那么就将被销毁。
- 通常所有对象的指针变量都是强变量，将对象的引用赋给变量使对象自动保持，旧对象的引用会在赋值前被释放。
- 当两个对象都持有彼此的强引用时，将会产生循环保持。如果对象仍然有引用，系统将不能销毁这个对象。如果两个对象都强引用彼此就不可以被销毁。
- 解决强引用问题可以创建其他类型的对象变量，并允许使用弱引用。通过父视图持有子视图的强引用，子视图持有父视图的弱引用，这样就没有循环保持。弱变量也不能阻止引用的对象被销毁。
- 以 `Objective-C`中的 delegate 设计模式为例，viewController 中有一个 strong 指针指向它所负责管理的 UITableView，而 UITableView 中的 dataSource 和 delegate 指针都指向 viewController 的 weak 指针。
- 当声明一个弱变量，系统会追踪赋值给这个变量的引用。当引用的对象释放时，弱变量会被自动设置为nil。变量被设置为nil,给nil对象发送任何消息不会有反应，避免了无意间给这个变量发送消息引起的崩溃。
- 如果需要持有一个对象，那么对其发送 retain。如果之后不再使用该对象，那么需要对其发送 release（或者autorelease） 每一次对 retain、alloc 或 new 的调用，需要对应一次 release 或 autorelease 调用。

### 深浅拷贝
#### 深拷贝
 - 将原数据拷贝后存入一块新的内存中，并以新的指针指向新的内存。
 - 拷贝过程结束后，两个对象存储数据相同，内存地址不同。
 - 两个对象互不影响，互不干涉。
 - 源对象和副本的计数器相同。
 - 非容器类的浅拷贝只拷贝对象的地址，没有新的内存被分配。
 - 容器类的浅拷贝不拷贝容器的内容，两个容器的地址不同，在一个容器中修改值，另一个浅拷贝的容器中的值也会变化。
 
#### 浅拷贝 
 - 拷贝数据所在内存的地址，目标对象指针和源对象指向同一片内存空间。
 - 新对象计数器为1，源对象计数器不变。
 - 在`Objective-C`中使用 retain 关键字进行引用计数，使几个指针共用同一片内存空间，不会轻易的销毁内存。
 - 非容器类的深拷贝就是重写分配一块内存，然后把另一个对象的内容原封不动搬过来。对容器类的深拷贝是对容器中的每个元素都进行拷贝。
 
#### 拷贝方式
1. **retain**：始终是浅拷贝。引用计数每次加1。返回对象是否可变与被复制的对象保持一致。
2. **copy**：对于可变对象为深拷贝，引用计数不改变；对于不可变对象是浅拷贝，引用计数每次加1。始终返回一个不可变对象。  
3. **mutableCopy**：始终是深拷贝，引用计数不改变。始终返回一个可变对象。

并非所有的类都支持拷贝。只有遵循 NSCopying 协议的类，才支持 copy 拷贝，只有遵循 NSMutableCopying 协议的类，才支持 mutableCopy 拷贝。如果没有遵循拷贝协议拷贝时会出错。

### 参考
[手把手教你ARC——iOS/Mac开发ARC入门和使用](https://onevcat.com/2012/06/arc-hand-by-hand/)
[Objective-C中的深拷贝和浅拷贝](https://www.cnblogs.com/ludashi/p/3894151.html)
[Objective-C 程序设计 (第六版)]()