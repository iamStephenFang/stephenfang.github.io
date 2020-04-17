---
title: Objective-C 学习笔记(五）
date: 2020-04-13 22:43:20
categories: 
- tech
tags: 
- iOS
- Xcode
- Objective-C
copyright: true
---

最近开始学习 `Objective-C` 夯实基础，在此处总结可以方便本人更好地整理学习内容，此文为本系列的第五篇文章，主要复习了 `Objective-C` Foundation 框架中关于数字对象、字符串对象以及数组对象的内容。

<!--more-->

### 关于数字对象
无论是int 型、float 型和long型都是`Objective-C`语言中的基本数据类型,它们都不是对象，不能够向它们发送消息，然而有时需要将这些值作为对象使用。如不能将任何基本数据类型直接存储到数组中，使用Foundation的NSArray对象创建一个数组时，它要求存储的值必须是对象。

**NSInteger**
NSInteger不是一个对象，是基本数据类型的typedef。

 Apple 官方 Foundation 文档解释的很清楚：

> When building 32-bit applications, NSInteger is a 32-bit integer. A 64-bit application treats NSInteger as a 64-bit integer.

> Apple use NSInteger (or NSUInteger) when passing a value as an argument to a function or returning a value from a function.

鉴于目前 iOS 设备全部迈向64位架构，可以理解成 NSInteger 是64位的 long 类型。而 NSUInteger 也是类似于 NSInteger 的typedef。


**int**
int 类型的使用主要体现在循环的控制上，控制循环语句无需考虑平台依赖，在大部分情况下16-bit 大小的 int 即可胜任此项工作。 NSInteger 可以作为函数的返回值或者是函数参数，至于使用 NSInteger 还是 int 决定权仍然在你需要解决的问题上。

**NSNumber**
NSNumber 是`Objective-C`的类，具体来说是 NSValue 的子类。如果需要存储基本数据类型（包括 signed 或 unsigned char类型和BOOL类型），可以使用 NSNumber 对其进行包装来满足需求，NSNumber 会根据数据的类型创建对象。在集合中也会使用到 NSNumber，如NSSArray、NSSet，因为这些需要对象参与。
下图摘录了为 NSNumber 对象设值的类和实例方法以及获取这些数值的实例方法。

![](http://images.stephenfang.xyz/mweb/15867486542169.jpg)

#### 简单示例
给出一个简单的测试示例。
```objc 
#import <Foundation/Foundation.h>

int main(int argc, char* argv[]){
    @autoreleasepool {
        NSNumber *intNum, *floatNum, *charNum, *doubleNum;
        NSInteger integerNum;
        
        intNum = [NSNumber numberWithInteger:20];
        integerNum = [intNum integerValue];
        NSLog(@"%li",(long)integerNum);
        
        floatNum = [NSNumber numberWithFloat:20.5];
        NSLog(@"%f",[floatNum floatValue]);
        
        charNum = [NSNumber numberWithChar:'X'];
        NSLog(@"%c",[charNum charValue]);
        
        doubleNum = @20.5;
        NSLog(@"%lf",[doubleNum doubleValue]);
        
        if([doubleNum isEqualToNumber:floatNum] == YES){
            NSLog(@"doubleNum is equal to number floatNum");
        }else{
             NSLog(@"doubleNum is not equal to number floatNum");
        }
        
        if([floatNum compare:intNum] == NSOrderedDescending){
            NSLog(@"intNum is less than floatNum");
        }
    }
    return 0;
}
```

#### 示例解释
一般来说，需要确保使用正确的方式获取对象的值，如果在NSNumber对象中存储了一个值，那么也需要用一致的方式去获取。同时，`Objective-C`语言扩展允许通过@表达式创建数字对象.

方法 numberWithInt: 和 numberWithInteger: 在使用存在差别
1. 使用 numberWithInt: 方法创建一个整型数,需要使用intValue获取值，使用%i作为格式化字符串显示它的值。
2. 使用 numberWithInteger: 方法创建一个整型数,需要使用integerValue获取值，也可以转换成 long 显示或者使用 stringWithFormat: 将其格式化成字符串。使用%li作为格式化字符串。

#### 关于NSLog
在NSLog中，格式字符`%@`不仅可以显示 NSString 对象，而且可以显示数组、字典和集合的全部内容。对于数组中的每一个元素,NSLog 将使用属于每个元素类的 description 方法。如果使用的是从 NSObject 对象继承的默认方法,获取到的是对象的类和地址。然而,通过覆盖继承的 description 方法可使用这些格式字符显示自定义类对象。

### 关于字符串对象
Foundation 框架支持 NSString类用于处理字符串对象。C 样式的字符串 char 字符组成，NSString 对象由 unichar 字符组成。unichar 字符是符合 Unicode 标准的多字节字符。NSString 类能够自动处理字符串的内部表示。使用 NSString 类的方法更容易开发出具有本地化的应用程序，并且能够在不同的语言环境下使用。

NSMutableString 类是 NSString 类的子类，可以用来创建可以更改字符的字符串对象，它可以使用 NSString 类所有方法。摘录常见 NSMutableString 方法
![](http://images.stephenfang.xyz/mweb/15867813113647.jpg)

#### 简单示例
给出一个简单的测试示例。
```objc
#import <Foundation/Foundation.h>

int main(int argc, char* argv[]){
    @autoreleasepool {
        NSString *str1 = @"This is str1";
        NSString *str2 = @"This is str2";
        NSString *subStr;
        NSMutableString *mutStr;
        NSRange subRange;
        
        subStr = [str1 substringToIndex:3];
        NSLog(@"%@",subStr);
        
        subStr = [str1 substringFromIndex:3];
        NSLog(@"%@",subStr);
        
        subStr = [[str1 substringFromIndex:3]substringToIndex:5];
        NSLog(@"%@",subStr);
        
        subStr = [str1 substringWithRange:NSMakeRange(3, 5)];
        NSLog(@"%@",subStr);
        
        subRange = [str2 rangeOfString:@"str2"];
        NSLog(@"index: %lu length: %lu",(unsigned long)subRange.location,(unsigned long)subRange.length);
        
        subRange = [str1 rangeOfString:@"str2"];
        if (subRange.location == NSNotFound){
            NSLog(@"String not found");
        }else{
            NSLog(@"index: %lu length: %lu",(unsigned long)subRange.location,(unsigned long)subRange.length);
        }
        
        mutStr = [NSMutableString stringWithString:str1];
        NSLog(@"%@",mutStr);
        
        [mutStr insertString:mutStr atIndex:[mutStr length]];
        NSLog(@"%@",mutStr);
        
        [mutStr deleteCharactersInRange:NSMakeRange([mutStr length]/2, [mutStr length]/2)];
        NSLog(@"%@",mutStr);
        
        [mutStr appendString:mutStr];
        NSLog(@"%@",mutStr);
        
        [mutStr replaceCharactersInRange:NSMakeRange([mutStr length]/2, [mutStr length]/2) withString:str2];
        NSLog(@"%@",mutStr);
        
        subRange = [mutStr rangeOfString: @"This is"];
        if (subRange.location != NSNotFound) {
        [mutStr replaceCharactersInRange:subRange withString: @"it is"] ;
        NSLog(@"%@",mutStr) ;
        }
    }
    return 0;
}
```

运行结果为
```log
2020-04-13 18:21:20.795845+0800 DemoProgram[49815:1823615] Thi
2020-04-13 18:21:20.796235+0800 DemoProgram[49815:1823615] s is str1
2020-04-13 18:21:20.796281+0800 DemoProgram[49815:1823615] s is
2020-04-13 18:21:20.796305+0800 DemoProgram[49815:1823615] s is
2020-04-13 18:21:20.796331+0800 DemoProgram[49815:1823615] index: 8 length: 4
2020-04-13 18:21:20.796353+0800 DemoProgram[49815:1823615] String not found
2020-04-13 18:21:20.796395+0800 DemoProgram[49815:1823615] This is str1
2020-04-13 18:21:20.796432+0800 DemoProgram[49815:1823615] This is str1This is str1
2020-04-13 18:21:20.796453+0800 DemoProgram[49815:1823615] This is str1
2020-04-13 18:21:20.796472+0800 DemoProgram[49815:1823615] This is str1This is str1
2020-04-13 18:21:20.796498+0800 DemoProgram[49815:1823615] This is str1This is str2
2020-04-13 18:21:20.796520+0800 DemoProgram[49815:1823615] it is str1This is str2
Program ended with exit code: 0
```

### 关于数组对象
Foundation数组是有序的对象集合。不可变数组由 NSArray 类处理的，而可变数组由NSMutableArray 处理的。后者是前者的子类，即后者继承了前者的方法。

其中
```objc
NSArray *monthNames = [NSArray arrayWithObjects :@"January", @"February", @"March", @"April", @"May", "June", @"July", @"August", @"September", @"October", @"November", @"December", nil ];
```
与如下方式相同。
```objc
NSArray *monthNames = @[@"January", @"February", @"March", @"April", @"May",@"June", @"July", @"August", @"September", @"October", @"November" ,@"December"];
```
而
```objc
array[index]
```
相当于如下表达式
```objc
[array objectAtIndex: index]
```
同时
```objc
array[index] = object
```
相当于如下表达式
```objc
[array setObject: object forIndex: index]
```
下一节会参照书本给的样例进行编写。

### 参考
[int vs. NSInteger vs. NSNumber](http://monkey-oyster.blogspot.com/2014/10/int-vs-nsinteger-vs-nsnumber.html)
[Why use int at all?-Stack overflow](https://stackoverflow.com/questions/4445173/when-to-use-nsinteger-vs-int/5320359#5320359)
[Objective-C 程序设计 (第六版)]()