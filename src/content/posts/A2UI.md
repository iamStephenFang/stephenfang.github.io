---
title: 客户端角度的 A2UI 思考
pubDatetime: 2026-07-17T08:48:00.000Z
categories:
  - 技术
tags:
  - AI
  - Agent
  - A2UI
  - iOS
  - 产品设计
copyright: true
featured: true
description: 从客户端视角理解 A2UI：Agent 负责描述界面意图，客户端负责用受控的原生组件渲染 UI，并通过 Catalog、Data Model 和 Action 建立安全边界。
---

A2UI 全称为 Agent-to-UI，核心思想是：

> Agent 负责描述 UI，客户端负责渲染 UI。

作为研发，第一次看到 A2UI 时，很多人的第一反应可能都是：

> “这不就是用 JSON 描述 UI 吗？”

实际上，JSON 只是它的载体，并不是它真正的价值所在。

A2UI 想解决的，并不是“如何描述一个页面”，而是 Agent 时代的 UI 应该如何生产。



## 为什么需要 A2UI

在 Agent 应用爆发的早期，应用的交互形式主要是纯文本对话，整个过程完全依赖自然语言。

```
User
 ↓
Prompt：“帮我订一家今晚七点的本帮菜”
 ↓
LLM：“请告诉我：1. 人数 2. 地点 3. 预算”
 ↓
User
```

随着任务型 Agent 变得普遍，提出诉求、填写表单、操控数据的需求变得更高频，传统的 Agent 交互形式逐渐无法满足用户诉求。具体来说：

- Agent 需要收集用户输入时，只能靠多轮对话一个字段一个字段地问，体验极差
- Agent 需要展示结构化数据时只能输出 Markdown 或 HTML，客户端盲目渲染
- Agent 需要直接触发操作时，客户端必须事先约定好所有 `action handler`

面对这些诉求，很多人的第一反应是：直接返回 HTML 不就完了吗？最粗暴的解决方案，是让 Agent 直接输出可执行代码，再由客户端运行。但这会引入安全问题。例如在 ChatGPT 里调用一个第三方 Agent，如果 Agent 返回：

```html
// Case 1
<script>
stealCookie()
</script>

// Case 2
window.location= "https://evil.com"
```

宿主 App 显然不能直接执行。

除了安全问题，还存在风格统一等问题。如果每个 Agent 都返回一套自己风格的 HTML，整个 App 就会变成大杂烩。A2UI 希望解决的正是这些问题。


## 设计原则
> Google 的团队认为：Agent 不应该生成代码，而应该生成 UI Intent。

**A2UI 的核心设计决策**：协议是一种**声明式数据格式**，不是可执行代码。Agent 只能描述“界面长什么样”，不能调用任何 API，也不能写任何逻辑。所有行为都由客户端用自己的原生组件实现。

![](https://image.stephenfang.me/A2UI/principles.png)

|            | 传统方案          | A2UI               |
| ---------- | ----------------- | ------------------ |
| Agent 输出 | HTML / JS 字符串  | JSON 组件描述      |
| 安全性     | 可注入任意脚本    | 仅能引用白名单组件 |
| 跨端一致性 | 各端自行解析 HTML | 原生 Widget 渲染   |
| 样式控制   | 完全失控          | 客户端主题全权掌控 |

---

## 核心概念模型

A2UI 由六个核心概念构成：

| 概念           | 角色       | 说明                                                                              |
| -------------- | ---------- | --------------------------------------------------------------------------------- |
| **Surface**    | 渲染画布   | UI 的根容器，可同时存在多个（对话框、侧边栏、主视图）                             |
| **Component**  | UI 元素    | Button、TextField、Card、Text 等，有唯一 ID 和类型                                |
| **Data Model** | 应用状态   | Surface 的 JSON 状态树，组件通过 JSON Pointer 路径绑定                            |
| **Catalog**    | 组件白名单 | 客户端声明的可用组件类型集合，Agent 只能使用其中的类型                            |
| **Message**    | 流式指令   | Server-to-Client 的操作单元，每条是一个自包含的 JSON 对象                         |
| **Action**     | 交互事件   | 用户操作触发的事件，分为 Server Action（回传 Agent）和 Local Action（客户端处理） |


A2UI 不是 UI 框架，而是一套协议。它借鉴了 MVVM 的思想，将界面拆成 Component Tree 和 Data Model 两部分。Component Tree 负责描述结构，例如 Button、Text、Card；Data Model 负责描述状态。

![](https://image.stephenfang.me/A2UI/component.png)

---

## 协议消息格式

A2UI 的 Server-to-Client 协议由四种消息构成，以 **JSON Lines（JSONL）** 格式流式传输，即每行一个完整的、合法的 JSON 对象。

```json
/// JSON
[
  {
    "id": 1,
    "name": "Alice"
  },
  {
    "id": 2,
    "name": "Bob"
  }
]

/// JSONL
{"id":1,"name":"Alice"}
{"id":2,"name":"Bob"}
{"id":3,"name":"Charlie"}
```

客户端可以逐行解析、增量构建 UI，不需要等待完整响应。

![](https://image.stephenfang.me/A2UI/dataflow.png)

### 版本演进

项目目前仍在 early preview（v0.9.1）阶段，API 仍然可能在 v1.0 正式稳定前发生变化。

| 版本       | 状态       | 关键消息类型                                                               |
| ---------- | ---------- | -------------------------------------------------------------------------- |
| v0.8       | Legacy     | `surfaceUpdate` · `dataModelUpdate` · `beginRendering` · `deleteSurface`   |
| **v0.9.1** | **Stable** | `createSurface` · `updateComponents` · `updateDataModel` · `deleteSurface` |
| v1.0       | Candidate  | 同 v0.9.1，新增 `actionResponse`（支持同步 RPC 回调）                      |

### 邻接表组件模型

A2UI 最关键的设计决策之一是**不使用嵌套 JSON 树**，而是使用**扁平的邻接表**。邻接表中每个组件独立存在，通过 ID 数组引用子节点。

嵌套树要求 LLM 在生成时正确闭合每一层花括号，深层嵌套极易出错。邻接表让每个组件都成为独立对象，LLM 可以逐个生成，顺序无关，错误也不容易级联扩散。因此，邻接表更适合由 LLM 生成。

![](https://image.stephenfang.me/A2UI/adjacency_list.png)

### 消息类型

#### createSurface

用于建立渲染画布，也是流的第一条消息，告诉客户端新建一个 Surface 并声明使用哪个 Catalog。

```json
{
  "version": "v0.9.1",
  "createSurface": {
    "surfaceId": "booking-form",
    "catalogId": "https://a2ui.org/specification/v0_9_1/catalogs/basic/catalog.json",
    "displayHint": "dialog"
  }
}
```


#### updateComponents

用于声明组件树，是最核心的消息类型。以**邻接表**格式发送组件列表，每个组件有全局唯一 ID 和类型。

```json
{
  "version": "v0.9.1",
  "updateComponents": {
    "surfaceId": "booking-form",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["title", "date-input", "submit-btn"]
      },
      {
        "id": "title",
        "component": "Text",
        "text": "预订座位",
        "variant": "h2"
      },
      {
        "id": "date-input",
        "component": "DatePicker",
        "label": "就餐日期",
        "binding": "/booking/date"
      },
      {
        "id": "submit-btn",
        "component": "Button",
        "label": "确认预订",
        "action": { "event": { "name": "submit" } }
      }
    ]
  }
}
```


#### updateDataModel

用于注入/更新状态。Agent 可以先发结构再单独发数据，或动态更新某个路径的值。

```json
{
  "version": "v0.9.1",
  "updateDataModel": {
    "surfaceId": "booking-form",
    "path": "/booking",
    "value": {
      "date": "2025-12-25",
      "guests": 2
    }
  }
}
```


#### deleteSurface

用于销毁 Surface。

```json
{
  "version": "v0.9.1",
  "deleteSurface": { "surfaceId": "booking-form" }
}
```

> **渐进式渲染**：客户端不需要等到所有消息到达才开始渲染。收到 `createSurface` 就创建占位视图，每条 `updateComponents` 可以逐步追加组件，`updateDataModel` 则触发绑定组件响应式刷新。


### 动态子节点

除了静态 ID 数组，A2UI 还支持根据 Data Model 中的数组动态生成子节点，也就是与模板绑定。假设我们需要渲染一个产品列表：

```
Column

├── Card 1
│   ├── iPhone
│   └── ¥6999
│
├── Card 2
│   ├── MacBook
│   └── ¥12999
│
└── Card 3
    ├── AirPods
    └── ¥1499
```

对应的 A2UI 结构如下所示：

```json
{
  "id": "product-list",
  "component": "Column",
  "children": {
    "path": "/products",
    "componentId": "product-card"
  }
}
```

最外层的 `Column` 可以这样理解：

```
/// React
products.map(product => {
    return <ProductCard data={product}/>
})

/// SwiftUI
ForEach(products) { product in
    ProductCard(product)
}
```

`componentId` 是 `Catalog` 中的模板。

```json
{
    "id":"product-card",
    "component":"Card",
    "children":[
        {
            "component":"Text",
            "text":"{{name}}"
        },
        {
            "component":"Text",
            "text":"¥{{price}}"
        }
    ]
}
```

> 其中组件文本属性支持路径插值，无需 Agent 重新生成消息：

`children` 由 `DataModel` 里的 `/products` 动态生成：

```
{
    "products":[

        {
            "name":"iPhone",
            "price":6999
        },

        {
            "name":"MacBook",
            "price":12999
        },

        {
            "name":"AirPods",
            "price":1499
        }

    ]
}
```

UI 不需要提前写死有几个子组件，而是根据 `DataModel` 里的数组，在运行时自动生成。

### 数据绑定机制

A2UI 将 **UI 结构**（组件树）和**应用状态**（Data Model）完全分离，二者通过 **JSON Pointer** 路径（JSON 文档中的绝对路径）建立绑定关系。

```
/// JSON
[
  {
    "name": "iPhone",
    "price": 6999
  },
  {
    "name": "MacBook",
    "price": 12999
  }
]

/// JSON Pointer
/products/0/name
iPhone

```

模板组件访问的路径是**相对**于其所在数组元素的。`/name` 在列表项模板中解析为 `/products/0/name`，而不是全局根节点，这避免了组件 ID 碰撞。

- Agent 可以先发组件结构，稍后再填充数据，支持骨架屏体验
- Data Model 的任意节点变更都会自动触发绑定组件的重新渲染
- 输入类组件（TextField、DatePicker）的用户操作会实时写回 Data Model

```json
// 组件绑定声明
{
  "id": "name-field",
  "component": "TextField",
  "label": "姓名",
  "binding": "/user/name"
}

// Data Model 状态
{
  "user": {
    "name": "张三",
    "email": "..."
  }
}

// 用户提交时，action 携带完整的当前 Data Model
{
  "action": "submit",
  "context": { "dataModel": { "user": { "name": "李四" } } }
}
```


## 传输层

A2UI 是传输无关的协议，它只定义 UI 消息的 JSON 格式，而不规定消息如何传输。因此，A2UI 消息既可以直接通过 SSE、WebSocket、HTTP Streaming 等传输层协议发送，也可以作为更高层协议（如 A2A 的 artifact、MCP 的 Tool Result）的内容进行封装，还可以通过 AG-UI 等适配层将其他 Agent 框架（如 LangGraph、CrewAI）的事件转换为 A2UI 消息。

换句话说，A2UI 关心的是“消息长什么样”，而不是“消息怎么送过去”，因此能够适配不同的通信方式和 Agent 生态。

## 安全边界

Catalog 是 A2UI 安全模型的核心。客户端在初始化时声明一份组件类型注册表，当收到 `updateComponents` 消息时：

1. 客户端首先验证每个 `component` 字段是否在 Catalog 中存在
2. 未注册的类型直接被丢弃，**不会**尝试执行或渲染
3. Agent 无法通过伪造类型名称绕过这一限制
4. 即使 Agent 被攻陷，攻击者也只能描述已知 UI 组件，无法注入任意代码

![](https://image.stephenfang.me/A2UI/secure.png)

**Action 的安全性**：Action 本质上是命名事件，不是函数引用。`{ "event": { "name": "submit" } }` 只是告诉客户端用户点击时触发名为 "submit" 的事件，客户端决定如何响应。Agent 无法指定事件处理函数的具体实现。


## iOS 客户端实现方案

基于 [BBC6BAE9/a2ui-swift](https://github.com/BBC6BAE9/a2ui-swift) 开源实现整理，使用其 A2UISwiftCore（协议层）+ A2UIUIKit（UIKit 渲染层）两个模块，不依赖 SwiftUI。
该库将整体拆分为六个独立 Module，对 UIKit 场景只需引入两个：

```
dependencies: [
    .package(url: "https://github.com/BBC6BAE9/a2ui-swift", from: "0.1.0"),
],
targets: [
    .target(
        name: "YourApp",
        dependencies: [
            .product(name: "A2UIUIKit",     package: "a2ui-swift"),
            .product(name: "A2UISwiftCore", package: "a2ui-swift"),
        ]
    ),
]
```

> 注意：A2UIUIKit 模块当前处于 active development 阶段（README 明确标注），生产接入请锁定具体版本并关注 changelog。A2UISwiftUI 是 feature-complete 的，但本节不使用它。

### 整体架构

`a2ui-swift` 的分层与职责如下。

![](https://image.stephenfang.me/A2UI/architecture.png)

`A2UISwiftCore` 是与 UI 框架无关的协议和状态层，负责解析 A2UI v0.9 消息，并维护 `SurfaceModel`、`DataModel`、组件定义、数据绑定等核心状态。

`A2UIUIKit` 不直接消费原始 JSON，而是消费 `A2UISwiftCore` 产出的 SurfaceModel。也就是说，JSON 先在 Core 层被处理成一份可渲染的 UI 状态，UIKit 渲染层再基于这份状态生成原生界面。

在 UIKit 侧，`A2UIUIKit` 主要通过 `A2UIPlatform` 完成实际渲染：它先把 `SurfaceModel` 中扁平的组件定义解析成 `ComponentNode` 树，再由 `ComponentFactory` 将每个 `ComponentNode` 映射成对应的原生 UIKit 视图。组件内部通过 `DataContext` 读取和写入 `DataModel`，并通过订阅机制响应数据变化，从而让局部 UI 随数据更新，而不是每次都重新解析整段 JSON 或重建整个界面。

整体可以理解为：Core 负责协议解析和状态管理，`A2UIUIKit` 负责把 Core 的状态渲染成 UIKit 原生界面。

### 快速接入

`A2UIUIKitSurfaceViewController` 是 UIKit 渲染的入口，通过标准的 `addChild` 方式嵌入到现有的 ViewController 里：

```swift
import A2UIUIKit
import A2UISwiftCore

class MyViewController: UIViewController {

    private var surfaceVC: A2UIUIKitSurfaceViewController!
    private var viewModel: SurfaceViewModel!

    override func viewDidLoad() {
        super.viewDidLoad()

        // 1. 创建 ViewModel，传入 Catalog（内置或自定义）
        viewModel = SurfaceViewModel(catalog: basicCatalog)

        // 2. 创建 UIKit Surface ViewController
        surfaceVC = A2UIUIKitSurfaceViewController(viewModel: viewModel) { action in
            // 3. 处理 Agent 回传的 Action
            print("[A2UI] action: \(action.name), context: \(action.context)")
            Task { try await self.sendActionToAgent(action) }
        }

        // 4. 标准 addChild 嵌入
        addChild(surfaceVC)
        view.addSubview(surfaceVC.view)
        surfaceVC.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            surfaceVC.view.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            surfaceVC.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            surfaceVC.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            surfaceVC.view.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
        surfaceVC.didMove(toParent: self)
    }
}
```

### 流式消息

用 `URLSession bytes(for:)` 逐行读取 SSE，把每一行交给 `SurfaceViewModel.processMessages()`。

Core 层负责解析和状态更新，UIKit 层自动响应：

```
func startStreaming(url: URL) {
    Task {
        do {
            let (bytes, _) = try await URLSession.shared.bytes(from: url)
            var buffer = ""

            for try await byte in bytes {
                let char = String(UnicodeScalar(byte))
                if char == "\n" {
                    let line = buffer.trimmingCharacters(in: .whitespaces)
                    buffer = ""
                    guard !line.isEmpty else { continue }

                    // SSE data: 前缀剥离
                    let jsonLine = line.hasPrefix("data: ")
                        ? String(line.dropFirst(6)) : line

                    // processMessages 解析 JSONL，驱动 SurfaceState 更新
                    try viewModel.processMessages([jsonLine])
                } else {
                    buffer.append(contentsOf: char)
                }
            }
        } catch {
            print("Stream error: \(error)")
        }
    }
}

// 或者直接传入一组离线 JSONL 消息（调试用）
let messages = [
    """
    {"version":"v0.9.1","createSurface":{"surfaceId":"booking","catalogId":"..."}}
    """,
    """
    {"version":"v0.9.1","updateComponents":{"surfaceId":"booking","components":[...]}}
    """,
]
try viewModel.processMessages(messages)
```

### 标准组件

当前状态说明：A2UIUIKit 模块正在开发中，与 SwiftUI 模块相比，部分组件可能尚未完全对齐。使用前建议查阅仓库最新的 README，确认各组件的可用状态，并通过 `basicCatalog` 返回的组件列表做实际验证。


| 组件类型            | UIKit 映射                         | 备注                                                     |
| ------------------- | ---------------------------------- | -------------------------------------------------------- |
| Text                | UILabel                            | 支持 variant（h1–h4、body、caption）和 formatString 插值 |
| Button              | UIButton                           | 触发 Server / Local Action                               |
| TextField           | UITextField                        | 双向绑定写回 DataModel，支持 keyboardType                |
| CheckBox            | UIButton（toggle）                 | 布尔路径双向绑定                                         |
| Slider              | UISlider                           | min/max/step，实时写回                                   |
| ChoicePicker        | UIPickerView                       | 选项数组来自 DataModel 或静态列表                        |
| DateTimeInput       | UIDatePicker                       | 支持 date / time / dateTime 三种模式                     |
| Image               | UIImageView                        | 异步加载，占位符支持                                     |
| Icon                | SF Symbols / UIImageView           | name 映射到 SF Symbol                                    |
| Row                 | UIStackView（horizontal）          | children 递归渲染                                        |
| Column              | UIStackView（vertical）            | 支持静态 children 和动态模板列表                         |
| Card                | UIView（圆角 + 阴影）              | 包含 children 布局                                       |
| List                | UITableView                        | 动态绑定数组，复用 cell                                  |
| Tabs                | UISegmentedControl + 容器          | Local Action 驱动选中切换                                |
| Modal               | UIAlertController 或自定义 present | Server Action 控制显示/隐藏                              |
| Divider             | 1pt UIView                         | 水平分割线                                               |
| AudioPlayer / Video | —                                  | —                                                        |

### 自定义 Catalog

内置 Catalog 包含 17 个标准组件（Text、Button、TextField、Card、List 等）。如需注册业务自有组件，实现 `A2UIUIKitComponent` 协议即可。协议要求提供三个能力：创建 View、用新数据更新 View、处理组件内部 Action：

```
import A2UIUIKit
import A2UISwiftCore

// 1. 定义自定义组件的 Props（对应 JSON Schema）
struct RatingProps: Decodable {
    let value: Int        // 当前星级 (1-5)
    let label: String?
    let binding: String?  // JSON Pointer，用于写回 DataModel
}

// 2. 实现 A2UIUIKitComponent
struct RatingComponent: A2UIUIKitComponent {
    static var componentType: String { "Rating" }  // 对应 JSON 中的 "component" 值

    // 创建 UIView（首次渲染）
    func makeView(
        props: JSONValue,
        dataModel: DataModelStore,
        actionHandler: @escaping (A2UIAction) -> Void
    ) -> UIView {
        let p = try! RatingProps(from: props)
        let ratingView = StarRatingView()   // 自己实现的 UIView
        ratingView.rating = p.value
        ratingView.onChanged = { newRating in
            // 写回 DataModel（双向绑定）
            if let path = p.binding {
                dataModel.set(.int(newRating), at: path)
            }
            // 也可以触发 Server Action
            actionHandler(A2UIAction(name: "ratingChanged", value: .int(newRating)))
        }
        return ratingView
    }

    // 增量更新（DataModel 变化时调用，避免重建 View）
    func updateView(
        _ view: UIView,
        props: JSONValue,
        dataModel: DataModelStore
    ) {
        guard let ratingView = view as? StarRatingView,
              let p = try? RatingProps(from: props) else { return }
        ratingView.rating = p.value
    }

    // （可选）处理来自其他组件的 Local Action
    func handleAction(_ action: A2UIAction, view: UIView) { }
}

// 3. 注册到自定义 Catalog，与内置 basicCatalog 合并
var myCatalog = basicCatalog
myCatalog.register(RatingComponent())

// 4. 传给 SurfaceViewModel
let viewModel = SurfaceViewModel(catalog: myCatalog)
```


### DataModel 双向绑定

Core 层的 `DataModelStore` 持有整个 Surface 的 JSON 状态树，并维护一张路径订阅表：当某个 JSON Pointer 路径的值发生变化时，所有绑定了该路径的组件 View 都会收到 updateView 调用。

UIKit 不像 SwiftUI 有 @Published，所以 Core 用 KVO-free 的发布-订阅实现了这套响应链：

```
// DataModelStore 内部简化逻辑（Core 层，非你实现）
class DataModelStore {
    private var root: JSONValue = .object([:])
    // path → [弱引用 UIView + updateView 闭包]
    private var subscriptions: [String: [(UIView, (JSONValue) -> Void)]] = [:]

    func set(_ value: JSONValue, at pointer: String) {
        root.set(value, at: JSONPointer(pointer))
        // 通知所有订阅了该路径（及父/子路径）的 View
        subscriptions[pointer]?.forEach { view, update in
            DispatchQueue.main.async { update(value) }
        }
    }

    func get(at pointer: String) -> JSONValue? {
        root.get(at: JSONPointer(pointer))
    }
}

// TextField 组件内部：注册写回 + 订阅刷新
let tf = UITextField()
tf.addAction(UIAction { _ in
    dataModel.set(.string(tf.text ?? ""), at: props.binding!)
}, for: .editingChanged)

// 订阅：外部更新 DataModel 时，刷新 TextField 显示
dataModel.subscribe(pointer: props.binding!) { newValue in
    if case .string(let s) = newValue { tf.text = s }
}
```

### Action 处理与回传
Action 分为两类，内部实现了路由：

- Server Action：通过传给 `A2UIUIKitSurfaceViewController` 的 `actionHandler` 闭包回调，业务负责 POST 给 Agent
- Local Action：Core 层在客户端内部处理（如切换 Tab、收起弹窗），不走网络

```
func sendActionToAgent(_ action: A2UIAction) async throws {
    struct ActionBody: Encodable {
        let surfaceId: String
        let name: String
        let context: JSONValue   // 完整 DataModel 快照随 action 一起回传
    }
    let body = ActionBody(
        surfaceId: action.surfaceId,
        name: action.name,
        context: viewModel.currentDataModelSnapshot()
    )
    var request = URLRequest(url: agentEndpoint)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try JSONEncoder().encode(body)
    try await URLSession.shared.data(for: request)
}
```



## 协议对比

| 能力层 | 技术        | 解决的问题                      |
| ------ | ----------- | ------------------------------- |
| 推理层 | LLM / Agent | 理解用户需求，规划任务          |
| 协作层 | A2A         | 多个 Agent 如何协同完成任务     |
| 能力层 | MCP         | Agent 如何调用外部工具与数据    |
| 交互层 | AG-UI       | Agent 如何与前端实时通信        |
| 展示层 | A2UI        | Agent 如何描述 UI，由客户端渲染 |

这些协议都服务于 Agent 生态，但解决的是不同层面的问题，可以把它们理解为一条完整链路中的不同环节：

![](https://image.stephenfang.me/A2UI/relation.png)

它们之间并不存在竞争关系，而是可以组合使用。

### 对比传统 Dynamic UI

A2UI 与传统 Dynamic UI（如 React Native、Lynx、Flutter 等）都采用了声明式 UI 的思想，但两者关注的问题并不相同。传统 Dynamic UI 的核心思想是：

> 开发者决定页面结构，服务端负责下发配置，客户端负责渲染。

虽然页面内容可以动态调整，但页面结构、组件组合方式以及业务流程仍然由开发者预先定义。而 A2UI 则进一步将**页面组合与交互流程**交给了 Agent。

其核心思想是服务端控制界面，客户端负责渲染，而这些系统 UI 和逻辑是由开发者写死的。例如 React Native 的 UI 逻辑主要在客户端，由客户端决定要展示什么。

![](https://image.stephenfang.me/A2UI/dynamic.png)

Agent 不再只是返回文本，而是根据当前上下文动态决定需要展示哪些组件、以什么顺序组织页面，并将这些意图通过 A2UI 协议描述出来。不过，A2UI 并没有把客户端变成一个“纯渲染器”。客户端仍然掌握着组件实现、布局计算、动画、主题、权限控制、埋点、AB 实验、风控策略以及本地能力调用等关键能力。


### 应用场景

A2UI 最适合落地在**需要 Agent 动态组织界面，而业务能力仍由宿主应用掌控**的场景。例如：
- 内容生成场景：Agent 根据用户创作的内容，动态推荐素材、滤镜、模板等业务组件，无需因为推荐逻辑调整而频繁发版
- 电商场景：Agent 理解用户“想买一台适合开发的笔记本电脑”，动态生成商品卡片、参数对比表、价格趋势图、购买建议等界面，而不是由工程师预先编写所有展示逻辑
- POI / 出行场景：Agent 理解“帮我规划杭州一日游”，自动组合地图、时间轴、景点卡片、交通方案、预算统计等组件，为不同用户生成不同的页面

这些场景有一个共同特点：Agent 决定“展示什么”，客户端决定“如何展示”。

需要注意的是，大模型虽然擅长理解用户意图，但它并不了解宿主应用内部的业务规则，例如 AB 实验策略、埋点采集规范、曝光与推荐逻辑、权限控制等策略。这些能力都属于宿主应用本身，而不是 Agent。

因此，Agent 的职责是表达业务意图，宿主应用的职责是提供可信、安全且可控的业务能力。A2UI 并不是让 Agent 接管客户端，而是在两者之间建立一层统一的协议：Agent 负责描述需要什么界面，客户端负责按照自己的设计规范、安全策略和业务规则，将这些描述渲染成最终的用户体验。

## 总结

当然，A2UI 目前也存在一些局限性与适用边界：

- **并非无限灵活**：Agent 永远不能超出客户端的组件白名单 Catalog，这是安全的代价，也是设计意图
- **样式控制权在客户端**：Agent 只建议组件应该使用哪一种视觉样式（`variant`），最终样式由客户端 Renderer 决定
- **不支持配置动画和手势**：A2UI 描述的是 UI 结构，不是交互行为；复杂的过渡动画需要客户端自行实现
- **项目前景**：目前项目仍是 early preview（v0.9.1），API 可能在 v1.0 正式稳定前发生变化，生产接入需关注官方 Evolution Guide

A2UI 的核心价值在于打通「Agent 意图到原生界面」这条路，以 Catalog 机制在两端之间建立清晰的信任边界。对于需要 Agent 动态生成交互界面的场景（餐厅预定表单、动态问卷、数据看板），A2UI 提供了一套安全、跨平台的标准化方案。

---

## 参考资料

- 官网：<https://a2ui.org>
- GitHub：<https://github.com/a2ui-project/a2ui>
- 规范文档：<https://a2ui.org/specification/v0.9.1-a2ui/>
- Basic Catalog：<https://a2ui.org/specification/v0_9_1/catalogs/basic/catalog.json>
- [BBC6BAE9/a2ui-swift](https://github.com/BBC6BAE9/a2ui-swift)
