---
title: Objective-C 学习笔记(三）
date: 2020-04-05 14:43:20
categories: 
- tech
tags: 
- iOS
- Xcode
- Objective-C
copyright: true
---


最近开始学习 `Objective-C` 夯实基础，在此处总结可以方便本人更好地整理学习内容，此文为本系列的第三篇文章，主要复习了数据类型、预处理、分类与协议等内容。

<!--more-->

### 关于初始化与变量
#### 关于初始化
若在创建类的对象时需要使用和引用一个或多个实例变量，可以通过重载init方法达到目的。该方法首先调用父类初始化方法，使得继承实例变量正常初始化，因为初始化过程改变了对象在内存中的位置所以需要将父类init方法执行结果赋值给self。特殊类型instancetype表明,从init方法返回的类型与它的初始化类相同。
```objc 
(instantype) init {
    self = [ super init ];
    if ( self ) {
    //do sth here
    } 
    return self;
}
```
#### 关于 extern 与 static
- 声明不会引起变量存储空间分配，而定义会引起变量存储空间分配。
- 如果有很多方法需要访问外部变量的值,应该只在文件的开始进行一次extern声明。
- 如果只有一个或少数几个方法访问这个变量，应该在其中的每个方法中单独进行extern声明。
- 如果变量定义在包含访问这个变量的文件中，不需要单独进行extern声明。
- static 变量声明在文件中的任何方法(或函数)之外，所有位于这条语句之后的方法或函数都可以访问其值，而其他文件中的方法和函数则不行。
- 静态局部变量用关键字static声明，其值在函数调用的过程中保留下来，并且初始值默认为0。

### 关于预处理
- 预定义名称非变量不能为其赋值，其右边所有字符被预处理程序自动替换到程序中，类似于文本处理中的搜索与替换。
- \#define 可以出现在程序程序任何地方，不必为开头；把定义放在头文件中可以方便在多个源文件中使用。
- 从视觉上区分预定义的值和变量可以通过大写字母组合实现。
- 预处理程序定义右边不必是合法`Objective-C`表达式。

### 关于条件编译
在调试程序时条件编译很有用。在程序中嵌入了NSLog调用可以用于显示中间结果并跟踪执行流程。程序中可能有很多这样的调试语句，且无论何时调试这个程序，都能够通过DEBUG使所有的调试语句都编译。

```objc 
#ifdef DEBUG
 NSLog (@"username = %@, password = %i", username, password);
 #endif
```

### 关于分类
#### 分类定义
面对一个类定义时可能想要添加新的方法，如对于一个计算器类来说可能需要四则运算的方法，而该类当前只需要处理四则运算方面的功能，其他的创建和初始化交由其他方法来做，这个时候就可以用到分类的思想。
分类提供简单的方式将类的定义模块划到相关方法的组或分类中，同时其提供了扩展现有类定义的简便方式，不必访问类的源代码，也不必创建子类。
如对于一个假定的计算器的四则运算操作就可以创建如下分类。
```objc 
@interface Calculator (MathOps)
-(void) add: (double) value1 : (double) value2;
-(void) subtract: (double) value1 : (double) value2;
-(void) multiply: (double) value1 : (double) value2;
-(void) divide: (double) value1 : (double) value2;
@end
```
#### 分类注意
分类可以覆写该类的另一个方法，但是覆写方法后无法访问原来的方法，所以正确的选择是创建子类。在子类中覆写方法可以通过super发送消息引用父类方法。
通过使用分类添加新方法扩展类会影响当前类与其子类。
### 关于协议与代理
#### 协议要点
协议是多个类共享的一个方法列表，协议中列出了一组方法，有些选择实现，有些必须实现。如`NSObject.h`中的部分协议定义。
```objc 
@protocol NSCopying
- (id)copyWithZone:(nullable NSZone *)zone;
@end

@protocol NSCoding
- (void)encodeWithCoder:(NSCoder *)coder;
- (nullable instancetype)initWithCoder:(NSCoder *)coder; // NS_DESIGNATED_INITIALIZER
@end
```
如果类采用`NSCopying`和`NSCoding`协议，就必须实现`copyWithZone`等方法，使用方法如下。
```objc 
@interface DemoPrototol: NSObject <NSCopying,NSCoding>
```
自定义协议时可以使用`@optional`指令表明列出的方法都是可选的，可以使用`required`指令标明必须实现的方法。
#### 协议注意
- 协议不引用任何类。
- 可以使用conformsToProtocol:方法检查一个对象是否遵循某项协议。
- 编译器只有在没有实现协议要求的方法时发出警告。
- 与类名一样，协议名唯一。

#### 代理要点

定义了协议的类可以看作是将协议定义的方法代理给了实现它们的类。如iOS建立表格需使用UITableView类，需要代理定义UITableViewDataSource协议，如果协议需要信息就会调用类中实现协议的相关方法，开发者必须将其写入类中，与协议相匹配。协议中定义的其他方法是否实现决定权在开发者，即责任代理在开发者。
- 如果一个对象采用正式协议，则它必须遵守协议中的所有信息。这可以在运行及编译时强制执行。
- 如果一个对象采用非正式协议，则它可能不需要采用此协议的所有方法，具体取决于这项协议。

### 参考
[Objective-C 程序设计 (第六版)]()
