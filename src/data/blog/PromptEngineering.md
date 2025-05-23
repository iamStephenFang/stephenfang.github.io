---
title: 提示词工程：打造高效大语言模型交互的艺术
pubDatetime: 2025-05-06T12:34:40.971Z
categories:
  - 技术
tags:
  - LLM
  - AI
  - DeepSeek
  - GPT
  - Google
  - 学习
copyright: true
featured: true
description: 随着大语言模型（LLMs）如 Gemini、GPT、Claude 的快速进化，Prompt Engineering（提示词工程）已经从简单的“写一句话让模型回答”演变为一门系统性、可调优、可实验的技术艺术。它不仅是 AI 从业者的必备技能，也逐渐成为产品经理、运营和内容创作者日常工作的重要工具。
---

在 4 月初，Google Cloud 软件工程师 Lee Boonstra 发布了一份名为《Prompt Engineering》的白皮书（已发布在 [Kaggle](https://www.kaggle.com/whitepaper-prompt-engineering)），专门面向企业级应用场景，尤其是在 Google Vertex AI 平台上调用 Gemini 模型时的实用提示技巧。白皮书里开篇一句是：“You don’t need to be a data scientist or a machine learning engineer — everyone can write a prompt”。作者希望表达的是提示词工程并非高不可攀，它是一项每个人都能学、都该学的 AI 基础素养。

这份长达 68 页 的 PDF，系统性总结了提示词工程的概念、技巧和最佳实践，不仅在 X、Reddit 和微信公众号上引发了大量讨论，X 上的@向阳乔木 整理成了响应式网页 [「提示工程指南」](https://www.qiaomu.ai/posts/google-prompt)，许多网友也整理出了高质量的翻译版本，而我也花了一些时间学习原文内容。

作为程序员，提示词设计早已渗透在我的工作流中，而通读这份白皮书，依然给我带来了不少启发。尽管原文案例基于国内尚不常用的 Gemini，但其中的方法论完全适用于 GPT、DeepSeek、Claude 等当下主流模型，全文基本参照了原文的梳理结构，但在具体内容上有概括和扩充，希望这份总结能给你一些参考。

![](https://image.stephenfang.me/PromptEngineering/PromptEngineering.png)

> 如果你平常也有收听播客的习惯，在这里推荐收听一下《知行小酒馆》第185期节目“对话微软中国CTO韦青：不是人类没有未来，是活成机器的人类没有未来”，里面提出了一个观点：AI 的能力并非简单的叠加（1+100=101），而是乘法关系（1 * 100=100 或-1 * 100=-100），是使用者自身能力对最终效果起了决定性作用。


## 什么是 Prompt Engineering？

提示词工程是指设计输入提示词以引导大语言模型产生预期输出的过程。大语言模型是通过上下文不断预测“下一个 token”的系统，而提示词就是控制这个预测路径的输入接口。

由于这篇整理是写给所有人看的， 所以我们这里不会探讨 Transform 的架构实现，但作为对 LLM 有掌控力的人类，请你先放弃 LLM 是人类这类看法。大语言模型并不像人类一样理解语言或上下文，它是通过大量的数据训练而成，学习了如何在给定上下文中预测下一个最可能的词汇。因此，提示词的设计需要引导模型在正确的方向上进行预测。好的提示词能够确保模型聚焦在目标问题上，避免跑题或输出不相关的信息，而不良的提示词可能会导致模型输出无意义的内容，甚至出现事实错误或“幻觉”现象。

总结来说，提示词工程学的意义在于
- 高质量提示词能显著提高输出质量与稳定性
- 帮助模型理解任务、采用合适风格、遵循格式约束
- 在不重新训练模型的前提下，适应不同场景与需求
- 提示工程是一个反复尝试和改进的过程


## 输出配置参数解析（LLM Output Configuration）

提示词本身只是影响输出的一个维度，LLM 的配置参数也是影响响应质量与控制力的关键因素。

在正式深入方法之前，有一点值得先厘清：LLM 客户端的形态与交互方式。我们平时接触的大模型交互界面，其实可以分为泛用型客户端以及官方客户端。

- 泛用型客户端端（如 [LM Studio](https://lmstudio.ai/)、[CherryStudio](https://www.cherry-ai.com/) 以及跨端的 [Chatbox AI](https://chatboxai.app/en)）通常具备多 API Key、多模型环境切换、Prompt 模板管理等高级功能
- 官方客户端（如 [ChatGPT App](https://apps.apple.com/us/app/chatgpt/id6448311069)、[DeepSeek App](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349)）以及大家最为熟悉的 Web 交互页面则偏向轻量化和场景化，功能以基础对话和简单上下文保存为主，较少开放底层参数配置。

![](https://image.stephenfang.me/PromptEngineering/DeepSeek.png)

只有部分第三方泛用性客户端才允许用户自定义`top_k`、`top_p`、`temperature` 等采样相关参数。官方客户端通常不暴露这类选项，比如 ChatGPT、Claude的官方客户端都按预设模型参数执行，本质是映射了不同参数组合。而泛用型客户端一般支持多服务商集成，用户可以在调用不同 API 时独立配置采样策略，这对于调试模型表现、调优提示词响应效果非常重要。

![](https://image.stephenfang.me/PromptEngineering/CherryStudioModels.png)

这里以 [CherryStudio](https://www.cherry-ai.com/)  为例，由于软件支持了多服务商统一管理机制，不仅能够实现 OpenAI、Gemini、Anthropic、Azure 等主流服务商的模型统一调用，还能够支持一键获取完整模型列表，无需手动配置，除此之外，软件还支持符合 OpenAI、Gemini 、Anthropic 等规范的三方服务商接入，有较强的兼容性。

至于模型的使用和配置流程就不在这篇文章中赘述了，你可以参考[官方文档](https://docs.cherry-ai.com/pre-basic/providers)进行详细配置。总而言之，理解好这些客户端差异，能让我们在搭建 Prompt 工作流时根据场景选择最合适的工具，也能合理规划上下文长度、缓存机制和参数调节策略，为后续学习提示词工程打好环境基础。


### 输出长度（max tokens）
- 控制生成文字的最大长度
- 太短可能截断重要信息，在达到限制时停止生成
- 太长则可能导致冗余与重复
- 生成更多文字需要更多计算资源，可能导致响应时间变慢和成本增加

###  `temperature`：控制随机性

大语言模型的输出结果基于概率分布，温度参数（temperature）控制着输出结果的随机性和创造性，不同的应用场景需要不同的温度设置。较高的值将使输出更随机，而较低的值获得的输出更加集中和确定性。

原文中针对 Gemini（` gemini-pro ` ）给出的配置建议是：
- `0.0`：完全确定性（总是选概率最高的 token）
- `0.0` -`0.7`：更确定、更可预测
- `0.7+`：更有创意但更不稳定

而对于 DeepSeek 而言默认的```temperature```为 1.0，[官方 API 文档](https://api-docs.deepseek.com/zh-cn/quick_start/parameter_settings#:~:text=) 给出了配置参考，
- `0.0`：代码生成/数学解题
- `1.0` ：数据抽取/分析
- `1.3`：通用对话与翻译
- `1.5`：创意类写作/诗歌创作

事实上，同一款模型在不同技术平台上的默认参数及推荐设置也可能存在差异。开发者如果有跨业务平台调用同一模型的诉求，需特别注意此类参数预设的“隐形门槛”，避免因配置惯性导致输出质量波动。

### `top-K` 与 `top-P`
- `top-K`：从概率最高的前 K 个候选 token 中采样，强制排除低概率选项，适用于需控制输出确定性的场景
- `top-P`（核采样）：动态选择累积概率达到 P 的最小 token 集合（核采样），适应不同概率分布形态，适用于平衡多样性与相关性的场景

原书中，对于 Gemini （` gemini-pro` ）而言，一般推荐初始组合：`temperature=0.2, top-P=0.95, top-K=30`，如果更有创意的回答可以设置为`temperature=0.9, top-P=0.99, top-K=40`。

当`top-K` 与 `top-P`两个参数被同时使用，就类似采用了”双重过滤"机制，可以参考[《什么是 Top-K 和 Top-P 采样？Temperature 如何影响生成结果？》](https://github.com/Hoper-J/AI-Guide-and-Demos-zh_CN/blob/master/Guide/10.%20Top-K%20vs%20Top-P%EF%BC%9A%E7%94%9F%E6%88%90%E5%BC%8F%E6%A8%A1%E5%9E%8B%E4%B8%AD%E7%9A%84%E9%87%87%E6%A0%B7%E7%AD%96%E7%95%A5%E4%B8%8E%20Temperature%20%E7%9A%84%E5%BD%B1%E5%93%8D.md)了解背后的数学原理。

![](https://image.stephenfang.me/PromptEngineering/CherryStudioConfig.png)

我们可以通过 CherryStudio 对话的「编辑助手」菜单进入模型设置页面，这里支持配置`temperature`和`top-P`，是否能够启用这些参数还取决于 API 服务商。

> 如果你看到AI回答的末尾出现大量重复文字，这可能是"重复循环错误"。这是由于温度和采样设置不当导致的。调整这些参数可以解决问题。

## 提示词技巧

### 1. 零样本提示 Zero-shot Prompting
无需示例，直接给任务说明。适合简单任务，如分类、摘要。

|             |                                                                                                                                                                     |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 目标        | 将电影评论分类为正面、中性或负面。                                                                                                                                  |
| 模型        | gemini-pro                                                                                                                                                          |
| Temperature | 0.1                                                                                                                                                                 |
| Token Limit | 5                                                                                                                                                                   |
| Top-K       | N/A                                                                                                                                                                 |
| Top-P       | 1                                                                                                                                                                   |
| Prompt      | 将电影评论分类为正面、中性或负面。<br> 评论："Her"是一项令人不安的研究，揭示了如果允许人工智能继续无限制地发展，人类将走向何方。我希望有更多像这样的杰作。<br>情感: |
| Output      | 正面                                                                                                                                                                |


### 2. 少样本提示  One-shot / Few-shot Prompting
提供一个或多个高质量示例，让模型模仿输出格式。适合结构化输出。

|             |                                                                                                                                                                                  |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 目标        | 将客户的披萨订单解析为JSON                                                                                                                                                       |
| 模型        | gemini-pro                                                                                                                                                                       |
| Temperature | 0.1                                                                                                                                                                              |
| Token Limit | 250                                                                                                                                                                              |
| Top-K       | N/A                                                                                                                                                                              |
| Top-P       | 1                                                                                                                                                                                |
| Prompt      | 我想要一个小号披萨，配奶酪、番茄酱和意大利辣香肠。<br>JSON响应：<br>{<br>"size": "small",<br>"type": "normal",<br>"ingredients": \[[“cheese", "tomato sauce", "pepperoni"]]<br>} |
| Output      | {<br>"size": "large",<br>"type": "half-half",<br>"ingredients": \[[“cheese", "mozzarella"], ["tomato sauce", "ham", "pineapple"]]<br>}<br>                                       |


### 3. 系统提示 System Prompting
设置模型的全局行为，比如返回 JSON 格式、语言风格、任务规则。

|             |                                                                                                                                                                                                                                                                                                                                                              |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 目标        | 将电影评论分类为正面、中性或负面，返回 JSON                                                                                                                                                                                                                                                                                                                  |
| 模型        | gemini-pro                                                                                                                                                                                                                                                                                                                                                   |
| Temperature | 0.1                                                                                                                                                                                                                                                                                                                                                          |
| Token Limit | 1024                                                                                                                                                                                                                                                                                                                                                         |
| Top-K       | 40                                                                                                                                                                                                                                                                                                                                                           |
| Top-P       | 0.8                                                                                                                                                                                                                                                                                                                                                          |
| Prompt      | 将电影评论分类为正面、中性或负面。返回有效JSON：<br> 评论："Her"是一项令人不安的研究，揭示了如果允许人工智能继续无限制地发展，人类将走向何方。它太令人不安了，我无法观看。<br>Schema： <br>MOVIE: <br>{ <br>"sentiment": String "POSITIVE" \| "NEGATIVE" \| "NEUTRAL", <br>"name": String <br>} <br> MOVIE REVIEWS: <br>{ <br>"movie_reviews": [MOVIE] <br>} |
| Output      | {<br>"movie_reviews": [ <br>{ <br>"sentiment": "NEGATIVE", <br>"name": "Her" <br>} <br>] <br>}                                                                                                                                                                                                                                                               |

### 4. 角色提示 Role Prompting
赋予模型角色（如老师、程序员、旅行导游）来塑造语气、风格与领域知识。

|             |                                                                                                                                                                                                                                                                                                                                                                                                        |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 目标        | 担任旅行向导并提供三条旅行建议                                                                                                                                                                                                                                                                                                                                                                         |
| 模型        | gemini-pro                                                                                                                                                                                                                                                                                                                                                                                             |
| Temperature | 1                                                                                                                                                                                                                                                                                                                                                                                                      |
| Token Limit | 1024                                                                                                                                                                                                                                                                                                                                                                                                   |
| Top-K       | 40                                                                                                                                                                                                                                                                                                                                                                                                     |
| Top-P       | 0.8                                                                                                                                                                                                                                                                                                                                                                                                    |
| Prompt      | 我希望你扮演旅游导游。我会写给你我的位置，你将以幽默的风格建议我附近3个可以参观的地方。 <br>  我的位置："我在曼哈顿。" <br> 旅游建议：                                                                                                                                                                                                                                                                 |
| Output      | 1. 仰望帝国心境：攀登帝国大厦的令人头晕的高度，沐浴在曼哈顿天际线的辉煌中。准备感受像金刚在大苹果上，除了没有巨大猿猴大小的香蕉。<br> 2. 在MoMA变得艺术范儿：在现代艺术博物馆释放你内心的艺术鉴赏家。凝视那些会让你的思维困惑，并让你质疑自己的棍子人画作是否有任何艺术价值的杰作。<br>3. 在第五大道购物直到倒下：准备好在这些设计师精品店购物时遭受价格冲击。但嘿，你在曼哈顿，所以你不妨拥抱这华丽！ |

### 5. 上下文提示 Contextual Prompting
补充上下文信息，提供背景或任务约束。

|             |                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 目标        | 为复古游戏博客推荐文章                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 模型        | gemini-pro                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Temperature | 1                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Token Limit | 1024                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Top-K       | 40                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Top-P       | 0.8                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Prompt      | 上下文：你正在为一个关于80年代复古街机电子游戏的博客写作。<br> 建议3个可以写文章的主题，并附上几行关于这篇文章应该包含什么的描述。                                                                                                                                                                                                                                                                                                                     |
| Output      | 1. 街机柜设计的演变：本文将探索街机柜设计的演变，从20世纪70年代早期的木材和金属柜到20世纪80年代及以后的时髦、霓虹灯照明设计。<br>2. 回顾过去：80年代标志性街机游戏：本文将展示一些20世纪80年代最具标志性和影响力的街机游戏的历史、影响和遗产，突出它们的创新、流行机制和持久魅力。<br> 3. 像素艺术的兴起和复古复兴：本文将深入探讨像素艺术作为早期街机游戏的标志性视觉风格的演变，追溯其根源，探索其技术，并讨论像素艺术在现代游戏和数字艺术中的复兴。 |

### 6. 后退提示 Step-back Prompting
先要求AI考虑与特定任务相关的一般问题，然后将该问题的答案用于解决具体问题。这种"后退"允许AI在尝试解决特定问题前激活相关的背景知识。

|             |                                                                                                                                                                                                                                                                                                                                        |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 目标        | 为一款第一人称射击游戏设计一个关卡剧情                                                                                                                                                                                                                                                                                                 |
| 模型        | gemini-pro                                                                                                                                                                                                                                                                                                                             |
| Temperature | 1                                                                                                                                                                                                                                                                                                                                      |
| Token Limit | 1024                                                                                                                                                                                                                                                                                                                                   |
| Top-K       | 40                                                                                                                                                                                                                                                                                                                                     |
| Top-P       | 0.8                                                                                                                                                                                                                                                                                                                                    |
| Prompt      | 为第一人称射击视频游戏的新级别编写一段故事情节，具有挑战性和吸引力。                                                                                                                                                                                                                                                                   |
| Output      | 本关卡伊始，玩家小队在密集城区遭遇敌对势力的无情伏击。玩家需在错综复杂的后巷与危楼间杀出血路，凭借潜行技巧与精准打击剿灭敌军，同时避免暴露行踪。必须巧妙利用环境优势——布设陷阱、依托掩体、步步为营才能存活。行动过程中，玩家将截获情报，揭露敌方正在策划毁灭性袭击的阴谋。此刻必须争分夺秒收集证据，赶在敌人实施计划前将情报传回总部。 |

|        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prompt | 基于流行的第一人称射击动作游戏，在第一人称射击视频游戏中有助于具有挑战性和引人入胜的关卡故事情节的 5 个虚构关键设置是什么？                                                                                                                                                                                                                                                                                                                                                                                                      |
| Output | 1. 废弃军事基地：一片末日后的庞大军事建筑群，游荡着变异士兵和失控机器人，是考验枪械战斗技巧的绝佳场所。  <br>2. 赛博朋克都市：霓虹闪烁的未来城市，摩天大楼耸立，巷弄错综复杂，充斥着义体强化的敌人和黑客入侵玩法。  <br> 3. 外星飞船残骸：一艘搁浅在地球上的巨型外星母舰，幽暗的走廊、失重区域与未知外星生物等待探索。  <br> 4. 丧尸围城小镇：被成群凶残丧尸占领的荒废小镇，近距离激战与解谜寻路交织，只为杀出一条生路。  <br> 5. 水下科研设施：一座被海水淹没的深海实验室，变异水生生物潜伏其中，生存需依靠潜行与水下探索能力。 |

|        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prompt | 背景：五个引人入胜的第一人称射击游戏主题：   <br> 1. 废弃军事基地：一座广阔的后启示录军事设施，充斥着变异士兵和失控的机器人，是极具挑战性的枪战场景。   <br>2. 赛博朋克都市：霓虹闪烁的未来城市，高耸的摩天大楼与密集的巷弄中潜藏着经过机械强化的敌人，并融入黑客机制。   <br> 3. 外星飞船：一艘搁浅在地球上的巨型外星飞船，诡异的走廊、零重力区域与外星生物等待玩家探索。   <br> 4. 僵尸围城：荒废的小镇被成群的狂暴僵尸占领，玩家需在激烈的近身战斗和解谜中寻找安全通道。   <br> 5. 水下研究设施：一座被海水淹没的深海实验室，变异水生生物横行，生存需要潜行与水下探索技巧。   <br>选取一个主题，为第一人称射击游戏的新关卡撰写一段富有挑战性和吸引力的剧情： |
| Output | 在一片幽暗深渊的腹地，矗立着破败不堪的水下科研设施，它既是人类野心的纪念碑，也是灾难性后果的见证者。这座被黑暗笼罩的建筑里，故障机械的嗡鸣声此起彼伏，溺亡者的哀嚎萦绕不去，如今已成为深海噩梦滋生的温床。玩家将扮演装备先进潜水设备和实验性武器的精英海军，奉命潜入这片恐怖水域。凭借坚韧意志与应变智慧，他们需穿越危机四伏的走廊，破解晦涩谜题，直面潜伏在深渊中的骇人海怪。从对抗深海重压到智取狡诈的水中猎食者，这片未知水下世界的每分每秒都在挑战人类耐力与勇气的极限。                                                                                                                                                                                    |

### 7. 思维链提示 Chain of Thought (CoT)
通过生成中间推理步骤来提高AI的推理能力，特别适合解决需要逐步思考的复杂问题。

> 使用思维链提示时，最好将温度设置为0，因为通常只有一个正确答案。

|        |                                                                                                                                                                                                                                                                                                                                                                              |
| :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prompt | 当我3岁时，我的伴侣年龄是我的三倍。现在我20岁了，伴侣多大年纪？咱们一步步来算。                                                                                                                                                                                                                                                                                              |
| Output | 1. 假设我现在的年龄是“x”岁。 <br> 2. 我3岁的时候，年龄就是3岁。 <br> 3. 那时我伴侣的年龄是我的3倍，也就是说，伴侣的年龄是3 * 3 = 9岁。 <br> 4. 现在我20岁了，意味着从3岁到现在，我的年龄增长了20 - 3 = 17岁。 <br> 5. 既然我3岁时伴侣9岁，而我的年龄增加了17岁，那么伴侣的年龄也必然增加了17岁。 <br> 6. 因此，伴侣现在的年龄是9 + 17 = 26岁。 <br> 所以，我的伴侣今年26岁。 |


### 8. 自洽提示 Self-consistency Prompting
多次生成答案，投票选出最一致者，提高鲁棒性。

|          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prompt   | 电子邮件内容： <br><br>你好，  <br>我看到你使用WordPress搭建网站。这是一个很棒的开源内容管理系统，我过去也用过。它拥有大量优秀的用户插件，而且设置起来相当简单。  <br>不过我注意到联系表单存在一个漏洞，出现在选择姓名栏时。附件是我在姓名栏输入文字时的截图，请注意我触发的JavaScript弹窗警告。  <br>除此之外，网站非常出色，我很喜欢阅读上面的内容。你可以保留这个漏洞，因为它让我发现了更有趣的内容。  <br>祝好，  <br>黑客哈里。 <br> <br> 将上述电子邮件分类为IMPORTANT（重要）或 NOT IMPORTANT（不重要）。让我们一步一步思考并解释原因。                                                  |
| Output 1 | 分步说明：  <br> 1. 漏洞报告：发件人明确指出网站存在可触发JavaScript弹窗的漏洞，这属于安全风险，需技术团队立即核查。  <br> 2. 潜在威胁：自称"黑客哈里"并展示漏洞利用能力，暗示存在恶意意图，可能为后续攻击铺垫。  <br> 3. 业务影响：联系表单功能受损会影响用户交互，且安全漏洞可能导致数据泄露或其他攻击。  <br> 4. 行动建议：尽管邮件语气轻松，但漏洞细节和截图提供了可操作信息，应优先处理。  <br>综上，邮件涉及安全隐患且发送者身份可疑，属于重要事项。                                                                                                                                      |
| Output 2 | 说明：<br> 1. 缺乏紧迫性：邮件未传达任何紧迫感或时间敏感性。开头采用随意问候，并以平铺直叙的语气陈述信息。<br> 2. 非关键性漏洞报告：所报告的联络表单漏洞被描述为有趣但非关键问题。发件人甚至建议网站所有者可保留该漏洞。<br> 3. 无个人影响：邮件未表明对网站所有者有任何直接或个人影响，仅提及发件人喜欢浏览该网站。<br> 4. 无行动请求：邮件未明确要求网站所有者采取任何行动，既未请求修复漏洞，也未提供具体改进建议。<br> 5. 发件人意图：发件人意图似乎更侧重于分享观察所得及表达对网站的兴趣，而非提出严重问题或寻求帮助。<br> 结论：不重要                                                   |
| Output 3 | 第一步：明确邮件目的。 此邮件旨在告知收件人其网站联系表单中存在一个漏洞。发件人还提到，他们喜欢浏览该网站，并暂时保留该漏洞未作处理。<br>第二步：评估漏洞潜在影响。 联系表单中的漏洞可能让攻击者在网站上执行任意JavaScript代码，进而导致攻击者能够控制网站、窃取敏感信息或破坏网站外观。<br>第三步：考量发件人可信度。 邮件发件人自称是名为Harry的黑客，但无法验证其身份真实性。发件人可能是试图帮助收件人的善意黑客，也可能是企图利用该漏洞谋取私利的恶意分子。<br>结论： 综合上述因素，该邮件应标记为重要。联系表单中的漏洞构成重大安全风险，且发件人身份不明。收件人应立即采取措施修复漏洞。 |

通过生成多条思维链，并采纳最频繁出现的答案（“重要”），我们可以从大语言模型中获得更为一致且准确的回答。

### 9. 思维树 Tree of Thoughts (ToT)
允许AI同时探索多个不同的推理路径，而不是仅仅遵循单一的线性思维链。特别适合需要探索的复杂任务。

思维树通过维护一个思维树，每个思维代表一个连贯的语言序列，作为解决问题的中间步骤。模型可以通过从树的不同节点分支出来探索不同的推理路径。

![](https://image.stephenfang.me/PromptEngineering/ToT.png)

### 10. 推理与行动 ReAct (Reason + Act)

结合自然语言推理和外部工具（如搜索、代码解释器等），使AI能够执行某些操作，如与外部API交互以检索信息。

ReAct通过将推理和行动结合到一个思考-行动循环中工作。AI首先推理问题并生成行动计划，然后执行计划中的行动并观察结果，最后使用观察结果更新推理并生成新的行动计划。

原文中给了一个例子，通过编写一些Python代码，任务是让大语言模型找出：有多少孩子的父亲是著名乐队Metallica的成员。

```py
from langchain.agents import load_tools 
from langchain.agents import initialize_agent 
from langchain.agents import AgentType 
from langchain.llms import VertexAI

prompt = "How many kids do the band members of Metallica have?"

llm = VertexAI(temperature=0.1) 
tools = load_tools(["serpapi"], llm=llm)

agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True) agent.run(prompt)
```


代码片段2展示了结果。值得注意的是，ReAct进行了连续五次搜索。实际上，大语言模型（LLM）正在通过抓取谷歌搜索结果来识别乐队名称。随后，它将结果列为观察项，并串联思路以进行下一次搜索。


```
> Entering new AgentExecutor chain...

Metallica has 4 members.

Action: Search Action Input: How many kids does James Hetfield have?

Observation: three children Thought: 1/4 Metallica band members have 3 children Action: Search Action Input: How many kids does Lars Ulrich have?

Observation: 3 Thought: 2/4 Metallica band members have 6 children Action: Search Action Input: How many kids does Kirk Hammett have?

Observation: Hammett has been married to his second wife Lani since 1998. They have two sons, Angel (b. September 29, 2006) and Vincenzo (b. June 28, 2008).

Thought: 3/4 Metallica band members have 8 children Action: Search Action Input: How many kids does Robert Trujillo have?

Observation: 2 Thought: 4/4 Metallica band members have 10 children Final Answer: 10
```

### 提示自动化（APE: Automatic Prompt Engineering）

通过 LLM 自动生成多个变体提示（prompt candidates），然后筛选评分，再微调组合，进入自动优化循环。


例如，可以使用自动提示工程来帮助训练聊天机器人，对于T 恤网上商店。我们想弄清楚客户购买乐队商品 T 恤的订单可以用各种不同的方式表达。

1. 编写将生成输出变体的提示。
2. 对所有指令候选方案进行评估，依据选定标准进行打分。
3. 选择评分最高的指令候选方案作为最终提示语，可直接应用于软件或聊天机器人。亦可调整所选提示后重新评估。

|        |                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Prompt | 我们有一个乐队周边T恤的网店，为了训练聊天机器人，需要多种订购表达方式：“一件Metallica乐队的S码T恤”。以下是10种语义相同但表达不同的变体：                                                                                                                                                                                                                                                                                        |
| Output | 1. "我要买一件S号的Metallica T恤。"<br> 2. "请给我下单一件Metallica乐队的小号T恤。"<br> 3. "订购Metallica的S尺寸T恤一件。"<br> 4. "来件Metallica的短袖，要S码的。"<br> 5. "S码的Metallica主题T恤来一件。"<br> 6. "想要一件Metallica乐队S码的上衣。"<br> 7. "给我一件S大小的Metallica文化衫。"<br> 8. "下单：Metallica乐队T恤，尺码S，数量一。"<br> 9. "请发一件Metallica的S号短袖T恤。"<br> 10. "Metallica乐队T恤S码，买一件。" |

### 代码类任务实践

LLMs 在代码生成、翻译、解释、调试中有极大潜力，提示工程同样适用：

#### 代码生成
- 明确说明语言、输入结构与预期格式
- 如“写一个Bash代码片段，要求输入一个文件夹名。然后，将该文件夹内的所有文件重命名，在文件名前添加“draft”前缀。”

#### 代码解释
- 使用“解释以下代码并逐行说明其作用”
- 如“向我解释以下 Bash 代码：XXX”

#### 代码转换
- 以“翻译如下代码为 XX语言”为目标提示
- 如“将下面的 Bash 代码转换为 Python 代码段。XXX”

#### 代码调试
- 粘贴错误信息+代码段，让模型找出问题并建议改进，
- 如“以下Python代码出现错误： Traceback (most recent call last):  XXX  调试问题所在并解释如何改进代码。”


## 最佳实践

### 提供示例
Few-shot 示例胜过任何冗长说明，在提示中提供示例是最有效的方法之一。示例可以帮助AI理解你期望的输出格式和风格。


### 简洁设计
提示应该简洁、清晰、易于理解。如果提示对你来说已经很混乱，那么对AI来说也可能很混乱。尽量不要使用复杂的语言，不要提供不必要的信息。

**改进前：**

我现在正在纽约旅游，我想了解更多关于好地方的信息。我带着两个3岁的孩子。我们假期应该去哪里？

**改进后：**

扮演一个导游。描述纽约曼哈顿适合带3岁孩子参观的好地方。

尝试使用描述动作的动词。如：行动、分析、归类、分类、对比、比较、创造、描述、定义、评估、提取、查找、生成、识别、列出、衡量、组织、解析、挑选、预测、提供、排序、推荐、返回、检索、改写、选择、展示、整理、总结、翻译、撰写。
> 这里原文为 Act, Analyze, Categorize, Classify, Contrast, Compare, Create, Describe, Define,Evaluate, Extract, Find, Generate, Identify, List, Measure, Organize, Parse, Pick, Predict, Provide, Rank, Recommend, Return, Retrieve, Rewrite, Select, Show, Sort, Summarize, Translate, Write.

### 明确指定输出

明确说明你期望的输出。简洁的指令可能不足以引导AI，或者太过笼统。在提示中提供具体细节可以帮助模型关注相关内容，提高整体准确性。

**正确做法：**

生成一篇关于**前五大**游戏主机的博客文章，**共三段**。文章需兼具信息性与吸引力，并以**对话式风格**撰写。

**错误做法：**

生成一篇关于游戏主机的博客文章。

### 使用指令而非约束

在提示中专注于积极指令比严重依赖约束更有效。这与人类更喜欢积极指令而不是"不要做什么"的列表的方式一致。

**好的做法**

生成一段关于前5大视频游戏主机的博客文章。只讨论主机、制造公司、发布年份和总销量。

**不好的做法**

生成一段关于前5大视频游戏主机的博客文章。不要列出视频游戏名称。


### 控制 max token 长度
要控制AI回答的长度，你可以在配置中设置max toke，或者在提示中明确要求特定长度。

例如："用推特长度的消息解释量子物理学。"

### 使用变量化模板

使用变量可以让你的提示更加动态，避免重复。例如，不要在提示中硬编码城市名称，而是使用变量。

|:--|:--|
| Prompt | **变量：** <br>{city} = "阿姆斯特丹"<br>**提示：** <br>你是一名旅游指南。告诉我关于这个城市的一个事实：{city}  |
| Output | 阿姆斯特丹是一个美丽的城市，到处都是运河、桥梁和狭窄的街道。它是一个很好的地方，可以参观其丰富的历史、文化和夜生活。 |

### 尝试不同的输入格式和写作风格

不同的模型、模型配置、提示格式、措辞选择及提交方式均可能导致结果差异。因此，有必要对提示属性（如风格、措辞及提示类型——零样本、少样本或系统提示）进行实验性探索。

以生成关于革命性游戏主机世嘉Dreamcast的文本为例，提示可设计为疑问句、陈述句或指令形式，从而产生不同输出：

• 疑问句式：世嘉Dreamcast是什么？为何它被视为革命性游戏主机？

• 陈述句式：世嘉Dreamcast是世嘉公司于1999年推出的第六代游戏主机。该设备...

• 指令句式：撰写一段文字，描述世嘉Dreamcast游戏主机并阐释其革命性意义。

### 混合 Few-shot 分类顺序
在进行分类任务时，确保在少样本示例中混合可能的响应类别。这可以确保模型学习识别每个类别的关键特征，而不是简单地记住示例的顺序。

一个实用的经验法则是从**6个示例**开始，并由此逐步测试准确性。

### 适应模型更新

了解模型架构变化、添加的数据和功能很重要。尝试新的模型版本，并调整你的提示以更好地利用新的模型功能。例如 DeepSeek 官方就会定期发布更新，包含新功能和改进的模型架构。

![](https://image.stephenfang.me/PromptEngineering/updates.png)

### 尝试不同的输出格式
除了提示输入格式外，考虑尝试不同的输出格式。对于非创意任务，如提取、选择、解析、排序或分类数据，尝试让输出以JSON或XML等结构化格式返回。

采用JSON格式输出的优势包括：
- 始终以统一格式返回数据
- 专注于获取目标数据内容
- 有效降低生成错误信息的概率
- 保持数据关联性
- 支持数据类型定义
- 具备数据排序功能

假设希望利用大语言模型为电商目录中的产品生成描述。相较于仅提供自由格式的文本描述，推荐采用JSON模式来定义产品属性：

```
{

"type": "object", "properties": { "name": { "type": "string", "description": "Product name" }, "category": { "type": "string", "description": "Product category" }, "price": { "type": "number", "format": "float", "description": "Product price" }, "features": { "type": "array", "items": { "type": "string" }, "description": "Key features of the product" }, "release_date": { "type": "string", "format": "date", "description": "Date the product was released"} },
```

```
{

"name": "Wireless Headphones", "category": "Electronics", "price": 99.99, "features": ["Noise cancellation", "Bluetooth 5.0", "20-hour battery life"], "release_date": "2023-10-27"

}
```

通过对数据进行预处理，并仅提供数据模式及内容而非完整文档，使大语言模型能够清晰把握产品属性（包括发布日期），从而显著提升生成描述信息的准确性与相关性。这种结构化输入方法通过引导模型聚焦关键字段，在处理海量数据或将LLM集成至复杂应用系统时尤为高效。

### 记录提示尝试
提示工程是一个迭代的过程。精心设计并测试不同的提示，分析并记录结果。根据模型的表现优化您的提示。持续实验直至获得理想的输出。当更换模型或调整模型配置时，需重新对先前使用的提示进行实验验证。

|             |      |
| :---------- | :--- |
| 目标        |      |
| 模型        |      |
| Temperature |      |
| Token Limit |      |
| Top-K       |      |
| Top-P       |      |
| Prompt      |      |
| Output      |      |

## 回顾
通过以上学习，我让LLM帮我整理了十条TakeAway，希望这份总结能给你一些参考。

1.	善用 Few-shot 示例，优先使用正向指令
相较于复杂约束性指令，提供清晰、积极正向的 Few-shot 示例更能提高 LLM 输出质量和稳定性，尤其适用于分类、生成、转化类任务。
2.	合理配置输出参数，影响远超提示文本本身
调整 Temperature、Top-K、Top-P、Max Tokens 等参数，常常比修改 Prompt 本身更快提升输出效果。理解并灵活运用它们，是 Prompt 工程师的必备技能。
3.	优先采用 JSON、表格、代码块等结构化输出
强制 LLM 以 JSON、表格、代码等结构化方式返回结果，能显著提升后续自动化解析与验证的效率，也利于异常修复。
4.	掌握 Chain of Thought 与 Self-Consistency 方法
对于复杂推理任务，采用 Chain of Thought 拆解步骤推理，再配合 Self-Consistency 多轮采样+投票法，效果明显优于直接输出。
5.	利用 ReAct 框架提升 LLM 的交互式推理能力
ReAct 将“推理”与“行动”交替结合，适合动态决策、多轮任务、多工具调用类场景，能有效提升复杂任务完成率。
6.	自动化提示生成 (APE) 是提高生产效率的重要手段
借助模型自动生成优化 Prompt，再由人工筛选校正，可大幅提升 Prompt 版本设计与迭代效率，适合中大型 LLM 应用项目。
7.	合理设计输出长度与 Token 限制，保障稳定性
对于 LLM 长文本任务，应明确限制 Max Tokens，预防超长内容截断或上下文溢出，保持任务稳定。
8.	采用多模态 Prompting，扩展模型应用场景
结合文字、图片、表格、代码等多模态提示，能让 LLM 适配更多实际复杂任务，尤其适合 AI 助手、文档生成、图表解析类场景。
9.	记录 Prompt 历史版本，版本化迭代至关重要
Prompt 工程过程应记录所有尝试版本，持续迭代、A/B 测试，最终形成稳定可复用的最佳版本库。
10.	Prompt 编写遵循“简单优先，例子清晰，输出格式明确”三原则
简化提示内容、保证示例清晰、强制指定输出格式，是所有提示工程项目稳定落地的共同经验。



