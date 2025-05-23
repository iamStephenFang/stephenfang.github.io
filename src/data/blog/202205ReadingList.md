---
title: 2022年五月读书摘录
pubDatetime: 2022-06-15 13:10:12
categories:
  - 阅读
tags:
  - 读书
  - 乔纳森传
  - 平成十二年
  - UNIX传奇
  - 西南联大
  - 重走
copyright: true
description: 最近看社会新闻很是头疼，也想着找一些地方发泄一些情绪，结果发现一旦拿起一本书看烦恼就能够暂时解除，便结束了这个念头。
---

今年囫囵吞枣读了不少书，早早达成了一个月读一本书的目标。但是很多书读完一遍过一段时间很难再去梳理，可能等同于没读，于是决定将书里的内容摘出来在博客上分享，也方便自己随时回忆。
有些书自己什么时候读完的也不记得了，之后每个月会对自己读的书进行一次整理，这起主要是四本书，

- 《乔纳森传》
- 《平成十二年》
- 《UNIX传奇》
- 《重走》

# 《UNIX传奇》

[UNIX传奇](https://book.douban.com/subject/35292726/)

这本书极大激发了我对于计算机研究的兴趣，从作者的讲述中了解到 UNIX 和实验室的发展历程以及这群人和这群人的创造的影响。

原来写代码是有使命感的，让我在专注工作的同时能够感受到写代码给我带来的成就感。

### 1.1 贝尔实验室的物理科学研究

> 现今世界已全然不同，多数人只做未来几个月的规划，功夫都花在了预测下一季度财务状况上。

时常能够在网络上看到对于现今人类不思进取的责难，的确，战争时期的人类在科技领域取得了耀眼的成就，近几十年的发展相较于战争时期再或者是冷战时期可以说发展缓慢。现代社会的法则更聚焦于商业上的成功。

### 1.5 137→127→1127→11276

> 相对于“我的人比你的人强”，我们更加会说“别忘记你的人还做了一件好事”。

在工作过程中需要肯定其他团队的成员的价值，懂得谦虚。

### 3.2 Unix房间

> 独立办公室虽然比开放式区域成本更高，但也给了员工安静平和的空间，让员工可以不受旁边没完没了的噪声影响，专注于工作，还能够保存图书、文件，关上门就能沉思或私聊。

### 3.5 丹尼斯·里奇小传

> 到了1973年，Unix已经从原来的汇编语言改为C语言编写，系统的维护和修改变得更加容易。

### 4.2 系统调用

> **文件只是字节。用户决定这些字节代表什么，而操作系统则只负责存储和取出，不向用户暴露设备属性。**

### 4.5 grep命令

> **grep这个名字来自ed文本编辑器中的命令g/re/p，它列出所有符合正则表达式模式re的行。**

在学习 Linux 的时候接触了这个命令却一直不知道它的历史。

### 4.7 C语言

> **C语言既古怪又有缺点，却获得了巨大的成功。虽然历史上的意外事件肯定有帮助，但C语言显然满足了人们对一种系统实现语言的需求，这种语言需要足够高效，足以取代汇编语言，但又足够抽象和流畅，足以描述各种环境下的算法和交互。**

### 5.2 Yacc，Lex，Make

> **Lint这个名字来自从衣服上捡拾绒毛（lint）的情景。虽然其功能已多被纳入C语言编译器，但其概念体现到了其他语言的类似工具中。**

### 5.3 文档编制

> **也许，今天不会有很多人记得，当机器容量以千字节而不是千兆字节为单位时，时间和空间的利用效率乃是重中之重。每个字节都得斟酌使用，所以在某种程度上，每条指令也得再三推敲，因此，一种能在这两方面都节约的语言不仅优秀，而且是实际需要。**

在日常写代码的过程中只有在 Code Review 的过程中会关注执行效率，会不曾想到在计算机存储和性能吃紧的时候每一次优化都非常有意义。

### 5.6 其他贡献

> **Unix和C语言被广泛采用，导致20世纪80年代和90年代的CPU设计围绕着它们运转，没人成功制造出为其他语言优化的CPU。**

### 6.1 程序员工作台

> **SCCS的基本思想是，程序员签出代码库中的一部分，锁定这部分代码，其他程序员在锁持有者解锁之前不能修改它，这样就避免了多位程序员同时对代码做出不一致的修改。当然还是会出问题，如粗心大意或程序崩溃都可能会导致代码死锁。另外，如果锁定范围太大，就会拖慢同时修改的速度。**

### 6.2 高校授权

> **加利福尼亚大学伯克利分校是最活跃的许可获得者之一，该校的一些研究生对系统做出了重大贡献，最终演化出伯克利软件发行版（Berkeley Software Distribution，BSD）。BSD是由最初的科研版Unix演变而来的两个主要分支之一。**

### 8.1 伯克利软件发行版

> **BSD的后裔如今仍然活跃，FreeBSD、OpenBSD和NetBSD等变种都在继续发展。苹果公司的Darwin（macOS的核心）所使用的NextSTEP也是BSD的衍生版本。**

### 8.3 Minix和Linux

> **我相信API不该有版权。如果API有版权，我们就不会有与Unix相似的各种操作系统，包括Linux在内，因为它们全是基于Unix系统调用接口的独立实现。我们可能也不会有Cygwin这样的软件包，它是Unix实用程序的Windows实现，为Windows用户提供了类似Unix的命令行界面。事实上，如果接口的独立实现可以被宣告所有权的公司所限制，我们就不太可能有很多独立实现。**

### 8.4 Plan 9

> \*Plan 9确实为世界贡献了一件无比重要的东西：Unicode的UTF-8编码。

### 8.5 流散

> **朗讯与法国电信公司阿尔卡特（Alcatel）合并成立阿尔卡特-朗讯（Alcatel-Lucent），而阿尔卡特-朗讯又在2016年被诺基亚收购。**

### 9.1 技术方面

> **人们有时会用代码行数来评价软件的生产力。在Unix的世界里，生产力却往往以删除了多少特殊情况或代码行数来衡量。**

> **Unix的高明之处在于选择了足够普适的抽象概念，既能发挥巨大的作用，又不至于在性能上付出太大代价。**

> **Unix哲学是关于如何处理计算任务的编程风格。这是道格·麦基尔罗伊在《贝尔实验室技术杂志》（Bell Labs Technical Journal）Unix特刊的前言中总结出来的。
> （i）让每个程序做好一件事。要做一件新的工作，就构建新程序，而不是通过增加新“特性”使旧程序复杂化。
> （ii）预期每个程序的输出都能成为另一个未知程序的输入。不要用无关的信息来干扰输出。避免使用严格的分栏对齐或二进制输入格式。不要执着于交互式输入。
> （iii）设计和构建软件，甚至是操作系统，要尽早试用，最好是在几周内就用起来。大刀阔斧砍掉笨拙的部件，重建它们。
> （iv）宁可绕道构建用后即弃的工具来减轻编程负担，也别依赖经验欠奉的帮助。**

### 9.2 组织

> **研究人员可以长期甚至年复一年地探索他们认为重要的想法，而不必每隔几个月就向人证明自己在努力。**

没有背负 KPI 的压力，自己确定自己的研究目标，对于自主的人来说无疑是一件幸福的事。

> **再优秀的视频会议系统也无法取代就在隔壁的合作者和随手可得的专家。**

在 WFH 逐渐流行的今天我也仍然相信这一点。之前在诺基亚公司实习的时候 leader 提到有员工会为了沟通一个业务专程从国外飞来，相信面对面的价值也是这家公司的价值观之一。

> **积极的研究者能和师生们讨论技术话题，总能学到有用的东西，为公司树立正面形象。**

> **部门主管应当知晓手下工作的细节，不是为了争论它有多了不起，而是为了能够解释给其他人听，帮助建立联系。**

> **要建立和维持一个组织，使其成员相互喜欢和尊重，并享受彼此的陪伴，这需要付出努力。不能靠管理部门的命令，也不能靠外部顾问来创造。它是在一起工作的乐趣中有机地成长起来的，也是在一起玩耍的乐趣和互相欣赏中成长起来的。**

带一个团队不是团建就足够的，同一家公司同一个部门不同团队的氛围可能都存在较大不同。

没有人离职的团队不一定是最好的团队，但离职率最高的团队一定是有其原因的，领导肯定负有责任。

### 9.3 认可

> **1993年电影《侏罗纪公园》（Jurassic Park）中有个著名场景，13岁的莱克斯·墨菲[Lex Murphy，阿丽亚娜·理查兹（Ariana Richards）饰]说：“这是个Unix系统! 我会用。”她浏览文件系统，找到大门控制装置，锁上了门，从而使大家免于被迅猛龙吃掉（图9-1）。这一幕可以说是极客们的高峰时刻。**

毫不夸张地说这部电影在上映几十年后重映我第一次看印象最深的就是这个镜头。

### 9.4 历史能重演吗

> **似乎可以预见，将会继续有新的语言出现，让编程变得更简单、更安全。同样可以预测，不会只有一种语言，然而每种语言都有得有失，无法满足所有目的。**

# 《乔纳森传》

[乔纳森传](https://book.douban.com/subject/25786645/)

## 第二章 英国的设计教育

> **20世纪20年代德国的包豪斯建筑学派理念，在20世纪50年代被英国设计界采纳并使用，”她说，“例如，在包豪斯，有所谓的基础学年，而英国的设计专业也有。基础学年就是指，学生从零开始学习设计，与以往的知识没有关系，完全从头开始。”**

之前收听 [Anyway.FM](http://Anyway.FM) 有一期节目讲述了包豪斯的意义，节目中推荐了[梁文道老师的包豪斯纪录片](https://www.bilibili.com/s/video/BV1Ka4y1a7a2)，很值得一看。

> **乔纳森以一种不同寻常的方式来到了纽卡斯尔综合性工程技术学院：他错过了开学的第一天，因为当时他要去领一个设计奖，这多多少少让一起入学的同学感到震惊。“新生入学的前两天，他都不在——他带着自己高中时的作品去领取一个设计奖。”汤奇回忆说。**

> **他从不自大，这在学设计的学生中是难得的优点。大多数学设计的学生尽管没多少才华，但是却很自负，而乔纳森完全不一样。做设计的时候，他是真的热爱自己的工作，对于自己的任务，他向来都是全身心投入。”**

## 第三章 伦敦的生活

> **他对人性化技术非常感兴趣。他设计时总是会先追问一样东西应该是什么样的。他拥有去除或无视某些东西的能力，他不关心一个产品的现状是怎样的，或者一个工程师说它必须是什么样的。他可以从基础开始对任何一样产品或用户界面进行设计。**

我认为设计一个 App 和做一个产品也应该是如此，如果只是拿来主义，最终诞生的必然是不如主流产品的产品。

> **这第一台PowerBook有着嵌入式的键盘、中央定点设备以及前倾的手腕放置区（掌托），足以为未来20年笔记本电脑的设立下基本标准，这一事实至今仍然令大家震惊不已。“我们的PowerBook十分成功，”布伦纳说，“这太让我惊讶了。那台机器和设计本身还有那么多的不足之处。我本以为那将成为一次巨大的失败。但今天回过头来看，基本上所有的笔记本电脑都是那样设计的：嵌入式键盘、掌托以及中央定点设备。”**

> **大多数情况下，当他接受设计委托的时候，许多关键性决策已经由内部做好了。乔纳森逐渐相信，要想成就一件史无前例的新事物，就需要从组织内部进行彻底的变化。**

## 第四章 初到苹果

> **布伦纳的这些选择是正确的，比如：制作室和工程团队的分离，松散的管理结构，工作流程中的合作以及向咨询模式的转变。苹果公司的设计团队之所以能做到如此高效，其中一个原因就是保留了布伦纳原始的结构。**

> **1996年，布伦纳成为五角设计旧金山办公室的一员。他和亚马逊合作设计了最早的电子阅读器Kindle，也参与了耐克和惠普很多产品的设计。2007年，布伦纳参与设计了安德烈·罗梅勒（Dr. Dre）品牌的魔音耳机，**

> **诺曼说，在某种程度上，这是“一个结构良好的程序”，但是他也指出了它的缺点。它不仅很慢、麻烦、繁琐，而且不可避免会导致“折衷”。当一个小组想这么做，而另一个小组想那样做，特色逐渐就会被取代，导致产品缺乏凝聚力。**

> **布伦纳说：“商人的想法是创造出每个人都喜欢的东西，这会导致产品走中庸路线。于是就变成了‘能不能达到一致同意’的问题，这就是为什么你很少看到天才的火花的原因。”**

可能用来解释现今时代的苹果很合适。但是我个人很喜欢现在苹果推出的产品，包括 MacBook Pro 上SD卡槽和 MagSafe 接口的回归，不再是设计师的一意孤行而是权衡了用户诉求的产品。

## 第五章 乔布斯重返苹果

> **停产一个比较受欢迎的产品，大多数高管都会思虑再三。牛顿的支持者拿着标语牌和扬声器，涌进苹果公司总部的停车场（其中一条标语写道：我在乎牛顿）。由于像Palm Pilot这样的掌上电脑的成功，掌上电脑的种类不断增加，但是对乔布斯来说，牛顿只是一个分散注意力的东西。他想让苹果公司将精力集中于电脑，这才是它的核心产品。**

> **“每位设计师都有一个自己的计划表，或是自己的设计理念，（对于他们的活动）根本毫无任何控制可言，”设计师道格·萨茨格说，“一位设计师有一个关于便携笔记本应该如何设计的想法，另一位设计师又有一个关于打印机应该如何设计的想法。但是关于下一代苹果超级电脑应该是什么样子的，却根本没有一个协调统一的想法。这个设计团队并没有建立在协调合作的基础之上。每位设计师都各自为战，都有着自己强烈的设计意识。他们看起来就像是在为许多不同的公司进行设计一样。”**

> **在iMac一体机没有软盘驱动器一事上，乔纳森站在苹果一边。他说：“关于新产品没有软盘驱动器这个问题，我不能代表苹果公司回答你。我只能给你我的回答，‘当人在前进的时候，总是需要把一些东西抛在身后。只要我还有一口气在，我就会继续争论下去，软盘驱动器实在是过时的技术了。我听过很多次这样的抱怨，但是如果前进的道路上没有摩擦，你的脚步就不会像自己希望的那样坚定。’”**

> **乔纳森反驳说，把iMac设计成特别的外形并非是故意为之，它的与众不同是设计过程的必然结果。他说：“我认为很多人起初都把设计看作一种有力的区别手段，能将自己的产品与其他产品相区别，我实在讨厌那种观点。那只是以企业为本，而不是以消费者和人为本。我们的目标不只是要突出自己的产品，而是要创造出在未来会受到人们喜爱的产品，了解这一点非常重要。我们的目标实现之后，结果必然就会与众不同。”**

## 第六章 捷报频传

> **“一切都被记录下来，这是非常必要的。因为很多环节都是动态的。”萨利说道，“即使是我在苹果工作的时候，所有的工艺也都已经确定。这就解释了，为什么对于员工来说，苹果能成为一家很适合为之工作的公司。因为他们有指导工作的手册，在生产软件或是硬件的过程中，这些手册会提供帮助。**

> **“仅仅把狂热的激情放在显而易见的事物上是远远不够的，你需要把注意力和热情放在人们容易忽略的细节上，这才是起决定性作用的。”乔纳森说道。**

## 第七章 铁幕背后的设计工作室

> **在苹果公司，乔纳森的角色一直在演变，逐渐由一位设计师变成了管理层的一分子。他不仅负责团队的管理，也开始着手新成员的招募。同时，他也是设计团队与公司其他部门——尤其是管理层——的信息沟通渠道。他与史蒂夫·乔布斯一直关系密切，而现在，他和公司领导层也是如此——所有新产品开发的种类和研究方向都是他们共同决定的。没有他的指示，什么都没法动工，甚至连产品颜色和按键细节都得由他拍板决定。“一切工作都得经过乔纳森的审阅。”一位设计师说。**

> **与苹果的其他部门相比，乔纳森对自己团队非常袒护。“他会独自承担整个团队的过错，”乔达姆·巴克斯说，“对于设计出现的问题，他会把责任揽在自己身上。如果有哪个环节没有达到标准，他会说那是他的过错。他从未抛下团队中的任何一员。”**

# 《平成十二年》

[平成十二年](https://book.douban.com/subject/30413118/)

## 第7章 党派间的较量

> 日本是一面镜子。当你用狭隘的眼光看这个世界时，你人生的道路也会变得狭隘。那些用与时俱进的眼光看世界的人，早已远远地把你甩在身后。

> 如今，中国人研究日本已经不能只看《菊与刀》了。同样，日本人解剖中国也不能只盯着《阿Q正传》。双方都在进步，都在为寻找新方向而努力。愿以邻为鉴，可知兴衰。

# 《重走》

[重走](https://book.douban.com/subject/35436901/)

## 序二 一次神游

> **旅行最宝贵的价值在于更好地理解世界和自我。**

> **当我们回想自己的一生，我们会意识到，旅行是一段徐徐展开的经历，它会在往后的岁月不断制造回响。它是你长期的投资，源源不断地给你发放红利。**

### 第四章 在南岳：我见证了中国吸收欧洲成就最后的伟大日子

> **学生作文文法有误，或不改，或改而不评；行文不贯，改，偶或加评；文不达，而有思想，助其达；文字华丽，作老生之谈，指出其空泛；文达而无新解，不评，也不给好分；文达而有新解，小误不足病**

> **宓一生极少与自然山水近接，故恒溺惑于人事，局囿于道德。即如Wordsworth（华兹华斯）之久居Lake Districts（英国湖区）……皆有助成其文章与修养工夫，亦皆宓所未得尝受”**

> **正如人一肚皮的世故，却有一点童心，满脸上的雀斑，却有两汪秋水，一街的电灯和汽车，却有头上的亮月，我们喜欢热闹，但是难忘记清静”**
