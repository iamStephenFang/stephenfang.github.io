---
title: Objective-C 学习笔记(六）
date: 2020-04-17 17:43:20
categories: 
- tech
tags: 
- iOS
- Xcode
- Objective-C
copyright: true
---

最近开始学习 `Objective-C` 夯实基础，在此处总结可以方便本人更好地整理学习内容，此文为本系列的第六篇文章，主要复习了 `Objective-C` Foundation 框架中关于数组排序、字典对象以及集合对象的内容。

<!--more-->

### 关于数组排序
#### 简单排序示例
`Objective-C` 中对于 NSArray 排序方法主要有以下几种。
```
sortedArrayUsingSelector:
sortedArrayUsingComparator:
sortedArrayUsingDescriptors:
```
给出前两者排序的简单示例，如果只是对字符串简单做排序，sortedArrayUsingSelector:方法已足够，sortedArrayUsingComparator: 中用到了block内容。

```objc
#import <Foundation/Foundation.h>
int main(int argc, char *argv[]){
    @autoreleasepool {
        NSArray *array = [NSArray arrayWithObjects:@"abc",@"456",@"123",@"789",@"ef", nil];
        
        //sortedArrayUsingSelector
        NSArray *sortedArray1 = [array sortedArrayUsingSelector:@selector(compare:)];
        NSLog(@"SortedArray1:");
        NSLog(@"%@",sortedArray1);
        
        //sortedArrayUsingComparator:
        NSArray *sortedArray2 = [array sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
             NSComparisonResult result = [obj1 compare:obj2];
             return result;
         }];
         NSLog(@"SortedArray2:");
         NSLog(@"%@",sortedArray2);
    }
    return 0;
}
```

#### 使用区块排序
NSArray和NSMutableArray类中具有使用区块对数组中元素进行排序的方法。
NSArray的排序方法一般格式为: 
```objc
- (NSArray *) sortedArrayUsingComparator: (NSComparator) block
```
NSMutableArray的排序方法格式为: 
```objc
- (void) sortUsingComparator: (NSComparator) block
```
NSComparator作为typedef定义在系统头文件中:
```objc
typedef NSComparisonResult (^NSComparator) (id obj1, id obj2);
```

NSComparator是一个区块，使用两个待比较对象作为参数，并返回 NSComparisonResult 类型的值。预期会返回一个标识，说明第一个对象是否小于、等于或者大于第二个对象，这一点与不使用区块的数组排序方法是一致的。区块对于大数组排序能够提升一些速度，可以考虑在程序中使用。

#### 关于描述器排序
给出使用描述器排序的一个代码样例。
代码中定义了三种车与五个人，并将车与人的信息载入数组，通过构建排序描述器，将排序描述器按照一定顺序放入数组，最后能够按照你所期望的顺序对信息进行输出，因为代码中重写了description，故能够按照格式进行输出。
```objc
//main.m
#import <Foundation/Foundation.h>
#import "Car.h"
#import "Person.h"

int main(int argc, char *argv[]){
    @autoreleasepool {
            Car *car1 = [Car initWithName:@"Audio"];
            Car *car2 = [Car initWithName:@"Rolls-Royce"];
            Car *car3 = [Car initWithName:@"BMW"];
            
            Person *p1 = [Person personWithAge:23 withName:@"zhangsan" withCar:car2];
            Person *p2 = [Person personWithAge:21 withName:@"zhangsan" withCar:car1];
            Person *p3 = [Person personWithAge:24 withName:@"lisi" withCar:car1];
            Person *p4 = [Person personWithAge:23 withName:@"wangwu" withCar:car3];
            Person *p5 = [Person personWithAge:23 withName:@"wangwu" withCar:car2];

            NSArray *array = [NSArray arrayWithObjects:p1,p2,p3,p4,p5, nil];
            
            NSSortDescriptor *carNameDesc = [NSSortDescriptor sortDescriptorWithKey:@"car.name" ascending:YES];
            NSSortDescriptor *personNameDesc = [NSSortDescriptor sortDescriptorWithKey:@"name" ascending:YES];
            NSSortDescriptor *personAgeDesc = [NSSortDescriptor sortDescriptorWithKey:@"age" ascending:YES];
            
            NSArray *descriptorArray = [NSArray arrayWithObjects:personAgeDesc,carNameDesc,personNameDesc, nil];
            
            NSArray *sortedArray = [array sortedArrayUsingDescriptors: descriptorArray];
            NSLog(@"%@",sortedArray);
    }
    return 0;
}

```

```objc
//Car.h
#import <Foundation/Foundation.h>

@interface Car : NSObject
@property(nonatomic, strong) NSString *name;
+(Car *)initWithName:(NSString *)name;
@end
```

```objc
//Person.h
#import <Foundation/Foundation.h>
#import "Car.h"

@interface Person : NSObject
{
    int age;
    NSString *name;
    Car *car;
}
+(Person *)personWithAge:(int)age withName:(NSString *)name withCar:(Car *)car;
-(NSString *)description;
@end

```

```objc
//Car.m
#import "Car.h"
@implementation Car

@synthesize name = _name;

+(Car *)initWithName:(NSString *)name{
    Car *car = [[Car alloc] init];
    car.name = name;
    return car;
}

@end
```

```objc
//Person.m
#import "Person.h"
#import "Car.h"
@implementation Person

+(Person *)personWithAge:(int)age withName:(NSString *)name withCar:(Car *)car{
    Person *person = [[Person alloc] init];
    person->age = age;
    person->name = name;
    person->car = car;
    return person;
}

-(NSString *)description{
    return [NSString stringWithFormat:@"age is %i , name is %@, car is %@",age,name,car.name];
}
@end
```

```log
2020-04-17 17:04:05.775056+0800 DemoProgram[55124:1325210] (
    "age is 21 , name is zhangsan, car is Audio",
    "age is 23 , name is wangwu, car is BMW",
    "age is 23 , name is wangwu, car is Rolls-Royce",
    "age is 23 , name is zhangsan, car is Rolls-Royce",
    "age is 24 , name is lisi, car is Audio"
)
Program ended with exit code: 0
```

### 关于字典对象 
词典 (dictionary) 是由键——对象对组成的数据集合。通过对象的键可以从`Objective-C`词典中获取需要的对象。词典中的键必须是单值的，通常它们是字符串，但也可以是其他对象类型。和键关联的值可以是任何对象类型，但不能是nil。词典可以是固定的，也可以是可变的。可变词典中的记录可以动态添加和删除。可以使用键检索词典，也可以枚举它们的内容。
```objc
#import <Foundation/Foundation.h>

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        dict[@"key1"] = @"This is key 1";
        dict[@"key2"] = @"This is key 2";
        dict[@"key3"] = @"This is key 3";
        
        NSLog(@"Key note for Key 1: %@",dict[@"key1"]);
        NSLog(@"Key note for Key 2: %@",dict[@"key2"]);
        NSLog(@"Key note for Key 3: %@",dict[@"key3"]);
    }
    return 0;
}
```

```objc
#import <Foundation/Foundation.h>

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        [dict setObject:@"This is key 1" forKey:@"key1"];
        [dict setObject:@"This is key 1" forKey:@"key2"];
        [dict setObject:@"This is key 3" forKey:@"key3"];
        
        NSLog(@"Key note for Key 1: %@",[dict objectForKey:@"key1"]);
        NSLog(@"Key note for Key 2: %@",[dict objectForKey:@"key2"]);
        NSLog(@"Key note for Key 3: %@",[dict objectForKey:@"key3"]);
    }
    return 0;
}
```
需要注意的是若Key存在重复则会出现无法显示某一重复Key问题.
创建词典后可以利用循环语句枚举词典的内容。
键从词典中依次检索,没有特定顺序。
```objc
#import <Foundation/Foundation.h>

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:
                                     @"This is key 1",@"key1",
                                     @"This is key 2",@"key2",
                                     @"This is key 3",@"key3",
                              nil];
        for (NSDictionary *dictItem in dict ) {
            NSLog(@"%@:%@",dictItem,[dict objectForKey:dictItem]);
        }
    }
    return 0;
}
```
### 关于集合对象
Set是一组单值对象集合，可以是可变的，也可以是不变的。Set的操作包括搜索、添加、删除集合中的成员(仅用于可变集合)，比较两个集合，计算两个集合的交集和并集等，这些操作在示例程序中得以体现。

需要注意的是 NSCountedSet，该Set中同一对象可以出现多次，然而在 NSCountedSet 中并非存放了多个对象，而是维护一个次数计数。第一次将对象添加到集合中时，对象的 count 值被置为1,然后每次将该对象添加到集合中 count 值就会增1, 相应地，每次从集合删除对象，count 值就会减1。当对象的 count 值为零时，实际上对象本身就被删除了。

示例程序对 NSSet、 NSMutableSet、NSCountedSet 和 NSIndexSet进行了演示。
```objc
#import <Foundation/Foundation.h>

@interface NSSet (Printing)
-(void) print;
@end

@implementation NSSet (Printing)
- (void) print {
    printf("{");
    for (NSNumber *element in self)
        printf("%li",(long)[element integerValue]);
    printf("}\n");
}
@end

int main(int argc, char *argv[]){
    @autoreleasepool {
        NSMutableSet *set1 = [NSMutableSet setWithObjects:@1, @3, @5,  @7, nil];
        NSSet *set2 = [NSSet setWithObjects:@2, @4, @6, @8, nil];
        NSCountedSet *set3 = [NSCountedSet setWithObjects:@1, @1, @3, @5, nil];
 
        NSIndexSet * indexSet1 = [[NSIndexSet alloc] initWithIndexesInRange:NSMakeRange(1,3)];
        NSMutableIndexSet *indexSet2 =[[NSMutableIndexSet alloc] init];
        [indexSet2 addIndex:0];
        [indexSet2 addIndex:3];
        [indexSet2 addIndex:5];
        
        unsigned long index;
        NSLog(@"IndexSet1:");
        for (index = [indexSet1 firstIndex];
             index != NSNotFound;
             index = [indexSet1 indexGreaterThanIndex: index])  {
            NSLog(@"%lu",index);
        }
        
        NSLog(@"IndexSet2:");
        for (index = [indexSet2 firstIndex];
             index != NSNotFound;
             index = [indexSet2 indexGreaterThanIndex: index])  {
            NSLog(@"%lu",index);
        }
        
        NSLog(@"Set1:");
        [set1 print];
        NSLog(@"Set2:");
        [set2 print];
        NSLog(@"Set3:");
        [set3 print];
        
        if([set1 isEqualToSet: set2] == YES)
            NSLog(@"Set 1 equals set2");
        else
            NSLog(@"Set 1 is not equal to Set2");
        
        if([set1 containsObject: @1]){
            NSLog(@"Set1 contains element 1");
        }else{
            NSLog(@"Set1 does not contains element 1");
        }
        
        NSLog(@"The count of 1 in Set3: %lu",(unsigned long)[set3 countForObject:@1]);
        [set1 addObject:@2];
        [set1 removeObject:@1];
        [set1 print];
        [set1 intersectSet:set2];
        [set1 print];
        [set1 unionSet:set2];
        [set1 print];
        
    }
    return 0;
}

```
相应的运行结果为：
```log
2020-04-17 11:40:23.646162+0800 DemoProgram[51926:1202542] IndexSet1:
2020-04-17 11:40:23.646584+0800 DemoProgram[51926:1202542] 1
2020-04-17 11:40:23.646627+0800 DemoProgram[51926:1202542] 2
2020-04-17 11:40:23.646679+0800 DemoProgram[51926:1202542] 3
2020-04-17 11:40:23.646733+0800 DemoProgram[51926:1202542] IndexSet2:
2020-04-17 11:40:23.646762+0800 DemoProgram[51926:1202542] 0
2020-04-17 11:40:23.646786+0800 DemoProgram[51926:1202542] 3
2020-04-17 11:40:23.646808+0800 DemoProgram[51926:1202542] 5
2020-04-17 11:40:23.646825+0800 DemoProgram[51926:1202542] Set1:
{7351}
2020-04-17 11:40:23.646871+0800 DemoProgram[51926:1202542] Set2:
{6284}
2020-04-17 11:40:23.646898+0800 DemoProgram[51926:1202542] Set3:
{315}
2020-04-17 11:40:23.646934+0800 DemoProgram[51926:1202542] Set 1 is not equal to Set2
2020-04-17 11:40:23.646957+0800 DemoProgram[51926:1202542] Set1 contains element 1
2020-04-17 11:40:23.646979+0800 DemoProgram[51926:1202542] The count of 1 in Set3: 2
{7325}
{2}
{6284}
Program ended with exit code: 0
```

### 其他总结
根据写代码过程中遇到的一些问题查找的答案做一些阶段性总结。
#### 实例变量的范围类型
**@private**
该类型的实例变量只有声明它的类能够访问它。
**@protected**
该类型的实例变量能被声明它的类和子类访问。
所有没有显式标识范围的实例变量默认为 @protected。
**@public**
该类型实例变量可以在任何地方被访问。
**@package**
在modern runtime下，@package 实例变量的范围在实现这个类的可执行文件镜像中是@public，但是在实现这个类的可执行文件镜像外部是 @private。
Objective-C 中的 @package 与 C 语言中变量和函数的 private_extern 类似，任何在实现类的镜像外的代码想使用这个实例变量都会引发link error错误。
@package 对于框架类的实例变量十分受用，在这种环境下使用 @private 可能太受限制，使用@protected 或者 @public 又过于开放。@package 类型的变量在 Framework 内部相当于 @protected，在 Framework 外部，相当于@private。

#### 类方法与实例方法
- 实例方法在类的具体实例的范围内执行，在调用一个实例方法前必须首先创建类的实例。需要在方法声明前加上“-”，表示实例（对象）方法 (动态方法)。
- 类方法不需要创建实例，不依赖于对象，直接用类名调用，执行效率较高；当方法内部不需要使用成员变量时，就可以使用类方法。需要在方法生命前加上“-”，表示类方法 (静态方法)。

#### 声明方式
在网上查找资料时发现属性声明存在三种方式，通过查资料对三种方式进行总结
1. 直接在 @interface 中声明。该方法声明的成员变量只能在类内部使用，即不能通过类名. 点的方式访问变量，需要使用 -> 的方式。

```objc 
@interface Test : NSObject{
    NSString *test;
}
``` 

1. 在@interface中声明，然后再在@property中声明。该方法为过时的声明变量方式，Xcode 在早期 @systhesize 没有自动合成属性器之前，需要手写 getter 与 setter 方法。在Xcode有自动合成属性器后，编译器会自动生成一个以下划线开头的的实例变量，所以不必同时声明属性与变量。即可以直接用 @property 声明一个成员属性，在 .m 文件中无需使用 @systhesize，Xcode 会自动生成 getter 与 setter.

```objc 
@interface Test : NSObject{
    NSString *_test;
}
@property (strong, nonatomic) NSString *mystr; 
```
同时在.m文件中插入
```objc 
@synthesize mystr = _myStr;
```

3. 直接用@property声明。该方法声明的成员变量能够在类内部和外部使用，在类的内部可以通过下划线+变量名 或 self.变量名 的方式来访问变量。

```objc 
@interface Test : NSObject{
}
@property (strong, nonatomic) NSString *test;
```
同时在.m文件中插入
```objc 
@synthesize test = _test;
```

### 参考
[Objective-C 程序设计 (第六版)]()
[Objective C中数组排序几种情况的总结](https://my.oschina.net/pengloo53/blog/173810)
[Objective-C入门教程14：集合对象(NSSet,NSMutableSet,NSIndexSet)](https://liuzhichao.com/p/1256.html)
[iOS中四种实例变量的范围类型](https://www.cnblogs.com/stevenwuzheng/p/4605232.html)
[OC声明变量在@interface括号中与使用@property的区别](https://blog.csdn.net/shenjie12345678/article/details/39052659)
