---
title: 苹果“收编学”：iOS 功能融合趋势观察
pubDatetime: 2025-06-02 10:30:12
categories:
  - 技术
tags:
  - WWDC
  - Apple
  - iOS
  - 越狱
  - App Store
  - 操作系统
  - Apps
copyright: true
featured: true
description: 本文将系统梳理苹果在历年 WWDC 和 iOS 大版本更新中，陆续取代、吸收第三方 App 与越狱插件的历史，归纳总结几种典型的“收编”路径，并回顾这些应用及背后团队的后续命运。
---

## 引言

![](https://image.stephenfang.me/WWDCKilledApps/Apps.png)
在智能手机发展的十余年间，iOS 始终是封闭生态的典型代表。从最初的 iPhone OS 到如今的 iOS 18，每年的 WWDC 除了系统更新和硬件发布之外，一些活跃于 App Store 或越狱社区的第三方 App 和插件会被苹果官方功能所取代，“又有哪些 App 被官方‘杀死’了”也成为开发者圈子里的热门话题。

Apple 对这些 App 和插件的 “收编”大致分为几种常见形式：有的被直接内建进系统，有的因 API 权限收紧而失去生存空间，有的通过收购方式纳入麾下，也有的在与系统功能的竞争中逐渐边缘化，最终淡出市场。

本文将系统梳理苹果在历年 WWDC 和 iOS 大版本更新中，陆续取代、吸收第三方 App 与越狱插件的历史，归纳总结几种典型的“收编”路径，并回顾这些应用及背后团队的后续命运。

> 由于篇幅和主题所限，本文梳理的仅是 iOS 系统自带应用和功能演进过程中对第三方工具型 App 和越狱插件的“收编”案例。实际上，macOS、watchOS、visionOS 乃至 iCloud 服务同样经历了类似的整合和官方化过程，涉及生产力工具、密码管理、文件同步、远程协作、健康追踪等诸多领域。

## 时间线概览

### 填补空白

在 iOS 初期，由于系统功能不完善以及权限限制，越狱社区和第三方 App 填补了大量系统空白，形成了活跃的工具生态。而苹果在后续更新中，不断将这些“实用功能”官方化，逐渐压缩了第三方应用的空间。

或许很少人知道 iOS 1-2 时代是没有复制粘贴功能的，当时有一些越狱插件能够在键盘基础上实现简单的复制粘贴功能，例如 [Clippy](https://www.ispazio.net/25855/clippy-095-7-update-cydia-ispazio-repository) 能够在用户输入「123」之后会高亮选中文字并展示复制+粘贴的菜单，然而这个功能仅在备忘录、邮件和信息App中可用。所幸 iOS 3 用非常优雅的交互实现了这一系统功能，John Gruber 将其称为 iOS 3 最棒的功能，在此之后这类插件也就不再具备存在的意义，

![](https://image.stephenfang.me/WWDCKilledApps/clippy.jpg)

iOS 4 伴随着 iPhone 4 的发布，成为了 iOS 在功能上逐渐完善的第一个里程碑。除了设置桌面壁纸的功能，iOS 4 还推出了广受欢迎的多任务处理以及个人热点功能。单就个人热点这一功能而言，MyWi 是当时最为流行的一款越狱插件，使用这款插件除了需要先越狱外，还需要支付 19.99 美金才能长期使用。相较于系统提供的极为简单的设置内交互，MyWi 提供了一些增强功能。

![](https://image.stephenfang.me/WWDCKilledAppsmywi.jpg)

至于多任务处理能力，在 iOS 4 之前 Apple 官方未开放真正的多任务机制，绝大多数应用在切换或退出后便被系统强制终止，无法在后台继续运行。这一限制引发了不少用户的不满，也催生了越狱社区的解决方案。

其中最具代表性的一款越狱插件便是 Backgrounder，它允许用户通过特定的手势或操作将任意应用强制挂起在后台持续运行，提升了 iPhone 的使用灵活性，但也带来了明显的弊端，例如设备发热、内存占用增加、耗电加剧等等。

![](https://image.stephenfang.me/WWDCKilledApps/backgrounder.png)

iOS 4 引入的名为“墓碑机制”的官方多任务管理方案使得应用在切换至后台时并非立即终止，而是进入挂起状态，必要时可通过系统授权的后台任务继续运行。虽然这一方案在安全性和续航方面做出了权衡，但也因此限制了普通应用在后台的自由度，不少越狱用户仍坚持使用 Backgrounder 或类似插件，以实现更加彻底、自由的后台多任务体验。这种官方和越狱社区在多任务处理上的长期拉锯，直到 iOS 7 后期及 iOS 8 开放 App Extension 和 Background Fetch 才逐渐缓和，但对老用户来说，Backgrounder 曾经是那个越狱黄金时代最具代表性的插件之一。

2011 年发布的 iOS 5 被标榜为“史上最先进的移动操作系统”，它带来了超过 200 项新功能，其中相当一部分直接“收编”了当时 App Store 上活跃的第三方应用和越狱插件。例如 Siri，原本是一款在 App Store 上独立上架的智能语音助手应用，Apple 在 2010 年将其收购，原 App 随即下架。这不仅开辟了 iOS 系统级语音交互的先河，也导致了第三方语音助手 App 在 iPhone 平台上生存空间的急剧收缩。

![](https://image.stephenfang.me/WWDCKilledApps/Siri.png)

同期 iCloud 的登场也对第三方文件同步工具构成很大打击。此前，SugarSync、Dropbox 等云存储 App 正在积累用户基础，而 iCloud 集成了照片、通讯录、日历、备忘录同步，并支持系统级的“文稿与数据”同步，让用户无需依赖第三方 App 便可实现多设备数据无缝衔接。

![](https://image.stephenfang.me/WWDCKilledApps/SugarSync.png)

此外，iOS 5 还带来了提醒事项应用，开始蚕食 Things、OmniFocus 等 GTD 应用的基础功能市场，标志着 Apple 官方对生产力应用生态的直接涉足。

![](https://image.stephenfang.me/WWDCKilledApps/Things.png)

在 iOS 6 上线的 Passbook（后来的钱包app）整合了登机牌、电影票、会员卡等票据管理功能，直接压制了 Lemon Wallet 等同类 App 的市场需求。官方方案具备系统级调用权限和通知推送优势，令第三方票据管理工具逐渐式微。

![](https://image.stephenfang.me/WWDCKilledApps/LemonWallet.png)

从 iOS 3 到 iOS 6，苹果通过不断补全系统短板和整合热门功能，逐步蚕食了越狱社区和第三方工具 App 的生存空间。无论是复制粘贴、多任务处理、个人热点，还是语音助手、云同步、GTD 应用和票据管理，无数项曾经依赖越狱或第三方的实用功能都以官方方案的形式回归系统，越狱黄金年代开始步入尾声。

### 越狱退潮

2013 年发布的 iOS 7 是 iOS 历史上界面变动最大的一次，标志着拟物化设计的正式落幕。然而，除了视觉层面的全面焕新，iOS 7 也是系统功能“收编”最密集的一年。

全新推出的控制中心，整合了 Wi-Fi、蓝牙、飞行模式、亮度调节、快捷启动等功能，几乎完整复刻了越狱插件 SBSettings 的核心能力，使用户无需越狱也能便捷操作系统设置，直接削弱了 SBSettings 的使用价值。

![](https://image.stephenfang.me/WWDCKilledApps/SBSettings.jpg)

AirDrop 的加入则几乎终结了当时盛行的文件快传类应用，例如 Bump 和 Instashare。凭借系统级权限与无缝整合的便捷性，AirDrop 很快成为 iOS 用户的默认选择，而这些第三方 App 则逐渐被迫转向跨平台或企业场景求生。

![](https://image.stephenfang.me/WWDCKilledApps/Bump.jpg)

iOS 8 延续了“系统收编”的节奏，新增的健康 App 整合了运动、睡眠、体重、营养等多个健康数据接口，直接冲击了像 Jawbone 、Fitbit 等依赖健康数据的 App 生态。

还记得当时 Jawbone UP 手环的一度凭借精致的硬件和设计感十足的 App 在市场中独树一帜，设备通过 3.5mm 耳机孔与 iPhone 同步数据，是少数既有设计感又注重平台体验的产品。但不亲民的售价和封闭的生态最终限制了它的扩展性，Jawbone 也成为 Apple Watch 时代最早倒下的一批品牌之一。

![](https://image.stephenfang.me/WWDCKilledApps/Jawbone.jpg)

非常罕见的是 Apple 开放了第三方键盘接口，一时间 Gboard、搜狗输入法、SwiftKey 等登场，但受限于 iOS 安全策略和 API 权限，至今仍被诸多限制，长期未能撼动原生键盘地位。

![](https://image.stephenfang.me/WWDCKilledApps/SwiftKey.jpg)

2015 年，原生备忘录应用迎来重大升级，新增手绘、清单、文件附件等功能，几乎取代了轻量笔记类 App 如 Evernote 的使用场景。

![](https://image.stephenfang.me/WWDCKilledApps/evernote.png)

此外，系统推出低电量模式，集成原越狱插件金山电池医生等 App 的核心功能一键省电，让 iPhone 用户无需越狱也能延长续航，相关节电工具插件逐步失去存在价值。

![](https://image.stephenfang.me/WWDCKilledApps/batteryDoctor.jpg)


2016 年 Apple 开始构建自家的智能家居生态，过统一接入协议，整合如灯泡、门锁、插座等智能设备，HomeKit 抢占了原本依靠自建 App 的品牌市场，例如 WeMo 等第三方智能家居控制 App 渐被边缘化。

![](https://image.stephenfang.me/WWDCKilledApps/wemo.jpg)

2017 年，Apple 推出原生文件App，整合 iCloud Drive、第三方云盘、本地文件，成为类似 Documents、GoodReader 等文件管理 App 的直接对手，尤其在基础文件浏览、传输场景下直接取代大量第三方应用。

![](https://image.stephenfang.me/WWDCKilledApps/GoodReader.png)

此外，iOS 11 还内建屏幕录制功能，越狱社区曾经流行的 RecordMyScreen、Display Recorder 插件彻底失去意义，录屏需求无需越狱即可解决。

![](https://image.stephenfang.me/WWDCKilledApps/recorder.jpg)

自 iOS 7 起，Apple 加快了对第三方 App 和越狱插件功能的整合节奏。通过系统级权限、设计一致性和更广泛的生态整合能力，苹果不仅抹平了用户越狱的动机，也令许多原本活跃的第三方工具在更新节奏和平台能力面前难以为继。

### 逐步完善

2018 年，iOS 12 推出屏幕使用时间 功能，提供每日设备使用统计、应用限制、家长控制等能力，直接覆盖了当年流行的Moment、QualityTime 等第三方数字健康类 App。Moment 的作者 Kevin Holesh 曾在个人博客中详细记录了这款 App 被官方功能取代后的[心路历程](https://kevinholesh.com/moment)。

![](https://image.stephenfang.me/WWDCKilledApps/moment.jpg)


同年，Apple 正式将 2017 年收购的自动化工具 App Workflow 改版成 Shortcuts（捷径），深度整合至 iOS 系统，开放自动化指令、Siri 联动、App 快捷操作。如果你在当时就是少数派的读者，肯定对这款 App 不陌生，当时有无数的文章和专栏介绍这款 App 的使用技巧。

![](https://image.stephenfang.me/WWDCKilledApps/Workflow.png)

用户期待多年的全局深色模式在 iOS 13 登场，官方深色界面覆盖系统及第三方 App，取代了越狱插件 Eclipse、Noctis 等深色主题插件的需求，要知道从 iOS 7 起，用户对深色界面的呼声就从未停歇，直到 iOS 13 才真正实现官方统一。

![](https://image.stephenfang.me/WWDCKilledApps/Eclipse.jpg)

2020–2022 年，也就是 iOS 14–16，Apple 系统级“收编”进程持续加速。 系统内置实况文本 OCR、扫码识别，直接覆盖了 App Store 中常年热门的文档扫描类 App，例如Scanner Pro、扫描全能王，大幅减少第三方文档扫描、文本提取 App 的下载需求。

![](https://image.stephenfang.me/WWDCKilledApps/Notes.png)

2023–2024 年，Apple 又将“围猎目标”瞄准了账号安全与数字资产管理领域。早在 iOS 7，Apple 就上线了 iCloud 钥匙串功能，提供账号密码同步与自动填充功能。而随着 iOS 17、18 相继加入验证码管理、密码共享、安全性建议等功能，进一步蚕食了 1Password、mSecure、LastPass 等第三方密码管理 App 的市场，轻量级用户基本已被系统自带方案覆盖，只有对多平台、团队协作、高级密码库管理有刚需的用户才会继续留在这些第三方 App 里。

![](https://image.stephenfang.me/WWDCKilledApps/Password.png)


从 iOS 12 到 iOS 18，Apple 的系统“收编”策略不再局限于基础功能或越狱插件，而是将目光投向更广泛的第三方独立 App 市场，从数字健康、自动化到扫描识别和密码管理，几乎每年都有重磅级原生功能上线，直接取代过去依靠第三方实现的刚需场景。

## 路径分类

回顾 iOS 历代版本的功能演进，不难发现苹果针对第三方应用与越狱插件的策略大致可以归纳为四条路径：功能内建与移植、收购吸收、功能升级压制、以及 API 限制与系统特权保留。

### 功能内建

最直接的一种策略是将原本依赖第三方应用或越狱插件实现的功能直接在系统中实现，用户无需额外安装。例如 iOS 3 增加复制粘贴功能取代了越狱社区内广泛使用的插件。iOS 4 实现多任务切换，直接替代越狱插件 Backgrounder。iOS 7 的控制中心本质上便是 SBSettings 的官方翻版，将快捷开关集中管理，取代越狱用户对 SBSettings 和 NCSettings 的依赖。深色模式、屏幕录制、省电模式、通知分组等均为越狱社区长年需求验证后的功能点。

### 收购吸收

苹果还通过收购优秀第三方应用及团队，将其核心技术和产品形态转化为官方功能。最典型案例包括 Siri 被收购，转化为 iOS 5 内建的 Siri 语音助手；Workflow 收购后重构为 iOS 12 中的 Shortcuts，极大提升自动化体验；天气类 App Dark Sky 被苹果收购，技术整合进自家天气 App。

### 功能升级压制

相比直接收购，苹果更常用的手段是对原生系统功能持续升级，逐步覆盖同类第三方 App 核心功能，形成“轻量需求内建，复杂高级交给订阅 App” 的结构。iOS 12 推出屏幕使用时间，直接压制了 Moment 等应用市场份额。备忘录应用从基础记事演进到支持绘图、PDF 扫描、OCR 文字识别，压缩了 Evernote、印象笔记等 App 的生存空间。iOS 17 起，iCloud 密码库扩展验证码管理功能，进一步侵蚀 1Password、LastPass 轻量用户市场。

### API 限制+系统特权

最后，苹果通过限制 API 调用、保留关键系统特权的方式，直接封杀某些 App 的功能实现路径。自 iOS 10 起，CallKit 框架对来电拦截 App 开放，但仅限部分权限。iOS 13 强制推行 Sign in with Apple，所有支持第三方登录的 App 若提供 Google 等登录方式则必须同步加入 Apple 登录，规范化账户体系。iOS 长期不开放通话录音、短信拦截 API，导致童话录音应用全面失效，或者被迫违规下架。第三方键盘 App 也长期受限，进一步巩固官方特权地位。


## 现状追踪

随着 iOS 功能不断完善，曾经风靡一时的第三方 App 和越狱插件在官方功能“收编”之后，纷纷走向不同的命运。有的彻底消失，有的转型求生，有的被苹果直接收购，还有的伴随越狱生态式微而衰退。我们不妨按照类型来梳理它们的后续轨迹。

### 原地解散型

一些被直接封杀、被 API 限制或市场需求消失的产品，基本退出了舞台。
- Bump：曾是靠“碰手机”交换联系人、照片的创新应用，2011 年全球下载破亿，但 2013 年被 Google 收购，次年随 AirDrop 上线退出市场，彻底停服。
- Clipboard Manager：早期越狱插件代表，弥补 iOS 缺乏复制粘贴功能的空白。随着 iOS 3 原生复制粘贴功能正式登场，越狱社区 Clipboard Manager 插件全面废弃。
- 金山电池医生专业版：一度在越狱设备流行，提供后台实时电量管理、充电优化、CPU 降频等功能。自 iOS 9 省电模式推出后，此类插件及 App 逐步消亡。

### 功能转型型

面对系统原生功能挤压，一些具备产品实力和开发能力的 App 选择主动转型，避开官方功能覆盖区域，转向细分或专业市场，继续保持活跃。

- Documents（Readdle）：原是 iOS 上最全面的文件管理神器，iOS 11 文件 App 上线后，转型主攻云同步、多格式文档编辑与 PDF 高级处理，强化专业办公场景需求。
- Scanner Pro：随着 iOS 14 实况文本、原生文件扫描与 OCR 功能加入，Scanner Pro 转型专注表单自动识别、图像矫正、智能批量 PDF 管理，牢牢占据办公 App 市场。
- 1Password ：尽管 iCloud Keychain 越发完善，加入验证码自动填充、跨设备同步，但受限于 Apple 生态，缺少跨平台、团队协作、密码共享等企业级功能，1Password 转型做企业密码库、团队权限管理 SaaS 产品，至今依然强势活跃。
- Day One：作为 iOS 上最知名的私密日记 App，长期面对备忘录 App 与手记 App 的正面冲击，却依靠 Markdown 写作、多设备端到端加密同步、照片日记、模板化记录、地图与天气打卡等差异化功能，持续保持活跃更新。

![](https://image.stephenfang.me/WWDCKilledApps/Journal.png)

### 被收购型

一些极具竞争力且生态冲突较大的应用，例如前文中提到过的 Siri、Workflow、Dark Sky，选择被苹果官方直接收购，功能和技术内化进系统，成为官方功能的一部分。这种路径既能消除潜在竞争，又迅速丰富系统体验。

这类产品结局较为理想，技术被保留，用户体验升级，同时也让 iOS 官方功能完成从“满足需求”到“覆盖场景”的布局。我也很是期待今年被 Apple 收购的 Pixelmator 公司能否将更为强大的照片编辑功能引入系统。 

![](https://image.stephenfang.me/WWDCKilledApps/Pixelmator.png)


### 越狱社区全面衰退型

越狱插件曾是 iOS 生态活力的象征，但自 iOS 7 安全机制大幅升级、系统功能完善后，越狱社区逐年衰退，功能性插件逐渐失去意义。大量越狱插件原本解决的需求被系统官方化，越狱门槛和风险提升，也让普通用户逐渐远离。

目前的越狱社区已沦为小众技术爱好圈，核心插件作者停更或转型，主流功能插件因 API 权限收紧、代码签名防护、App Store 审核机制而失效，越狱工具基本只作为开发者测试和极客用途。


## 趋势展望

如果回头看 iOS 十几年的进化史，其实会发现一个很有趣的现象：第三方 App 和越狱插件，长期扮演着苹果产品功能验证和用户需求试探的角色。很多看似由官方首创的功能，背后往往都源自社区开发者和独立团队的探索。

Apple 一边观察这些产品的用户反馈和市场反应，一边择优吸收、优化体验，最终以更系统化、更安全、更易用的方式集成进原生系统，普惠给更广泛的普通用户。这种“收编”策略虽然让许多独立开发者和工具类应用的生存空间变窄，但对于用户而言，体验的统一、隐私的保障、数据互通的便利、基础功能的免费普及，反而是实实在在的好处。

哪怕今天越狱几乎消失、工具型 App 越来越难做，这个“替苹果试错、替用户创新”的角色依然存在。AI 应用、空间计算、Vision Pro 场景，仍然是第三方开发者的舞台。或许未来十年，我们依然会看到下一个 Workflow、下一个 Dark Sky 诞生，也依然会看到这些优秀的创意，最终走进系统，成为所有用户都能用到的、无感但必要的操作系统自带应用。

## 后记
今年的 WWDC 25 你更期待那些功能引入呢，我更期待的其实不是某个颠覆性的全新功能，而是一些长期缺席、却影响日常体验的小细节被补齐。比如，一款原生的剪贴板管理工具，能够查看和管理历史复制内容，目前已有不少优秀的第三方方案（Paste），但系统级别的工具始终缺位。还有像基于场景和习惯的动态卡片推荐、横屏主屏幕的回归等，都是近年来用户呼声很高的功能。希望 Apple 能在新一代 iOS 里，继续优化这些贴近日常场景的小工具，让 iPhone 和 iPad 的使用体验更加完整和顺畅。


## 引用

- https://daringfireball.net/2009/06/copy_and_paste
- https://www.idownloadblog.com/2009/01/19/clippy-finally-brings-copypaste-to-the-iphone/
- https://www.car1.hk/digital/apple-iphone-iso4-share-3g-mywi/
- https://www.idownloadblog.com/2008/10/03/backgrounder-runs-multiple-apps-at-once/
- https://www.idownloadblog.com/2010/10/07/backgrounder-updated-to-support-ios-4-1/
- https://www.etechbuzz.com/apple-siri-on-iphone-4s/
- https://www.theguardian.com/technology/blog/2012/jun/11/wwdc-2012-ios5-apple
- https://lowendmac.com/2014/dropbox-mobile-a-photo-stream-alternative/
- https://www.businessinsider.com/how-to-use-sugarsync-2011-3#one-killer-feature-of-sugarsync-is-that-you-can-not-only-stream-music-from-the-cloud-but-you-can-even-tap-the-blue-arrow-for-an-entire-folder-of-music-and-tap-sync-to-iphone-to-download-it-to-your-phone-17
- https://gizmodo.com/everything-apple-tried-to-kill-wwdc-2024-1851531882
- https://abcnews.go.com/Technology/jawbone-up24-bluetooth-app-features-added-popular-fitness/story?id=20863632
- https://www.macstories.net/stories/revisiting-evernote-checking-in-with-the-former-note-taking-king/
- https://www.tamingthetrunk.com/p/the-history-of-evernote-in-screenshots
- https://www.macstories.net/ipad/goodreader/
- https://kevinholesh.com/moment
- https://www.idownloadblog.com/2014/01/27/eclipse/