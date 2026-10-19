# 中文博客排版方案

以中文长文阅读为主，使用衬线字体呈现内容，使用系统黑体呈现界面信息。字体类别与功能关联，不再让原主题的西文等宽字体承担全站排版。

## 字体用途

| 用途 | 字体 | 设置 |
| --- | --- | --- |
| 站名、栏目名、文章标题 | `--font-reading` | 栏目 24px，列表标题 20px，文章主标题 24–28px，字重 600；首页域名 24–30px，字重 500 |
| 文章正文 | `--font-reading` | 17px / 1.85，字重 400 |
| 首页介绍、文章摘要 | `--font-reading` | 16px / 1.8，字重 400 |
| 导航 | `--font-reading` / `ui-nav` | 与站名统一使用衬线字体和 600 字重；15px / 24px |
| 操作入口、分页 | `--font-app` / `ui-action` | 16px / 24px，字重 500 |
| 日期、辅助标签 | `--font-app` / `ui-meta` | 14px / 24px，字重 400，次要颜色 |
| 页脚信息 | 继承界面字体，在页脚组件设置层级 | 13px / 24px，字重 400，次要颜色 |
| 面包屑、搜索控件 | `--font-app` | 系统中文黑体；按设备选择系统字体 |
| 代码、键盘按键、程序输出 | `--font-code` | Google Sans Code，缺少字形时使用其回退字体 |

这些字号、字重和行距是本博客的设计取值，不是标准规定的唯一方案。中文本机宋体只有 Regular、Bold 等有限字重时，浏览器会将 600 匹配到可用字重，并不能保证每个平台都有真实的 Semibold。

## 中西文混排

- 中文衬线优先使用已安装的 Noto Serif CJK SC／思源宋体，然后回退到宋体；通过 `unicode-range` 限定中文字形，避免中文字体接管英文。
- 英文使用 `ui-serif`，在支持的 Apple 浏览器中调用系统衬线设计；其他环境回退到 Times New Roman／通用 serif。不分发 Apple 字体文件。
- 阅读区使用等高数字 `lining-nums`，避免年份和版本号出现旧式数字的高低错落。日期使用中文年月日格式。
- 中文保持正常字距，采用严格行首行尾禁则和自然换行；不做全文两端强制对齐，不批量修改文章中的空格和标点。
- 界面说明和各级标题默认正体；文章作者主动使用的强调、斜体标记继续保留。

## 加载与平台差异

阅读字体和界面字体采用本机字体，首页不预加载代码字体。代码字体按需下载，继续使用 `optional` 策略，减少文字显示后的切换。

这种方案优先保证首屏稳定和中文阅读体验，不能保证所有设备显示完全相同的字形。未安装中文宋体的 Android／Linux 设备可能采用系统的其他回退字体；若后续要求跨平台统一为思源宋体，应另行引入按字集分片的中文 WOFF2，并重新评估首次访问的下载量和字体切换。

本地浏览器检查覆盖首页、文章列表、文章页的字体声明与排版。它不等同于 Windows、Android、iOS 和不同浏览器的真机验证。

## 参考

- [W3C 中文排版需求](https://www.w3.org/International/clreq/)：中文标点、行首行尾禁则及中西文混排。
- [USWDS Typography](https://designsystem.digital.gov/components/typography/)：字号、字重、行长和行距共同形成阅读层级。
- [Apple Fonts](https://developer.apple.com/documentation/technologyoverviews/fonts)：通过系统字体接口选用系统设计，网页使用 `ui-serif` 等标识。
- [MDN font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric)：等高数字与数字间距属于不同设置。
- [Noto 字体使用说明](https://github.com/notofonts/noto-docs/blob/main/docs/website/use.md)：CJK 字体选型与 Web 字体优化。
