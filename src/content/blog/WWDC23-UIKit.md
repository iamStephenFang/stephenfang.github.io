---
title: 开发者应该知道的 UIKit 新变化 | WWDC23
pubDatetime: 2023-07-16 17:15:00
categories: 
- 技术
tags: 
- iOS
- Swift
- Preview
- WWDC
- WWDC23
- UIKit
copyright: true
featured: true
description: WWDC 23 大家的目光都被 visionOS 吸引了，作为 UIKit 开发者关注一下目前今年的 [What’s New in UIKit](https://developer.apple.com/videos/play/wwdc2022/10068/) session 实为必要。~~尽管今年更新的内容似乎并没有那么吸引人。~~
---

笔者参照官方给出的代码片段复现了一些简单页面实现，**并且将代码整合到仓库**[WhatsNewInUIKit](https://github.com/iamStephenFang/WhatsNewInUIKit)，希望可以帮助你更快上手和理解这些新特性。笔者还按照业务理解和适配进度的优先级，对 session 内容进行了重新排序和整理。

总的来说，今年的更新主要包括以下几个方面：

- 开发体验
- 通用组件
- 国际化
- iPadOS 适配


<!--more-->

> 💡 2022年笔者在云音乐组内和博客分享了 [WWDC22 UIKit 新功能](https://stephenfang.me/2022/07/24/WWDC22-UIKit/)，有兴趣可以先回顾一下这篇文章，这个系列会一直保持更新。

## 开发体验

### 预览
新版本的 Xcode 中新增了 `#Preview()`这个宏，终于，在用户界面开发上 UIKit 也能够获得和 SwiftUI 一样的预览体验了。

![CleanShot 2023-07-17 at 14.27.18](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2014.27.18.png)


开发者可以自定义预览的视图的名称，下面的 Demo 中使用了 `#Preview()`并指定预览的名称为 `NumberVC`。

```swift
class NumberViewController: UIViewController {
    // ...
}

#Preview("NumberVC") {
    let controller = NumberViewController()
    return controller
}
```

除了快速预览 `UIViewController` ，开发者还可以在面板快速预览`UIView`及其子类。实际体验下来这项功能还是非常实用的，可以在一个面板上以集合的形式显示查看不同机型上的显示效果。

![CleanShot 2023-07-17 at 14.32.49](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2014.32.49.png)


开发者可以在一个代码文件下创建多个`#Preview()`宏，所有预览将展示在 Preview 页面的顶部很方便切换。这个宏的定义长得像这样，需要注意的是这个宏仅在新版本的 Xcode 和系统上生效。

```swift
@available(iOS 17.0, macOS 14.0, tvOS 17.0, *)
@freestanding(declaration) public macro Preview(_ name: String? = nil, traits: PreviewTrait<Preview.ViewTraits>..., body: @escaping () -> UIViewController) = #externalMacro(module: "PreviewsMacros", type: "Common")
```

至于 Preview 实现的原理可以移步[这篇文章](https://saitjr-blog.feishu.cn/docs/doccngUda5tsKD7J1ORyTGh9kog)查看。

### `viewIsAppearing`

`viewIsAppearing`的触发时机可以让开发者更方便的对用户界面刷新进行操作，关于这个生命周期你需要知道的有以下几点：

- 向前兼容到 iOS 13，不少应用的最低 target 在今年都有机会升级到这个版本
  
- `viewIsAppearing`只会触发一次，不会像`layoutSubviews`那样被多次调用

- 时机介于`viewWillAppear`与`viewDidAppear`之间，在view transition 之前
    ![CleanShot 2023-07-17 at 14.37.02](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2014.37.02.png)

- `viewWillAppear`与`viewDidAppear`适用于不依赖视图的结对调用，例如注册数据库通知以及销毁注册
    ![CleanShot 2023-07-17 at 14.40.19](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2014.40.19.png)
    

### SF Symbols 动画
之前听《Anyway.FM》播客主播有提到 SF Symbols 可能是 Apple 在设计界做出的最大贡献，今年的 SF Symbols 5 带来了通用动画这一重要更新，对独立开发来说又是一大利好。

动画的形式可以大体分为两种，一种是单次动画，一种是持续动画，效果也提供了多种选择。

```swift
// 单次 Bounce 动画
imageView.addSymbolEffect(.bounce)
```

![CleanShot 2023-07-17 at 14.42.45](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2014.42.45.gif)

```swift
// 单次 Pulse 动画
imageView.addSymbolEffect(.pulse)
```

![CleanShot 2023-07-17 at 14.45.17](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2014.45.17.gif)

```swift
// 单次缩放动画
imageView.addSymbolEffect(.scale)
```

![CleanShot 2023-07-17 at 14.46.33](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2014.46.33.gif)


```swift
// 持续可变渐变动画
imageView.addSymbolEffect(.variableColor.iterative)
imageView.removeSymbolEffect(ofType:.variableColor)
```

![CleanShot 2023-07-17 at 14.47.53](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2014.47.53.gif)


```swift
// 符号切换动画
imageView.setSymbolImage(UIImage(systemName: "swift")!, contentTransition: .replace.offUp)
```

![CleanShot 2023-07-17 at 14.50.55](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2014.50.55.gif)


SF Symbols 为跨 UI 框架提供了统一 API，为自定义符号提供了复合层注解。如果你对新增的功能感兴趣可以观看[这个session](https://developer.apple.com/videos/play/wwdc2023/10197/)，上述的几种动画用例代码都可以[WhatsNewInUIKit](https://github.com/iamStephenFang/WhatsNewInUIKit)中找到。

### Trait System

如果你没有接触过全局样式开发，可能会对 Trait 这套框架感到陌生。

![CleanShot 2023-07-17 at 15.03.39](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.03.39.png)

`UITraitCollection` 包含许多系统特征，例如用户界面样式（切换日间/夜间主题）、水平和垂直尺寸（横屏/竖屏布局）等等。

![CleanShot 2023-07-17 at 15.01.16](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.01.16.png)

根据[Unleash the UIKit trait system](https://developer.apple.com/wwdc23/10057)的说法，有两点需要开发者注意:

- View controllers 从其 view 的 superview 继承trait collection，而不是直接从其parent view controller继承。

- 如果在 view 添加到 hierarchy 之前访问 view controller 的 trait collection，那么 view controller 将获取不到最新的traits，导致`viewWillAppear` 受到影响（需要适配 `viewIsAppearing`）。

除此之外，session还提及了以下几点更新:
- 开发者允许编写自定义的 traits，并且采用了更灵活的 API。
![CleanShot 2023-07-17 at 15.02.38](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.02.38.png)


- 采用注册的方式处理 traits，在 traits 发生更改时接收回调而不需要在子类中重写 `traitCollectionDidChange`（事实上已经被`traitCollectionDidChange`被标记为废弃）。以下列举了两种注册方式。
![CleanShot 2023-07-17 at 15.20.36](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.20.36.png)
    ![CleanShot 2023-07-17 at 15.19.13](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.19.13.png)

- 允许将自定义 UIKit traits 与自定义 SwiftUI environment keys 相桥接，允许应用在 UIKit 和 SwiftUI 组件之间**双向**无缝传递 traits。
![CleanShot 2023-07-17 at 15.22.55](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.22.55.png)
![CleanShot 2023-07-17 at 15.24.36](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.24.36.png)


## 通用组件增强

### UIPageControlTimerProgress

`UIPageControlTimerProgress` 有一个内置计时器可以轻松配置每个页面的持续展示时间，当定时器到达指定时间时 `UIPageControl` 将自动滚动页面。
![CleanShot 2023-07-17 at 15.29.06](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.29.06.png)

对于需要跟随视频播放器或外部计时器的页面，需要使用 `UIPageControlProgress` 随着内容进度手动更新 `currentProgress`。

![CleanShot 2023-07-17 at 15.29.28](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.29.28.png)


需要注意的是，**用户需要在点击`UIPageControl`之后才能激活倒计时进度条。**，[WhatsNewInUIKit](https://github.com/iamStephenFang/WhatsNewInUIKit) 包含了以下 Demo 可以方便快速上手这个新特性。

![CleanShot 2023-07-17 at 15.25.57](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.25.57.gif)


### UIContentUnavailableConfiguration
在业务开发过程中，针对无网络状态、搜索不命中状态、无内容状态都应该展示空态视图。在内容构成上该视图通常会包含一个一级文本、一个二级文本以及一个图片。自定义实现上有不同的方法，例如画一个视图然后添加自定义分类。

![CleanShot 2023-07-17 at 15.58.23](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.58.23.png)


新增的`UIContentUnavailableConfiguration`使用方法很容易理解，`UIViewController` 的拓展中包含了一个`contentUnavailableConfiguration`属性，更新 viewController 最佳方法是重写`updateContentUnavailableConfiguration(using: state)`。

在 SwiftUI 中使用这个特性也很简单，使用`UIHostingConfiguration` 能完成空状态视图。
![CleanShot 2023-07-17 at 15.57.15](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.57.15.png)


例如在搜索场景中，可以使用如下代码在没有结果匹配的情况下展示空态界面。

```swift
    // Represent no search results empty state
    override func updateContentUnavailableConfiguration(using state: UIContentUnavailableConfigurationState) {
        var config: UIContentUnavailableConfiguration?
        if searchResults.isEmpty {
            config = .search()
        }
        contentUnavailableConfiguration = config
    }

    // Update search results for query
    searchResults = backingStore.results(for: query)
    setNeedsUpdateContentUnavailableConfiguration()
```

默认提供了`UIContentUnavailableConfiguration.empty()`、`UIContentUnavailableConfiguration.loading()`、`UIContentUnavailableConfiguration.search()`这几种实现，可以自定义的属性包含以下多项，通过苹果提供的空态 API， 开发者也可以审视自己之前实现类似需求时考虑是否周全。

```swift
    public var image: UIImage?

    public var imageProperties: UIContentUnavailableConfiguration.ImageProperties

    public var text: String?

    public var attributedText: NSAttributedString?

    public var textProperties: UIContentUnavailableConfiguration.TextProperties

    public var secondaryText: String?

    public var secondaryAttributedText: NSAttributedString?

    public var secondaryTextProperties: UIContentUnavailableConfiguration.TextProperties

    public var button: UIButton.Configuration

    public var buttonProperties: UIContentUnavailableConfiguration.ButtonProperties

    public var secondaryButton: UIButton.Configuration

    public var secondaryButtonProperties: UIContentUnavailableConfiguration.ButtonProperties

    public var alignment: UIContentUnavailableConfiguration.Alignment

    public var axesPreservingSuperviewLayoutMargins: UIAxis

    public var directionalLayoutMargins: NSDirectionalEdgeInsets

    public var imageToTextPadding: CGFloat

    public var textToSecondaryTextPadding: CGFloat

    public var textToButtonPadding: CGFloat

    public var buttonToSecondaryButtonPadding: CGFloat

    public var background: UIBackgroundConfiguration
```

### 调色盘菜单
调色板菜单(Palette Menus) 可理解成一排菜单构成的 stackView，通常用于在一系列选项中选择，目前它作为一个新的控件被使用。

要将任何菜单变成调色板菜单，只需在`UIMenu`对象的`options:[]`中添加`.displayAsPalette`。

![CleanShot 2023-07-17 at 16.13.17](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2016.13.17.png)

如果你对调色板菜单的使用方法感兴趣，除了参考仓库里实现的 Demo，还可以参考这一篇文章[Create Menus with Palette Picker in SwiftUI and UIKit](https://blog.leonifrancesco.com/articles/create-menus-with-palette-picker-in-swiftui-and-uikit)。


### UIStatusBarStyle

之前在开发过程中经常要根据页面背景颜色重写指定状态栏风格，iOS 中默认状态栏样式会根据状态栏背景展示的内容动态调整明暗样式，甚至状态栏左边和右边的明暗样式都可以不同。

![CleanShot 2023-07-17 at 15.27.58](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2015.27.58.png)

> 这项更新意味着在 iOS 17 之后可以将原先自定义的状态栏代码删除。

## 国际化语言优化
### 按区域设置检索 UIImage
在`UIImage`的`configuration`中指定`locale`可以取得对应图像特定的变体，这为全球的用户营造一种归属感。

下面的例子中提供一个带有日语`locale`设置的`configuration`来获取该符号的日语版本。
![CleanShot 2023-07-17 at 16.19.45](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2016.19.45.png)

笔者简单实现了一个实现随机获取不同`locale`下的`UIImage`的Demo可以尝试玩一下。

![CleanShot 2023-07-17 at 16.17.45](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2016.17.45.png)


### 动态行高调整
部分语言字体往往需要比拉丁字母更多的垂直空间进而导致重叠和裁切的问题，如阿拉伯语、印地语和泰语等。

![CleanShot 2023-07-17 at 16.15.34](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2016.15.34.png)


新增的动态行高调整功能使得能够动态调整文本的控件（如 `UILabel`）自动调整行高和垂直距离来实现最佳的可读效果。

需要注意的是，如果开发者手动设定了`UIFont`则可能导致这项功能不再适用，苹果推荐使用`UIFontTextStyle`来设置字体。
![CleanShot 2023-07-17 at 16.18.28](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2016.18.28.png)


## iPadOS 适配改进

Apple 在 iPadOS 适配上也下了不少功夫，由于本人对这部分业务接触比较少，如果你对这此感兴趣推荐你观看视频 session 了解更新的全部内容，以下简单列举了几个更新。

### 窗口拖拽交互
用户可以在 `UINavigationBar` 的任何位置拖动以移动窗口.
![CleanShot 2023-07-17 at 16.29.44](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2016.29.44.gif)

### 侧边栏调整
使用双列或三列样式创建的 `UISplitViewController` 的自动展开/关闭侧边栏的行为模式获得了更新。
![CleanShot 2023-07-17 at 16.32.17](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2016.32.17.gif)

### 键盘滑动支持

键盘上的 Page Up、Page Down、Home 和 End 键能够触发 UIScrollView 滚动，开发者可以指定 `allowsKeyboardScrolling` 确定是否禁用此行为。

### Apple Pencil 笔迹
`PencilKit`引入了新的墨迹类型。
![CleanShot 2023-07-17 at 16.37.23](https://image.stephenfang.me/mweb/CleanShot%202023-07-17%20at%2016.37.23.png)

## 结束语

除了以上提及的功能之外视频还介绍了不少其他特性：

- `UICollectionView` 在 diffable data source 和 snapshot 方面性能大幅提升
- Compositional Layout 引入了 `uniformAcrossSiblings` 布局 
- 新的 Spring 动画参数仅需要`duration`和`bounce`两个参数
- 文本交互上更新了光标、选择器以及自定义交互菜单
- 支持将文件或内容直接拖放到应用图标上直接打开相应的应用与内容
- `UIImageView` 与`UIGraphicsImageRenderer`加入了对ISO HDR图像的支持

如果这篇文章对你有帮助，别忘了在 GitHub 上为 [WhatsNewInUIKit](https://github.com/iamStephenFang/WhatsNewInUIKit) 点一个🌟。

作为开发者，一起尝试兼容 app 到 iOS 17，适配新的API，探索新的业务可能性吧。

## 参考链接
- [WWDC 2023: What’s New In UIKit | Apple](https://developer.apple.com/videos/play/wwdc2023/10055)
- [What's new in UIKit | WWDC NOTES](https://www.wwdcnotes.com/notes/wwdc23/10055/)
- [WWDC 2023: What’s New In UIKit | Steven Curtis](https://stevenpcurtis.medium.com/wwdc-2023-whats-new-in-uikit-3d7ca3ce6e2c)
- [WWDC23 10055 - UIKit 中的新功能｜老司机技术](https://xiaozhuanlan.com/topic/0651384792)
- [Create Menus with Palette Picker in SwiftUI and UIKit｜SwiftyLion](https://blog.leonifrancesco.com/articles/create-menus-with-palette-picker-in-swiftui-and-uikit)