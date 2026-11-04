# 博客文章整理流程

将旅行稿、阅读笔记或外部平台稿件放入 `src/content/posts/` 时，先对照最近同类文章，再按以下步骤整理。以 `SiliconValley.md` 和 `CaliforniaWallpaperTrip.md` 为旅行稿参考。

## 1. 补齐 YAML

```yaml
---
title: 文章标题
pubDatetime: 2026-11-04T00:00:00+08:00
categories:
  - 生活
tags:
  - 旅行
  - 加州
  - macOS
  - Apple
copyright: true
featured: true
ogImage: https://image.stephenfang.me/California/cover-california-macos.png
description: 用一两句话写清文章涉及的地点、内容和个人视角。
---
```

- `title`、`pubDatetime`、`description` 是内容模型的必填字段。日期使用文章确定的发布日期和明确时区；示例日期不要直接沿用。原稿已有发布日期时保留原值。
- 分类沿用现有文章的「生活」「阅读」「技术」等习惯；标签优先复用已有名称，选择能概括主题的少量标签。
- `featured: true` 表示首页精选，按需要添加，不是每篇都必需。
- 有专门封面时可以将其设为 `ogImage`；没有时省略，由站点生成分享图。正文是否展示封面另外决定。
- `categories` 和 `copyright` 是现有文章沿用的字段；当前 `src/content.config.ts` 未将它们列入内容模型，不要假定它们会控制页面分类或版权展示。
- 标题由文章页面展示，正文不再重复添加同名一级标题。

## 2. 整理全文引子

YAML 后先放一至两段引子，交代写作缘由、文章范围和个人视角，再进入原有章节。保留作者的第一人称叙述和事实边界，不把尚未到访的地点写成亲历，不额外补充未经确认的时间、经历或结论。

引子与 `description` 各有用途：前者供读者进入正文，后者概括文章内容。避免照抄同一段，也尽量不重复后续第一节的细节。

外部平台稿中的称呼按博客语境调整。AI 辅助说明、图片版权和来源声明仍需保留；如影响开篇阅读，可移至文末、参考链接之前。不得删去图片来源或将第三方图片当作作者拍摄。

## 3. 替换图片地址

图片域名统一使用 `https://image.stephenfang.me/`，云端文件夹和文件名以实际上传结果为准，保留大小写和扩展名。此次 California 稿件使用：

```text
原地址：wallpaper-yosemite.jpg
新地址：https://image.stephenfang.me/California/wallpaper-yosemite.jpg
```

- 检查正文、表格、封面、HTML 图片和引用式图片，避免遗漏。
- 只替换图片地址，保留 alt 文本、图注、顺序和资料链接；已有外部图片地址不应不加区分地改写。
- 修改前后核对图片数量及文件名。此次文章为 61 张图片，包括正文封面；`ogImage` 复用同一张封面。
- 联网检查图片是否返回成功状态及图片类型；对异常地址进一步检查实际内容。无法联网时应明确记录未验证，不能据此断言图片不存在。
- PNG 应返回 `image/png`，JPG/JPEG 应返回 `image/jpeg`。如果返回 `application/octet-stream`，可先读取文件签名确认真实格式，再在云端修正文件类型信息，避免直接打开时触发下载或影响第三方预览。
- 地址替换不等于上传；云端缺文件时先核对上传目录和扩展名，不根据猜测重命名。

## 4. 验证与交付

1. 检查差异，确认改动限于元信息、引子、平台语境调整和图片地址，保留原有正文及来源。
2. 对改动文件运行格式检查，例如 `npx --no-install prettier --ignore-path /dev/null --check src/content/posts/CaliforniaWallpaperTrip.md docs/post-preparation.md`。
3. 运行 `npm run build`，验证内容模型、中文字体覆盖、静态页面和搜索索引。新增生僻字如触发字体覆盖检查，参阅 `scripts/fonts/README.md`。
4. 检查生成页面的标题、引子、封面及表格图片地址。只有实际查看过浏览器页面，才能声称完成视觉检查。
5. 汇报变更和验证结果；提交、推送、部署按用户当次授权执行。
