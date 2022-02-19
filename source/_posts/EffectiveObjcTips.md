---
title: Effective Objective-C 总结
date: 21-07-14 14:21:22
categories: 
- tech
tags: 
- iOS
- Objective-C
- Xcode
copyright: true
---

准备开始写 Objective-C 之前花了一些时间重新阅读这本经典的《Effective Objective-C》，在阅读的过程中对重点内容进行了一些摘录，在方便自己复习的同时将相关内容在博客分享出来供参考。

<!--more-->

## 第一节

- Objective-C 采用了动态绑定的消息结构，在运行时检查对象的类型，运行期环境决定了接受消息后需要执行的代码。
- Objective-C 对象所占内存分配在堆空间中，分配在堆空间中的内存必须直接管理。
- 定义中不含*的变量分配在栈空间上，分配在栈的用于保存变量的内存会在栈帧弹出时自动清理。
- 如果需要存储int、float、double、char等非对象类型推荐使用结构体。

## 第二节

- 在 .h 文件中使用@class 标识需要引入的类并且在 .m 文件中引入相关头文件，该种方式被称为向前声明，简单的说，将引入头文件的时机尽量向后可以减短编译的时间，并且能够解决互相引用问题。尽量不要引入头文件，降低类之间的耦合。
- 有时无法使用向前声明，比如要声明某个类遵循一项协议。此时应尽量把“该类遵循某协议〞的这条声明移至“class-continuation 分类” 中。如果不行就把协议单独放在一个头文件中然后将其引人。

## 第三节

- 尽量使用字面量语法创建字符串、数值、数组、字典

```objectivec
NSNumber *intNumber = @1;
NSNumber *floatNumber = @1.1f;
NSNumber *doubleNumber = @1.123456;
NSNumber *boolNumber = @YES;
NSNumber *charNumber = @'a';

int numberInt = 5;
float numberFloat = 1.23f;

NSArray *animals = @[@"cat", @"dog", @"mouse"];
NSString *dog = @"shiba";

NSDictionary *personData = @{@"firstName" : @"Stephen",
														 @"lastName" : @"Fang",
														 @"gender" : @"male"};
```

- NSArray 的 arrayWithObjects 方法依次处理各个参数直到发现nil，而如果使用字面量的方法在创建时就会抛出异常终止程序执行，需要确保创建的数组与字典中不含有nil
- 尽量使用取下标的方式来访问数组或字典中的元素

```objectivec
NSString *dog = animals[1];
NSString *lastName = personData[@"lastName"];
```

## 第四节

- #define预处理指令声明全局变量尽量少用，编译器只会执行查找和替换操作，不会产生重复定义的警告信息
- 尽量使用 static const 声明的方式来完成变量的声明，static表示该变量在定义此变量的编译单元中可见，而static const不会创建符号，只是将变量替换为常量

```objectivec
static const NSTimeInterval kAnimationDuration = 0.3;
```

- 编译器看到extern关键字得知全局符号表中包含该符号无需查看该定义就允许只用该常量，该类常量只可以定义一次，命名最好使用与之相关的类名作为前缀

```objectivec
// In the header file
extern NSString *const EOCStringConstant;

// In the implementation file 
NSString *const EOCStringConstant = @"DEMO";
```

## 第五节

- 保证枚举由底层数据类型实现，不采用编译器所选类型
- 凡是需要以按位或操作来组合的枚举都应使用NS_OPTIONS定义，若枚举不需要相互组合应使用NS_ENUM来定义

```objectivec
typedef NS_ENUM(NSUInteger, STFFeedPageType) {
    STFFeedPageTypeNone = 0,             // 未知
    STFFeedPageTypeFollow = 1,           // 关注页
    STFFeedPageTypeRecommend = 2,        // 推荐页
    STFFeedPageTypeFeatured = 3,         // 精选页
};

typedef NS_OPTIONS(NSUInteger, AgoraAudioSessionOperationRestriction) {
    /** No restriction, the SDK has full control of the audio session operations. */
    AgoraAudioSessionOperationRestrictionNone              = 0,
    /** The SDK does not change the audio session category. */
    AgoraAudioSessionOperationRestrictionSetCategory       = 1,
    /** The SDK does not change any setting of the audio session (category, mode, categoryOptions). */
    AgoraAudioSessionOperationRestrictionConfigureSession  = 1 << 1,
    /** The SDK keeps the audio session active when leaving a channel. */
    AgoraAudioSessionOperationRestrictionDeactivateSession = 1 << 2,
    /** The SDK does not configure the audio session anymore. */
    AgoraAudioSessionOperationRestrictionAll               = 1 << 7
};
```

- 处理枚举类型的switch语句不要实现default分支

## 第六节

- 在iOS中一般不使用atomic，因为同步锁会带来较大的开销，且无法保证线程安全
- 尽量使用@property语法定义对象封装的数据
- 在设置属性对应的实例变量时需要遵从属性声明的语义
- 针对CGFloat、NSInteger此类纯量类型采用assign声明即可
- copy类型用于保护NSString*类型的封装性，在ARC下直接访问一个声明为copy的属性并不会直接拷贝而是保留新值释放旧值

## 第七节

- 在对象内部尽量直接访问实例变量
    - 速度更快且生成的代码会直接访问对象实例变量的那块内存
    - 不会调用“设置方法”
    - 不会触发KVO，但需要确定是否会产生问题
    - 通过给getter、setter设置断点可以进行监控和确定访问时机
- 在写入实例变量时可以通过属性写入，读取实例变量时直接访问，可以作为一种折中方案
- 在初始化方法及dealloc方法中，应该直接通过实例变量读取数据，即_
- 懒加载方式中必须使用getter的方式访问属性，如果在没有用getter的情况下直接访问实例变量会导致得到是尚未设置好的变量

```objectivec
- (STFComponent*)component {
		if (!_component) {
					_component = [SFComponent new];
			}
			return _component;
		}
```

## 第八节

- == 操作符对比的是两个指针本身并非所指对象
- NSString类实现了一个等同判断方法即isEqualToString，执行该方法的速度快于执行isEqual
- 检测对象的等同性需要提供 isEqual 与 hash 方法，NSObject对于两个方法默认实现是仅当指针值完全相等才返回相等，需要针对具体的需求制定检测方案
- 编写hash方法时需要使用计算速度快且哈希碰撞低的算法

```objectivec
- （BOOL）isEqual:(id)object {
		if (self == object) return YES; // 指向同一个对象必然相等
		if ([self class] != [object class]) return NO; //不属于同一个类不相等

		// 检测每一个属性是否相等
		STFPerson *someone = (STFPerson*) object;
		if (![_firstName isEqualToString:someone.firstName])
			return NO;
		if (![_lastName isEqualToString:someone.lastName])
			return NO;
		if (![_age != someone.age])
			return NO;
		return YES;
	}

 - (NSUInteger)hash {
		NSUInteger firstNameHash = [_firstName hash]；
		NSUInteger lastNameHash = [_lastName hash]；
		NSUInteger ageHash = [_ageHash hash]；
		return firstNameHash ^ lastNameHash ^ ageHash；
	}
```

- NSArray有等同性判定方法"isEqualToArray:"，而NSDictionary有等同性判定方法"isEqualToDictionary:"， NSArray检测方式为首先核对两个数组包含对象的个数是否相等，若相等在每个对应位置调用"isEqual:"方法
- 在编写判定方法时应一并覆写"isEqual:"方法，如果接收该消息的对象与受测参数来自一个类就调用自己编写的判定方法，负责交由超类判定

```objectivec
-  (BOOL)isEqual:(id)object {
		if ([self class] == [object class]) 
				return [self isEqualToPerson:(STFPerson*)object];
		} else {
				return [super isEqual: object];
		}
```

## 第九节

- UIButton类使用者无需关系创建出来的按钮属于哪个子类也无需考虑按钮绘制方式等细节
- 类族的使用需要遵循以下原则
    - 子类应该继承自类族的抽象基类
    - 子类应该定义自己的数据存储方式
    - 子类应该覆写超类文档中需要覆写的方法

## 第十节

- 在其他做法不可行的条件下可以选用关联对象，因为这种做法同样会引入难以查找的bug（不建议使用）

## 第十一节

- 在编译期就能决定运行时所需要调用的函数为静态绑定，而所需要调用的函数直到运行期才能确定为动态绑定
- runtime决定了对象收到消息后调用哪个方法，甚至在程序运行时可以改变。发送给对象的所有消息都由动态信息派发系统处理
- objc_msgSend函数根据receive和selector的类型调用适当的方法，通过查找每个类中的“表格”查找需要执行的方法并跳转至相应的实现
- 尾调用优化在函数的最后一项是调用另一个函数时生效，编译器生成跳转至另一个函数所需的指令码

## 第十二节

- 消息转发分为两个阶段
    - 第一阶段：动态方法解析
    - 第二阶段：消息转发机制
  
    ![](http://image.stephenfang.me/mweb/Untitled.png)

- receiver在每一步都有机会处理消息且步骤越往后处理消息的代价越大
- 如果对象没有办法响应某个selector则进入消息转发流程,runtime的动态方法解析可以在需要某个方法时将其加入类中，对象可以将无法解析的selector转交给其他对象处理。这一步结束后若仍然无法处理selector则启动消息转发机制

## 第十三节

- 在runtime中可以向类中新增或替换selector对应的方法实现，但一般只用于调试
- method swizzling，即使用另一份实现替换原有的方法实现，可以用于向原有的实现中添加新功能

## 第十四节

- 每个Objective-C对象实例都有指向Class对象的指针，每个对象结构体的首个成员是Class类的变量，该变量定义了对象所属的类，通常称为"is a"指针
- isMemberOfClass 判断对象是否为某个特定类的实例，isKindOfClass 判断对象是否是某类或派生类的实例
- 动态类型特性可以用于从 collection 中获取对象（类型信息查询方法）
- 假设名为SomeClass的子类继承自NSObject可以得到以下继承体系

![](http://image.stephenfang.me/mweb/Untitled1.png)

## 第十五节

- 类名、分类名都应该加上相应的前缀，如果使用三方库编写自己的代码并分发尤其需要注意重复符号问题

![](http://image.stephenfang.me/mweb/Untitled2.png)

## 第十六节

- 在类中实现一个designated initializer，尽量在文档中指明初始化需要调用该方法
- 若designated initializer不同于超类则需覆写超类对应方法
- 如果超类的初始化方法不适用于子类应覆写超类方法并抛出异常

## 第十七节

- 实现description方法能够返回一个有意义的字符串来描述实例，需要打印出类的名字和指针地址因为有时候会用到
- 使用NSDictionary来编写description方法使代码更容易维护

![](http://image.stephenfang.me/mweb/Untitled3.png)

- 在调试时打印更为详尽的对象描述信息应实现debugDescription方法

![](http://image.stephenfang.me/mweb/Untitled4.png)

## 第十八节

- 尽量创建不可变对象，把对外公开的属性设置为只读且在必要时对外公布属性
- 某属性仅用于对象内部修改应将其从readonly改为readwrite属性
- 可变的collection不应作为属性公开，而应提供相关方法修改可变的collection

## 第十九节

如果从其他框架中继承子类务必遵循命名惯例，如从UIView中继承自定义子类则类名末尾词为View，若创建自定义委托协议末尾应跟上Delegate一词。

![](http://image.stephenfang.me/mweb/Untitled5.png)

## 第二十节

- 适当给私有方法加上前缀可以很容易将其与公共方法进行区分
- 不应使用一个下划线做私有方法的前缀，如 _resetViewController 方法已经被苹果实现

## 第二十一节

- Objective-C对于异常采取的态度为：只有在极为罕见的情况下才抛出异常，并在异常抛出后无需考虑恢复问题，应用程序此时应该退出。异常应该运用于极其严重的问题

![](http://image.stephenfang.me/mweb/Untitled6.png)

```objectivec
- (BOOL)doSomething:(NSError**) error

- (BOOL)doSomething:(NSError**) error {
	// do something that may cause an error

	if ( /* there was an error */ ) {
			if (error) {
					*error = [NSErrorerrorwithDomain:domain code:code userInfo:userInfo];
			}
			return NO;
		} else {
		return YES;
		}
}

NSError *error = nil;
BOOL ret = [object doSomething: &error];
if (ret) {
     // handle error 
}
```

![](http://image.stephenfang.me/mweb/Untitled7.png)

传递给方法的是个指针，指针本身指向另一个指向NSError对象的指针，或认为其为一个直接指向NSError对象的指针。在 ARC 中，指针所指向的对象会在方法执行完毕后自动释放。

## 第二十二节

- 使自己的类支持拷贝操作需要实现NSCopying协议，该协议只有一个方法且不必担心zone参数。覆写copy方法真正需要实现的是copyWithZone方法。

```objectivec
- (id)copyWithZone:(NSZone*)zone

- (id)copyWithZone:(NSZone*)zone {
		STFPerson *copy = [[self class] allocWithZone:zone]initWithFirstName:_firstName andLastName:_lastName];
		return copy;
}
```

- 在可变对象上调用copy会返回一个不可变类的实例，可能会把NSMutableArray对象当作NSArray返回，为了安全起见使用copy和mutableCopy这两个方法复制对象
- 深拷贝与浅拷贝
    - 深拷贝：拷贝对象自身时一并拷贝其底层数据，需要新增一个专门执行深拷贝的方法
    - 浅拷贝：只拷贝容器对象本身不拷贝其中数据；Foundation框架所有collection类执行拷贝的默认情况；实现copyWithZone方法
    - 图解：

   ![](http://image.stephenfang.me/mweb/Untitled8.png)

## 第二十三节

   ![](http://image.stephenfang.me/mweb/Untitled9.png)

   ![](http://image.stephenfang.me/mweb/Untitled10.png)

   ![](http://image.stephenfang.me/mweb/Untitled11.png)

   ![](http://image.stephenfang.me/mweb/Untitled12.png)

   ![](http://image.stephenfang.me/mweb/Untitled13.png)

   ![](http://image.stephenfang.me/mweb/Untitled14.png)

存放委托对象的属性需要为weak（在对象销毁时自动清空）或unsafe_unretained（不需要自动清空）。

   ![](http://image.stephenfang.me/mweb/Untitled15.png)

   ![](http://image.stephenfang.me/mweb/Untitled16.png)

   ![](http://image.stephenfang.me/mweb/Untitled17.png)

- 某个对象从另一个对象获取数据可以使用委托模式，亦成为数据源模式，数据的流动如上图所示
- 如果有必要可以实现有段位的结构体将委托对象是否能响应相关协议的信息缓存至其中

## 第二十四条

- 通过分类机制将代码划分为易于管理的小块

   ![](http://image.stephenfang.me/mweb/Untitled18.png)

   ![](http://image.stephenfang.me/mweb/Untitled19.png)

   ![](http://image.stephenfang.me/mweb/Untitled20.png)

   ![](http://image.stephenfang.me/mweb/Untitled21.png)

- 可以创建名为Private的分类并将私有方法放在里面，这个分类的方法只在类和框架内部使用无需对外公布

## 第二十五条

- 向第三方类中添加分类时给分类名与方法名加上前缀

   ![](http://image.stephenfang.me/mweb/Untitled22.png)

## 第二十六条

- 在实现分类时所有属性都应该定义在主接口内，类所封装的所有数据都应该定义在主接口内

   ![](http://image.stephenfang.me/mweb/Untitled23.png)

## 第二十七条

- class-continuation 分类中可以定义方法和实例变量，如下方式中_anotherInstanceVariable 是隐藏的状态

    ```objectivec
    @interface STFPerson() {
    		NSString *_anInstanceVariable;
    }
    // Methods declaration
    @end

    @implementation STFPerson {
    	int _anotherInstanceVariable;
    }
    // Methods implementation 
    @end
    ```

   ![](http://image.stephenfang.me/mweb/Untitled24.png)

- WebKit、CoreAnimation 底层大部分代码用C++编写，对外展示的为Objective-C接口

   ![](http://image.stephenfang.me/mweb/Untitled25.png)

- 上图方式可以随意调用setFirstName与setLastName方法与点语法设置属性，同时外界无法修改对象，完成了类型的拓展

   ![](http://image.stephenfang.me/mweb/Untitled26.png)

    - 不需要在公共接口中声明类遵从了私有协议，而应该改到 class-continuation 分类内进行声明

## 第二十八条

- 协议可以在某种程度上提供匿名类型，具体的对象类型淡化成为遵从某个协议的id类型，协议离规定对象应该实现的方法。下图中与数据库连接相关的类名称就无法泄漏

    ![](http://image.stephenfang.me/mweb/Untitled27.png)

- 使用匿名对象实现类型名称的隐藏，需要注意的是对象需要能够响应定义在协议中的方法
- 下图中其中sectionInfo为匿名对象，把section数组中返回的内部状态对象视为遵从NSFetchedResultsSectionInfo的匿名对象，隐藏了相关实现细节。

    ![](http://image.stephenfang.me/mweb/Untitled28.png)

## 第二十九条

- 对象创建完成后引用计数至少为1，如果需要保留该对象需要调用retain方法，如果不再需要该对象则调用release、autorelease方法，当引用计数归零时对象被回收

    ![](http://image.stephenfang.me/mweb/Untitled29.png)

- 为了避免使用无效对象一般在完成调用release之后清空指针，保证不会出现指向无效对象的指针

    ```objectivec
    NSNumber *number = [[NSNumber alloc]initWithInt: 1234];
    [array addObject: number];
    [number release];
    number = nil;
    ```

## 第三十条

- ARC会自动执行retain、release、autorelease等操作，不能直接对这些方法（还包括dealloc）进行调用
- ARC在调用这些方法并不通过Objective-C消息派发机制，而是直接调用底层C语言版本，能够带来更好的性能
- 若方法名以以下的几个四个词语开头则表示返回的对象归调用者所有，反之返回的对象会自动释放
    - copy
    - mutableCopy
    - new
    - alloc

## 第三十一条

   ![](http://image.stephenfang.me/mweb/Untitled30.png)

- 如果对象持有文件描述符等系统资源，应该专门写一个方法释放此类资源，用完使用close方法
- 执行异步任务的方法和只能在正常状态下执行的方法不应在dealloc中调用

## 第三十二条

- ARC不生成安全处理异常所需的清理代码，开启编译器标志后可以生成这种代码但是会导致应用程序变大，且会降低运行效率

   ![](http://image.stephenfang.me/mweb/Untitled31.png)

## 第三十三条

- 当指向EOCClassA的实例引用移除后unsafe_unretained属性仍然指向已经回收的实例，而weak属性指向nil

    ![](http://image.stephenfang.me/mweb/Untitled32.png)

## 第三十四条

系统会自动创建一些线程，如主线程或GCD机制中的线程都有自动释放池，这些线程都有autoreleasepool，每次执行event loop就会将其清空

   ![](http://image.stephenfang.me/mweb/Untitled33.png)

   ![](http://image.stephenfang.me/mweb/Untitled34.png)

## 第三十五条

- 系统在回收对象时可以将其转化为僵尸对象，通过环境变量NSZombieEnabled可以开启该功能，或在Xcode中开启

![](http://image.stephenfang.me/mweb/Untitled35.png)

- 系统修改对象的isa指针指向特殊的僵尸类可以时该对象成为僵尸对鲜花，僵尸类能够响应所有的selector，在打印一条包含消息内容及接受者的消息后终止应用程序

## 第三十六条

在 ARC 下调用查询对象当前引用计数的方法会触发崩溃

    ```objectivec
    - (NSUInteger)retainCount
    ```

事实上该方法不应该调用，方法返回的retainCount是某个给定时间点上的数值，并未考虑系统会稍后清空自动释放池，无法反应对象生命期的全貌。

## 第三十七条

- Block与定义它的函数共享同一个范围内的信息，块自有其相关类型，可以将块赋值给变量并使用它

    ```objectivec
    void (^someBlock) () = ^ {
    		// Block implementation
    };

    int other = 10;
    int (^addBlock) (int a, int b) = ^ (int a, int b) {
    		return other + a + b;
    };
    int sum = addBlock(1, 2);
    ```

    - 需要在Block内修改的变量需要加上 _block 修饰符，如果将块定义在Objective-C类的实例方法中，除了可以访问类的所有的实例变量外还可以使用self变量且无需添加_block。
    - 定义Block的时候分配的内存区域在栈上，即块只在定义的范围内有效，可以创建不会捕捉任何状态的全局块

![](http://image.stephenfang.me/mweb/Untitled36.png)

![](http://image.stephenfang.me/mweb/Untitled37.png)

## 第三十八条

![](http://image.stephenfang.me/mweb/Untitled38.png)

- 以下展示了SDWebImage中Block的写法

    ```objectivec
    typedef void(^SDWebImageDownloaderProgressBlock)(NSUInteger receivedSize, long long expectedSize);
    typedef void(^SDWebImageDownloaderCompletedBlock)(UIImage *image, NSData *data, NSError *error, BOOL finished);

    ****- (void)setImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder options:(SDWebImageOptions)options progress:(SDWebImageDownloaderProgressBlock)progressBlock completed:(SDWebImageCompletedBlock)completedBlock;
    - (id<SDWebImageOperation>)downloadImageWithURL:(NSURL *)url
                                            options:(SDWebImageDownloaderOptions)options
                                           progress:(SDWebImageDownloaderProgressBlock)progressBlock
                                          completed:(SDWebImageDownloaderCompletedBlock)completedBlock;

    - (id<SDWebImageOperation>)downloadImageWithURL:(NSURL *)url
                                    timeOutInterval:(NSTimeInterval)timeOutInterval
                                            options:(SDWebImageDownloaderOptions)options
                                           progress:(SDWebImageDownloaderProgressBlock)progressBlock
                                          completed:(SDWebImageDownloaderCompletedBlock)completedBlock;
    ```

## 第三十九条

- 简洁程度上Delegate与Block的对比

   ![](http://image.stephenfang.me/mweb/Untitled39.png)

   ![](http://image.stephenfang.me/mweb/Untitled40.png)

- 处理多个请求时Delegate与Block的对比

   ![](http://image.stephenfang.me/mweb/Untitled41.png)

   ![](http://image.stephenfang.me/mweb/Untitled42.png)

   ![](http://image.stephenfang.me/mweb/Untitled43.png)

   ![](http://image.stephenfang.me/mweb/Untitled44.png)

- 在处理请求时采用两个独立的处理Block（1/2）

   ![](http://image.stephenfang.me/mweb/Untitled45.png)

   ![](http://image.stephenfang.me/mweb/Untitled46.png)

   ![](http://image.stephenfang.me/mweb/Untitled47.png)

- 在处理请求时采用同一个处理Block，令Block更为灵活但更为冗长

   ![](http://image.stephenfang.me/mweb/Untitled48.png)

   ![](http://image.stephenfang.me/mweb/Untitled49.png)

## 第四十条

大部分网络通信库写法

   ![](http://image.stephenfang.me/mweb/Untitled50.png)

为了使得在下载完成后通过以下方法执行调用者指定的Block，需要将completion handler保存至实例变量，一旦运行完completion handler之后没有必要对其进行保留，从而避免出现retain cycle

   ![](http://image.stephenfang.me/mweb/Untitled51.png)

   ![](http://image.stephenfang.me/mweb/Untitled52.png)

## 第四十一条

- 串行队列，将读取操作与写入操作安排到同个队列中保证数据同步，可以将设置方法由同步派发改为异步执派发

   ![](http://image.stephenfang.me/mweb/Untitled53.png)

   ![](http://image.stephenfang.me/mweb/Untitled54.png)

    - 并发队列，读取与写入操作可以随时执行

   ![](http://image.stephenfang.me/mweb/Untitled55.png)

    创建栅栏使得barrier块单独执行不与其他Block并行，对并发队列有意义，因为串行Block按顺序逐个执行

   ![](http://image.stephenfang.me/mweb/Untitled56.png)

   ![](http://image.stephenfang.me/mweb/Untitled57.png)

   ![](http://image.stephenfang.me/mweb/Untitled58.png)

## 第四十二条

- performSelector接受的参数类型为id，限定了传入参数必须是对象，不能是整数或者浮点数，并且最多只能接受两个参数

   ![](http://image.stephenfang.me/mweb/Untitled59.png)

- 延后执行某项任务，优先使用GCD的方式

   ![](http://image.stephenfang.me/mweb/Untitled60.png)

- 把任务放到主线程上执行，把任务封装至Block中用GCD相关方法更为合适

   ![](http://image.stephenfang.me/mweb/Untitled61.png)

- performSelector在内存管理方面存在缺失，无法确定将执行的Selector具体是什么

## 第四十三条

- GCD是纯C的API，操作队列是Objective-C的对象
- Block是轻量级的书籍结构而Operation是重量级的Objective-C对象
- 在执行后台任务时GCD并不一定是最佳方式
- 使用NSOperation与NSOperationQueue有以下好处，能够实现纯GCD具备的绝大部分功能

   ![](http://image.stephenfang.me/mweb/Untitled62.png)

   ![](http://image.stephenfang.me/mweb/Untitled63.png)

   ![](http://image.stephenfang.me/mweb/Untitled64.png)

- NSNotificationCenter 的 addObserverForName: 方法接受的参数是块而不是Selector

   ![](http://image.stephenfang.me/mweb/Untitled65.png)

- 确定哪一种方法的最好方式是测试性能

    ## 第四十四条

- dispatch group 能够将任务分组，调用者可以等待这组任务执行完毕同时也可以在提供回调函数之后继续执行
- 如下函数是dispatch_async的变体

![](http://image.stephenfang.me/mweb/Untitled66.png)

- 如下函数用于等待 dispatch group 执行完毕，timeout 参数表示阻塞时间，若执行时间短于timeout返回0

![](http://image.stephenfang.me/mweb/Untitled67.png)

- 如下函数中可以传入在特定线程上执行的Block

![](http://image.stephenfang.me/mweb/Untitled68.png)

- 令数组每个对象都执行某个任务，并且等待每个任务都执行完毕可以使用如下GCD特性

![](http://image.stephenfang.me/mweb/Untitled69.png)

- 若当前线程不阻塞可以使用notify函数取代wait

![](http://image.stephenfang.me/mweb/Untitled70.png)

- 区分任务的优先级放置于不同的线程执行，同时将所有任务归于一个dispatch group，并且在执行完毕后获得通知（并发队列）

![](http://image.stephenfang.me/mweb/Untitled71.png)

- 将任务提交到串行队列中并用dispatch group 跟踪执行情况

![](http://image.stephenfang.me/mweb/Untitled72.png)

![](http://image.stephenfang.me/mweb/Untitled73.png)

## 第四十五条

- 常用的一种共享单例的方法

   ![](http://image.stephenfang.me/mweb/Untitled74.png)

- 使用GCD实现共享单例的方法

   ![](http://image.stephenfang.me/mweb/Untitled75.png)

- 使用 dispatch_once 能够简化代码并且彻底保证线程安全开发者无需关心加锁或同步，所有问题都由GCD在底层进行处理，static 作用域能够保证编译器在每次执行该方法时复用该变量而不是重复创建

## 第四十六条

- dispatch_get_current_queue 函数尽量不要使用

## 第四十七条

- 框架指一系列代码被封装为动态库，并且在其中放入描述接口的头文件，iOS平台的系统框架仍然采用了动态库
- iOS应用程序不允许在其中包含动态库于是就出现了静态库
- 关于静态库与动态库的了解可以参考 [细说iOS静态库和动态库](https://juejin.cn/post/6844904031937101838)

- Cocoa 本身并不是框架而是集成了一批创建应用程序时需要用到的框架
- Objective-C编程的一个重要特点是经常需要用到底层的C语言级API
- CoreAnimation 使用Objective-C进行编写，而 CoreGraphics 框架采用C语言进行编写，两者均为 UI 框架之下的一等框架

## 第四十八条

- 遍历方式
    - for循环

   ![](http://image.stephenfang.me/mweb/Untitled76.png)

    字典与 set 均无顺序，无法根据下标访问数值。于是需要获取字典内所有键或 set 内所有对象，从而产生空间上的额外开销。然而执行反向遍历时 for 循环会更为方便。

    - NSEnumerator

    ```objectivec
    // Dictionary
    NSDictionary *dict = /* ... */;
    NSEnumerator *enumerator = [dict keyEnumerator];
    id key;
    while ((key = [enumerator nextObject]) != nil) {
    	id value = dict[key];
    	// do something here
    }

    // Set
    NSSet *set = /* ... */;
    NSEnumerator *enumerator = [set objectEnumerator];
    id object;
    while ((object = [enumerator nextObject]) != nil) {
    	// do something here
    }

    // Array
    NSArray *array = /* ... */;
    NSEnumerator *enumerator = [array reverseObjectEnumerator];
    id object;
    while ((object = [enumerator nextObject]) != nil) {
    	// do something here
    }
    ```

    对于所有的collection都可以采用这套语法，在读法上更容易被理解

    - for in 快速遍历

    ```objectivec
    // Dictionary
    NSDictionary *dict = /* ... */;
    for (id key in dict) {
    	id value = dict[key];
    	// do something here
    }

    // Set
    NSSet *set = /* ... */;
    for (id object in set) {
    	// do something here
    }

    // Array
    NSArray *array = /* ... */;
    for (id object in array) {
    	// do something here
    }
    for (id object in [array reverseObjectEnumerator]) {
    	// do something here
    }
    ```

    某个支持快速遍历的类的对象遵从 NSFastEnumeration 协议可以实现对象的迭代，而NSEnumerator 也实现了该协议，该遍历方法无法获取遍历操作针对的下标。

    - 基于Block的遍历

    ```objectivec
    // Dictionary
    NSDictionary *dict = /* ... */;
    [array enumerateKeysAndObjectsUsingBlock:
    	^(id key, id object, BOOL *stop) {
    		// do something here
    			if (shouldStopHere) {
    				*stop = YES;
    		}
    }];

    // Set
    NSSet *set = /* ... */;
    [array enumerateObjectsUsingBlock:
    	^(id object, BOOL *stop) {
    		// do something here
    			if (shouldStopHere) {
    				*stop = YES;
    		}
    }];

    // Array
    NSArray *array = /* ... */;
    [array enumerateObjectsUsingBlock:
    	^(id object, NSUInteger idx, BOOL *stop) {
    		// do something here
    			if (shouldStopHere) {
    				*stop = YES;
    		}
    }];
    ```

    使得遍历能够从Block中获取信息，并且可以在遍历数组获取数组的下标。

    NSEnumerationOptions 类型为enum，如果开启了NSEnumerationConcurrent 底层会使用GCD处理出发执行事宜，采用其他方法很难实现。

## 第四十九条

- 使用桥接技术可以实现定义在Foundation框架内的Objective-C类与CoreFoundation 框架中的 C 数据结构的相互转换

    ```objectivec
    NSArray *anNSArray = @[@1, @2, @3, @4, @5];
    CFArrayRef *aCGArray = (__bridge CFArrayRef)anNSArray;
    NSLog(@"size of array = %li", CFArrayGetCount(aCFArray)); 

    gradientLayer.colors = @[(__bridge id)[UIColor ne_colorWithHexString:@"000000" alpha:0.95].CGColor,
                                                (__bridge id)[UIColor ne_colorWithHexString:@"000000" alpha:0.95].CGColor,
                                                (__bridge id)[UIColor ne_colorWithHexString:@"000000" alpha:0.72].CGColor,
                                                (__bridge id)[UIColor ne_colorWithHexString:@"000000" alpha:0.45].CGColor,
                                                (__bridge id)[UIColor ne_colorWithHexString:@"000000" alpha:0.28].CGColor,
                                                ]; 
    ```

- __bridge 含义为ARC具备该对象的所有权，__bridge_retained表示ARC交出该对象的所有权， 通过__bridge告诉ARC如何处理转换涉及的Objective-C对象
- Foundation 框架中的 Objective-C 类具备的某些功能是 CoreFoundation 框架中的 C语言数据结构不具备的

## 第五十条

- NSCache 在系统资源耗尽时能够自动删减缓存，采用LRU策略
- NSCache并不会直接拷贝键，而是保留键
- NSCache是线程安全的，多个线程可以同时访问NSCache
- NSCache可以设置针对对象个数以及总成本的上限

缓存的一般用法

   ![](http://image.stephenfang.me/mweb/Untitled77.png)

   ![](http://image.stephenfang.me/mweb/Untitled78.png)

加入 NSPurgeable 的缓存用法

   ![](http://image.stephenfang.me/mweb/Untitled79.png)

   ![](http://image.stephenfang.me/mweb/Untitled80.png)

- 重复计算会带来性能开销的数据值得被放入缓存，从而提高应用程序的响应速度
- NSPurgeableData 与 NSCache 一起使用能够实现自动清除数据的功能

## 第五十一条

- load 方法并不像普通的方法那样，她不遵从继承规则，如果某个类本身不实现load方法那么无论其各级超类是否实现此方法系统都不会调用
- load 与 initialize 方法务必精简实现，因为会产生阻塞从而使得应用程序无响应
- initialize 方法在程序首次用该类前调用一次，并且使用runtime进行调用，只应该用来设置内部数据而不应该调用其他方法
- 如果某个类本身不实现 initialize 方法然而超类完成了就会调用超类的实现方法，如下图中初始化子类后由于该类未覆写该方法于是需要执行父类的实现代码，于是得到了通常的子类实现方法

![](http://image.stephenfang.me/mweb/Untitled81.png)

![](http://image.stephenfang.me/mweb/Untitled82.png)

![](http://image.stephenfang.me/mweb/Untitled83.png)

## 第五十二条

- NSTimer 对象会保留目标直到计时器失效，需要调用invalidate方法令其失效

   ![](http://image.stephenfang.me/mweb/Untitled84.png)

   ![](http://image.stephenfang.me/mweb/Untitled85.png)

- 反复执行的计时器容易引入retain cycle，可以使用 Block 的方式打破，需要注意的是必须创建分类来加入相关实现代码