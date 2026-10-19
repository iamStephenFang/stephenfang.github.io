---
title: 装上 Fedora 的 Surface Pro：一台老设备的新可能
pubDatetime: 2026-07-21T07:00:00.000Z
categories:
  - 技术
tags:
  - Linux
  - Fedora
  - Surface
copyright: true
featured: true
description: 给 Surface Pro 5 安装上仍在积极更新的 Linux 发行版，它会成为一台更可用的设备吗？
---

**特别声明**

本文以人工形式完成了事实搜集、资料核查以及内容撰写，在完稿后使用了 GPT 5.5 模型进行了多个段落的润色，并且使用 GPT Image 2 绘制了 2 张配文图像。

笔者并不是 Linux 领域以及内核知识的专家，如果对内容有疑问和见解，欢迎派友在评论区留言沟通。

---

## 缘起

每个人折腾 Linux 的理由都不太一样，有的是为了学习系统原理，有的是为了搭建开发环境，也有人只是单纯希望体验不同的操作系统。

我这次折腾 Linux 的原因很简单：手头的 Surface Pro 5 已经是一台发布多年的设备，运行着 Windows 10 22H2 以及各种后台服务、浏览器和常用软件，在日常使用里已经能感觉到吃力。它对我来说是一台还能用、但很难让人重新产生兴趣的老设备。

直到我偶然刷到了 [linux-surface](https://github.com/linux-surface/linux-surface) 这个项目，又看到有博主把搭载了Linux 的设备长期使用。于是好奇**如果给这台 Surface Pro 5 安装上仍在积极更新的 Linux 发行版，它会成为一台更可用的设备吗**？

提到 Surface，大多数人的第一印象是微软用来展示 Windows 体验的硬件平台。很长一段时间里我也认为 Surface 只应该运行 Windows，就像 MacBook 应该运行 macOS 一样，这才是最搭配的组合。不过这种想法随着时间慢慢发生了变化。变化的也许并不是 Surface，而是 Linux 发行版。

![](https://image.stephenfang.me/FedoraOnSurface/flip.jpeg)

如果把时间往回推几年，我大概是不会考虑在 Surface 上安装 Linux 的。过去无论是桌面环境、Wayland，还是Linux 对 Surface 硬件的驱动支持，都还没有现在这么成熟。安装 Linux 并不困难，但想把它真正当作一台每天都会使用的电脑还有不少需要跨过的心理障碍。而这几年里，随着 Wayland 逐渐成熟、GNOME 持续完善触控体验，以及 linux-surface 项目的多年维护，Linux 对 Surface 的支持已经有了非常大的变化，越来越多的软件开始提供 Linux 支持，整个Linux 的桌面生态也比几年前成熟得多。

![](https://image.stephenfang.me/FedoraOnSurface/front.jpeg)

给 Surface 安装 Fedora 之后，我最明显的感受是这套硬件与系统之间确实存在某种契合。Surface 并不会在安装完成后立刻变成一台「完美的 Linux 平板」，这种契合更多体现在 GNOME 的交互逻辑与 Surface 硬件形态之间：触摸屏、可拆卸键盘、多工作区和手势操作，在一些场景下能够自然地配合起来，与此同时应用生态、驱动细节和系统稳定性等问题，也在不断提醒着我它的边界。

这次体验得到的结论并不是 Fedora 比 Windows 更适合 Surface，这套组合也不会成为所有人的最佳选择，我真正想分享的，是 Fedora 已经成熟到足以让一些旧设备重新变得好用。

## 为什么是 Fedora？

每个准备安装 Linux 的朋友都绕不开一个问题：到底应该选择哪一个发行版？

这个问题几乎没有标准答案。Linux 世界最大的魅力之一正是它提供了丰富的选择：有人偏爱稳定的长期支持版本，有人追求滚动更新带来的最新软件，也有人更看重社区文化、软件生态或者发行版背后的设计理念。对于不同的人来说，「最好用的 Linux 发行版」意味着完全不同的东西。因此在继续讨论之前我想先叠个甲：这并不是一篇发行版推荐文章，更不是一篇 Linux 发行版评测。

我选择 Fedora 并不意味着我认为 Ubuntu、Arch Linux、Debian 或 openSUSE 不够优秀。这些发行版都拥有成熟的社区和各自鲜明的特点，如果你的工作环境已经围绕某个发行版建立起来，那么继续使用它就是最好的选择，况且 linux-surface 同样提供了对这些主流发行版的支持。

![](https://image.stephenfang.me/FedoraOnSurface/support.png)

我调研的问题更具体一些：目标是一台使用多年的 Surface Pro 5，需要兼顾触控体验和日常开发，到底应该选择哪个发行版。毕竟 Surface 除了键盘和触控板之外，还有触摸屏、手写笔、高 DPI 屏幕以及可以随时拆卸的 Type Cover，比起软件包管理器、社区规模或者发行版的人气，我更关注这 几个实际问题：

- 默认桌面环境是否适合触控
- Wayland 是否足够成熟
- 新内核和新驱动能否及时跟进
- 社区是否已经积累了丰富的 Surface 使用经验

综合这些因素之后，Fedora Workstation 进入了我的视野。

Fedora Workstation （后统称 Fedora）通常会较早跟进新版 GNOME、Wayland 和 Linux 内核，它的每个版本大约维护 13 个月，更新节奏相对较快，能够更及时地跟进上游项目的变化。这种更新节奏的意义并不只是版本号刷新更快，例如 Wayland 会直接影响高 DPI 缩放、触控滚动、触控板手势、多屏显示和窗口动画等体验；GNOME 的持续更新则会带来系统设置、虚拟键盘、触控目标、工作区手势、截图录屏、在线账号和默认应用等方面的改进；内核更新的影响则更加底层，它关系到硬件识别、电源管理、休眠唤醒、蓝牙、Wi-Fi、触控板、手写笔以及其他设备驱动能否正常工作。

![](https://image.stephenfang.me/FedoraOnSurface/workstation.png)

很多发行版都提供 GNOME，但 Fedora Workstation 把 GNOME 当作默认体验来交付。GNOME 的 Activities 概览、工作区切换、较大的按钮和 Header Bar、系统搜索、触控板手势，都更接近一台二合一设备需要的交互方式。它长期以来采用不同于传统「开始菜单加任务栏」的桌面逻辑，并在后续版本中进一步强化了多工作区和手势驱动的使用方式。

这些优点对我的 Surface 改造来说尤其重要。Surface 在 Linux 上的支持需要由 Linux 主线内核、GNOME 生态以及 linux-surface 项目共同补齐，换句话说，选择 Fedora 的好处在于它把较新的桌面栈、较新的内核、GNOME 默认体验和 linux-surface 的维护方式放在了一条相对顺的路径上。虽然对于喜欢深度定制系统的人来说，Fedora 这种强调默认配置的体验未必符合他们的习惯，但对我而言，我更希望把时间放在真正的工作和使用上而非不停地调整系统本身，这也是我没有选择 Arch Linux 的原因。我更喜欢先获得一套完整的默认体验，再用少量扩展补齐个人习惯。对于长期使用 macOS 的我来说，这种方式反而更安心。

最后还是要说一句：Linux 桌面生态已经不像十几年前那样不同发行版之间有着很大差别。真正影响体验的往往是默认的软件栈、更新策略以及社区实践，所以 Fedora 并不是唯一正确的选择，本文中关于 linux-surface、以及使用体验的大部分讨论对于其他发行版都同样具有参考价值。

## 安装 Fedora 与 linux-surface

Fedora 近期推出了 44 版本。截至发稿前，linux-surface 支持的最新版本仍为 43，对应的内核版本是 6.19.8。如果你也最近也想在 Surface 上折腾 Fedora，建议优先下载 43 版本的操作系统镜像，或查阅项目最新的 Release 和安装文档。

如果你之前安装过 Fedora 或者其他 Linux 桌面版操作系统，那么在 Surface Pro 5 上安装也不会遇到什么特殊情况，即使是双系统也完全没问题。制作启动盘、进入 UEFI、调整启动设置和 Secure Boot 设置，再安装系统，这些步骤与一台普通 PC 基本一致。

![](https://image.stephenfang.me/FedoraOnSurface/install.png)

Fedora 的安装程序已经相当成熟，分区、用户设置和安装引导都比较清楚，即使没有太多 Linux 使用经验也能顺利完成。不过我建议安装完成后先不要急着创建开发环境，而是先完成 linux-surface 内核的安装。

很多第一次接触自定义内核的用户都会疑惑一个问题：Fedora 自带的内核难道不能直接使用吗？如果只是安装系统、连接 Wi-Fi、打开浏览器，Fedora 自带的主线内核已经能够完成这些基础工作，但 Surface 集成了触控屏、Surface Pen、Type Cover、电池管理等不少微软自己设计的硬件方案，而这些功能长期以来并没有全部进入 Linux 主线内核，这也就是 linux-surface 项目存在的意义。

linux-surface 围绕 Linux 内核维护了一系列面向 Surface 设备的补丁、驱动和配套软件包。官方推荐的安装方式是添加对应发行版的软件仓库，再通过系统包管理器安装和更新内核。整个过程大致可以分为五步：

1. 制作启动盘，进入 Surface UEFI，调整 USB 启动顺序
2. 根据情况决定是否保留 Secure Boot
3. 安装 Fedora，并先确认系统可以用 Fedora 默认内核正常启动
4. 添加 linux-surface 软件源，安装 linux-surface 提供的内核与配套软件包
5. 如果保留 Secure Boot，导入 linux-surface 提供的签名密钥，重启并确认已经进入带有 surface 标识的内核

![](https://image.stephenfang.me/FedoraOnSurface/kernel.png)

这里最容易误解的是 Secure Boot。Secure Boot 的作用是防止未经信任的引导程序或内核在启动阶段运行，linux-surface 内核属于社区维护的自定义内核，如果直接在开启 Secure Boot 的系统上启动，可能会因为签名不被信任而失败。linux-surface 提供了对应的证书和 Fedora 包，按照文档导入对应的 MOK 密钥后，系统便可以在启用 Secure Boot 的情况下验证并启动 linux-surface 内核。

![](https://image.stephenfang.me/FedoraOnSurface/secureboot.png)

不过不能把 linux-surface 理解成一个「装上就完整支持所有 Surface 功能」的项目。官方安装说明文档 [Feature Matrix](https://github.com/linux-surface/linux-surface/wiki/Supported-Devices-and-Features#feature-matrix) 已经明确列出了不同机型、不同硬件功能的支持状态，而且项目覆盖的也不只是 Surface Pro，还包括 Surface Book、Surface Laptop 等产品线。

![](https://image.stephenfang.me/FedoraOnSurface/matrix.png)

以 Surface Pro 5 这类较早的 Intel 机型为例，键盘、触控板、触摸屏、手写笔、Wi-Fi、蓝牙、电池状态和挂起等基础功能通常已经比较完整，这也是它相对适合安装 Linux 的原因。但到了更新的 Surface Pro、Surface Laptop Studio、ARM/Snapdragon 机型，或配有 LTE、特殊传感器等硬件的版本，支持情况就会复杂得多：有些功能依赖 linux-surface 内核，有些仍处于实验阶段，有些状态未知，还有一些暂时无法使用，例如相机功能就不像键盘、触控板和 Wi-Fi 那样可以期待安装完成后就能正常工作。Surface Pro 11 的 ARM 版本也不在 linux-surface 主项目的支持范围内。因此在安装之前务必先根据自己的具体型号查看项目说明页面。

安装结束后打开终端，确认系统当前运行的内核版本。如果能够看到带有 surface 标识的版本号，就说明已经进入 linux-surface 内核。

![](https://image.stephenfang.me/FedoraOnSurface/version.png)

到这一步才算完成了这台 Surface Pro 5 的基础环境配置：它运行的是标准 Fedora，同时拥有了一套针对 Surface 做过额外适配的内核，之后无论是系统更新还是软件安装，都可以继续使用 Fedora 原本的包管理方式，不需要维护一套特殊的系统环境。

## GNOME

安装完 Fedora 后我没有急着安装扩展或者把它改造成自己熟悉的样子，而是花了一段时间体验默认提供的 GNOME，试着理解它希望用户如何使用桌面。

在 Linux 世界里，GNOME 与 KDE Plasma 一直都是讨论最多的两个桌面环境。有人喜欢 KDE 丰富的自定义能力，也有人欣赏 GNOME 简洁统一的设计语言。两者之间的差异，与其说是谁更好，不如说是两种完全不同的产品思路：KDE Plasma 是一套高度自由的平台。任务栏放在哪里、开始菜单长什么样、窗口按钮如何排列、动画是否开启、主题如何搭配，几乎所有界面元素都可以按照自己的习惯重新组织；GNOME 则选择了另一个方向，它主动减少可调整的选项，希望通过统一的设计语言，让用户把注意力放在应用和任务本身。

![](https://image.stephenfang.me/FedoraOnSurface/window.png)

刚开始使用时，GNOME 很容易给人一种「限制很多」的感觉。它没有传统意义上的开始菜单，也没有一条始终占据屏幕底部的任务栏，很多操作都围绕 Activities 概览、搜索和工作区展开。对于习惯 Windows 或传统 Linux 桌面的人来说，这套逻辑一开始甚至会显得有些反直觉。但放到 Surface 这样的二合一设备上，我逐渐理解了这套设计的意义。

![](https://image.stephenfang.me/FedoraOnSurface/search.png)

很多时候我会把键盘拆下来，直接拿着 Surface 阅读文档、浏览网页或者查资料。这时候鼠标不再是主要输入方式，触摸、触控板手势和屏幕键盘开始变得重要。GNOME 本身也把这些交互当作系统导航的一部分：三指上滑打开 Activities 概览，三指左右滑动切换工作区，需要输入时，也可以从屏幕底部上滑呼出虚拟键盘。这些交互并不是 GNOME 专门为 Surface 设计的，却很适合需要在平板和笔记本两种形态之间不断切换的设备。

![](https://image.stephenfang.me/FedoraOnSurface/Gradia.png)

GNOME 生态下的应用也延续了这种触控友好的设计，它的 [Human Interface Guidelines](https://developer.gnome.org/hig/) 强调界面需要适配不同的指针设备，并考虑低精度操作场景；Header Bar 则把窗口标题、主要操作按钮和菜单集中在同一区域。实际使用时，这些尺寸更大的控件、更少的界面层级，以及相对集中的操作区域，用手指点击时往往比传统桌面应用里密集排列的小按钮更容易操作。不过在 Fedora 上一旦开始使用跨平台应用、Electron 应用或者一些移植程度不高的软件，这种一致性就会明显削弱。

![](https://image.stephenfang.me/FedoraOnSurface/Store.png)

当然，我最后也没有完全保持 GNOME 的默认状态。更准确地说，我是先用了一段时间默认 GNOME，确认自己能接受它的工作区、搜索和手势逻辑之后，才安装了少量扩展来补齐日常习惯。比如 Clipboard Indicator 提供剪贴板历史，Dash to Dock 让常用应用更接近 macOS Dock 的使用方式，Night Theme Switcher 自动切换深浅色主题，Vitals 可可以在顶栏显示处理器、内存和温度等系统状态，AppIndicator 则补上了一些传统托盘应用的入口……它们确实让 Fedora 用起来更接近我熟悉的 macOS，但并没有把 GNOME 改成另一个系统；它们让几个高频操作更顺手，并没有改变 GNOME 的基本使用逻辑。

![](https://image.stephenfang.me/FedoraOnSurface/extension.png)

我后来并没有继续尝试 KDE Plasma，倒不是因为 KDE 在 Surface 上一定不好。事实上 KDE 这些年对 Wayland 和触控也有不少进步，如果你的使用方式仍然以键盘和鼠标为主，同时希望拥有更丰富的自定义能力，Plasma 依然值得尝试。只是对我来说 Surface 最大的价值在于它不像一台传统笔记本，而 GNOME 默认的工作区逻辑、全局搜索、手势操作，以及相对偏向触控友好的应用设计，更接近我对这台设备的期待。

## 日常使用体验

在安装 Fedora 之后，我最关心的是它能不能承载我在 macOS 上已经形成的部分工作流：写代码、查资料、写文档、管理文件、远程连接服务器等等。

过去我对 Linux 桌面应用的印象并不算特别好，给我的感觉是「功能存在但体验一般」。界面风格不统一、缩放不一致、快捷键逻辑不同、配置散落在各个地方，这些问题让我感觉不是在使用一套完整的系统，而是在把不同来源的软件勉强拼凑在一起。

然而这次使用 Fedora 后，我对这种印象有了部分改观，很多基于 GTK 和 libadwaita 的应用虽然功能简单，但界面统一、响应自然、控件尺寸适合触控，非常适合 Surface。比如 GNOME Podcasts 这款应用，功能上无非是订阅、更新、播放和管理播客，但它轻量、直接、和谐。

![](https://image.stephenfang.me/FedoraOnSurface/Podcast.png)

这种感觉在文件管理上也很明显。在 macOS 上我每天都会用 Finder 管理项目文件，它的优势是与系统整合得非常深，隔空投送、标签、预览、iCloud 都是它体验的一部分。来到 Fedora 之后，GNOME 文件管理器已经足够完成基础文件管理任务，尽管不能完全复刻 Finder 的生态能力。无论是侧边栏、网格视图、列表视图、最近文件，还是挂载外部磁盘、访问网络位置这些常用功能都在，而且界面非常克制。更重要的是它和 GNOME 的整体风格高度一致，在 Surface 上用手指点选文件、打开菜单、拖动项目时，并不会出现传统桌面软件那种按钮太小、列表太密的问题。

![](https://image.stephenfang.me/FedoraOnSurface/Files.png)

文档和 PDF 阅读也是类似的体验。在 macOS 上我经常使用「预览」 App快速打开 PDF 文件、图片和截图，「预览」 App的优势是轻量、启动快、系统级集成。Fedora 上的文档查看器虽然没有「预览」 App那么多标注和编辑能力，但作为阅读工具已经足够可靠。它打开 PDF 很快，缩放流畅，配合 Surface 的 3:2 屏幕阅读电子书和技术文档非常舒服。

![](https://image.stephenfang.me/FedoraOnSurface/PDF.png)

写作场景则更有意思。在 macOS 上，我主要依赖 iA Writer、 MWeb Pro 以及一些 Markdown 编辑器完成文档工作，到了 Fedora 这部分软件几乎没有迁移成本，如 VS Code、Obsidian、Typora 都提供了官方 RPM 包。但我反而觉得 Fedora 上更值得一试的是一些 GNOME 风格的轻量写作应用，例如 [Apostrophe](https://apps.gnome.org/Apostrophe/)，一个非常纯粹的 Markdown 编辑器：界面干净、专注写作、支持预览，也符合 GNOME 一贯的克制设计。它未必能取代 iA Writer，但如果只是写一篇文章、修改几段 Markdown，它的体验也很舒服。

![](https://image.stephenfang.me/FedoraOnSurface/Apostrophe.png)

代码开发是 Linux 最容易让人放心的场景。在 macOS 上，我习惯使用 VS Code、Codex、Git、SSH、Homebrew、Docker 和各种命令行工具，迁移到 Fedora 后，许多命令行工具和开发环境都能直接通过包管理器配置，整个过程很自然。

VS Code 依然是我的主力编辑器，Git、Node.js、Python、Rust、Go 等开发工具和运行环境都可以直接通过系统包管理器安装。比较失望的是截至发稿时还不能在 Fedora 上原生安装 Codex Desktop，只能使用 Codex CLI 或者在 VS Code / Cursor 中以 IDE 扩展的形式来使用 Codex。

终端体验也值得单独说。macOS 上有 Terminal、iTerm2、Ghostty、Warp 等可供选择，在 Fedora 上同样可以使用 Ghostty 和 Warp，也可以使用 GNOME Console、Ptyxis等工具。如果只是 SSH、Git、运行脚本和管理项目，那么 GNOME Console 已经完全够用，如果你需要更强的配置能力，可以和我一样换成 Warp。

![](https://image.stephenfang.me/FedoraOnSurface/warp.png)

Fedora 上还推荐使用 Podman，它和 Docker 同样用于管理容器、镜像和 pod，但更强调不依赖常驻守护进程、以普通用户运行容器的工作方式，也更贴近 Red Hat 这一侧的容器生态。如果只是跑本地数据库、测试服务或者构建镜像，Podman 很多时候可以直接承担 Docker 的角色。对开发者来说，macOS 是一个非常优秀的 Unix-like 桌面系统，但 Linux 本身就是很多后端服务和开发工具真正运行的环境。

![](https://image.stephenfang.me/FedoraOnSurface/Podman.png)

RSS 阅读是另一个能体现差异的场景。macOS 上我习惯使用成熟、精致的 Reeder或者是老派、稳定的 NetNewsWire，在Fedora 上可以选择 [Newsflash](https://apps.gnome.org/NewsFlash/)，它不仅适用于本地数据，还可以配合已有的 Web RSS 服务使用：同步、搜索、过滤、标签、桌面通知这些功能都比较完整。它没有 Reeder 那种经过高度打磨的质感，但作为 GNOME/GTK 风格的 RSS 客户端，放在 Surface 上阅读文章整体体验比我预期要高。

![](https://image.stephenfang.me/FedoraOnSurface/RSS.png)

截图和图片处理方面，Fedora 默认的截图工具已经可以灵活完成区域截图、窗口截图和屏幕录制。如果需要编辑图片，可以使用传奇软件 [GIMP](https://www.gimp.org/)。它从 1990 年代中期一路发展到今天，名字来自 GNU Image Manipulation Program，长期承担着开源世界里「Photoshop 替代方案」的角色。我未必会用它承担专业设计工作，但一个从 1990 年代维护至今的自由软件项目，仍然能处理照片修饰、图像合成和格式转换等多种 Photoshop 上的高频任务，这件事本身就很能说明开源桌面软件的生命力。

![](https://image.stephenfang.me/FedoraOnSurface/GIMP.png)

浏览器就更不用担心了。无论在 macOS 还是 Fedora，浏览器都是现代工作流的核心。Chrome、Firefox 以及 Zen Browser 都可以在 Linux 上使用。对于我来说，大部分的工作都能被浏览器承载：查文档、使用 GitHub、阅读文章、管理云服务、写在线文档、访问 ChatGPT。只要浏览器体验稳定，系统之间的差异就会被大幅削弱。

单从应用设计角度，Fedora 上最让我感兴趣的是这批小而完整的 GNOME 应用，这些应用单独看都不复杂，但放在一起会形成一种很明确的系统气质。macOS 的系统应用胜在成熟、完整，并且与 Apple 生态绑定很深，但是Fedora/GNOME 没有这样的封闭生态，也很难在跨设备协同上与 macOS 正面竞争。于是 GNOME 用开源方式提供了一套相对统一的桌面应用体验，并且这套体验并不仅是「凑合能用」，还有一套相当明确的设计取向。

![](https://image.stephenfang.me/FedoraOnSurface/Weather.png)

Fedora 不一定拥有 macOS 那样完整的商业软件生态，但在开发、写作、阅读、文件管理、远程连接和一部分日常工具这些场景里它已经足够成熟。对我来说，这台 Surface Pro 5 也并不是用来取代 MacBook Pro，它首先是一台轻量、安静、便携、适合阅读和写作的设备，当我只是想写代码、查资料、阅读文档、连服务器或是整理笔记时，它大多数时候可以轻松完成这些工作。

## 谈谈问题

日常使用 Fedora 加上 Surface 这套组合也会遇到不少问题，这些问题通常不至于让系统完全无法使用，但是这些问题会时不时提醒你，这不是一台被厂商完整验证过的 Linux 设备。

第一类问题来自硬件和内核。Surface Pro 5 这类老款 Intel 设备在 linux-surface 的支持下，触控、Type Cover、电池状态、待机挂起等基础体验已经比较完整，但还是做不到像 Windows 下一样稳定（虽然 Windows 下也会遇到一些驱动问题）。偶尔还会遇到唤醒卡顿、屏幕旋转失效、网络状态更新不及时，或者系统升级后启动回默认内核等问题。大部分问题都能找到解决办法，但排查过程本身也说明，这终究是一套依赖社区维护的适配方案。

第二类问题是应用生态。Fedora/GNOME 最舒服的部分，往往是那些真正按照 GNOME 设计语言开发的应用；一旦使用了那些跨平台应用、Electron 应用、Qt 应用，体验就会明显变得参差不齐。窗口样式、文件选择器、深浅色主题、触控目标大小、滚动手感，都可能和系统本身定义的控件不完全一致。这些差异不一定影响完成任务，但会削弱那种「这是一套完整桌面系统」的感觉。更现实的是部分服务在 Linux 上根本没有同等质量的桌面客户端，比如 Apple Music 和 ChatGPT 都没有官方的 Linux 原生桌面客户端，只能依赖网页、PWA 或第三方封装应用程序。一些商业软件即便提供 Linux 版本，也往往不是厂商优先维护的平台。

软件安装方式也需要重新适应。Windows 和 macOS 用户通常习惯去官网或者应用商店下载一个安装包，而在 Linux 上，同一个软件可能同时存在 Fedora 官方仓库、Flatpak、AppImage、第三方仓库甚至手动安装脚本。我的经验是优先使用 Fedora 官方仓库，其次选择 Flatpak，确实没有其他方案时考虑第三方来源。这样做不一定能拿到最新版本，但后续维护会轻松很多。

还有一些痛点更难归类。比如某个应用偶发卡顿、崩溃，输入法偶尔异常，或者界面缩放出现问题，Flatpak 沙盒权限导致文件访问不顺等等。这些问题很难简单归因于 Fedora、GNOME、Wayland、Flatpak、驱动还是应用本身。

![](https://image.stephenfang.me/FedoraOnSurface/crash.png)

与其说 Fedora 能够解决 Linux 桌面的问题，不如说它把问题缩小到了一个可以接受的范围。你不再需要频繁修改配置文件、自己编译驱动，或者花大量时间修系统；但你仍然需要接受应用生态的空缺、跨平台应用的不一致、偶发稳定性问题，以及一些只能等待上游项目慢慢改进的细节，至于能否长期使用这套系统，最终取决于你是否愿意接受这些取舍。

## 总结

写到这里再回头看这台 Surface Pro 5，这篇文章并不是在证明 Fedora 比 Windows 更好，也不是在证明 Linux 已经可以超越 macOS，我是在记录一台已经发布多年的设备如何在新的软件环境里重新找到自己的位置。

Surface Pro 5 已经不是一台性能领先的设备，如果只看硬件参数，它很容易被归入「已经被淘汰」的旧设备。但安装和使用 Fedora 之后我反而觉得这样的评价并不完全公平，因为一台电脑的价值并不只来自硬件本身，也来自它还能承担什么样的工作。我每天花费时间最多的并不是大型桌面软件，而是在浏览器、终端、IDE 以及各种 Web 服务之间切换。对于这些工作来说，操作系统之间的差异，已经不像过去那样决定性，而 Linux 本身又是很多开发工具最自然的运行环境。

也正是在这种背景下，Fedora 开始显得适合我的这台 Surface。打开电脑，进入工作区，写代码、阅读文档，完成之后合上 Type Cover，这个过程让我想起很多年前第一次使用 Surface 时的新鲜感。只不过这一次陪伴它的不再是 Windows，而是 Fedora。偶尔遇到某个应用突然崩溃、某个服务只能使用浏览器，又或是某个操作的细节不像其他系统那样顺手时，我也会意识到这依然是一套需要取舍的方案。

如果让我继续在这台 Surface 上使用 Windows，我大概率会选择 Windows 10 LTSC。它足够稳定，预装组件和功能更新相对克制，对于这样一台旧设备来说，仍然是一种务实的选择。如果你的工作依赖 Office、Adobe 或者 Windows 独占的软件，那么 LTSC 依然是一种非常合理的选择。

![](https://image.stephenfang.me/FedoraOnSurface/crop.jpeg)

所以在 2026 年，一台 Surface Pro 5 还有没有继续使用的价值？我的答案是有，只是它不会扮演一台主力机的角色。它可以是一台阅读 PDF 文档的设备，可以是一台随身携带的瘦终端，也可以只是一个安静浏览网页、看看技术文章的平板电脑。它没有变得更强，也没有因为 Fedora 就突然变成理想设备，只是找到了一个相对适合自己的位置。

我们总希望通过升级硬件来获得更好的体验，却很少思考另一种可能：换一款操作系统、换一种工作方式，也许同样能让一台设备重新变得有用。

如果你已经拥有一台 Surface，或者正好有机会接触这样一台设备，我会建议你在有心理预期的前提下，花一个周末安装一次 Linux 认真体验几天。最后你可能仍然会回到 Windows，也可能只是把它当成一次短暂的折腾。但对我来说，这台原本已经很少开机的 Surface Pro 确实重新回到了书桌上。

## 参考链接

- [Linux On A Microsoft Surface in 2024 ...](https://www.youtube.com/watch?v=D_3ZSC6c-wQ&t=98s)
- [linux-surface](https://github.com/linux-surface/linux-surface)
- [GNOME Human Interface Guidelines](https://developer.gnome.org/hig/)
- [如何给surface pro7安装fedora linux并修复触屏](https://www.bilibili.com/video/BV1wCL6zgESC/?)
- [Apostrophe](https://apps.gnome.org/Apostrophe/)
- [Newsflash](https://apps.gnome.org/NewsFlash/)
- [GIMP](https://www.gimp.org/)
- [GIMP - Wikipedia](https://zh.wikipedia.org/zh-tw/GIMP)
