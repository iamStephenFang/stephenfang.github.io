---
title: Objective-C 学习笔记(二）
pubDatetime: 2020-03-26 21:43:20
categories:
  - 技术
tags:
  - iOS
  - Xcode
  - Objective-C
copyright: true
description: 最近开始学习 Objective-C 夯实基础，并尝试在学习基础上开发出简单的 iOS 应用程序。在此处总结可以方便本人更好地整理学习内容，此文为本系列的第二篇文章。
---

<!--more-->

## 示例代码

先给出第二课学习的代码。

```objc
//main.m
#import <Foundation/Foundation.h>
#import "Calculator.h"

int main(int argc, char* argv[]){
    @autoreleasepool {
        double value1, value2;
        char operator;

        SubCalculator *subCalculator = [[SubCalculator alloc]init];
        [subCalculator print];
        scanf("%lf %c %lf",&value1,&operator,&value2);

        subCalculator.accumulator = value1;
        switch (operator) {
            case '+':
                [subCalculator add: value2];
                break;
            case '-':
                [subCalculator subtract: value2];
                break;
            case '*':
                [subCalculator multiply: value2];
                break;
            case '/':
                [subCalculator divide: value2];
                break;
            default:
                NSLog(@"The operator is unknown!\n");
                break;
        }
        NSLog(@"The result is %.2f",subCalculator.accumulator); //点运算符
        NSLog(@"The result is %.2f", [subCalculator accumulator]); //getter方法
    }
    return 0;
}
```

```objc
//Calculator.h
#import <Foundation/Foundation.h>

@interface Calculator : NSObject

@property double accumulator;

-(void) add: (double) value;
-(void) subtract: (double) value;
-(void) multiply: (double) value;
-(void) divide: (double) value;
-(void) print;

@end

@interface SubCalculator : Calculator

-(void) print;

@end
```

```objc
//Calculator.m
#import "Calculator.h"

@implementation Calculator

@synthesize accumulator;

-(void) add: (double) value{
    accumulator += value;
}
-(void) subtract: (double) value{
    accumulator -= value;
}
-(void) multiply: (double) value{
    accumulator *= value;
}
-(void) divide: (double) value{
    accumulator /= value;
}

-(void) print{
    NSLog(@"Type in your expression.\n");
    NSLog(@"Method from Class Calculator.\n");
}

@end

@implementation SubCalculator

-(void) print{
    NSLog(@"Type in your expression.\n");
    NSLog(@"Method from Sub Class subCalculator.\n");
}

@end
```

运行结果如下：

```log
2020-03-26 18:21:58.865631+0800 DemoProgram[17447:519699] Type in your expression.
2 * 5
2020-03-26 18:22:23.471596+0800 DemoProgram[17447:519699] The result is 10.00
2020-03-26 18:22:23.471696+0800 DemoProgram[17447:519699] The result is 10.00
Program ended with exit code: 0
```

### 代码解释

相比上一次实验，接口与实现文件得到了分离，这一点与C++是类似的。
类的声明，即`@interface` 部分，用于描述类和类的方法，放在自己的名字为`class.h`的文件中；类的实现，即`@implementation` 部分，用于描述类对象的实例变量存储的数据，实现了接口中声明的方法，放在同名的.m文件中；`main.m`实现了简易计算器的功能。
该程序简单验证了继承、覆写的概念，可以在程序基础上做出更改验证

### 点运算符

```objc
[calculator setAccumulator: value1]
```

与

```objc
calculator.accumulator = value1;
```

都完成了赋值操作，需要注意的是编码风格，点运算符通常运用在属性上，用于设置或取得实例变量的值，其他的工作通常使用传统的方括号形式的消息表达式作为首选语法。

### @property 与 @synthesize

#### 合成存取

使用`synthesize`的存取方法，属性前面不要用new、alloc、copy或者init等作为开头，编译器会合成相关方法。

```objc
@property double accumulator;
```

如果使用了`@property`指令，就不需要在实现部分声明相应的实例变量。

```objc
@synthesize accumulator;
```

这句话告诉Objective-C编译器，为accumulator属性生成一对设值方法和取值方法，即设值方法`accumulator`与取值方法`setAccumulator`。
如果只使用`@property`且并未使用`@synthesize`，编译器也会生成相应的 setter 和 getter，但是生成的实例变量以下划线(\_)作为其名称第一个字符，如此处会生成"\_accumulator"。

#### 继承中存在的问题

在子类中使用实例变量，必须现在接口部分声明变量，而不是在实现部分声明变量。在实现部分声明和合成(`@synthesize`)的实例变量为私有，无法在子类中访问。

![](https://image.stephenfang.me/mweb/objc_test1.png)

## 其他总结

### 关于多态

使不同的类共享相同方法名称的能力叫多态。

> 多态让你可以开发一组类，这组类中的每一个类都能响应相同的方法名。每个类的定义都封装了响应特定方法所需的代码，这就使得它独立于其他的类定义。多态还允许你以后添加新的类，这些新类能够响应相同的方法名。

### 关于动态类型

- `id` 可以用来存储属于任何类的对象，且`id`对象类型的声明中无需使用星号(\*)。
- `Objective-C` 总是跟踪对象所属的类。系统先判定对象所属的类，然后在**运行**时确定需要动态调用的方法，而不是在**编译**的时候。
- 静态类型能够在程序编译阶段而不是运行阶段标明错误
- 静态类型相比动态类型能够提高程序可读性

> 如果存在id变量`dataValue 1`和`dataValue2`，那么

```objc
result = [dataValue1 add: dataValue2] ;
```

会导致编译器生成代码,将参数传递给add:方法,并通过假设来处理其返回值。
在运行时，`Objective-C` 运行时系统仍然会检查存储在dataValue1中对象所属的类选择相应的方法来执行。然而，在大多数情况下，编译器可能生成不正确的代码来向方法传递参数或处理返回值。
当一个方法选取对象作为它的参数，而另一个方法选取浮点数作为参数时，很有可能发生这种情况。如果这两个方法之间的不一致仅在于对象类型的不同,编译器仍然能够生成正确的代码,因为传递给对象的引用是内存地址(即指针)。

### 关于类的问题

![NSObject类支持的基本方法](https://image.stephenfang.me/mweb/NSObject_basic.png)

对`isMemberOfClass`、`isKindOfClass`、`isSubclassOfClass`、`respondsToSelector`、`instancesRespondToSelector`的用法与意义应熟稔于心。

### 关于异常处理

`Objective-C`中对于异常处理的机制与`C++`、`Java`等均为类似。格式如下：

```objc
@try {
statement
statement
...
}
@catch (NSException *exception) {
statement
statement
...
}
```

> 一般来说，你并不希望程序在运行时发生异常。这就需要考虑更好的编程实践，在错误发生之前做测试，而不是错误发生后捕获它。测试方法的错误并返回一些值作为错误的标识，而不是抛出异常。抛出异常通常会使用大量的系统资源，Apple 反对非必要的使用异常(例如，你不希望因为一一个文件无法打开而抛出异常)。

### 参考

[Objective-C 程序设计 (第六版)]()
