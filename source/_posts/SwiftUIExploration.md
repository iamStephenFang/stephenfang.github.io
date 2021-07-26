---
title: SwiftUI开发初探
date: 2021-07-15 15:20:20
categories: 
- tech
tags: 
- iOS
- SwiftUI
- Swift
copyright: true
---

最近使用 SwiftUI 完成了一部分项目的编写，我将完成项目时使用 SwiftUI 进行开发的体验做简单的总结。本文也同时发表于网易KM平台。

<!--more-->

# 最近项目

- 基于知识图谱的推荐系统的设计与实现（客户端部分采用 SwiftUI 实现）

{% asset_img Recommender.png %}

{% asset_img Structure.png %}

- 知识图谱入门简介（UI 部分采用 SwiftUI 实现，WWDC Swift Student Challenge获奖项目）

[iamStephenFang/KnowledgeGraph](https://github.com/iamStephenFang/KnowledgeGraph)

{% asset_img KG.png %}

- FinMatters（一款采用 SwiftUI 编写的理财 App）

{% asset_img Fin.png %}

# 哪些优点

## 指令式编程 VS 声明式编程

指令式编程逐条指示计算机**怎么做，**注重于**描述过程**

- 运算语句：let a = 1 + 2
- 循环语句: for while
- 条件语句: if switch

## 声明式编程教会计算机**做什么，**注重于**描述结果**

- Map： let squares = nums.map {$0* $0}
- Reduce： let total = nums.reduce(10.0,+)
- Filter： let evens = nums.filter { $0% 2 == 0 }

## 声明式UI

1.View并不负责渲染，并非传统意义的视图层级，而是对视图组织关系的声明

2.决定 UI 状态的状态 State 存储在对象之中

3.View = func(State)通过控制和改变 State来得到确定的 View

4.State 改变时调用上述函数获取新的 State 的 View，重新渲染更改部分

## 开发体验

- UIKit 组件混编成本不高
- 复杂视图减少代码量
- Model-View-ViewModel
- 动画、效果、手势实现简单

{% asset_img Code1.png %}

## 其他特性

- 在 iPad 上的 Swift Playground编写 SwiftUI 相关代码

{% asset_img PG.png %}

- 在 Xcode 中可以实现实时的、可响应的预览

{% asset_img Demo.png %}

- 跨端开发压力小，实现iOS、iPadOS、watchOS、macOS同步开发

{% asset_img CP.png %}

# 哪些缺点

## 兼容性

- 发布于 WWDC19
- Xcode 11.0+
- iOS 13.0+
- 网易云音乐iOS 11.0+

## 组件开发

表面上 SwiftUI 集成了很多可用的组件，但在实现自定义组件时还是需要自行编写元组件相关的代码，并且目前三方组件库可选择的项目较少。

{% asset_img Code2.png %}

{% asset_img Code3.png %}

{% asset_img Fin2.png %}

原生组件可供更改的样式极其有限，有时候一些问题的解决方案代码并不优雅，比如导航栏只能手动隐藏、全屏状态下无法展示Modal、List 的分割线无法移除等等。

{% asset_img Code4.png %}

```swift
var body: some View {
        NavigationView{
            ZStack {
                Color("Background").ignoresSafeArea()
                VStack{
                    TopNavView(navDesc: “总览")
                        .padding(.horizontal)
                        .padding(.top, 0)
                    
                    VStack{}
	      / *** 省略内容 ***/
                .navigationTitle("")
                .navigationBarHidden(true)
            }
        }
    }
```

## 组件缺失

- WKWebView 混编

{% asset_img Code4.png %}

- SwiftUIX [https://github.com/SwiftUIX/SwiftUIX](https://github.com/SwiftUIX/SwiftUIX)
- SwiftUI-Introspect [https://github.com/SwiftUIX/SwiftUIX](https://github.com/SwiftUIX/SwiftUIX)

## 开发体验问题

- 寻找问题答案成本较高，Stack Overflow可能都未收录
- API 在 SwiftUI 大版本更新时存在差别
- View Hierarchy 检查器无法使用
- Live Preview 渲染经常出错且消耗大量性能
- 错误信息有时存在误导

# 最后总结

- 目前适合个人开发者开发个人项目
- 两年内随着老款iOS设备的淘汰能够看到更多的 SwiftUI 应用
- SwiftUI 与 Combine 的结合
- 苹果平台应用有跨端需求可以减少开发成本
- 开发体验上好于 Flutter、React Native

# 参考链接

1. https://designcode.io/swiftui2-course
2. https://www.raywenderlich.com/19611194-multiplatform-app-tutorial-swiftui-and-xcode-12
3. https://www.fivestars.blog/articles/custom-view-styles/
4. https://objccn.io/products/functional-swift/
5. https://objccn.io/products/swift-ui
6. https://www.fivestars.blog/articles/swiftui-hud/