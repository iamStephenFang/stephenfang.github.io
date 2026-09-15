---
title: iPhone Duo 适配前瞻
pubDatetime: 2026-09-13 00:00:00
categories:
  - 技术
tags:
  - iOS
  - Swift
  - SwiftUI
  - UIKit
  - Apple
  - iPhone Duo
  - WWDC
  - 适配
  - 设计
copyright: true
description: iPhone Duo 不是简单的“更大屏幕”，而是 App 运行环境会在多显示屏、折痕、Split View 和相机语义上持续变化。本文从布局、系统 Bar、Safe Area、Reserved Region 和多 Scene 出发，梳理适配底线与可扩展体验，并以相机 App 为例讨论新 API。
---

## 适配背景

Apple 的六场 Tech Talks 表明，iPhone Duo 带来的变化并不只是屏幕变大，而是 App 的运行环境会在使用过程中持续变化。同一个会话可能从外屏切换到内屏，内屏还会经历完全展开、部分折叠和 Split View；同一 App 可以同时拥有多个 Scene，也可以通过 Scene Accessory 在另一块屏幕上提供配套内容。这些变化不一定伴随 App 重启，因此布局、导航、播放和拍摄状态都需要在形态切换过程中保持连续。

这会打破存量 iPhone App 中几项长期成立的默认假设：

- 物理屏幕不再等于当前页面可用的 Window，`UIScreen.main` 也无法说明 UI 位于哪块显示屏。
- 横竖屏方向不足以决定布局；窗口尺寸、Size Class、Safe Area 和 Reserved Region 都可能连续变化。
- App 不再只有一个 Window、一个 Scene 或一条导航栈，播放器、相机和草稿写入等资源需要明确归属。
- 状态栏和系统 Bar 不再固定占据顶部区域，铰链与摄像头也不能用一组机型常量统一避让。
- “前置摄像头”不再固定对应某一颗物理设备，相机方向必须相对于承载预览的显示屏判断。

因此，Duo 适配其实包含两层目标。第一层是保证现有功能持续可用：设备开合、窗口缩放或 Scene 变化时，页面不跳变，交互不落入折痕或遮挡区，业务状态也不丢失。第二层才是把新增空间和双屏能力真正变成产品资产：展开后让内容与工具并列，半折时让预览与操作分区，内外屏同时工作时为操作者和被摄者提供不同信息。前者是底线，后者是逐步放大的体验。

相机场景几乎是最好的检验器。Preview 可以跨过折痕铺满画面，但快门、模式选择等控件必须保持可见和可触达；设备开合后，相机选择、镜像和输出方向也必须继续正确；多个 Scene 或外屏 Accessory 同时存在时，还要处理采集会话和硬件资源的所有权。也就是说，页面几何、摄像头选择和采集会话不能再由同一组机型与方向分支隐式决定。

我会先把 UIKit + SwiftUI 里那些“顺手就能用”的默认假设拆掉：可变 Window、系统 Bar、Safe Area、Reserved Region 和多 Scene。然后再用相机类 App 作为案例，聊聊 Virtual Front Camera、Direction Coordinator、双屏预览和资源仲裁这些新能力。重点不是重新做一套 Duo 专用页面，而是把系统自适应、公共基建和业务设计各自负责的边界分清楚。


> 2026-09-10 公开的 Xcode 27 Beta / RC 尚未提供 iPhone Duo Simulator。模拟器和 iOS 27.1 SDK 会随 **Xcode 27.1 beta** 到来，Apple 开发者页面仍标注 “Coming later this month”。目前可以先改 App Resizability、Window / Scene、Safe Area、Size Class 和容器布局，并用可变窗口做基础验证；要在 Device Hub 中执行 **open / close / rotate / fold**，还得等 Xcode 27.1 beta。

## 术语速查

| 术语                                 | 中文理解         | 在本文中的含义                                                                                                                                                         |
| ------------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iPhone Duo                           | 双屏折叠 iPhone  | 具有内屏、外屏和铰链，可在闭合、展开、部分折叠等形态间切换的设备。                                                                                                     |
| Window / Scene                       | 窗口 / 场景      | `Window` 是一块 UI 的显示容器，`Scene` 管理一组窗口及其生命周期。Duo 支持多显示屏和多 Scene，不能再假设 App 只有一个全局窗口。                                         |
| Size Class                           | 尺寸类别         | 系统用 `compact` / `regular` 描述当前窗口可用空间的抽象信号。它反映的是布局能力，不等同于设备型号或横竖屏方向。                                                        |
| Safe Area                            | 安全区           | 系统建议放置主要内容和交互控件的区域，用于避开系统栏、屏幕圆角等边缘限制；其四边 inset 会随形态和窗口变化。                                                            |
| Reserved Region                      | 保留区域         | iOS 27.1 提供的额外几何信息，表示 Safe Area 之外仍需关注的铰链、摄像头或系统占用区域。背景可以跨过它，关键内容通常需要避让。                                           |
| Division                             | 分割型保留区域   | 一类 Reserved Region，例如部分折叠时的铰链。它把容器分成两个仍可使用的区域，适合将控件重新安排到其中一侧。                                                             |
| Occlusion                            | 遮挡型保留区域   | 一类 Reserved Region，例如摄像头开孔。该区域中的内容会被实际遮住，交互控件和关键信息必须避开。                                                                         |
| Displacement                         | 内容移位         | 一种自适应布局策略：识别被折痕或遮挡影响的内容，将其移动到合适区域，再按目标区域的尺寸重新布局；它不是简单的坐标平移。                                                 |
| Arrangement View / `ArrangementView` | 主次内容编排     | Apple 用于描述两块主次内容关系的布局机制。SwiftUI 使用 `ArrangementView`，UIKit 使用 `UIArrangementViewController`，可在并排（split）和覆盖（overlay）之间自适应切换。 |
| Concentricity                        | 同心圆角         | 让卡片、蒙层或 Preview 的圆角与所在显示屏轮廓保持同心，避免按机型维护固定圆角值。                                                                                      |
| Split View                           | 分屏多任务       | 在内屏并排显示两个 App，或同一 App 的多个 Scene；每个 Scene 都有独立的 Window、trait 和生命周期。                                                                      |
| Scene Accessory                      | 场景配套界面     | 系统在特定条件下为另一块显示屏提供的辅助界面，不是任意创建的第二窗口。                                                                                                 |
| Camera Capture Accessory             | 相机外屏配套界面 | Scene Accessory 的相机场景能力。主相机界面在内屏全屏拍摄时，可在外屏显示被摄者预览、倒计时或录制状态。                                                                 |
| Virtual Front Camera                 | 虚拟前置摄像头   | 系统对内外物理前摄的统一抽象，可在设备开合时维持“面向当前用户”的前摄语义和拍摄连续性。                                                                                 |
| Direction Coordinator                | 方向协调器       | `AVCaptureDeviceDirectionCoordinator`。以相机 UI 所在的 View 为参照，判断摄像头相对界面的方向，避免把“前置”固定理解为某一颗物理相机。                                  |
| Rotation Coordinator                 | 旋转协调器       | `AVCaptureDeviceRotationCoordinator`。为预览和采集输出提供随设备姿态变化的旋转角度。                                                                                   |
| Preview                              | 相机预览         | 相机实时取景画面。它可以铺满或跨过折痕，但其可视区域、成片比例和交互坐标需要分别计算。                                                                                 |
| Device Hub                           | 设备状态控制工具 | Xcode 中用于模拟 Duo 打开、闭合、旋转和折叠状态的入口。                                                                                                                |
| App Resizability                     | 可调整布局检查   | Apple 用于发现固定尺寸、不可连续缩放等布局问题的检查能力，不能替代相机坐标链和业务页面的专项验证。                                                                     |

## 结论先行

iPhone Duo 改变了 iPhone App 长期默认的“单屏、固定方向、单窗口”运行前提：

- 同一设备具有外屏和内屏，应用所在的显示屏可能随开合发生变化。
- 内屏可以全屏、部分折叠、分屏多任务，也可以同时承载多个 Scene。
- 铰链与内外摄像头会形成 Division 或 Occlusion 类型的 Reserved Region；它们不能被一个固定的顶部刘海高度概括。
- 状态栏、导航栏、工具栏和 Tab Bar 可能进入屏幕侧边的共享竖向区域；状态栏不再等价于一个固定的 `topInset`。
- “前置摄像头”不再天然等于“正对当前使用者的摄像头”。相机方向要相对于 UI 所在的显示屏来判断。

把这几场 Session 归纳起来，我会先记住四件事：

1. **适配的底线是连续可用。** Window 尺寸、Safe Area、系统 Bar 和 Reserved Region 会在开合、旋转、Split View 里连续变化。页面不能依赖物理屏尺寸、固定方向，或者第一次进入时缓存下来的几何值。
2. **新增工作主要落在折痕、双屏和相机语义。** 现成的动态布局、栅格、分屏、Scene 和 Safe Area 能力，已经够大多数 App 用了；真正的新工作是交互控件避让、相机方向与切换、多个 Scene 的资源仲裁，以及外屏 Accessory。
3. **相机不该再用“前置/后置”这种粗粒度概念来做设计。** “前置摄像头”不再天然等于“正对当前用户”。Virtual Front Camera 很适合保证开合连续性，独立物理相机则适合高规格模式；镜像、方向、输出格式和录制中切换要分别处理。
4. **折叠态确实值得做产品体验，但别把它搞进基础布局。** Preview + 工具面板、桌面半折拍摄、内屏主控 + 外屏被摄者视图都很有意思，但普通页面仍然应该交给 Size Class、系统容器和 Reserved Region；铰链角度只适合真正需要连续角度的动效或交互。

**值得探索的产品形态**

| 产品形态                  | 核心体验                                                                              | 建议                                                         |
| ------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 展开态创作台              | 保持 Preview 比例稳定，把效果、素材、脚本和参数面板放到新增空间，减少工具对画面的遮挡 | 适合先在拍摄、直播和编辑器中选择一条链路试点                 |
| 半折桌面拍摄              | 一侧显示 Preview，另一侧放快门、模式、提词器或倒计时；设备本身可以充当支架            | 用户价值直接，优先验证主操作可达性、折痕避让和方向切换       |
| 内屏主控 + 外屏被摄者视图 | 创作者在内屏取景和调参，被摄者从外屏确认构图、倒计时和录制状态                        | 适合优先探索，但必须限制外屏信息范围并提供明确开关           |
| 展开态编辑与发布          | 画面与时间线、素材或发布信息并列，减少面板反复展开和收起                              | 可复用现有编辑器与发布页，适合作为展开态的连续体验           |
| 多 Scene 协同创作         | 一个 Scene 承载拍摄或编辑，另一个 Scene 展示素材、脚本、评论或参考内容                | 适合中期探索，前提是解决相机、麦克风、编码器和草稿的资源仲裁 |

这些形态不应被实现为五套独立页面。更合理的路径是先保证同一业务状态能够跨形态延续，再根据可用空间、Reserved Region 和 Scene 能力重组内容；当系统能力不可用时，仍回落到完整的单屏流程。

工程上，我会把三类状态拆开看，避免一开始就把它们混成一个大布尔值：

1. **布局只依赖当前 Window / Scene 的有效几何信息**：Size Class、Safe Area、layout margin、Reserved Region。
2. **相机能力只依赖当前 capture device 与 format**：不要用“这是哪个机型”来推断能力。
3. **开合只作为状态变化输入**：普通布局交给系统容器和 Reserved Region；铰链角度只用于连续动画或交互效果。

未重新编译的 App 仍然能在 iPhone Duo 上跑，但用 iOS 27、27.1 SDK 重新构建后，内容会逐步延伸到内屏边缘和状态栏区域，标准系统栏也会有竖向布局变化。换 SDK 会直接改变实际界面，所以回归范围不能只停在“编译通过”。

**适配范围全景**

![iPhone Duo 适配范围全景](https://image.stephenfang.me/iPhoneDuo/mindai-adaptation-overview.svg)

*图：可变 Window、Scene、布局输入与业务界面之间的适配关系。*

适配验收不能只看“展开后页面有没有拉宽”。完整链路是：**Window 变更 → trait / Safe Area / Reserved Region 更新 → 容器重排 → 业务内容重组 → 相机/播放器坐标重算 → 埋点与实验正确分桶**。任何一层缓存旧几何值，都会在旋转、Split View、开合连续变化或多 Scene 下暴露问题。

## 让你的 App 为 iPhone Duo 做好准备｜Prepare your app for iPhone Duo

这场先讲构建环境，再讲布局。换用新 SDK 后，App 能使用 Duo 的完整显示区域；窗口尺寸连续变化时，布局不能再依赖固定屏幕和方向；系统容器、Safe Area 和 Reserved Region 分别处理系统栏、铰链与摄像头。Apple 还演示了两个测试工具：Device Hub 用来切换 Duo 的开合、旋转和折叠状态，App Resizability 用来查找固定布局。

**换用新 SDK 构建后，界面会发生什么变化**

没有重新编译的旧版本仍能运行，但会受到兼容模式限制。使用 iOS 27 SDK 构建后，内屏内容可以延伸到状态栏左侧；升级到 iOS 27.1 SDK 后，内容会进一步铺到屏幕边缘，标准 Navigation Bar 和 Toolbar 也能改为竖向排列。这些变化不要求业务代码发生改动，所以 SDK 升级本身就需要做界面回归。

回归时要保留旧 SDK 包作对照，重点看系统 Bar、Sheet、Popover、Safe Area 和可用宽度。Xcode 27.1 beta 发布后，Device Hub 才能模拟打开、闭合、旋转和部分折叠。

![同一应用用不同 SDK 构建后，在 iPhone Duo 上获得的显示范围不同](https://image.stephenfang.me/iPhoneDuo/sdk-opt-in.png)

*图：换用不同版本的 SDK 构建，会改变内容在 Duo 上能够延伸到的范围。来源：[Prepare your app for iPhone Duo，0:50](https://developer.apple.com/videos/play/tech-talks/111461/?time=50)。*

![Xcode Device Hub 中的 iPhone Duo 开合、旋转与折叠控制](https://image.stephenfang.me/iPhoneDuo/device-hub.png)

*图：Duo 姿态控制集中在 Device Hub。来源：[Prepare your app for iPhone Duo，1:22](https://developer.apple.com/videos/play/tech-talks/111461/?time=82)。*

**不再把“屏幕”当成全局单例**

**使用 Window / Scene，而不是 `UIScreen.main`**

双屏设备上，所谓“主屏幕”并不能说明当前页面究竟落在哪一块屏幕。Apple 的建议很直接：优先从 View 所属的 `UIWindowScene` 获取 screen，而不是继续用 `UIScreen.main` 这种全局单例。布局、截图比例、显示缩放和预览尺寸，都会沿着 View → Window → WindowScene 这条链路去算。

```swift
// UIKit：仅在确实需要 UIScreen 对象时使用
let screen = view.window?.windowScene?.screen

// 仅需要缩放因子时，优先使用 trait，而不是全局 Screen
let displayScale = view.traitCollection.displayScale
```

优先搜索这几类代码：

```text
UIScreen.main.bounds
UIScreen.main.scale
UIScreen.main.nativeBounds
previewLayer.frame = UIScreen.main.bounds
按 device model 返回固定宽高
```

页面布局应依据 `view.bounds`、`safeAreaLayoutGuide`、SwiftUI 提供的可用尺寸，以及当前 Scene 的几何信息。只有少数功能需要读取物理屏幕参数，普通布局不应使用它们。

**使用 Size Class，而不是设备方向**

外屏整体接近传统 iPhone 的 compact 体验；内屏通常提供 regular/regular 的更大空间。内屏不遵守应用声明的 `supportedInterfaceOrientations` 来决定布局，因此以下模式风险很高：

```swift
if UIDevice.current.orientation.isLandscape { ... }
if interfaceOrientation == .portrait { ... }
```

应改为表达“当前空间是否足以展示双列、侧栏或扩展控制面板”：

```swift
// SwiftUI
@Environment(\.horizontalSizeClass) private var horizontalSizeClass
@Environment(\.verticalSizeClass) private var verticalSizeClass

// UIKit
let horizontal = traitCollection.horizontalSizeClass
let vertical = traitCollection.verticalSizeClass
```

对相机类 App，`regular` 不等于直接套用 Pad UI。它更适合表达“当前空间足以让素材、效果或参数面板从覆盖层变成并列区域”，拍摄画布和预览比例仍保持稳定。

**Concentricity、系统容器与 Sidebar**

Apple 还补充了三点容易被忽略的内容：

- 使用 iOS 26 的 `ConcentricRectangle`（SwiftUI）或 `UICornerConfiguration`（UIKit）让卡片、蒙层、Preview 遮罩与当前屏幕圆角保持同心；不要维护“外屏圆角/内屏圆角”机型常量。
- `NavigationSplitView` / `UISplitViewController`、`TabView` / `UITabBarController` 会跨姿态自适应：闭合时列收起，展开时 tile 或 overlay。Sheet、Popover、Context Menu、Alert 也有系统适配。
- 内屏可以把 Tab 导航显式放到 sidebar：SwiftUI 使用 `.defaultTabBarPlacement(.sidebar)`，UIKit 使用 `tabBarController.sidebar.preferredPlacement = .sidebar`。这对搜索、消息、个人页有价值，但拍摄页不应为了“像 Pad”强行引入 sidebar。

**Safe Area：形态变化且四边不对称**

**状态栏高度不能再作为布局常量**

iPhone Duo 上，状态栏和动态系统元素可以与导航、工具栏及 Tab Bar 共用屏幕侧边的竖向区域。设备闭合、展开、旋转、进入 Split View、显示键盘或 Live Activity 时，可用区域都可能变化。Apple 的设计示例也显示，状态信息和主要操作可能共同排列在外侧竖栏。

![外屏侧边共享区域中的状态信息与操作控件](https://image.stephenfang.me/iPhoneDuo/vertical-bars-status.png)

*图 1：状态栏与操作项进入侧边共享区域。来源：[Design for iPhone Duo，5:25](https://developer.apple.com/videos/play/tech-talks/111466/?time=325)。*

工程上应明确禁止把 `20`、`44`、`47`、`54`、`59` 等经验值当作状态栏或顶部安全距离，也不应把 `statusBarFrame.height` 当作所有页面的顶部 inset。推荐规则：

- **做布局**：使用 `safeAreaLayoutGuide` / `safeAreaInsets` / SwiftUI safe area。
- **做全屏背景**：背景延伸到 `view.bounds` 或使用 `ignoresSafeArea()`；前景交互仍留在安全区。
- **确实需要观察状态栏本身**：从当前 `windowScene.statusBarManager` 获取信息，但它只用于状态栏状态或诊断，不作为通用布局基准。
- **响应变化**：UIKit 在 `viewSafeAreaInsetsDidChange()` 重新计算；SwiftUI 依赖环境和 Geometry 更新，不缓存首次出现时的 inset。

![外屏与内屏具有不同的安全区形态](https://image.stephenfang.me/iPhoneDuo/safe-area.png)

*图 2：外屏与内屏的安全区并非同一种顶部条带。来源：[Prepare your app for iPhone Duo，6:26](https://developer.apple.com/videos/play/tech-talks/111461/?time=386)。*

**Safe Area 是不对称的**

旧代码常用 `left * 2` 或 `top + bottom` 推导居中区域。iPhone Duo 的摄像头、侧边栏和显示屏圆角使四个方向的 inset 经常不对称；Split View 中还会再次变化。Apple 明确要求分别处理每一侧。

![错误地假设左右安全区相等](https://image.stephenfang.me/iPhoneDuo/asymmetric-insets.png)

*图 3：`width - left * 2` 是 Apple 点名的错误模式。来源：[Prepare your app for iPhone Duo，7:30](https://developer.apple.com/videos/play/tech-talks/111461/?time=450)。*

```swift
// 错误：假设左右安全区相同
let width = view.bounds.width - view.safeAreaInsets.left * 2

// 正确：分别使用四边 inset
let safeBounds = view.bounds.inset(by: view.safeAreaInsets)
```

全屏相机页可以拆成两个坐标空间：

- `visualBounds`：取景画面、蒙层、背景，可覆盖完整 `view.bounds`。
- `interactionBounds`：快门、返回、镜头切换、时长、道具入口、文字按钮，至少落在 Safe Area 内，并进一步避开 Reserved Regions。

```swift
final class CameraViewController: UIViewController {
    override func viewSafeAreaInsetsDidChange() {
        super.viewSafeAreaInsetsDidChange()
        layoutCameraControls(in: view.bounds.inset(by: view.safeAreaInsets))
    }
}
```

注意避免通过 `additionalSafeAreaInsets` 重复补偿系统已经计入的侧边栏或摄像头区域。

**Reserved Region：允许自定义 UI 主动为系统 UI 让位**

`ReservedRegion`（SwiftUI）与 `UIViewReservedRegion`（UIKit）是 iOS 27.1 的新接口。边到边页面和自定义系统栏可以尽量使用完整屏幕，同时避开系统占用的区域。铰链、摄像头以及 Division、Occlusion 两种区域的区别，会在第三场继续展开。

放到相机类 App 中，取景背景可以铺满 `view.bounds`；快门、关闭、翻转、倒计时和发布按钮则要同时避开 Safe Area 与 Reserved Region。“全面屏适配”不能再靠一张状态栏高度表完成。

## 在 iPhone Duo 上提升控制栏的体验｜Raise the bar with iPhone Duo

系统会在宽内屏上把 Navigation Bar、Toolbar 和 Tab Bar 从上下两侧移到屏幕外侧。Session 还解释了这些按钮如何共用一条侧栏、怎样适配横排和竖排，以及空间不足时哪些按钮先收起。

**为什么 Bar 要移到侧边**

宽内屏增加的是横向空间，页面高度并没有变多。系统把原来位于顶部和底部的控件移到外侧，既能保留内容高度，也更接近握持时拇指的位置。内屏横向使用侧栏，回到纵向或窄窗口后再恢复传统的横向系统栏。

![同一页面在窄屏使用横向 Bar，在宽内屏把导航、工具和 Tab 项放入外侧竖栏](https://image.stephenfang.me/iPhoneDuo/vertical-shared-region.png)

*图 4：Bar 的变化是系统容器级重排，而不是业务把按钮旋转 90°。来源：[Raise the bar with iPhone Duo，3:35](https://developer.apple.com/videos/play/tech-talks/111462/?time=215)。*

获得这套行为的前提是使用最新 SDK 和系统容器：SwiftUI 的 `.toolbar` 要位于 `NavigationStack` / `NavigationSplitView` 内；UIKit 应使用 `UINavigationController` / `UITabBarController`。独立创建的 `UIToolbar`、`UINavigationBar`、`UITabBar` 不会自动进入完整重排。

**三种系统栏如何共用侧边区域**

Navigation Bar、Toolbar 和 Tab Bar 的按钮会进入同一条竖向区域。这里有个很容易误解的点：系统不是简单按原来的数组顺序把按钮搬过去，而是按“按钮的语义”重新排序。也就是说，关闭、返回、下一步和发布这样对用户最重要的动作，通常会被放在更前面。

- 返回、关闭等导航操作位于顶部；SwiftUI 使用 `.cancellationAction`，UIKit 使用 leading group，同时要避免重复添加返回按钮。
- “完成”“下一步”“发布”等主要操作紧随其后，可用 `.topBarPinnedTrailing` / `pinnedTrailingGroup` 固定在优先区域。
- 普通工具按钮排在后面，Tab 项靠下；空间不足时，系统才会压缩或收起按钮。
- Split View 只有 detail column 进入共用侧栏；inspector 不会得到单独的竖栏。
- 侧栏固定在设备的物理外侧。在从右向左书写的语言中，它不会跟随普通 leading/trailing 规则换到另一边。
- Sheet 在外屏和内屏的呈现并不相同，Sheet 内部的 Bar 也应交给其自己的系统容器管理。

![关闭动作在共享竖栏中的顺序，以及 UIKit 对应的 cancellation action 配置](https://image.stephenfang.me/iPhoneDuo/bar-item-order.png)

*图：系统按语义安排关闭和导航动作，并非简单保留原数组顺序。来源：[Raise the bar with iPhone Duo，5:00](https://developer.apple.com/videos/play/tech-talks/111462/?time=300)。*

**每个 Toolbar 按钮都要考虑竖排样式**

竖栏宽度固定，只能沿高度方向伸展，因此更适合只显示图标。即使界面上不展示文字，按钮仍要提供 title；系统会在溢出菜单、展开状态和辅助功能中使用它。

| Item 类型                  | 默认倾向        | 应做什么                                                       |
| -------------------------- | --------------- | -------------------------------------------------------------- |
| symbol + title             | 竖向显示 symbol | 确认 SF Symbol 语义、title、accessibility label 完整           |
| 纯文本按钮                 | 留在横向区域    | “发布/完成”若需固定在竖栏，提供合适图标或使用 pinned placement |
| symbol + 数字文本          | 可能过宽        | 数量改用 `.badge()` / `UIBarButtonItem.badge`                  |
| custom view                | 默认横向        | 只有确实有竖向版本时设 `.axisBehavior(.verticalPreferred)`     |
| 会在图标/文本间切换的 item | 容易跨轴跳动    | 使用 `.horizontalOnly`，让相关状态始终处于同一轴               |

自定义 View 可以通过 `@Environment(\.toolbarVerticalEdge)` 或 `traitCollection.verticalBarEdge` 得知竖栏位于设备哪一侧，再调整内部样式。这个值只用于绘制控件，不能拿来推算整个页面的位置。

竖栏还有两处容易漏掉。第一，横向 Bar 里的 flexible spacer 在竖向布局中会收缩为零，fixed spacer 才会保留最小间隔，原来靠 spacer 分组的 item 要复核顺序。第二，竖向 Bar 默认没有横向 Bar 的 scroll-edge 透明效果；当用户开启 Reduce Transparency，系统会补上实色背景。自定义侧栏若要模拟系统外观，也要覆盖这组辅助功能状态。

![Toolbar item 使用 axisBehavior 提供竖向版本](https://image.stephenfang.me/iPhoneDuo/bar-axis-behavior.png)

*图：同一个按钮可以选择竖排优先或只保留横排样式。来源：[Raise the bar with iPhone Duo，8:20](https://developer.apple.com/videos/play/tech-talks/111462/?time=500)。*

![复合自定义控件在横向与竖向系统栏中的不同呈现](https://image.stephenfang.me/iPhoneDuo/bar-custom-view.png)

*图：自定义 View 需要提供适合竖栏的窄版布局，系统不会重排 View 内部的内容。来源：[Raise the bar with iPhone Duo，10:25](https://developer.apple.com/videos/play/tech-talks/111462/?time=625)。*

**空间不足时，哪些按钮先收起**

外屏横向显示、键盘弹出或窗口高度不足时，侧栏放不下所有按钮。`.toolbarVerticalCompressionBehavior(.prefersToolbarItems)` / `navigationItem.verticalBarCompressionBehavior = .prefersBarItems` 用来指定优先保留 Toolbar 还是 Tab Bar 中的内容。

![竖栏空间冲突时可声明优先保留 Toolbar 项还是 Bar/Tab 项](https://image.stephenfang.me/iPhoneDuo/bar-overflow.png)

*图 5：compression behavior 决定哪组 item 更早收缩。来源：[Raise the bar with iPhone Duo，12:25](https://developer.apple.com/videos/play/tech-talks/111462/?time=745)。*

需要保留、但不必一直显示的操作，可以放进 `ToolbarOverflowMenu` 或 `navigationItem.additionalOverflowItems`。必须常驻的按钮使用 `.visibilityPriority(.high)` / `visibilityPriority = .high`。不要另做一个相同外观的省略号菜单，否则系统无法统一处理排序、辅助功能和展开样式。某个页面确实无法使用竖栏时，再通过 `.toolbarVerticalBehavior(.disabled)` / `preferredVerticalBarBehavior = .disabled` 关闭这一行为。

![SwiftUI ToolbarOverflowMenu 为竖栏补充仅在溢出时出现的动作](https://image.stephenfang.me/iPhoneDuo/bar-overflow-menu.png)

*图：空间不足时才会出现省略号，收起的操作仍由系统菜单管理。来源：[Raise the bar with iPhone Duo，12:50](https://developer.apple.com/videos/play/tech-talks/111462/?time=770)。*

主拍摄页是高度定制的沉浸式 UI，首版可以不迁移系统 Bar。发布页、草稿页、素材选择、相册和设置更适合先接系统容器。拍摄页若继续使用自定义侧栏，也要保留“顶部返回/关闭—高优动作—普通工具—模式入口”的层级，并自行处理 safe area、overflow 和可达性。

## 在 iPhone Duo 上使用自适应布局适配各种姿态｜Strike a pose with adaptive layouts on iPhone Duo

部分折叠后，铰链会把内屏分成两个区域。这场主要回答两个问题：哪些内容需要避开折痕，以及这些内容应该移到哪一侧。Apple 提供的布局依据是 Reserved Region，常见处理方式是 Displacement 和 Arrangement View，不需要业务根据铰链角度计算坐标。

**Reserved Region 分为 Division 和 Occlusion**

iOS 27.1 可以查询两类 Reserved Region。`Division` 把容器分成两个仍可使用的区域，部分折叠时的铰链就属于这一类；`Occlusion` 会实际挡住内容，例如内外屏的摄像头。

![部分折叠时，跨越中线的连续内容难以阅读和操作](https://image.stephenfang.me/iPhoneDuo/hinge-reserved-region.png)

*图 6：部分折叠会把内屏变成两个具有不同交互意义的区域。来源：[Strike a pose with adaptive layouts on iPhone Duo，1:40](https://developer.apple.com/videos/play/tech-talks/111463/?time=100)。*

查询结果还区分 active 和 inactive。active region 影响当前布局；inactive region 虽然尚未形成折痕，但可以用来预先确定网格列数、画布比例或面板结构。例如素材网格可以提前为中间间距留位，折叠过程中就不会突然增减一列。

```swift
GeometryReader { proxy in
    let divisions = proxy.reservedRegions(kind: .division)
    let occlusions = proxy.reservedRegions(kind: .occlusion)
    CameraLayout(divisions: divisions, occlusions: occlusions)
}

// UIKit
let divisionFrames = view.reservedRegions(kind: .division).map(\.frame)
```

**Displacement：把需要操作的内容移到合适的一侧**

Apple 的 displacement 做法可以拆成三步：

1. 找出必须保持可见、可触达且不能被遮挡的内容。
2. 折痕形成后，把单个控件或一组相关控件整体移到其中一侧，不要让按钮骑在折痕上。
3. 移动完成后，再按目标区域的 Size Class、Safe Area 和 layout margin 重新布局，不能只平移原来的 frame。

![Displacement 的目标是让内容始终可见、可触达且不被遮挡](https://image.stephenfang.me/iPhoneDuo/displacement-pattern.png)

*图 7：先定义不变量，再决定内容移动到哪个 region。来源：[Strike a pose with adaptive layouts，2:50](https://developer.apple.com/videos/play/tech-talks/111463/?time=170)。*

在 Book pose 下，弹层通常放到折痕的 trailing side；在 tabletop pose 下，适合远看的画面放在上半区，操作控件放在下半区。目标区域取决于任务，不能统一写死为左侧或顶部。

拍摄页的 Preview 可以跨过 fold，快门和模式选择则成组落到容易操作的一侧，另一侧用来放美化、滤镜、提词器或拍摄参数。Feed 和长文章这类连续滚动内容通常不需要整体移开；评论输入、关注和分享等按钮仍要避开 Division。Alert、Action Sheet、Menu、Popover、Navigation、List 和 Scroll 等系统组件已经带有相应处理，业务应先复用系统行为，再处理自定义相机浮层。

![Book pose 中的弹层被移动到折痕一侧完整可用的区域](https://image.stephenfang.me/iPhoneDuo/displacement-destination.png)

*图：先选择内容要移动到哪一侧，再在该区域内重新布局。来源：[Strike a pose with adaptive layouts，4:10](https://developer.apple.com/videos/play/tech-talks/111463/?time=250)。*

**Arrangement View：在并排和覆盖布局之间切换**

SwiftUI 的 `ArrangementView` 和 UIKit 的 `UIArrangementViewController` 用来管理主、次两块内容。`.split` 让两者并排，并可限制水平或垂直分割；`.overlay` 则让次要内容覆盖在主要内容上。系统根据可用空间、Size Class、宽高比和当前 Division Region 计算两块内容的位置与可见性，业务只需定义二者的关系。

![ArrangementView 的 split 模式把 primary 与 secondary 放入两个区域](https://image.stephenfang.me/iPhoneDuo/arrangement-split.png)

*图 8：同一内容模型可在 split 与 overlay 之间适配，而不是为每个姿态复制页面。来源：[Strike a pose with adaptive layouts，12:30](https://developer.apple.com/videos/play/tech-talks/111463/?time=750)。*

overlay 模式可通过 `overlayArrangementZIndex`（SwiftUI）或 `state(for:)?.zIndex`（UIKit）判断某一内容当前在上层还是下层，从而把下层面板收起成 compact 形态。适合“Preview + 参数面板”“视频 + 评论/选集”等两块有清晰主次关系的内容；单一滚动 Feed 或只需要避开一个小 camera occlusion 时，不必强行使用 Arrangement。

![Arrangement 根据可用空间选择分割轴并重新放置两块内容](https://image.stephenfang.me/iPhoneDuo/arrangement-overlay.png)

*图：Arrangement 可以限制分割方向，让同一组内容在不同空间里选择横向或纵向并排。来源：[Strike a pose with adaptive layouts，13:20](https://developer.apple.com/videos/play/tech-talks/111463/?time=800)。*

## 充分利用 iPhone Duo 上的多显示屏和场景｜Leverage multiple displays and scenes on iPhone Duo

布局之外，Duo 还改变了 App 的运行方式。这场介绍如何读取铰链状态，如何在内屏参与 Split View，以及同一 App 出现多个 Scene 时怎样管理资源。最后一部分是 Scene Accessory：主界面运行在内屏时，可以在外屏显示一个配套界面。

**铰链角度适合驱动效果，不适合计算布局**

SwiftUI 的 `.onHingeChange` 与 UIKit 的 `UIHingeInteraction` 可以读取铰链状态和角度。回调包含变化前后的 context；在没有铰链的设备上，值可能为 nil。只有状态为 `partiallyOpen` 时，角度才适合驱动连续效果。设备闭合、完全展开或没有铰链时，应恢复默认值。Apple 的示例用折叠角度控制乐器的 pitch bend，这类数据更适合声音、动画、物理模拟和创意交互。

![SwiftUI 使用 onHingeChange 读取前后 hinge context](https://image.stephenfang.me/iPhoneDuo/hinge-api.png)

*图：回调同时提供变化前后的状态；页面位置仍由 Reserved Region 和 Size Class 决定。来源：[Leverage multiple displays and scenes，1:50](https://developer.apple.com/videos/play/tech-talks/111464/?time=110)。*

相机页可把角度用于“桌面模式倒计时动效”“展开完成提示”或创意滤镜，但控件避让仍应使用 Safe Area、Reserved Region 和 Arrangement；用角度阈值手写两块屏幕 frame，会与系统动画、Split View 和未来硬件形态冲突。

**Split View 与多 Scene**

iPhone Duo 的内屏支持 Split View，也首次让 iPhone App 面对同一进程多个 UI Scene。每个 Scene 都有自己的 Window、bounds、trait、导航栈和生命周期；Scene 之间不能共享“当前 ViewController”“当前 Window”这种单例状态。

![内屏支持两个 App 或同一 App 的多个 Scene 并排，窗口宽度由 Size Class 驱动](https://image.stephenfang.me/iPhoneDuo/multi-scene.png)

*图 9：多任务与多 Scene 继续使用系统 Size Class / Scene 模型。来源：[Leverage multiple displays and scenes，3:30](https://developer.apple.com/videos/play/tech-talks/111464/?time=210)。*

应用可以请求创建新的 Scene，但外屏不支持新窗口，必须在完成回调里处理失败。相机、麦克风、编码器和草稿写入不能由多个 Scene 随意争用。多个 Scene 可以同时浏览内容，但同一时间只能有一个 Scene 使用拍摄会话；另一个 Scene 应显示占用状态，或由用户明确移交控制权。

系统提供的 Scene Activation action 会在当前形态不允许创建 Scene 时自动隐藏。业务若自建入口，就要自行同步这套可用性判断，不能让外屏用户点击后才发现失败。

![只有内屏支持创建并排的新 Scene，外屏入口不可用](https://image.stephenfang.me/iPhoneDuo/scene-activation.png)

*图：能否创建新的 Scene 取决于当前使用的是外屏还是内屏。来源：[Leverage multiple displays and scenes，4:00](https://developer.apple.com/videos/play/tech-talks/111464/?time=240)。*

**Scene Accessory 与 Camera Capture Accessory**

Scene Accessory 是系统在特定条件下为另一块屏幕提供的配套界面，不是一个普通的第二窗口。`CameraCaptureAccessory` 只有在主相机界面位于内屏、处于全屏状态且拍摄会话正在运行时才可用。设备闭合、退出全屏、停止拍摄会话或系统策略变化，都可能使它失效，因此要监听 `.onAvailabilityChange`。

![主相机在内屏工作时，Camera Capture Accessory 可把被摄者 Preview、状态或提词内容放到外屏](https://image.stephenfang.me/iPhoneDuo/camera-accessory-detail.png)

*图 10：Accessory 让两块屏幕形成主控端与被摄者端，而不是镜像整页。来源：[Leverage multiple displays and scenes，5:40](https://developer.apple.com/videos/play/tech-talks/111464/?time=340)。*

```swift
CameraView(model: model)
    .sceneAccessory {
        CameraCaptureAccessory(isEnabled: $model.isAccessoryEnabled) {
            SubjectView(model: model)
        }
        .onAvailabilityChange { model.isAccessoryAvailable = $0 }
    }
```

`isEnabled` 记录用户或业务是否希望开启 Accessory，availability 表示系统当前能不能提供。两者不是一回事。主界面退出全屏或拍摄会话停止时，availability 会改变，但不应该连带修改用户的开关状态。

![Scene Accessory 绑定 enabled 状态并监听 availability change](https://image.stephenfang.me/iPhoneDuo/accessory-availability.png)

*图：开关状态和系统可用状态需要分开处理。来源：[Leverage multiple displays and scenes，6:20](https://developer.apple.com/videos/play/tech-talks/111464/?time=380)。*

外屏首发最适合展示录制状态、倒计时、构图安全框和低复杂度被摄者 Preview；之后再考虑提词器、动作提示和模板分镜。Accessory 必须使用独立 ViewModel 与数据白名单，禁止把评论、草稿文案、私信、账号或商业化数据随主界面一起镜像到外屏。

## 为 iPhone Duo 构建出色的相机体验｜Build a great camera experience for iPhone Duo

这场与相机类 App 的关系最直接。iPhone Duo 有两颗前摄；哪颗相机正对用户，要看相机界面位于哪块屏幕，也会随设备开合发生变化。

**把界面布局、相机选择和拍摄会话拆开**

![自适应相机架构](https://image.stephenfang.me/iPhoneDuo/mindai-camera-architecture.svg)

*图：界面几何、相机选择、方向判断与采集会话保持职责分离。*

图中的三个模块是对 Apple Session 所示 API 边界的工程化归纳，并不是 Apple 定义的框架类型。Session 的关键约束是：Direction Coordinator 必须绑定具体的 `UIView`，因此运行在 `MainActor`；它的回调不应直接调用 AVFoundation，而是返回可安全跨并发域传递的 `AVCaptureDeviceDescriptor`，再由相机 actor 完成设备解析和 session 重配。

| 模块                  | 输入                                                                                              | 负责的决策                                                                                         | 不应负责                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `Adaptive Camera UI`  | 当前 `UIWindowScene` 的 bounds、Safe Area、Division / Occlusion，以及 Orchestrator 发布的预览状态 | Preview 容器、快门、模式栏和面板如何排列；如何为 fold 或第二块屏幕留出空间                         | 根据 `.front` / `.back` 选择设备，或直接修改 `AVCaptureSession`     |
| `Camera Orchestrator` | Direction Coordinator 产生的 descriptor、设备能力、拍摄模式和录制状态                             | 使用 Virtual Front Camera 还是物理相机；开合后切换、锁定或降级；预览是否镜像；输出规格是否允许变化 | 根据屏幕坐标计算控件 frame，也不在 MainActor 回调里直接重配 session |
| `Camera Actor`        | Orchestrator 下发的目标设备、格式和输出配置                                                       | 在同一个隔离域内执行 `beginConfiguration`、增删 input、切换 format、更新 connection，再提交配置    | 决定页面布局或把尚未提交成功的设备状态提前展示给 UI                 |

这样拆分，是因为一次开合会同时产生两类变化，但二者并不等价，也不保证按固定顺序到达：

1. **Scene 几何变化**驱动 UI 重排。`Adaptive Camera UI` 可以先根据新 bounds 和安全区域调整 Preview 与控件，即使相机仍在输出旧设备的画面。
2. **相机相对 View 的方向变化**由 Direction Coordinator 检测。`.front` 只表示相机在机身上的物理类别；Session 展示了后摄也可能相对当前 View 正对用户，因此设备选择和预览镜像必须依据 descriptor 所表达的相对方向。
3. **业务策略收敛**发生在 Orchestrator。普通自拍可继续使用 Virtual Front Camera，让系统在内外前摄之间切换；4K、120fps 或 depth 等模式若使用独立物理相机，则要根据录制状态决定切换、锁定还是停止后再切，不能仅因布局变化就改设备。
4. **采集配置提交**发生在 Camera Actor。Orchestrator 把 descriptor 和目标规格传入 actor，actor 串行完成整个 session transaction；配置成功后再发布当前设备、画幅和镜像状态，供 Preview 与 Accessory 更新。

这也解释了为什么不能把三者合并成一个“开合回调”：如果 UI 在 Direction Coordinator 回调里直接切 input，主线程会进入耗时的 session 配置；如果相机队列反过来读取 View frame，又会跨线程访问 UIKit；如果把开合状态直接等同于某颗物理相机，还会绕过 Virtual Front Camera 的自动选择，并在双屏场景下得到错误结论。更稳妥的模型是让**几何状态**与**采集状态**各自演进，最后通过 Orchestrator 发布的轻量预览状态汇合，而不是共享一个 `isFrontCamera` 或 `isUnfolded` 布尔值。

**两颗物理前摄与一颗 Virtual Front Camera**

iPhone Duo 首次提供两个前摄：外屏超广角前摄和内屏屏下超广角前摄。AVFoundation 同时提供一个 Virtual Front Camera，它会在设备开合时选择当前最相关的内/外前摄。

![iPhone Duo 的外屏超广角前摄](https://image.stephenfang.me/iPhoneDuo/camera-front-cameras.png)

*图 11：外屏超广角前摄；同一设备的内屏还配有屏下超广角前摄。来源：[Build a great camera experience for iPhone Duo，0:50](https://developer.apple.com/videos/play/tech-talks/111465/?time=50)。*

![通过 front 位置与 wide 或 ultra-wide 类型共同发现 Virtual Front Camera](https://image.stephenfang.me/iPhoneDuo/camera-virtual-front.png)

*图 12：将 `.front` 与 `.builtInWideAngleCamera` 或 `.builtInUltraWideAngleCamera` 作为 `AVCaptureDevice.DiscoverySession` 的筛选条件时，iPhone Duo 会返回 Virtual Front Camera。来源：[Build a great camera experience for iPhone Duo，1:17](https://developer.apple.com/videos/play/tech-talks/111465/?time=77)。*

这里返回的不是两颗物理前摄的列表，而是一颗逻辑上的 Virtual Front Camera。设备展开时，它使用内屏前摄；设备闭合后改用外屏前摄。App 始终面对同一个虚拟 `AVCaptureDevice`，因此开合时不必自行更换设备。相应的限制是，它只提供两颗物理相机都支持的格式和能力。

![iPhone Duo 两颗物理前摄的独立设备类型和格式能力](https://image.stephenfang.me/iPhoneDuo/physical-front-cameras.png)

*图：需要使用全部格式时，可以分别发现外屏和内屏的超广角前摄。来源：[Build a great camera experience for iPhone Duo，2:00](https://developer.apple.com/videos/play/tech-talks/111465/?time=120)。*

| 路线                 | 优点                                                              | 限制                                                                       | 适用场景                                                         |
| -------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Virtual Front Camera | 系统自动随开合选择内/外前摄；输出规格容易保持一致；改造成本最低   | 只提供两颗相机共有的能力：最高 1080p/60fps；不包含个别物理相机独有的 Depth | 首发兼容、普通自拍视频、直播/视频通话、录制中需要连续切换        |
| 独立物理相机         | 可使用各自完整能力；外前摄最高 4K/120fps；可访问 Depth 等独有能力 | 必须自己处理方向、镜像、session 重配和格式降级；内前摄最高 1080p/60fps     | 高画质模式、专业创作、特效强依赖 Depth、明确禁止录制中开合的模式 |

若显式发现 `.builtInOuterUltraWideCamera` / `.builtInInnerUltraWideCamera`，则绕过 Virtual Front Camera，能使用各自完整格式，但业务必须承担开合后的设备切换与降级策略。

相机能力属于具体 `AVCaptureDevice.Format`，不能简单写成“Duo 支持 4K/120”。业务先声明分辨率、帧率、HDR、depth、美颜 pipeline 和多摄需求，再选择 device/format。外屏能录 4K/120fps，不代表录制中的素材可以在打开设备后悄悄切到 1080p/60fps。

**Direction Coordinator：以相机界面所在的 View 为参照**

传统的 `AVCaptureDevice.position == .front` 只说明摄像头位于机身正面。Duo 的两块屏幕可能朝向不同方向，仅凭 `.front` 无法判断相机是否正对当前用户。`AVCaptureDeviceDirectionCoordinator` 会绑定一个 UIView，并以这个 View 所在的显示屏为参照，判断一组 camera type 的相对方向。方向改变时，回调返回可安全传给相机线程的 device descriptor。

![摄像头方向需要相对于当前 UI 所在显示屏判断](https://image.stephenfang.me/iPhoneDuo/camera-both-displays.png)

*图 13：同一设备上，camera direction 与 View 所在显示屏相关。来源：[Build a great camera experience for iPhone Duo，5:20](https://developer.apple.com/videos/play/tech-talks/111465/?time=320)。*

```swift
// iOS 27.1，示意代码
directionCoordinator = AVCaptureDeviceDirectionCoordinator(
    view: cameraView,
    deviceTypes: [
        .builtInOuterUltraWideCamera,
        .builtInInnerUltraWideCamera,
        .builtInDualWideCamera,
    ],
    changeHandler: { [weak self] directionMap in
        guard let cameraActor = self?.cameraActor else { return }
        Task { await cameraActor.apply(directionMap) }
    }
)
```

产品需要事先约定开合发生时的相机行为：

| 当前状态                       | 建议行为                                                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| 未录制，设备开合               | 可自动切到面向用户的摄像头；更新镜像、能力面板和 preview transform                                               |
| 使用 Virtual Front Camera 录制 | 优先保持 session 与统一输出规格，验证系统切换是否满足音画连续性和特效状态连续性                                  |
| 使用独立相机录制               | 首版建议锁定当前 device，或明确提示停止后切换；若必须切换，以分段录制 + 无损拼接设计，不承诺无缝 reconfiguration |
| 直播中开合                     | 优先 Virtual Front Camera；切换前后保持编码分辨率、方向元数据、美颜/分割模型输入和镜像语义不变                   |
| 双屏同时显示相机内容           | 每个 Display 上的 UIView 使用独立 direction coordinator，因为方向是相对于各自 View 的                            |

表格中的录制和直播策略是面向相机类 App 的工程取舍，并非 Apple 的强制要求。设备切换、输出规格变化和预览镜像要分开处理，并留下日志和回退开关。

Direction Coordinator 的回调会返回一组 device type 与 descriptor 的对应关系。Descriptor 可以安全地传给其他并发任务；增加或移除 capture input、切换 format 等操作，仍要放在 Camera Actor 或相机串行队列里完成。双屏同时显示相机内容时，每块屏幕上的 View 都需要自己的 coordinator，因为同一颗相机相对两块屏幕的方向可能不同。

![Direction Coordinator 从 MainActor 把可发送的设备描述交给 Camera Actor](https://image.stephenfang.me/iPhoneDuo/camera-descriptor.png)

*图：Coordinator 在主线程观察 View，拍摄会话仍由 Camera Actor 修改。来源：[Build a great camera experience for iPhone Duo，6:00](https://developer.apple.com/videos/play/tech-talks/111465/?time=360)。*

Apple 还举了一个容易误判的情况：某块屏幕面向用户时，机身后置相机也可能正对用户。此时预览通常需要像自拍一样镜像，但录制文件是否镜像仍由产品决定。因此，`device.position`、相对方向、预览镜像和输出镜像不能共用一个 `isFrontCamera` 布尔值。

![后置相机也可能相对于当前 View 正对用户](https://image.stephenfang.me/iPhoneDuo/camera-direction-change.png)

*图：是否镜像，要看相机相对于当前 View 的方向。来源：[Build a great camera experience for iPhone Duo，6:40](https://developer.apple.com/videos/play/tech-talks/111465/?time=400)。*

**预览区域、成片比例和交互坐标要分开计算**

内屏变宽后，成片比例不需要跟着改变。相机里有三套不同的坐标：

- 素材坐标系决定 9:16、1:1、16:9 等最终输出比例。
- Preview 容器是当前窗口中用来显示画面的区域。
- 交互区域放置快门、模式选择以及滤镜、道具和美化面板。

`AVCaptureVideoPreviewLayer.videoGravity` 决定 Preview 在 Layer 中按 aspect fit 还是 aspect fill 显示。内外两颗超广角前摄还提供 `AVCaptureDevice.dynamicAspectRatio`，用于读取当前形态下合适的画幅。画面之外的空间可以放工具和素材面板，不必一律裁掉。

![通过 dynamicAspectRatio 取得前摄在当前形态下的动态画幅](https://image.stephenfang.me/iPhoneDuo/camera-dynamic-aspect.png)

*图：动态画幅由具体的 capture device 提供，不应根据屏幕宽高反推。来源：[Build a great camera experience for iPhone Duo，8:05](https://developer.apple.com/videos/play/tech-talks/111465/?time=485)。*

![在宽内屏中利用画面之外的空间放置控件](https://image.stephenfang.me/iPhoneDuo/camera-preview-layout.png)

*图 14：Preview 可以偏移或填充，剩余区域可承载控件。来源：[Build a great camera experience for iPhone Duo，7:20](https://developer.apple.com/videos/play/tech-talks/111465/?time=440)。*

放到相机类 App 中，可以按下面几条处理：

- 保持用户选择的素材比例，不因开合改变成片 composition。
- 内屏上的 Preview 可以偏向一侧，把右侧或底部空间留给参数面板；快门仍靠近手指容易触达的位置。
- 所有贴纸、手势坐标、对焦点和人脸框，都从 View 坐标统一映射到 normalized capture coordinates，禁止直接乘屏幕宽高。
- 开合后重新计算 `metadataOutputRectConverted`、Preview Layer transform、触摸对焦映射、贴纸画布和安全框。
- 采用 `AVCaptureDeviceRotationCoordinator` 统一 Preview 与输出方向。Apple 还建议在已采用 Rotation Coordinator 后关闭 iPhone Duo 前摄默认开启的 camera sensor orientation compensation，以减少额外性能开销。

**旋转和传感器方向补偿**

`AVCaptureDeviceRotationCoordinator` 负责协调 Preview 和 capture output 的旋转。Duo 前摄可能默认开启 camera sensor orientation compensation。如果 App 已经通过 Rotation Coordinator 处理了全部方向变化，可以关闭 `AVCapturePhotoOutput.isCameraSensorOrientationCompensationEnabled`，避免重复补偿带来的开销。关闭前要确认照片、视频、Live Photo、HDR、特效输入和最终 metadata 都已接入现有旋转链路。

![采用 Rotation Coordinator 后关闭重复的 sensor orientation compensation](https://image.stephenfang.me/iPhoneDuo/camera-rotation.png)

*图：只有现有链路已经处理了全部旋转情况，才应关闭额外补偿。来源：[Build a great camera experience for iPhone Duo，8:40](https://developer.apple.com/videos/play/tech-talks/111465/?time=520)。*

开合之后至少要同步更新五条坐标链：Preview layer bounds/gravity、触摸对焦点、metadata output rect、人脸/人体框、贴纸/字幕画布。它们应共同经过 capture normalized coordinates，不能分别用屏幕宽高做比例换算。

**用外屏给被摄者提供拍摄信息**

相机 App 在内屏全屏运行、capture session 处于活动状态时，`CameraCaptureAccessory` 可以在外屏显示配套内容。Apple 演示的是提词器。产品也可以让被摄者看到构图、倒计时、录制状态或口播内容，创作者则在内屏操作完整相机界面。系统会动态更新 Accessory 的可用状态；设备闭合、退出全屏或 session 停止后，相关入口要及时禁用或隐藏。

![内屏主相机界面与外屏附加内容](https://image.stephenfang.me/iPhoneDuo/camera-accessory.png)

*图 15：Camera Capture Accessory 可为外屏提供配套拍摄界面。来源：[Leverage multiple displays and scenes on iPhone Duo，5:40](https://developer.apple.com/videos/play/tech-talks/111464/?time=340)。*

```swift
// SwiftUI：提炼自 Apple Session 的注册方式
CameraView(model: cameraModel)
    .sceneAccessory {
        CameraCaptureAccessory(isEnabled: $cameraModel.isAccessoryEnabled) {
            SubjectPreviewView(model: cameraModel)
        }
        .onAvailabilityChange { available in
            cameraModel.isAccessoryAvailable = available
        }
    }
```

可以分阶段开放：

1. P0：外屏只显示录制状态、倒计时和安全裁切框。
2. P1：增加低复杂度的被摄者 Preview、提词器与姿态提示。
3. P2：探索合拍/访谈模式、双人取景引导、模板分镜提示。

隐私上，外屏不得默认展示评论、草稿文案、私信通知、账号信息或仅创作者可见的商业化数据。Accessory 应具有独立的 ViewModel 和明确的数据白名单，而不是镜像整个相机页面。

**多个 Scene 之间如何分配相机**

iPhone Duo 上所有 App 都会参与 Split View；它也是首款支持同一 App 多 UI 实例的 iPhone。外屏不能创建新窗口，新 Scene 请求必须处理失败。

相机模块需要一个进程内的 `CameraSessionArbiter`：

- 同一时刻只允许一个 Scene 持有可录制的 capture session。
- 第二个 Scene 请求相机时，显示占用态或把控制权显式移交，不要让两个 Scene 竞态重配 session。
- Scene 进入 inactive/background、Split View 尺寸变化、Accessory 失效时，分别处理 UI 重排与 capture interruption；两者不能混成一个“页面消失”事件。
- 在视频 + App stacking、键盘弹出、控制中心、来电等场景下验证 preview、音频 session、编码器和录制状态。

## 为 iPhone Duo 设计｜Design for iPhone Duo

设计章节给出的原则很朴素：设备姿态改变时，移动和重排原有内容，功能层级保持不变。没有必要为闭合、展开和半折分别做一套页面。

**设计约束**

1. 设备开合时，正在播放的视频、拍摄模式、编辑位置和未提交输入都应该保留。
2. 在宽内屏上，主要操作更适合放到屏幕外侧；这样既更容易触达，也能给内容留出更多高度，而不是强行挤在中间。
3. 页面应该根据 compact / regular 和实际可用空间来调整。只有在确实需要姿态专属布局时，才做独立处理，但功能和信息层级仍然不能乱掉。

![邮件页面的主要操作沿内屏外侧竖向排列](https://image.stephenfang.me/iPhoneDuo/design-side-controls.png)

*图：操作沿侧边竖排后更容易触达，较宽的控件仍可保留横排。来源：[Design for iPhone Duo，5:25](https://developer.apple.com/videos/play/tech-talks/111466/?time=325)。*

![部分折叠时，媒体和控制分别落入更适合观看与操作的区域](https://image.stephenfang.me/iPhoneDuo/design-control-placement.png)

*图 16：控件随姿态移动，但播放能力与层级不变。来源：[Design for iPhone Duo，5:05](https://developer.apple.com/videos/play/tech-talks/111466/?time=305)。*

**外屏保持熟悉，内屏增加内容**

外屏沿用用户熟悉的 iPhone 信息密度和单手操作。内屏多出的横向空间可以展示 Preview 与工具面板、视频与评论或选集，也可以把搜索结果排成两列。展开后不应把所有元素等比放大，也不必直接复用 iPad 导航。标准页面适合系统 Bar 和 sidebar；相机、播放器、编辑器则可以根据内容主次使用 displacement 或 Arrangement。

![外屏中沉浸式背景铺满显示区域，而文字和操作保持安全距离](https://image.stephenfang.me/iPhoneDuo/design-outer-display.png)

*图：背景可以铺满屏幕，文字和操作仍留在安全区内。来源：[Design for iPhone Duo，7:00](https://developer.apple.com/videos/play/tech-talks/111466/?time=420)。*

![同一邮件应用在外屏单列、内屏展开为主从两列](https://image.stephenfang.me/iPhoneDuo/design-inner-display.png)

*图：内屏用多出的空间显示更多内容，而不是简单放大字号和卡片。来源：[Design for iPhone Duo，7:55](https://developer.apple.com/videos/play/tech-talks/111466/?time=475)。*

**Sheet 和折痕避让**

Sheet 会随显示屏与姿态改变宽度、位置和 Bar 形态。不要假设底部 Sheet 永远贴着一个固定物理“底边”，也不要在 Sheet 内再叠加按屏幕高度计算的自定义面板。

![同一个系统 Sheet 在折叠形态中会改变占用区域并自动避让](https://image.stephenfang.me/iPhoneDuo/sheet-behavior.png)

*图 17：系统 Sheet 已包含跨形态行为，业务重点是让内部内容可调整。来源：[Design for iPhone Duo，8:55](https://developer.apple.com/videos/play/tech-talks/111466/?time=535)。*

折痕避让并不要求所有内容都离开中线。视觉背景和连续滚动内容可以跨过 fold；需要精确点击、连续阅读或承担主要任务的内容，才要移到一侧完整区域。系统容器通常已经处理了这件事，自定义全屏页面才需要直接读取 Reserved Region。

![不同折叠方向下，系统选择合适的区域承载弹层与主要内容](https://image.stephenfang.me/iPhoneDuo/fold-avoidance.png)

*图 18：fold avoidance 关注内容语义和可用区域，而非硬编码某个铰链方向。来源：[Design for iPhone Duo，9:40](https://developer.apple.com/videos/play/tech-talks/111466/?time=580)。*

## 六场 Session 如何汇成一条相机体验

**设备展开时，界面和相机分别做什么**

![设备展开时的界面与相机更新时序](https://image.stephenfang.me/iPhoneDuo/mindai-unfold-sequence.svg)

*图：布局先恢复可用，相机状态与外屏 Accessory 分别按各自节奏更新。*

布局更新和相机切换不应互相等待。窗口变化后先把 Preview 和操作控件放到正确位置，再按录制策略决定是否更换 device / format。Accessory 只是附加功能，主录制链路不能依赖它。

**首发可优先落地的新增能力**

| 能力                           | 首发建议                     | 用户价值                                         | 主要风险                                             |
| ------------------------------ | ---------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| Virtual Front Camera           | 普通自拍、直播默认优先       | 开合时自动选择朝向用户的前摄，容易保持连续       | 公共格式上限、特效能力降级需明确                     |
| Direction Coordinator          | 所有前摄模式接入             | 镜像、方向和“面向用户”语义正确                   | 切换回调与 Capture Session 并发重配                  |
| Reserved Region + Displacement | 拍摄、直播、编辑 P0          | 快门/完成等主操作不跨 fold，Preview 仍可沉浸铺满 | 旧 overlay 与面板仍缓存 screen frame                 |
| Arrangement split / overlay    | Preview + 工具/效果面板试点  | 展开后增加可用工具，而不是放大现有界面           | 与已有分屏容器可能职责重叠，需要明确由哪一层负责布局 |
| Camera Capture Accessory       | 先做状态、倒计时、安全框     | 被摄者可确认构图和录制状态                       | 隐私、外屏功耗、availability 动态变化                |
| 竖向系统 Bar                   | 发布/素材/设置等标准链路优先 | 增加内屏内容面积，按钮也更容易触达               | 自定义按钮缺少竖排样式，重要操作可能被收起           |

**各种开合状态下的产品行为**

- **未开始录制时开合**：允许 Camera Orchestrator 自动选择面向用户的前摄，同时保留拍摄模式、特效、美颜和素材比例。
- **普通自拍视频录制中开合**：优先 Virtual Front Camera，输出规格固定；只有通过音画、首帧、镜像和特效连续性验证后才开放无感切换。
- **高规格/Depth 模式录制中开合**：锁定当前物理相机，或提示停止后切换；不要静默降级。确需切换时按分段录制 + 合成设计。
- **内屏半折叠**：Preview 可以跨 fold，快门与模式选择落在靠用户的一侧，效果/参数面板落在另一侧。
- **内屏全展开**：保留成片比例，把额外空间用于参数、素材或评论/脚本，而不是拉伸 9:16 画面。
- **双屏拍摄**：内屏是创作者主控，外屏只显示被摄者需要的信息；默认不复制整页。

## SwiftUI / UIKit API 对照速查

| 能力             | SwiftUI 推荐                                                                  | UIKit 推荐                                                       |
| ---------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 普通响应式布局   | Size Class、Geometry、系统 Navigation / Tab 容器                              | `traitCollection`、Auto Layout、系统 navigation / tab controller |
| 全屏背景         | `ignoresSafeArea()` 仅用于视觉层                                              | background frame 使用 `view.bounds`                              |
| 前景交互         | 默认 Safe Area + Reserved Region                                              | `safeAreaLayoutGuide` + `UIView.reservedRegions`                 |
| 双区域内容       | `ArrangementView` 的 split / overlay                                          | `UIArrangementViewController`                                    |
| 铰链连续交互     | `.onHingeChange`                                                              | `UIHingeInteraction`                                             |
| 相机方向         | UIKit 以具体 View 作为 coordinator 的方向参照；SwiftUI 页面可通过 UIView 接入 | `AVCaptureDeviceDirectionCoordinator(view: ...)`                 |
| 外屏相机附加界面 | `.sceneAccessory { CameraCaptureAccessory { ... } }`                          | 按最终 SDK 的 Scene Accessory 接口接入，避免自建第二屏生命周期   |

现有 UIKit 相机不需要为了适配整体迁移到 SwiftUI。可以保留 Capture / Effect / Record 链路，只在 Scene 几何信息、Camera Orchestrator 和可选的 Accessory 层接入新能力。

## 前瞻结论

iPhone Duo 的新增接口可以按职责分为三组。UI Frameworks 负责竖向系统栏、Reserved Region 和 Arrangement 布局；Scene 管理多窗口、铰链状态和 Accessory；AVFoundation 通过 Virtual Front Camera、Direction Coordinator 和动态 Preview 处理相机选择与显示方向。

已有动态布局、栅格断点、分屏、Scene / Safe Area 和公共容器的 App 不必重做这些基建。新增投入可以收敛到四项：相机方向与切换语义、折痕下的交互 Displacement、双屏拍摄 Accessory，以及标准链路的竖向系统 Bar。它们决定了产品只是能在折叠屏上运行，还是能利用这台设备新增的交互空间。

## 资料来源

1. Apple. “[Prepare your app for iPhone Duo](https://developer.apple.com/videos/play/tech-talks/111461/).” Apple Developer Tech Talks, September 9, 2026.
2. Apple. “[Raise the bar with iPhone Duo](https://developer.apple.com/videos/play/tech-talks/111462/).” Apple Developer Tech Talks, September 9, 2026.
3. Apple. “[Strike a pose with adaptive layouts on iPhone Duo](https://developer.apple.com/videos/play/tech-talks/111463/).” Apple Developer Tech Talks, September 9, 2026.
4. Apple. “[Leverage multiple displays and scenes on iPhone Duo](https://developer.apple.com/videos/play/tech-talks/111464/).” Apple Developer Tech Talks, September 9, 2026.
5. Apple. “[Build a great camera experience for iPhone Duo](https://developer.apple.com/videos/play/tech-talks/111465/).” Apple Developer Tech Talks, September 9, 2026.
6. Apple. “[Design for iPhone Duo](https://developer.apple.com/videos/play/tech-talks/111466/).” Apple Developer Tech Talks, September 9, 2026.
7. Apple. “[Get ready for iPhone Duo](https://developer.apple.com/iphone-duo/).” Accessed September 10, 2026.
