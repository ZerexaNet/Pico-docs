---
title: 系统配置
order: 3
---

# 系统配置

DocFlow 使用根目录的 `docs.config.mjs` 作为统一配置文件。

## 完整示例

```js
export default {
  siteName: "DocFlow 文档",
  siteDescription: "DocFlow 是由 Node.js 开发的静态文档系统",
  docsDir: "docs",
  outDir: "dist",
  base: process.env.DOCFLOW_BASE || "/",
  header: {
    sticky: true,
    background: "solid",
    logo: {
      text: "DocFlow 文档",
      link: "/",
      image: "",
      alt: "DocFlow 文档"
    },
    rightButtons: [
      { text: "GitHub", link: "https://github.com/ZerexaNet/DocFlow", newTab: true }
    ]
  },
  nav: [
    { text: "首页", link: "/" },
    { text: "快速开始", link: "/guide/getting-started/" }
  ]
};
```

## 常用字段

- `siteName`：站点名称，同时用于页面标题后缀
- `siteDescription`：页面 `meta description`
- `docsDir`：Markdown 源目录
- `outDir`：构建输出目录
- `base`：站点基础路径（GitHub Pages 项目仓库建议 `/<repo>/`，默认 `/`）
- `nav`：顶部导航
- `header.sticky`：是否固定 Header
- `header.background`：Header 背景样式，可选 `solid | transparent | striped`

## Header 右侧按钮

```js
rightButtons: [
  { text: "GitHub", link: "https://github.com/ZerexaNet/DocFlow", newTab: true, style: "outline" },
  { text: "开始阅读", link: "/guide/getting-started/", style: "filled" }
]
```

- `style` 支持 `outline` 和 `filled`
- `newTab: true` 时会在新标签页打开
