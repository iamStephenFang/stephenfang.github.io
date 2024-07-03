---
title: 将你的应用与 Apple Intelligence 集成 | WWDC24
pubDatetime: 2024-07-04 01:15:00
categories:
  - 技术
tags:
  - iOS
  - Siri
  - Apple Intelligence
  - Apple
  - WWDC
  - WWDC24
  - App Intent
  - SiriKit
  - Ferret-UI
  - LLM
  - AI
  - 深度学习
  - 计算机视觉
  - Assistant Schemas
copyright: true
featured: true
description: 2024年的 WWDC 压轴的就是由 LLM 赋能的 AI 能力，苹果甚至玩了个谐音梗将其命名为「[Apple Intelligence](https://developer.apple.com/apple-intelligence)」，它包括了文生图（Image Playground）、文生文（Writing Tools）、图生图（Clean Up tool）以及屏上感知等多项能力。其中文生图、文声文将作为系统级别的能力集成到iOS 18的组件中，本文想与你探讨的是如何让你的应用与这个“AI”更深度集成，这里不得不把目光转回Siri。
---

经过这几年 SwiftUI 的发展和推广，笔者已经很难再从「[What‘s New in UIKit](https://developer.apple.com/videos/play/wwdc2024/10118/)」中提炼出很多有价值的新内容，今年的 WWDC 给了我们一个新的方向，那就是AI。

2024年的 WWDC 压轴的就是由 LLM 赋能的 AI 能力，苹果甚至玩了个谐音梗将其命名为「[Apple Intelligence](https://developer.apple.com/apple-intelligence)」，它包括了文生图（Image Playground）、文生文（Writing Tools）、图生图（Clean Up tool）以及屏上感知等多项能力。其中文生图、文声文将作为系统级别的能力集成到iOS 18的组件中，例如 [《Get started with Writing Tools》](https://developer.apple.com/videos/play/wwdc2024/10168) 讲解了如何将写作工具适配给`UITextView`、`NSTextView`、`WKWebView`以及自定义的文本组件中，本文想与你探讨的是如何让你的应用与这个“AI”更深度集成，这里不得不把目光转回Siri。

![AI](https://image.stephenfang.me/mweb/AI.png)

Siri 以往给我们的感觉是笨笨的，让他回答一个设置闹钟之外的问题就会跳转到网页搜索结果，LLM的加持能够让 Siri 在智商上有所改观。在新的系统上，Siri的声音更自然，同时对话更加上下文相关、更具个性化，也更深入地融入系统，它第一次能够产生屏幕上所看到的事物的感知并能够理解并相应地采取行动。

本文接下来通过[《Bring your app to Siri》](https://developer.apple.com/videos/play/wwdc2024/10133/)这个session的内容结合一些其他信息，介绍关于如何使用 SiriKit 和 AppIntents将应用集成到新的 Siri 中，用语音和文本直接在设备上的任何位置进行交互。开发者可以利用跨多个 Domain 的预定义和预训练的 App Intent，不仅使 Siri 能够在应用程序中执行操作，还可以使App的操作在 Spotlight、Shortcuts、控制中心更容易被曝光，同时Siri 可以理解应用程序内的内容，并从系统中的任何位置向用户提供应用程序中的信息。

## 屏幕感知

Apple Intelligence 为 Siri 提供了屏幕感知能力，因此它可以理解屏幕上的内容并对其采取行动。例如朋友发来一条信息包含了新地址，你可以说“将此地址添加到他的联系人名片中”，新的Siri 能够处理这样的操作。

![OnScreen](https://image.stephenfang.me/mweb/OnScreen.png)

那么Siri是如何做到这一点的呢，从苹果最近发表的几篇论文就能够窥见一二。

### Ferret-UI

如果你一直在关注AI圈子，一定记得几个月之前苹果发表了一篇论文[Ferret-UI: Grounded Mobile UI Understanding with Multimodal LLMs](https://arxiv.org/abs/2404.05719) ，这篇论文介绍了一种名为Ferret-UI的MLLM（多模态大型语言模型），具有指代（Referring）、定位（Grounding）和推理能力，能够实现与UI元素的交互。通过引入“任意分辨率（Ferret-UI-anyres）”以放大细节，并利用增强的视觉特征，Ferret-UI 模型通过OCR和Widget分类预测来分析UI任务，展示了在处理小文本、文本之间关系以及部分截断文本等方面的优越性能，在基本UI任务的性能上超过GPT-4V。

#### 做什么

Ferret-UI 利用深度学习和计算机视觉技术，能够在详细描述和感知对话中讨论视觉元素，还可以在交互对话中提出面向目标的动作，并通过功能推理推断屏幕的整体功能。Ferret-UI 的核心能力包括：

1. **灵活输入识别**：支持点、框、涂鸦等多种输入方式，方便用户自然地与界面交互。
2. **Widget分类**：能够准确分类和识别界面中的各类Widget，例如按钮、输入框、图标等。
3. **图标识别**：通过高精度的图像识别技术，Ferret-UI 能够识别和区分各种应用图标。
4. **光学字符识别（OCR）**：能够有效提取界面中的文本信息，无论是静态文本还是动态文本。
5. **元素定位**：支持精确定位界面中的特定元素，如小部件、图标和文本，方便用户快速找到所需信息。
6. **功能推理**：通过对界面元素和布局的综合分析，推断出屏幕的整体功能，帮助用户理解和操作复杂的UI。

![FerretUI](https://image.stephenfang.me/mweb/FerretUI.png)

这些基础知识对于执行更高级的任务至关重要。具体来说，Ferret-UI不仅能够在详细描述和感知对话中讨论视觉元素，还可以在交互对话中提出面向目标的动作，并通过功能推理推断出屏幕的整体功能。

#### 怎么做

UI检测器输出所有检测到的元素，包含了每个元素的类型、文本和边界框。这些检测结果能够为基本任务创建训练样本。对于定位任务，所有检测到的元素会被用于创建一个Widget列表样本，而其他任务则一次专注于一个元素。将元素分为图标、文本和非图标/文本Widget三类。针对每种类型，都会创建一个指代样本和一个定位样本。
![SimpleTask](https://image.stephenfang.me/mweb/SimpleTask.png)

复杂任务中首先从检测输出中归一化边界框坐标，然后将检测、提示和可选的单次示例发送到 GPT-4。对于详细的描述和函数推理，将生成的响应结果与预先选择的提示配对，以训练 Ferret-UI。对于对话任务，直接将 GPT-4 输出转换为多回合对话。

![ComplexTask](https://image.stephenfang.me/mweb/ComplexTask.png)

论文的测试结果中，在简单任务上 Ferret-UI 胜出，然而复杂任务上Ferret-UI还是不如GPT-4V。苹果这一次的屏幕感知或多或少用上了这项技术的产出。
![Elementary](https://image.stephenfang.me/mweb/Elementary.png)

## Siri 开放历史

### SiriKit

苹果在 iOS10 开放了 SiriKit 接口给第三方应用，SiriKit 允许开发人员使用系统提供的 intents 来启用用户要求 Siri 执行的操作，例如播放音乐或发送文本消息。
![SiriKit](https://image.stephenfang.me/mweb/SiriKit.png)

在官方文档中，SiriKit 将对不同场景的语音支持划分为不同的 domain，SiriKit 支持的 domain 包括：列表、VoIP 电话、锻炼、通讯、转账等等，如果你的应用中包含有这些功能之一，就可以考虑将这些功能接入到 SiriKit。

实现 SiriKit 相关功能时，开发者并不需要真正对语音进行识别，语音的识别工作会由 Siri 完成。Siri 识别完语音后会将待完成的功能抽象成 intent 对象传递给app。由于 SiriKit存在一些历史问题，目前一些[domain已经废弃](https://developer.apple.com/support/deprecated-sirikit-intent-domains/);

### AppIntents

iOS 16 引入了新的框架 App Intents，可以用于将App与 Siri、Shortcuts、Spotlight 等集成。如果App 的能力不与上述提及的 SiriKit Domain重叠，可以使用 App Intents 来完成功能的集成。

WWDC24推出了[《Bring your app’s core features to users with App Intents》](https://developer.apple.com/videos/play/wwdc2024/10210/) 可供学习，有了这个框架，各个App之间的隔阂被打通，通过简单的指令就可以从一个App的某个核心功能接续到另一个App的某个核心功能上。

同时，WWDC24 新推出了 App Intent Domain，这是一组基于特定类型功能的 App Intents 的 API 集合，例如书籍、相机或电子表格。iOS 18 中将发布 12 个这样的 domain，每个domain都包括了广泛的经过训练和测试的新操作，今年 Siri 将获得对超过 100 种不同操作的支持。这一套组合能够更好地理解app 与 Siri 之间的交互，以更好地理解用户在设备上所做的事情，并为用户在应用程序中执行更多操作提供帮助。

![IntentDomain](https://image.stephenfang.me/mweb/IntentDomain.png)

假如有一款图像处理的App，可以使用 `setFilter` 这样的 intent 来实现应用一个设置滤镜的功能，Siri可以在你的应用程序内执行操作，即用户不仅可以通过语音命令直接控制图像处理功能，还能用文本输入的方式来完成图像的效果编辑，提高了操作的便捷性，同时由于 Siri 具备了上下文能力，通过实现撤销/重做功能以及其他编辑功能，可以实现动动口就完成图像编辑这件事，或许Siri还能够提供一些相关意见。

![Domain](https://image.stephenfang.me/mweb/Domain.png)

## 如何接入

App Intent Domain 需要通过`Assistant Schemas`构建。`Assistant Schemas`是指 Apple Intelligence 的基础模型，这些模型已经训练为期望具有特定 Shape 的intent。如果您构建了具有正确 Shape 的 App Intent，所需要做的就是编写一个`perform` 方法，让平台负责其余的工作而无需担心自然语言的复杂性。

![perform](https://image.stephenfang.me/mweb/perform.png)

`Assistant Schemas`流程可以简化为

1. **用户请求** - 用户的请求首先被路由到 Apple Intelligence 进行处理。
2. **模型处理** - 模型已经特别训练得可以理解`Assistant Schemas`，从而选择一个基于用户请求的`Assistant Schemas`。
3. **工具箱** - 工具箱包含所有应用程序的 App Intents，按照它们的`Assistant Schemas`分组。
4. **执行操作** - 通过调用您的 AppIntent 来执行操作。
5. **输出** - 结果呈现，输出返回。

![](https://image.stephenfang.me/mweb/17199378423904.jpg)

## 结论

通过将App集成到 Siri 中，可以让用户在设备上的任何位置使用 Siri 执行操作而无需打开App，同时当用户正在查看你的App时 Siri 也能够快速执行操作。如果你对App的适配感兴趣，可以接续学习[《Bring your app to Siri》](https://developer.apple.com/videos/play/wwdc2024/10133/)、[《Bring your app’s core features to users with App Intents》](https://developer.apple.com/videos/play/wwdc2024/10210/)以及[《What’s new in App Intents》](https://developer.apple.com/videos/play/wwdc2024/10134/)，原始链接中还包含了具体的Code Demo，笔者时间有限就不在这里赘述了。

「Apple Intelligence」作为一个今年秋季才能发布的期货，开发者还不能在目前的 Developer Beta 软件中体验到这些新功能，然而当前仍然可以在技术上前瞻一番。期待在秋季能够体验到新版本的Siri，以及看到无数开发者的新作品带来更紧密的AI结合。

## 引用

- [《Bring your app to Siri》](https://developer.apple.com/videos/play/wwdc2024/10133/)
- [《Bring your app’s core features to users with App Intents》](https://developer.apple.com/videos/play/wwdc2024/10210/)
- [《What’s new in App Intents》](https://developer.apple.com/videos/play/wwdc2024/10134/)
- [Ferret-UI: Grounded Mobile UI Understanding with Multimodal LLMs](https://arxiv.org/abs/2404.05719)
- [《Get started with Writing Tools》](https://developer.apple.com/videos/play/wwdc2024/10168)
- [Apple Intelligence 面面观](https://sspai.com/prime/story/apple-intelligence-the-making-of)
- [iOS10 SiriKit QQ 适配详解](https://juejin.cn/post/6844903446227730439?searchId=202406292343490B26FD52CAEFDC44091C)
- [Inside Ferret-UI: Apple’s Multimodal LLM for Mobile Screen Understanding](https://pub.towardsai.net/inside-ferret-ui-apples-multimodal-llm-for-mobile-screen-understanding-2289d696eba1)
