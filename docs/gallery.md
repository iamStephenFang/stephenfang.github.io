# Unsplash 摄影页

`/gallery/` 在 Astro 构建时通过官方 API 获取 `stephenfang` 的全部公开照片，按最新发布排序、自动分页。页面直接使用 API 返回的 Unsplash 图片链接，保留 `ixid`；不下载图片，不向访客暴露 Access Key。照片宽高也来自 API，避免加载时布局跳动。

## 部署

1. 在博客 GitHub 仓库进入 **Settings → Secrets and variables → Actions → New repository secret**。
2. Name 填 `UNSPLASH_ACCESS_KEY`，Secret 填 Unsplash 应用的 **Access Key**，不是 Secret Key。
3. 将本次代码推送到 `master`，现有 **Deploy to GitHub Pages** 工作流会构建并部署。
4. 首次部署成功后访问 `https://stephenfang.me/gallery/`。

不设置定时更新。上传新照片后，按需手动执行工作流即可更新摄影页；推送代码到 `master` 时，正常部署也会获取最新照片。新照片会在下一次成功部署后出现。

立即更新：**Actions → Deploy to GitHub Pages → Run workflow → 选择 master → Run workflow**。

如缺少 Key、API 返回错误或超时，构建会失败，已发布的网站继续保留，不会用空画廊覆盖线上页面。日志只显示状态，不打印 Key 或 API 错误正文。

## 本地预览

复制根目录 `.env.example` 为 `.env`，填写 `UNSPLASH_ACCESS_KEY` 后重启开发服务器。`.env` 已被 Git 忽略。没有 Key 时，本地摄影页显示配置提示；正式构建会报错。

## 验证

```sh
node --test scripts/tests/gallery.test.mjs
pnpm exec astro check
pnpm build
```

完整构建需要有效的 Access Key 和网络连接。自动化测试使用模拟 API 验证多页读取、图片链接与追踪参数、错误处理，无需真实 Key。
