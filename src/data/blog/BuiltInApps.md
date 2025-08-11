---
title: 操作系统内置应用程序的变迁
pubDatetime: 2025-04-19T12:34:40.971Z
categories:
  - 技术
tags:
  - 怀旧
  - iOS
  - Mac
  - 折腾
  - macOS
  - Windows
  - UIUX
  - 操作系统
copyright: true
featured: true
description: 本文将从“互联网考古”的视角出发，回顾内置应用的发展历程，分析它们在技术与设计层面的演化逻辑，并试图展望一个由 AI 重构的操作系统应用生态的未来图景。
---

## 引言

操作系统，作为计算设备的灵魂，一直以来都承载着连接用户与硬件的核心职责。而几乎每一代操作系统，从桌面到移动端，都会随之附带一批内置应用程序（built-in apps），这些应用程序构成了操作系统最基本的体验。

在我学习人机交互（HCI）课程时，曾浅浅研究过“系统内置应用的演化”这个课题。这类“互联网考古”式的探索，总是让我着迷。一种有趣的观点认为：操作系统是否好用，关键就在于它的内置应用体验。而这种体验，往往并不来自那些光鲜复杂的高级功能，而来自最基础却不可或缺的工具——记事本、浏览器、相册、邮件、文件管理器等等。

你或许会安装第三方 App来取代内置应用，你也总是能够找到更好的选择，例如你可能会使用 Spark、XX笔记这样的第三方应用，但可能兜兜转转你又用回了系统内置的那些应用。

![](https://image.stephenfang.me/BuiltInApps/Notes.png)

以 iOS 为例，算上库乐队、可立拍等扩展应用，国行 iPhone 在 2025 年的预装程序数量已达到 50 个，且随着 iOS 18 中 AI 功能的加入，这个数字还在持续增长。Apple 甚至专门上线了一个[官方页面](https://www.apple.com.cn/apps/) ，全面介绍这些内置应用，视其为生态卖点的一部分。

![](https://image.stephenfang.me/BuiltInApps/iPhonePreInstalled.png)

从命令行时代的 vi、OMMAND.COM，到图形时代的 Paint、Finder，再到今天的 Siri、iCloud、Copilot，内置应用的变化，不只是功能上的升级，更体现了技术范式、用户习惯与产品理念的演进。

本文将从“互联网考古”的视角出发，回顾内置应用的发展历程，分析它们在技术与设计层面的演化逻辑，并试图展望一个由 AI 重构的操作系统应用生态的未来图景。

### 数字考古工具

在2025年的今天，想体验早期操作系统与软件已经不必非得去淘一台老设备。我们可以通过模拟器与在线博物馆来开展互联网考古工作。

- [Mini vMac](https://www.gryphel.com/c/minivmac/) 是一个开源的 Mac 模拟器，主要用于模拟苹果早期的 Macintosh 电脑，比如 Macintosh Plus。它的目标是让现代计算机能够运行经典的 Mac OS 系统，比如 System 1 到 System 7。这个项目由 Paul C. Pratt 开发，目的是保存和体验 1980-90 年代的 Macintosh 软件和操作系统。

  ![](https://image.stephenfang.me/BuiltInApps/Install.png)

  运行这款软件你需要一份 Macintosh ROM 文件、一份虚拟化启动用的系统磁盘镜像以及空白磁盘镜像，在网络上能够找到不少相关的教程和镜像，只要你感兴趣可以找到很多可以玩的经典软件。

- [DOSBox](https://www.dosbox.com/) 是一个免费的开源 x86 DOS 仿真器，可以用来在现代操作系统（如 Windows、macOS、Linux）上运行早期的 MS-DOS 程序，尤其是经典 DOS 游戏。

  ![](https://image.stephenfang.me/BuiltInApps/DOSBOX.png)

- [复古电脑博物馆](https://www.retromuseum.org/)是一个公益性质的在线交互式计算机博物馆，致力于通过现代浏览器中的仿真模拟器，重现 1970 至 1990 年代的经典电脑硬件与软件。该项目由 Honux 创建，旨在教育公众并传承计算机文化，秉持开放、平等和免费访问信息的互联网初衷。

  ![](https://image.stephenfang.me/BuiltInApps/museum.png)

  网站上的展览包括了复古电脑、专题展览、家用游戏博物馆等多个主题，最重要的是网站支持多种设备和浏览器，无需安装任何插件，即可在线体验各类仿真内容。

## 早期操作系统的内置工具：命令行与GUI工具

在操作系统发展之初，预装应用的“使命”很朴素——它们只是完成系统运作或用户基础交互的工具集合。但这种“工具”也随着计算平台和交互方式的演化，逐步转型为真正的“App”。

这一阶段的内置应用以“实用优先”为核心，不追求复杂的用户体验，而是侧重于功能的完备性和灵活性。

### 命令行时代：程序员的工具箱（1960s–1980s）

在图形用户界面（GUI）尚未出现前，操作系统服务的主要是专业用户、程序员和工程人员。所谓“内置应用”，就是系统预装的命令行程序，用来完成基础的文本处理、文件操作和系统监控。

这些工具的特点是：

- 轻量级，占用极少资源
- 以命令行交互为主，依赖用户对语法的熟悉程度
- 主要面向开发者和专业用户

#### Unix 系统：简洁之美，灵活至上

自 1970 年代起，Unix 成为科研与服务器领域的主力平台，内置的工具链极具“组合能力”

- vi：最早期的全屏文本编辑器
- grep、awk、sed：文本处理三宝
- ps、kill：系统任务控制命令
- man：内建的文档系统

这些指令非常强的延续性，在今天的操作系统中以核心组件或命令行工具包的形式继续存在和演化。例如 vi 被 vim 和 neovim 等继承。

![](https://image.stephenfang.me/BuiltInApps/vi.png)

这些指令至今仍是 Linux / macOS 用户日常操作的基石。如果你是计算机专业的学生，几乎一定学过它们。macOS 本身是 Unix-like 系统，终端（Terminal）内几乎完整保留了 Unix 命令工具链。

#### MS-DOS：个人电脑时代的开端

在 1981 年，IBM PC 搭载的 MS-DOS 系统将命令行带入了个人用户家庭。它也内置了一批功能精简但实用的程序：

- [EDIT.COM](https://en.wikipedia.org/wiki/MS-DOS_Editor)：简单的文字编辑器
- [CHKDSK](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/chkdsk?tabs=event-viewer)：磁盘工具
- [COMMAND.COM](https://en.wikipedia.org/wiki/COMMAND.COM) 本身就是系统控制的核心接口

COMMAND.COM 在 Windows 后期用 cmd.exe 替代，而当前正在逐渐被 PowerShell 和 Windows Terminal 所逐步取代；CHKDSK / FORMAT 在 Windows 中仍然以命令行的形式存在（chkdsk、format），而 EDIT.COM 以 Notepad 这种图形化的形式继续延续。

![](https://image.stephenfang.me/BuiltInApps/CMD.png)

这些“应用”没有界面、没有图标，却是系统最初的“标配功能”。而当图形用户界面（GUI）登场，操作系统不再只属于工程师，计算机才真正走进了大众生活。

### GUI 时代：可视化的日常工具（1984–1995）

图形用户界面（GUI）的普及，是操作系统发展史上的关键转折点。它让“内置应用”从专业的命令行工具，变成了人人都能上手的应用程序，不仅降低了使用门槛，也开始扮演教学、演示、生态入口等多重角色。

#### 初代 GUI：Macintosh System 1.0（1984）

回到正题，暂且不谈 Apple 和施乐公司的那些故事， Macintosh 在历史上确实是第一批成功面向消费者的图形界面操作系统，其内置应用具有极强的“示范性”和“启发性”：

- Finder：首次引入“图标即文件”的交互理念，用户通过点击图标即可操作文件，打破命令行壁垒。

  ![](https://image.stephenfang.me/BuiltInApps/Finder.png)

- MacWrite：Apple 为 Macintosh 开发的第一款图形文字处理器，首次实现“所见即所得”的排版体验，随 1984 年首发机型附带，但并非严格意义上的“预装应用”。

  ![](https://image.stephenfang.me/BuiltInApps/MacWrite.png)

- MacPaint：最早期的图形绘图软件，具备喷枪、图案填色等功能，是 Macintosh 图形界面能力的代表作之一，与 MacWrite 一起成为最初“附送软盘”中的演示软件。

  ![](https://image.stephenfang.me/BuiltInApps/MacPaint.png)

#### GUI 平民化：Windows 3.x / Windows 95（1990–1995）

微软则把 GUI 从高端带入了大众市场，Windows 3.1 到 Windows 95 的内置应用大多“轻量且高频”。这些应用并不只是功能软件，更是 GUI 思维的载体——它们“教用户如何使用图形化电脑”。这其中就包括了

- 记事本、画笔、计算器：三大轻工具被深度植入用户习惯
  ![](https://image.stephenfang.me/BuiltInApps/Utils.png)

- 程序管理器 / 开始菜单：启动方式本身也成为“应用的一部分”
  ![](https://image.stephenfang.me/BuiltInApps/manager.png)

- 扫雷 / 蜘蛛纸牌：小游戏首次作为内建应用走入办公场景，塑造系统“人性化”形象
  ![](https://image.stephenfang.me/BuiltInApps/games.png)

#### 多功能集成时代：Windows 95 & Mac OS 7 之后

随着图形用户界面（GUI）的普及，操作系统开始预装更多的可视化应用。进入 90 年代中后期，内置应用不仅止步于基础功能，还开始承担更多“系统核心服务”的角色： 例如 Windows 95 及 Mac OS 7 时代，操作系统开始内置：

- 文件管理器（Windows：Windows Explorer、Mac： Finder）
- Web 浏览器（Windows ：Internet Explorer、Mac：Netscape Navigator）
- 多媒体播放工具（Windows： Windows Media Player、Mac： QuickTime）

这一时期的显著特点有：

- 图形化交互大幅普及：界面可点击、窗口可拖动，操作不再依赖记忆命令。
- 应用功能增强：IE 可浏览网页，WMP 可播放视频，系统“内置”功能大大扩展。

这个阶段的“内置应用”已经从辅助工具演变为系统使用方式的引导者、操作理念的传播者、乃至生态锁定的武器，也为接下来的“应用生态竞争”打下基础。

## 互联网时代：云端与集成化应用

进入 21 世纪，互联网的全面普及与多设备连接催生了操作系统的新命题：内置应用不再是局部的功能补足，而成为系统级平台能力的体现。

### 系统级“超级工具”：浏览器、媒体、通讯

#### 浏览器——通往互联网的默认大门

Windows 阵营这边的主角就是IE浏览器（Internet Explorer），IE 4.0 起深度集成于 Windows，与资源管理器界面合一。在Windows XP 时代，IE 占据全球 90% 以上市场份额，成为“上网即打开 IE”的默认习惯，相信阅读文章的很多人也是从这个时候开始养成了上网冲浪的习惯。

![](https://image.stephenfang.me/BuiltInApps/ie4.jpg)

相较之下，Apple 阵营的主角就是 Safari，它搭载了苹果自研内核 WebKit，以摆脱对微软 IE 的依赖。但是 Mac 在那个时代并没有占据很大的市场份额。

#### 通讯工具——系统级通讯的根基

微软通过预装邮件客户端，将用户导入 MSN / Hotmail / Exchange 平台。这些工具 Office 系统高度耦合，成为企业用户工作流入口。

![](https://image.stephenfang.me/BuiltInApps/Outlook.png)

苹果将邮件（Mail.app）、即时通讯（iChat，自OS X Mountain Lion起被 Messages代替）整合进系统。

![](https://image.stephenfang.me/BuiltInApps/iChat.png)

#### 多媒体内容——从播放到创作闭环

在操作系统的演进中，多媒体始终是关键场景之一。从最早的“播放体验”出发，Apple 和 Microsoft 逐步走向了两种不同的策略方向：创作为本 与 工具整合。

多媒体内容一直是 Apple 生态的强项，他们于 2001年推出了 iTunes，实现了音乐播放 + 商店 + iPod 管理三合一，是其建立音乐帝国的基础。

iLife 套件中的 iPhoto / iMovie / GarageBand 分别覆盖摄影、视频剪辑、音乐创作，以内容创作为导向，赋予每个用户“创作”的权利。这些应用帮助苹果建立起内容创作和消费的闭环，后续也成为 Mac 与 iPhone 协同的接口。

![](https://image.stephenfang.me/BuiltInApps/iLife.png)

> iLife 工具初期为付费独立软件，需额外购买 iLife 套件才能使用。直到 2013 年后，Apple 才宣布 iLife 与 iWork（办公套件）对所有新设备免费，实现了“创作工具普及化”。

Windows Media Player（简称 WMP）是微软自 Windows 95 开始引入的多媒体播放器，它逐步发展为一个集视频播放、音频播放、CD 抓轨、媒体库管理、刻录与同步功能于一体的全能型媒体中心。

对于很多人来说，Windows XP 带来的 WMP 8 和 WMP 9 是许多用户的启蒙播放器，不需要安装第三方解码器，就可以播放大部分媒体文件。到了 Windows 7 搭载的 WMP 12，界面进一步现代化，功能进一步整合，体验达到了巅峰。即便到了 Windows 11 的今天，WMP 依旧作为“可选功能”被保留，可见其在微软生态中长久的存在价值。

![](https://image.stephenfang.me/BuiltInApps/MediaPlayer.png)

除此之外，Windows Movie Maker 为普通用户打开了家庭影像剪辑大门，然而这款工具命运多舛，在 Windows 7 后被边缘化，最终由 Clipchamp 在 Windows 11 中接替，成为新一代视频创作工具。

![](https://image.stephenfang.me/BuiltInApps/Clipchamp.png)

Microsoft 的多媒体策略强调功能集成与通用性，目标是让大众用户在系统内即可完成基本的播放与编辑需求。

### 从本地工具到“云端服务门户”

在 Web 1.0 时代，内置应用是“文件操作工具”。到 Web 2.0 与云服务兴起之后，它们变成了“数据接入终端”。

操作系统内置应用变得“联网、有状态、随设备同步”，无论在哪台设备打开备忘录、照片、日历，看到的都是你同一份数据内容，数据不再保存在 Documents 文件夹，而是实时与云端服务同步。

#### Google Docs 的尝试

在查找资料的时候才知道 Google Docs 在2006年就诞生了，比国内的一众协同文档出现的时间要早得多。用户无需安装 Office 软件，只要打开浏览器就能写作、保存、分享。这款浏览器上的应用程序在当时震惊了微软，因为它动摇了 Word/Excel 的地位。

![](https://image.stephenfang.me/BuiltInApps/Docs.png)

作为互联网领域巨头的 Google ，将 Google Docs 视为“云办公”思想的先行者，随后在 2011 年他们就推出了自己的操作系统（ChromeOS）。

#### MobileMe

Apple 在 WWDC 2008 尝试推出了 iPhone、Mac、Web 同步的一体化平台 MobileMe，它提供邮件、通讯录、日历、iDisk（网盘）等功能。

![](https://image.stephenfang.me/BuiltInApps/WWDC2008.jpeg)

这款设计精良的网络应用在上线初期灾难频发（同步丢失、登录失败、界面卡顿），被媒体称为“Apple 少见的败笔”，Steve Jobs 为此在内部大发雷霆，并亲自重组团队，最终推动了 iCloud（2011） 的重建计划。

#### SkyDrive

微软对于云端的布局也是很早就开始了，SkyDrive 是微软在 2007 年推出的免费云存储服务，用户可以通过网页上传下载文件，后续也加入了桌面同步工具，和 Microsoft Office 做了深度集成, 并在 2011年之后逐步内嵌进 Windows 系统。如果你在那个时代用过用过 Surface，应该会对这个应用程序有印象。

![](https://image.stephenfang.me/BuiltInApps/Surface.png)

只不过 SkyDrive 的更名并非微软改名部的自娱自乐，在 2013 年英国法院裁定微软侵犯了英国天空广播公司（BSkyB） Sky 品牌的商标权，要求停止使用 “SkyDrive” 名称。于是微软决定将其更名为 OneDrive，更突出其“一体化”（One）概念，也有“统一存储你所有文件”的意思。

## 移动设备互联网时代

进入 2010 年代，智能手机的爆发与移动互联网普及，彻底改变了操作系统内置应用的角色与形态。在 iOS 与 Android 的主导下，内置应用开始迈向“服务平台”与“生态接口”的新时代。

### 内置应用从“本地工具”进化为“系统服务”

进入 2010 年代后，用户不再满足于“本地设备拥有数据”，而是希望在手机、平板、电脑之间无缝切换。这一趋势推动各大系统厂商将“账号 + 云服务”视为操作系统核心功能，从文件同步、设置恢复，扩展到照片、联系人、消息甚至剪贴板。

![](https://image.stephenfang.me/BuiltInApps/Continuity.png)

几大平台的云同步战略：

- iCloud：Apple 将备忘录、日历、邮件、Safari、照片、钥匙串等系统级 App 接入云端，首次实现 macOS、iOS、iPadOS 之间的无缝同步。
- Google Account：Android 设备开机绑定 Google 账号，自动同步 Gmail、Calendar、Keep、Contacts、Chrome 数据，甚至 Google Photos 的无限图像备份也一度成为杀手级卖点。
- Windows：整合 OneDrive 与 Office Online，实现跨设备文档、桌面配置、浏览器收藏夹同步。Microsoft Account 也成为 Xbox、Edge、Microsoft 365 的通用凭证。
- 小米账号（Mi Account）：支持短信、通话记录、照片、便签、录音、浏览器书签同步，MIUI 也提供一键换机与云端数据恢复功能。
- 华为账号（HMS Core）：替代 Google 服务的同时，也构建了联系人、日历、便签、云空间（Huawei Cloud）、钱包等全面服务。
- OPPO/realme/vivo 账号体系：构建相册云备份、云便签、查找设备等能力，尤其在国内生态中强化品牌粘性与数据留存。
- 三星账号（Samsung Account）：实现 Galaxy 设备之间的 Samsung Notes、Samsung Cloud、智能切换等功能，在全球范围内作为补充 Google 同步的手段。

这些账号系统不仅提供“同步”，更强化了“用户绑定”，同时云同步也带来了用户意识的转变：人们开始以“账号”为核心认知设备，而不是“硬件本身”。手机不再唯一，而数据才是核心。系统厂商在其中掌握着主导权，因为账号数据绑定增强了用户粘性，厂商从“硬件提供者”转变为“服务运营者”。

![](https://image.stephenfang.me/BuiltInApps/Hyper.png)

最重要的是，跨设备体验成为卖点：从 Handoff（Apple）到 HyperConnect（小米）、Phone Link（Windows），Chromebook 直接调用 Android 应用或接力任务，云服务推动设备间协同操作成为常态。各个生态之间的壁垒在 2025 年的放下也在被逐步打通。

### 预装应用走向“服务化”与“智能化”

预装应用已不再是单纯的图标和界面，而是系统能力的延伸，甚至以“无形”的方式嵌入操作体验中。这些预装应用与系统的智能功能强绑定，如语音输入、OCR、图像识别、自动整理等，模糊了“App”和“平台能力”的边界。可以说应用正在消融为“能力”，系统体验本身就是应用体验。

例如，Apple 的备忘录不再只是本地记事本，而是一个云端存储、同步、协作的入口，还包含了文档扫描、数字签名、绘图、手写计算等功能；Apple Music、Google Photos 具备订阅、AI分类、云端备份等完整的内容服务能力。除此之外，几乎所有的操作系统系统搜索（如Spotlight）可直接调用应用数据（如照片、提醒事项、备忘录），用户无需手动进入 App，这大大提升了操作效率。

![](https://image.stephenfang.me/BuiltInApps/AppleAI.jpg)

随着 AI 技术的快速演进，内置应用已经不再只是“界面上的图标”，它们越来越嵌入系统底层、转化为隐形但常驻的“能力”。例如 Siri、Google Assistant、Windows Copilot 能用自然语言语音调用几乎所有系统功能，打破“打开 App → 执行操作”的传统交互路径。后台分析、自动分类、信息预填等机制让用户甚至不再察觉“哪个 App 在工作”。

![](https://image.stephenfang.me/BuiltInApps/Copilot.png)

与此同时，许多传统 App 被 AI 技术重新改造，例如 Apple 备忘录引入智能整理、自动图文识别、手写识别等功能，iCloud、Google Photos 等诸多照片服务能够提供人物聚类、物品搜索、自动分类，Windows Paint在 2023 年开始加入生成式图像能力（DALL·E），Apple 也正在推出图乐园这样的绘图工具 。这种趋势将内置应用从“被动工具”推向“主动协作伙伴”，与用户更自然地协作。

![](https://image.stephenfang.me/BuiltInApps/Creator.png)

## 未来展望：AI 驱动的新预装应用模式

随着 AI、大模型与云平台的不断演进，操作系统中的“内置应用”正发生深刻变化。未来的操作系统可能围绕 AI 重新设计一系列默认应用，甚至让传统 GUI 退居二线。从图标入口到无界能力，它们不再只是预装软件，而是操作系统体验的一部分，甚至成为构成“数字人格”的重要接口。

曾经的内置应用，是图标，是功能集合。而未来，它们将是系统能力的延伸，是你数字人格的投影，是 AI、云与设备协同的基础结构。我们可以大胆畅想一个无图标、无边界、按需组合的操作系统世界。

### 应用界面的“消融”：AI 融入操作系统上下文

AI 正在重塑我们与系统交互的方式，传统 App 图标正被“语义化指令”与“场景触发”所取代：

- 对话即操作：也许你将不再打开提醒事项，而是直接说“记下明天 9 点开会”，系统便能理解并生成提醒、日历事件、甚至邮件草稿。Apple 在WWDC 24 上承诺的屏幕感知是能够实现这一点的，但是从最近的新闻以及2025年的当下来看更多的是一种画饼。
- 多模态感知：你拍下一张菜肴照片，AI 自动识别食材、生成食谱、链接至购物 App，整个过程无需手动操作。甚至前几步 ChatGPT 已经能帮我们做到了，而 MCP 这些的协议的出现能够让这些体验更具备实现的可能。
- AI 助理成为聚合器：Copilot、Siri、Gemini 等将成为新一代“入口”，后台调用日历、文件、备忘录等能力模块，真正实现“能力即服务”。显然目前 ChatGPT 还不具备系统层级的能力，假设给予了系统级大模型更强的权限，AI 助理的想象空间也会更加大。

内置应用正在从“前台应用”转变为“后台能力”，不再以界面呈现，而是被深度嵌入在操作系统的日常语境之中。

### 系统形态的“无界”：内置应用走向人格化与云端化

未来的操作系统将以“用户为核心”进行重构，内置应用随用户身份而生，不再绑定设备，而托管于云端。

- 风格化操作系统：用户的文档、设置、界面风格、对话历史被封装为可迁移的“数字壳层”。当前从某个设备迁移到新的设备，所有的设置习惯都能够恢复，操作系统厂商们也在着力于提供更多的系统级别的个性化选项。例如个性化壁纸、图标等等。
- 系统无边界切换：在 Apple 生态下 从 iPhone 到 iPad，再到 Vision Pro，用户状态与任务进度自动同步，无缝衔接。在安卓的其他生态下也是如此，许多安卓厂商还在着力“强行兼容” Apple 生态。

每个人的“操作系统”将变成高度个性化的“数字操作习惯体”，内置应用不再统一，而是“因人而异、按需而现”。

### 安全与隐私：从后台策略走向前台体验

当 AI 与云端成为系统底层结构，用户对数据的控制权与透明度要求也水涨船高，隐私保护将成为内置应用的核心竞争力：

- 系统级隐私策略演进：Apple 的 App 追踪透明度（ATT）、邮件隐私保护，Google 的沙盒与权限分级，皆已深入多个系统级默认应用。
- 法规推动透明化：iOS 10 起允许删除部分内置 App，Android 开放默认应用替换；欧盟、印度等对预装行为加强监管。
- “零信任架构”内建应用：未来系统将强化权限颗粒度、本地优先计算、数据处理可视化，提升用户的安全信任感。

内置应用将不再是“不可替代的特权”，而是在功能、整合体验与隐私保护中体现系统厂商的价值观。

## 结语

从命令行时代的 vi 与 COMMAND.COM，到 GUI 时代的 画图应用与文件管理器，再到今天的 Siri、Copilot 与 iCloud，操作系统的内置应用始终陪伴着计算体验的进化。

它们不仅见证了用户界面的演变，更参与了“计算机由工具转向生活方式”的过程。未来，随着 AI、云计算和个性化系统的发展，内置应用也将不再是“默认值”，而是可重构、智能协作的“能力容器”。

在这个意义上，操作系统内置应用的历史，其实就是我们与计算世界互动方式的演变史。我们不会再关注哪一个 App 是系统内置的，因为我们所使用的每一个场景、每一次交互，都将由一个模糊而智能的系统层帮我们调度、聚合、反应。内置应用的终极形式，可能是“无形之中”。

与此同时，操作系统内置应用的演变更是体验了用户习惯、商业模式和监管环境的共同作用。我们可以看到操作系统正变得更加“以用户为中心”，但与此同时，软件生态的控制权也正在经历新的博弈。

未来的内置应用是否会完全被 AI 代理所取代？还是会迎来新的形态？让我们拭目以待。

## 参考链接

- Apple iLife 套件简史（Wikipedia）：https://en.wikipedia.org/wiki/ILife
- COMMAND.COM 介绍（Wikipedia）：https://en.wikipedia.org/wiki/COMMAND.COM
- MS-DOS EDIT 编辑器（Wikipedia）：https://en.wikipedia.org/wiki/MS-DOS_Editor
- Windows CHKDSK 命令文档（Microsoft Learn）：https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/chkdsk?tabs=event-viewer
- Internet Explorer 4.0 历史档案（Internet Archive）：https://archive.org/details/microsoft-internet-explorer-4.0
- Windows Media Player 历史（Wikipedia）：https://en.wikipedia.org/wiki/Windows_Media_Player
- Mini vMac 官网：https://www.gryphel.com/c/minivmac/
- DOSBox 官网：https://www.dosbox.com/
- RetroMuseum（复古电脑博物馆）：https://www.retromuseum.org/
- Google Docs 历史（Wikipedia）：https://en.wikipedia.org/wiki/Google_Docs
- ChromeOS 历史与定位（Wikipedia）：https://en.wikipedia.org/wiki/ChromeOS
- Apple MobileMe 历史事件回顾：https://en.wikipedia.org/wiki/MobileMe
- SkyDrive 更名为 OneDrive 的新闻（WIRED）：https://www.wired.com/story/microsoft-skydrive-onedrive/
