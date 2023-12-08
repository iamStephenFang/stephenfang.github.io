---
title: Muzik开发总结 — 设计与实现
pubDatetime: 2020-07-15 19:15:20
categories: 
- 技术
tags: 
- iOS
- Swift
- 音乐App
copyright: true
description: 我希望有一款 Tab Based 的 iOS App 带来简约轻量的音乐播放体验，作为一个有一些 iOS 基础的人，我决定自己开发一个简单的本地音乐播放器，正好实践一些 UIKit 控件的使用。
---

<!--more-->

## 目的
本系列文章是开发一个简易的音乐播放器（暂时命名为“Muzik”）的博客记录，本篇目的在于展示设计与实现方面的进度。

## 环境
- iOS 13.6
- Xcode 11.6

## 设计
![截图2020-07-27 at 22.58.20](http://image.stephenfang.me/sketch.png)
在项目开始编写代码前，我使用 Sketch 对整个App 进行设计，确定了字体与元素的使用规范，方便之后针对我想要实现的设计进行微调。其实这一步也可以直接在 StoryBoard 中完成，然而添加阴影等操作在 Sketch 等原型创作工具中更为直观。
在完成设计后我尝试使用 Sketch Mirror、MockUp工具对 App 上手的感受进行评估，并发送原型给朋友了解他们提出的一些建议。
![](http://image.stephenfang.me/mweb/15958622925026.png)
至少在 MockUp 效果下 App的整体观感还让我比较满意。我希望这种简单的风格贯穿整个 App，使得我能够用 UIKit 较为轻松地实现 App 的功能。
 ![](http://image.stephenfang.me/mweb/15958623328077.png)

支持 Dark Mode 也是大势所趋，针对 iOS 13 之后的 App 都应该加入支持。为了给 iPhone X设备带来更好的视觉观感，我选择了纯黑作为 App 的底色。
![](http://image.stephenfang.me/mweb/15958624669288.jpg)


## 组织
按照 Sketch 中的页面设计，我将整体 App 分为精选、专辑、歌曲、音乐人、播放列表、正在播放这几个部分，其中我希望有一个小组件能像原生音乐App一样能够看到当前播放进度以及进行快捷操作，于是我将包含显示当前播放内容的 UIView 置于App的顶层位置，其中UIView中包含 UIProgressView 等控件。这是我目前能够想到且实现的理想方法，缺点即需要为下层的所有视图添加 Offset。
Tab + Navigation 是 iOS 开发中一种非常常见的模式，每一个页面依次对应了精选、专辑、歌曲、音乐人、播放列表的功能。
![](http://image.stephenfang.me/strc.png)

## 页面实现
### 精选页面
页面包含最近添加的专辑、收听最多的歌曲、常听的播放列表等栏目组成，点击不同栏目的项目可以触发不同的二级功能。从此页面可以简述我的设计理念，即专辑使用卡片式的设计语言，更契合 iOS 13 的设计风格。
![-w301](http://image.stephenfang.me/mweb/15958633632257.jpg)

### 专辑页面
卡片式的专辑页面，点击不同的专辑进入详情页面。需要注意的是我为该页面添加了可隐藏的索引栏，避免索引栏与专辑页面重合，显得过于拥挤，这一点在歌曲页面可以看到。
![-w301](http://image.stephenfang.me/mweb/15958635741661.jpg)

点击专辑卡片进入相应的详情页面，简单的 TableView 实现。
![-w301](http://image.stephenfang.me/mweb/15958637814033.jpg)

## 歌曲页面
从歌曲页面可以看到右侧的可隐藏的索引栏，这里学习了 Ecoute 的设计。App 整体的设计风格十分统一，无论是字体还是网格。
![-w301](http://image.stephenfang.me/mweb/15958640618143.jpg)

## 音乐人页面
这个页面是我目前不满意的一个页面，因为 iOS 的MediaLibrary 框架中并没有提供获取 ```albumArtist```的 ```artwork``` 的方法。目前有改进的方案，即通过请求 iTunes Store 数据库返回 JSON，获取其中的艺人封面 url 并缓存其中的艺人封面。思路有一些类似于 [SDWebImage](https://github.com/SDWebImage/SDWebImage)，然而希望以自己的方式进行简单实现。
![-w301](http://image.stephenfang.me/mweb/15958641787194.jpg)

同样，点击不同的 row 进入相应的音乐人详情页面，区别是这个采用 CollectionView 实现。
![-w301](http://image.stephenfang.me/mweb/15958647723869.jpg)

## 播放列表页面
根据播放列表的实际需求实现了显示页面，由于时间过于仓促没有认真适配播放列表的缩略图。
正打算自己花时间写一个类似于原声音乐播放器的播放列表的缩略图效果，我在 GitHub 上找到了一个类似的开源项目: [
StitchingImage](https://github.com/zhengjinghua/StitchingImage)
![-w301](http://image.stephenfang.me/mweb/15958648056682.jpg)

然而实现语言为 Objective-C，我正在尝试用 Swift 将其进行重写，之后会开源到 GitHub 上。

详情页还是同样的味道，目前做的仍然十分粗糙，我会尝试对 UI 进行持续改进。
![-w301](http://image.stephenfang.me/mweb/15958650862897.jpg)


## 搜索页面
点击任意一级页面导航栏的搜索按钮会激活搜索页面，使用框架的方法调用实现了简单的检索。
![-w301](http://image.stephenfang.me/mweb/15958640040336.jpg)

## 正在播放页面
类似于原生的播放页面，目前正在对整个页面进行重构，包括 UI 部分与代码部分。
目前主要通过 Timer 与 Observer 实现了简单的功能实现，但是为了达到优雅听歌的目标功能远不于此，我正在尝试接入[LyricsKit](https://github.com/ddddxxx/LyricsKit) 使得页面具有显示歌词的功能，这里需要用到 ScrollView 与 PageControl的加持。
![-w301](http://image.stephenfang.me/mweb/15958655245499.jpg)


## 总结
以上为目前的进度总结，我会持续更新 App 的开发过程，包括代码总结与功能实现。