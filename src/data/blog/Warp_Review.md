---
title: Warp：GPT 赋能的终端体验
pubDatetime: 2023-03-04 16:40:00
categories:
  - 技术
tags:
  - Rust
  - Terminal
  - Mac
  - GPT
  - AI
  - 终端
  - Warp
copyright: true
description: Warp自称是“21世纪的终端”，这是一款基于Rust开发的原生终端应用，兼容主流的 zsh（默认）、bash 以及 fish，主打功能是块编辑以及 GPT 模型下的命令搜索，在最近受到了不少关注。
---

先说结论，终端作为程序员每天都需要使用的工具，[Warp](https://www.Warp.dev/) 在现阶段可能还不能替代你电脑上配置了花里胡哨主题又绑定了无数快捷键的终端，但作为一个新起的工具应用，它的功能和思路非常值得学习和借鉴。

<!--more-->

> 目前 Warp 仅适用于 Mac，正在开发 Windows 和 Linux 的版本。

## 接触

了解到这款终端是通过[DockHunt](https://www.dockhunt.com) 的 [Top 100 apps](https://www.dockhunt.com/apps)。在这个页面你可以看到全世界的 Mac 用户都在 Dock 上放置了什么 app，这个榜单或许并不具有代表性，但我们得以从这个榜单窥见喜欢折腾的用户都在重度使用什么 app。

作为老牌的原生终端应用，[iTerm 2](https://iterm2.com/) 在榜单上的位置在Warp 之前，这一点也不意外，相较于 Mac 原生的 Terminal，iTerm 2（后简写为iTerm） 提供了自动补全、全局下拉菜单、支持正则的搜索、多面板展示等无数值得称赞的功能。打开 iTerm 的控制面板，你会惊讶于这款终端有如此之多的可定制项，以及在 GitHub 上能够找到无数开箱即用的主题。并且作为一款开源应用，iTerm 这些功能都是免费的。如果你对 iTerm 的功能感兴趣，可以在官网提供的[列表](https://iterm2.com/features.html)一览它所提供的功能。

确切的说，是 Warp 的图标吸引了我，这类简约的图标设计风格让用户第一眼完全不知道应用的用途，很难说是不是一种好的趋势，相较之下， iTerm 的图标就易懂的多。

![icon](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2013.37.58.png)

值得一提的是，Warp在[Product Hunt](https://www.producthunt.com/products/Warp)上获得了2022年的最佳开发工具提名。上一次人们对终端工具如此感兴趣可能还是[Hyper](https://hyper.is/?ref=producthunt)的出现，尽管它是使用 Electron 框架开发的。在 Warp 的博客上他们不加掩饰地夸耀其与 Hyper 上在 vtebench 基准测试上的性能优势。

![Performance](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2015.32.39.png)

## 界面设计

Warp 的与众不同是你打开终端的那一刻就可以感受到的。命令输入区域被摆放在了终端的底部，顶部和所有现代终端一样都展示了 Tab，背景则提示了三个快捷键命令，分别是命令面板、命令检索以及快捷键一览。

![Home](http://image.stephenfang.me/mweb/CleanShot%202023-03-01%20at%2013.03.35.png)

你可以通过设置里的选项修改 Warp 的主题，它提供了日间以及夜间两套方案，每种方案都有多种配色方案供选择，并且额外提供了与系统同步（夜间模式）这一选项。作为一款给程序员用的产品，Warp 自然支持[自定义主题](https://docs.Warp.dev/appearance/custom-themes)，然而对于我我来说系统的默认主题足够简洁耐看。

![LightTheme](http://image.stephenfang.me/mweb/CleanShot%202023-03-02%20at%2001.17.50.png)

Warp 默认字体是开源的[Hack](https://github.com/source-foundry/Hack)，相比我之前在 iTerm 使用的 Panic Sans，这款字体具备了很好的区分度。如果你对终端字体感兴趣我推荐你阅读这篇[《程序员字体的自我修养》](https://zhuanlan.zhihu.com/p/89833093)。

除此之外，Warp终端还支持透明度调节。正如下图所见，Warp 的配置菜单非常简洁，用户能够根据自己的喜好实现字体和颜色的个性化定制。

![Preference](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2015.17.42.png)

同样的，Warp终端支持分屏，用户可以通过快捷键`Cmd+D`开启分屏，非常方便在不同的窗口中进行操作。

![Windows](http://image.stephenfang.me/mweb/CleanShot%202023-03-02%20at%2001.39.33.png)

## 功能特点

### 检索

在网络环境下使用``Ctrl+` `` 或者`#` 快捷键可以快速唤起A.I. 命令搜索，在输入框使用自然语言输入需要达成的目的并按下回车，由 [OpenAI Codex](https://openai.com/blog/openai-codex) 生成的结果就会立刻下达并等待用户的`Cmd+Enter `确认，免去了在 Stack Overflow 检索的步骤。

![AICommand](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2013.11.52.png)

Warp 还提供了 Workflows 面板方便用户迅速检索常用命令，对应的快捷键是 `Ctrl+Shift+R`，无论是小白还是大牛，这个功能都能够一定程度上帮助到用户。

![Workflows](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2013.14.58.png)

比较有心的是 Warp 还在键入推荐命令后给予了文档提示，可以理解为工具集成了常用的命令行文档。

![Prompt](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2013.16.26.png)

事实上，整个命令检索功能都被整合到了一个面板，使用快捷键 `Ctrl+R ` 就可以唤起，默认 Warp 会在 Workflows、历史以及A.I. 检索三个场景下进行命令搜索。

![Search](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2013.22.19.png)

### 命令面板

作为一名命令面板 (Command Palette) 的爱好者，我觉得给终端应用加上命令面板是一个很好的想法。毕竟你永远无法记住每一个快捷键，通过`Cmd+P`快捷唤起命令面板触发二级操作可以一步到位，省下不少导航的时间。

![Command](http://image.stephenfang.me/mweb/CleanShot%202023-03-02%20at%2001.44.35.png)

这项起源于 Sublime Text 的功能未来或许能够在更多的桌面 app 以及网页上见到，目前无论是Notion、Raycast、1Password 8、Visual Studio Code、Arc Browser、Linear、Spark Desktop 还是 Figma，对命令面板都有很好的支持。如果你对命令面板感兴趣可以继续阅读[这篇文章](https://capiche.com/e/consumer-dev-tools-command-palette).

### 块编辑

在 Warp 中执行命令，可以理解团队对终端的重新思考。块作为构成聚合了终端操作的原子单位，包含了`prompt`、`input command`、`output command`三个部分。

![Block](http://image.stephenfang.me/mweb/Block.png)

用户不再需要关注文本的操作，反之可以通过选择块单位快速实现命令的拷贝、重复输入、书签、分享等操作，并且这些操作也同样适用于 SSH 连接服务器。

![Block Selection](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2012.04.45.png)

如果你和我一样之前使用的终端是 iTerm，可能你也会抱怨 iTerm 甚至不能在更改输入命令的时候直接将光标移动到对应的位置进行删改。Warp 解决了这写痛点，你可以像一个文本编辑器一样在 Warp 中输入、修改和撤销命令，这可能是我最喜欢这个终端的一个地方。

如果你之前使用过更正错误命令的开源项目[thefuck](https://github.com/nvbn/thefuck)，Warp 直接在这个项目的基础上内建了命令纠错功能，并且这项功能是默认开启的。无论是拼写错误、权限缺失（chmod +x）还是 flag 缺失问题， Warp 都可以在错误的输入之后给予对应的提示。

![Fuck](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2012.28.07.png)

至于错误高亮、自动补全这些功能几乎是必备的功能，值得一提的 Warp 在补全候选键入的快捷键并非是`Tab` 而是 `Ctrl+F（Fill）`，

![Smart](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2012.36.16.png)

并且和[Fig插件](https://github.com/withfig/autocomplete)一样，Warp 给出了递进菜单来快捷补全命令，这对我来说这需要一些时间来适应。

![iTerm](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2012.37.32.png)

### 快捷键

丰富的快捷键组合能够让用户在使用 Warp 的时候使用一步完成的操作绝不用两步。你可以从[官方介绍](https://docs.warp.dev/features/keyboard-shortcuts) 找到绑定的快捷键列表，并且你也可以在 `Settings > Keyboard Shortcuts` 重新映射快捷键。

### 分享

使用块编辑可以实现永久链接代码片段的分享，我生成了一段
[demo代码](https://app.warp.dev/block/hb0p24pHlQCjNhps3d7W5W)可供访问。

![Share](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2013.55.03.png)

鉴于目前社交网络上代码片段分享的 App 和 Web 工具层出不穷，作为“21世纪的终端”具备这个功能实属必要。直接把链接粘贴到 Slack、Twitter、Notion、Telegram等平台能够实现预览，但有些遗憾，目前预览的大图都是固定的。

![Telegram](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2014.08.15.png)

### 其他功能

Warp 的[官方文档](https://docs.warp.dev/features/entry/workflows)提供了相当完善的功能描述，列举来说，前文没有提及的功能还有

- VSCode 和 JetBrains系 IDEs的整合
- 通知发送
- 全屏滚动
- Url快速选择和访问
- Voice Over支持

等等，Warp 放出了一份基于[terminal-testdrive.sh](https://gist.github.com/hellricer/e514d9615d02838244d8de74d0ab18b3)的[功能对比表格](https://docs.warp.dev/how-does-warp-compare/terminal-features)，可以找到你需要的 must-have 功能有没有缺失。

## 总结

### 存在问题

在体验这款终端的过程中，通过对比不同终端之间的功能区别,我对终端模拟器这类工具有了更多的了解，但目前来说，Warp 还存在着一些问题。

- 对 Vim 的支持不够，如果你对 Vim 有足够的肌肉记忆,重新熟悉一套新的快捷键成本过于高昂

- 连接 SSH 不支持 tmux，从 [GitHub 讨论](https://github.com/warpdotdev/Warp/discussions/501) 看影响了不少人的工作流

- 块的概念牺牲了屏幕可以显示的空间，即使是打开了「紧凑模式」

- 设计和体验并不是像是原生的应用，这一点会偶尔让我想念 iTerm。在启动速度上我感觉 Warp 会慢一些，尽管官方提供的[Benchmark 测试](https://docs.warp.dev/how-does-warp-compare/performance)特地强调了 Warp 的卓著执行性能与渲染性能

- 部分交互细节仍然需要打磨，至少不应该出现下面这样的交互问题

  ![Setting](http://image.stephenfang.me/mweb/CleanShot%202023-03-02%20at%2001.34.36.png)

- **Warp 至少在目前不是一款开源应用**，并且由于存在网络层的加密访问，出于安全的考量，Warp 可能会在一些公司被禁用

### 未来方向

从官网可以找到 Warp 正在准备推出一个类似 Jupyter NoteBook 的新功能，从 UI 和概念上看非常值得期待。就和 AI 搜索一样，这些巧思都是团队性格的体现。

![Notebook](http://image.stephenfang.me/mweb/CleanShot%202023-03-04%20at%2015.40.03.png)

Warp 会首先开源使用 Rust 写就的 UI 框架，而服务器部分将暂时保持闭源，在[这个帖子](https://github.com/warpdotdev/Warp/discussions/400)下团队详细解释了如何看待开源这件事情。

Rust 作为最近几年火起来的语言，在 Dropbox、Discord 等产品中都能见到它的身影，从Stack Overflow的[年度用户调查](https://insights.stackoverflow.com/survey) 中也可以看到越来越多的程序员想要学习这一门语言。

我个人非常好奇这个团队怎样利用 Rust 实现原生的用户界面，可能也有一些 AppKit 或者 SwiftUI 的代码，这些都得等开源的时候才能知道答案了。

### 理想的终端模拟器？

作为结尾，可以引出“理想的终端模拟器是怎样的”这个问题，答案可能有

- 全权个性化配置
- 强大的命令编辑
- 便捷的命令查询
- 迅速的命令访问
- 灵活的窗口操作

喊出自己是21世纪的终端还是需要一点底气的。作为一款新的工具类应用，Warp 可能很难满足所有人的需求，大刀阔斧的UI变更需要相当的学习成本，但换来的是开箱即用的配置、无需安装的插件功能以及未来的跨平台支持。

Warp 可以帮助用户更加高效地进行终端操作，它的简洁界面、实用功能和安全性都表现得非常出色。如果你还没有尝试过Warp终端不妨下载来试试。如果你对它的功能不满意，请再给他一些时间。

## 相关阅读

1. https://www.producthunt.com/products/Warp
2. https://matduggan.com/Warp-terminal-emulator-review/
3. https://zhuanlan.zhihu.com/p/89833093
4. https://docs.warp.dev/features/blocks
5. https://capiche.com/e/consumer-dev-tools-command-palette
6. https://www.warp.dev/blog/how-warp-works
7. https://yalantis.com/blog/rust-market-overview/
8. https://insights.stackoverflow.com/survey
