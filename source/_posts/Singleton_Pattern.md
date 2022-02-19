---
title: 软件设计模式 - 单例模式
date: 2020-06-07 13:23:20
categories: 
- tech
tags: 
- 设计模式
- Java
copyright: true
---

单例模式(Singleton Pattern)，也叫单子模式，属于创建型模式的一种。单例模式重点解决几个不同的客户对象需要引用同个对象，且这种类型的对象数目不止一个的问题。通过确保一个类只能有一个实例，提供对该实例的全局访问，使得客户对象无需操心是否存在单例类的实例，实例化由单例类自己控制。

<!--more-->

## 模式简介
某些时候整个系统只需要拥有一个全局对象，却有利于协调系统整体的行为。比如在某个服务器程序中，该服务器的配置信息存放在一个文件中，这些配置数据由一个单例对象统一读取，然后服务进程中的其他对象再通过这个单例对象获取这些配置信息，这种方式简化了在复杂环境下的配置管理。 
单例类存在多种实现方式，较为普遍的实现方式为饿汉式单例类与懒汉式单例类。其中饿汉式单例类在被加载时就将自己实例化。单从资源利用效率角度来讲，饿汉式单例类比懒汉式单例类稍差些。从速度和反应时间角度来讲，饿汉式单例类则比懒汉式单例类稍好些。懒汉式单例类在实例化时，必须处理好在多个线程同时首次引用此类时的访问限制问题，特别是当单例类作为资源控制器，在实例化时必然涉及资源初始化，而资源初始化很有可能耗费大量时间，这意味着出现多线程同时首次引用此类的机率变得较大，需要通过同步化机制进行控制。具体的单例模式实现方式会在后文重点讨论。
单例模式的优点在于可以严格控制客户怎样以及何时访问它，为设计及开发团队提供了共享的概念。同时由于在系统内存中只存在一个对象，因此可以节约系统资源，对于一些需要频繁创建和销毁的对象，单例模式无疑可以提高系统的性能。然而，由于单例模式中没有抽象层，因此单例类的扩展有很大的困难。单例类的职责过重，在一定程度上违背了“单一职责原则”。至于单例模式相关的设计原则会在后文中逐一列举。
单例模式应用十分广泛，如需创建一个对象需要耗费大量时间与空间资源时，如IO，数据库连接等，再如需要生成唯一id、静态类型的的工具类等情形也需要使用单例模式。

## 设计原则
与单例设计模式相关的有以下OOP设计原则。
- 迪米特原则
迪米特法则（Law of Demeter），一个类对于其他类知道的越少越好，就是说一个对象应当对其他对象有尽可能少的了解,只和朋友通信，不和陌生人说话。
在单例模式中表现为其他类对该单例类了解的尽量少。其他类获取该单例类的对象只需要通过其暴露的方法即可，而不需要了解单例具体是怎么创建的。假如该单例类创建的过程变得更加复杂，其他类的调用还是通过这个简单的方法获得对象，不用关心单例类增加了哪些代码。
- 单一职责原则
单一职责模式的定义为，就一个类而言，应该仅有一个引起它变化的原因。单例类的职责过重，既充当了工厂角色，提供了工厂方法，同时又充当了产品角色，包含一些业务方法，将产品的创建和产品的本身的功能融合到一起，在一定程度上违背了单一职责原则。违背单一职责原则带来的弊端不限于复用能力越弱、多个职责，一个职责的变化可能会影响到其他的职责等。
在使用具体的设计模式前应该思考与之相关的设计原则，进而确定该设计模式是否符合需要，以单例模式为例，单例类没有接口，不能继承，与单一职责原则冲突，仅适用于只关心内部逻辑而不关心外面如何实例化的情形。

## 实现方法
单例模式的实现需以下三个部分：
- 一个引用单例对象的静态私有成员变量
- 一个公共静态方法，负责实现一次性的实例化并返回对单例对象的引用
- 设置为保护型或私有型的构造方法
根据单例模式的成员可以画出相应的类图，其中包含引用单例对象的静态私有成员变量instance；公共静态方法getInstance()负责实现一次性的实例化并返回对单例对象的引用；设置私有型的构造方法Singleton()。

![](http://image.stephenfang.me/mweb/15917501563785.jpg)
图3.1 单例模式的类图

在所有常见的设计模式中，singleton模式是唯一一个能够用短短几十行代码完成实现的模式，接下来以不同的例子探讨单例模式的解法。

1. 只适用于单线程模式的解法（懒汉式）
由于单例模式要求只能生成一个实例，因此我们必须把构造函数设为私有函数以禁止他人创建实例。可以通过定义一个静态的实例，在需要的时候创建该实例。下面定义类型Singleton1就是基于这个思路的实现：

```java
package com.singleton;

public class Singleton1 {
    private Singleton1() {
    }

    private static Singleton1 instance = null;

    public static Singleton1 getInstance() {
        if (instance == null) {
            instance = new Singleton1();
        }
        return instance;
    }
}
```

代码3.1 只适用于单线程模式的解法
	上述代码只有在instance为null时才创建一个实例从而避免重复创建，同时我们把构造函数定义为私有函数从而确保只创建一个实例。该代码仔单线程的时候工作正常，但是在多线程的情况下就会出现问题。设想如果两个线程同时运行到判断instance是否为null的if语句，并且instance的确没有创建时，那么两个线程都会创建一个实例，此时类型Singleton1就不再满足单例模式的要求，可以通过以下解法改变该局面。

2. 适用于多线程的解法（效率欠佳的懒汉式）
为了保证在多线程环境下还是只能得到类型的一个实例，需要加上一个同步锁。假设有两个线程同时想创建一个实例。由于在一个时刻只有一个线程能得到同步锁，当第一个线程加上锁时，第二个线程只能等待。当第一个线程发现实例还没有创建时，它创建出一个实例。接着第一个线程释放同步锁，此时第二个线程可以加上同步锁，并运行接下来的代码。这个时候由于实例已经被第一个线程创建出来了，第二个线程就不会重复创建实例了，这样就保证了在多线程环境中也只能得到一个实例。把Singleton1稍做修改得到了如下代码：

```java
package com.singleton;

public class Singleton2 {
    private Singleton2() {
    }

    private static Singleton2 instance = null;

    public static synchronized Singleton2 getInstance() {
        if (instance == null) {
            instance = new Singleton2();
        }
        return instance;
    }
}
```

代码3.2 适用于多线程的低效率解法
	但是 Singleton2 还不是很完美。我们每次通过 getInstance 方法得到Singleton2的实例，都会试图加上一个同步锁，而加锁是一个非常耗时的操作，在没有必要的时候应该尽量避免。
	
	
3.	加同步锁前后两次判断实例是否已存在的解法（DCL）
在实例还没有创建之前需要加锁操作，以保证只有一个线程创建出实例。然而当实例已经完成创建之后，已经不需要再做加锁操作了。Singleton3中只有当instance为null即没有创建时，需要加锁操作。当instance 已经创建出来之后，则无须加锁。参考以下改进后的Singleton2代码，其时间效率能够比Singleton2提升很多。其中instance被volatile 修饰，增加线程之间的可见性，并且任何线程对它的写操作都会立即刷新到主内存中，并且会强制让缓存了instance变量的线程中的数据清空，必须从主内存重新读取最新数据。

```java 
package com.singleton;

public class Singleton3 {
    private volatile static Singleton3 instance;

    private Singleton3() {
    }

    public static Singleton3 getInstance() {
        if (instance == null) {
            synchronized (Singleton3.class) {
                if (instance == null) {
                    instance = new Singleton3();
                }
            }
        }
        return instance;
    }
}

```

代码3.3 加同步锁前后两次判断实例是否已存在的解法
Singleton3用加锁机制来确保在多线程环境下只创建一个实例，并且用两个 if 判断来提高效率。这样的代码实现起来比较复杂，容易出错，然而还有其他解法。

4.	利用静态构造函数的解法（饿汉式）
静态构造函数的实现代码非常简洁。因为单例对象只创建一次，所以考虑使用 static 修饰，这样在 JVM 加载该类的时候就会自动创建对象，又因为不希望其他类执行该单例类的构造方法再去创建单例对象，所以把构造函数的属性设置为 private。效果为在调用静态构造函数时初始化静态变量，确保只调用一次静态构造函数，从而保证只初始化一次instance。

```java
package com.singleton;

public class Singleton4 {
    private Singleton4() {
    }

    private static final Singleton4 instance = new Singleton4();

    public static Singleton4 getInstance() {
        return instance;
    }
}
```

代码3.4 利用静态构造函数的解法
假设我们在Singleton4 中添加一个静态方法，调用该静态函数是不需要创建一个实例的，但如果按照Singleton4的方式实现单例模式，则仍然会过早地创建实例，从而降低内存的使用效率。

5.	利用静态内部类的解法
静态内部类的优点为，外部类加载时不需要立即加载内部类，内部类不被加载则不去初始化instance，即不会在内存中占据位置。如下巧妙运用了这种方法，即第一次调用getInstance() 方法使得JVM加载SingletonStatic类，从某种程度上而言实现了按需创建实例。

```java
package com.singleton;

public class Singleton5 {
    private Singleton5() {
    }

    private static class SingletonStatic {
        private static Singleton5 instance = new Singleton5();
    }

    public static Singleton5 getInstance() {
        return SingletonStatic.instance;
    }
}
```

代码3.5 利用静态内部类的解法
当Singleton5类第一次被加载时，并不需要立即加载SingletonStatic内部类，只有当 getInstance() 方法第一次被调用时，才会初始化instance对象。这种方法不仅能确保线程安全，也能保证单例的唯一性，同时也延迟了单例的实例化。

6.	利用枚举的解法
引用 《Effective Java》书中的一句话，“单元素的枚举类型已经成为实现Singleton的最佳方法。”这种解法利用枚举的特性保证了按需加载、线程同步。

```java
package com.singleton;

public enum Singleton6 {
    instance;

    public void testMethod() {
    }
}
```

代码3.6 利用枚举类型的解法
目前该实现方式还没有被广泛采用，但它更简洁，自动支持序列化机制，绝对防止多次实例化。它不仅能避免多线程同步问题，而且还自动支持序列化机制，防止反序列化重新创建新的对象，绝对防止多次实例化。不过，由于 JDK1.5 之后才加入 enum 特性，用这种方式写不免让人感觉生疏。


7.	解法总结
以简洁明了的表格总结前文中实现的六种单例模式的解法，对于不同解法的参考指标为是否懒加载、是否容易实现、是否线程安全以及是否高效率。

| 实现方法 | 解法一 | 解法二 | 解法三 | 解法四 | 解法五 | 解法六 |
| -------- | ------ | ------ | ------ | ------ | ------ | ------ |
| 懒加载   | 是     | 是     | 是     | 否     | 是     | 是     |
| 易实现   | 是     | 是     | 否     | 是     | 是     | 是     |
| 线程安全 | 否     | 是     | 是     | 是     | 是     | 是     |
| 高效率   | 否     | 否     | 是     | 是     | 是     | 是     |

表格3.1 解法总结表

一般情况下不建议使用第一种和第二种懒汉解法，第三种解法补足了前两者的短板然而编写逻辑较为复杂，第四种解法虽然没有实现懒加载的效果但仍为比较通用的解法，静态内部类的解法能够实现按需加载不失为一种优秀的算法，而如果涉及到反序列化创建对象时，可以尝试使用最后一种枚举类型的算法。

## 模式简例
在JDK内部也存在对单例模式的运用。Runtime类就是十分典型的例子。
![](http://image.stephenfang.me/mweb/15917515167469.jpg)


图4.2  Runtime类图
	在每一个Java应用程序中，都有唯一的一个Runtime对象，通过这个对象应用程序可以与其运行环境发生相互作用。Runtime类提供私有的静态的Runtime对象 currentRuntime、私有的空Runtime构造方法以及一个静态工厂方法getRuntime（），通过调用getRuntime（）方法，可以获得Runtime类唯一的一个实例，并且从源代码代码中可以看出，Runtime使用了饿汉式单例模式。
	
```java
package java.lang;
public class Runtime {
    private static final Runtime currentRuntime = new Runtime();
public static Runtime getRuntime() {
    return currentRuntime;
    }
    private Runtime() {}
…
}
```

代码4.3  Runtime源代码
前文中有提及，单例模式还可以用于生成唯一id 的情形，这里以前文中的Singleton4 实现方式为例。通过创建Main主类，并且在该类的main()方法中，创建2个Singleton4对象，获取对象的hashCode。
```java
package com.singleton;

public class Main {
    public static void main(String[] args) {
        System.out.println("创建单例对象1：");
        Singleton4 singleton1 = Singleton4.getInstance();
        System.out.println(singleton1.hashCode());
        System.out.println("创建单例对象2");
        Singleton4 singleton2 = Singleton4.getInstance();
        System.out.println(singleton2.hashCode());
    }
}
```

代码4.5  测试类
运行结果符合预期，测试类通过getInstance()方法获得的是同一对象，因而哈希值是一致的。此特点适用于生产唯一序列号的场景。
![](http://image.stephenfang.me/mweb/15917516893500.jpg)

图4.3  测试结果
	对于单例模式的应用与验证至此告一段落，显然单例模式的运用远不止于此，相关的还有Web计数器、数据库配置文件等等。
	
## 问题与缺陷
滥用单例可能带来一些负面问题，如为了节省资源将数据库连接池对象设计为单例类，可能会导致共享连接池对象的程序过多而出现连接池溢出。在Java语言中，连接池采用持久化服务的方式，滥用单例将导致连接得不到释放，内存不断上升从而溢出。
JVM提供了自动垃圾回收的机制，并且采用根搜索算法，其基本思路为：任何“活”的对象一定能最终追溯到其存储在堆栈或静态存储区中的引用。通过一系列根（GC Roots）的引用作为起点开始搜索，经过一系列的路径，如果可以到达java堆中的对象，那么这个对象就是不可回收的。可以作为根的对象有：

- 虚拟机栈（栈桢中的本地变量表）中的引用的对象。
- 方法区中的类静态属性引用的对象。
- 方法区中的常量引用的对象。
- 本地方法栈中JNI的引用的对象。

方法区是JVM的一块内存区域，用来存放类相关的信息。java中单例模式创建的对象被自己类中的静态属性所引用，符合第二条，因此，单例对象不会被JVM垃圾收集。虽然JVM堆中的单例对象不会被垃圾收集，但是单例类本身如果长时间不用会不会被收集呢？因为JVM对方法区也是有垃圾收集机制的。如果单例类被收集，那么堆中的对象就会失去到根的路径，必然会被垃圾收集掉。
通过以下代码测试单例对象是否会被回收。

```java
package com.singleton;

class Singleton {
    private byte[] test = new byte[6*1024*1024];
    private static Singleton singleton = new Singleton();
    private Singleton(){}

    public static Singleton getInstance(){
        return singleton;
    }
}
class Obj {
    private byte[] test = new byte[3*1024*1024];
}

public class Client{
    public static void main(String[] args) throws Exception{
        Singleton.getInstance();
        while(true){
            new Obj();
        }
    }
}
```

代码5.1  测试代码
运行时JVM 的参数被设定为：
```-verbose:gc -Xms20M -Xmx20M```
即每次JVM进行垃圾回收时显示内存信息，JVM的内存设为固定20M。
通过模拟J2EE容器，实例化大小为6M的单例类，然后不断的创建对象，迫使JVM进行垃圾回收，观察垃圾收集信息，如果进行垃圾收集后，内存仍然大于6M，则说明垃圾回收不会回收单例对象。

![](http://image.stephenfang.me/java.png)

图5.1  测试结果
从运行结果中可以看到有6M空间没有被收集。达到GC的条件其一为该类所有的实例都已经被回收，即java堆中不存在该类的任何实例。单例的类不满足该条件，因此单例类也不会被回收。也就是说，只要单例类中的静态引用指向JVM堆中的单例对象，那么单例类和单例对象都不会被垃圾收集。所以“如果实例化的对象长时间不被利用，系统会认为它是垃圾，会自动销毁并回收资源，下次利用时又将重新实例化，这将导致对象状态丢失。”这一点目前无法在实验中验证。
至于违背了单一职责原则这一点前文已有讨论，不复引述。

### 参考资料
- 洁城浩，《设计模式-JAVA语言中的应用》，中国铁道出版社2005.1
- （美） GoF, 《设计模式-可复用的面向对象软件的基础》，机械工业出版社，2005 
- 何海涛，《剑指Offer》，电子工业出版社2012.1
- （美）Alan Holub，《设计模式初学者指南》，机械工业出版社，2006

