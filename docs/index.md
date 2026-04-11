---
title: DocFlow
order: 1
---

# DocFlow

DocFlow 是一个极简、可扩展的静态文档系统，基于 Node.js 构建。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FZerexaNet%2FDocFlow)
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FZerexaNet%2FDocFlow)

- 支持 Markdown 自动渲染为 HTML
- 自动生成路由、侧边栏和页面目录
- 可配置 Header、导航和按钮
- 内置 i18n 前端翻译能力（支持代理转发）

## 快速开始

```bash
npm install
npm run dev
```

默认启动地址：`http://localhost:4173`

构建静态站点：

```bash
npm run build
```

## 文档导航

- [快速开始](/guide/getting-started/)
- [系统配置](/guide/configuration/)
- [i18n 翻译配置](/guide/i18n/)
- [部署指南](/guide/deployment/)

## 一个最小配置示例

```js
export default {
  siteName: "DocFlow 文档",
  docsDir: "docs",
  outDir: "dist",
  nav: [
    { text: "首页", link: "/" },
    { text: "快速开始", link: "/guide/getting-started/" }
  ]
};
```
