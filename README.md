# DocFlow 文档系统

一个极简风格的静态文档系统

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FZerexaNet%2FDocFlow)
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FZerexaNet%2FDocFlow)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ZerexaNet/DocFlow)

- 自动将 Markdown 渲染为 HTML
- 自动生成页面路由
- 提供顶部导航、侧边栏文档结构、页面目录
- 全站白色背景，黑色文字与黑色按钮/边框

## 使用方式

```bash
npm run build
```

构建后输出到 `dist/`。

```bash
npm run dev
```

本地开发模式，默认端口 `4173`，支持改动后自动重建。

## 目录结构

```text
docs/               # Markdown 文档源
public/assets/      # 样式与前端脚本
scripts/            # build/dev 入口
src/                # 文档系统核心实现
test/               # 基础单元测试
```

## Markdown 路由规则

- `docs/index.md` -> `/`
- `docs/guide/getting-started.md` -> `/guide/getting-started/`
- `docs/reference/index.md` -> `/reference/`

## Markdown 必填规范

每个文档文件建议按下面规范写，团队协作时最稳：

1. 文件必须放在 `docs/` 目录下，扩展名必须是 `.md`。
2. 页面必须有一个一级标题（`# 页面标题`）。
3. 建议在文件开头写 Frontmatter，至少包含 `title` 和 `order`。

示例：

```md
---
title: 快速上手
order: 2
---

# 快速上手

## 安装

正文内容...
```

说明：
- `title` 用于侧边栏和页面标题展示。
- `order` 用于同分组内排序，数字越小越靠前。
- 如果未写 `title`，系统会退化为“首个标题/文件名”作为标题。

## Markdown 提示块

支持 GitHub 风格提示块语法：

```md
> [!NOTE]
> 你好
```

也支持警告样式（会渲染为深色警告卡片）：

```md
> [!WARNING]
> 你好
```

## Markdown Task List

支持任务列表（Task List）语法：

```md
- [x] 玩家链接协议
- [ ] Spigot插件支持
- [ ] TFL插件([旧版仓库](https://github.com/hekuo5310/TranforCpp))支持
```

该语法会渲染为任务列表组件（`task-list` / `task-list-item checked|pending`），不是表单输入控件。

## 配置

在 `docs.config.mjs` 中配置站点标题、输出目录、导航项和 Header：

```js
export default {
  siteName: "DocFlow 文档",
  siteDescription: "DocFlow是由node开发的静态文档系统",
  docsDir: "docs",
  outDir: "dist",
  nav: [
    { text: "首页", link: "/" },
    { text: "指南", link: "/guide/getting-started/" }
  ],
  header: {
    sticky: true,                // 是否固定在顶部
    background: "solid",         // solid | transparent | striped
    logo: {
      text: "DocFlow 文档",      // logo 文本
      link: "/",                 // 点击跳转
      image: "",                 // 可选，logo 图片地址
      alt: "DocFlow 文档"
    },
    rightButtons: [
      { text: "GitHub", link: "https://github.com/ZerexaNet/DocFlow", newTab: true },
      { text: "开始阅读", link: "/guide/getting-started/", style: "filled" } // style: outline | filled
    ]
  },
  i18n: {
    enabled: true,
    endpoint: "/api/translate",
    upstreamEndpoint: "https://deepl.io.hk.cn/translate",
    sourceLang: "zh",
    defaultLang: "zh",
    altCount: 2,
    cache: true,
    autoApplySaved: true,
    languages: [
      { code: "zh", label: "简体中文" },
      { code: "en", label: "English" }
    ]
  }
};
```

## i18n 自动翻译

用户切换语言后，前端会向 `i18n.endpoint` 发起 `POST` 请求。相关地址统一在 `docs.config.mjs` 配置：

- `i18n.endpoint`：前端调用地址（默认 `/api/translate`）
- `i18n.upstreamEndpoint`：开发服务器代理转发的上游地址（默认 `https://deepl.io.hk.cn/translate`）

如果你把 `i18n.endpoint` 配成外部完整 URL，前端会直接请求该地址；如果使用默认 `/api/translate`，则由本地开发服务器代理到 `i18n.upstreamEndpoint`。

请求体字段：
- `text`：要翻译的文本（必填）
- `source_lang`：源语言代码（可选）
- `target_lang`：目标语言代码（必填）
- `alt_count`：替代翻译数量（可选，最多 3）

系统会自动缓存翻译结果，并在用户下次访问时优先使用缓存。

## 测试

```bash
npm test
```

## 部署

本项目是纯静态站点，构建产物为 `dist/`，可直接部署到 Vercel、Cloudflare、Netlify 和 GitHub Pages。

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FZerexaNet%2FDocFlow)
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FZerexaNet%2FDocFlow)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ZerexaNet/DocFlow)

### 部署到 Vercel

#### 方式一：Vercel 控制台（推荐）

1. 将仓库推送到 GitHub/GitLab/Bitbucket。
2. 登录 Vercel 并导入该仓库。
3. 在项目构建设置中填写：
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. 点击 Deploy，完成后即可获得线上地址。

#### 方式二：Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

首次运行 `vercel` 时，按提示选择项目并确认：
- Build Command: `npm run build`
- Output Directory: `dist`

### 部署到 Cloudflare Pages（CF）

#### 方式一：Cloudflare Pages 控制台（推荐）

1. 登录 Cloudflare，进入 `Workers & Pages`。
2. 选择 `Create application` -> `Pages` -> 连接你的 Git 仓库。
3. 构建配置填写：
   - Framework preset: `None`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. 点击 Save and Deploy，等待部署完成。

#### 方式二：Wrangler CLI

```bash
npm i -g wrangler
wrangler login
wrangler pages project create DocFlow
npm run build
wrangler pages deploy dist --project-name DocFlow
```

### 部署到 GitHub Pages

建议使用 GitHub Actions 发布 `dist/`，步骤如下：

1. 在仓库里新建文件 `.github/workflows/deploy-pages.yml`。
2. 写入以下工作流：

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build docs
        run: npm run build
      - name: Upload GitHub Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    permissions:
      pages: write
      id-token: write
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. 在 GitHub 仓库中进入 `Settings -> Pages`。
4. `Source` 选择 `GitHub Actions`。
5. 推送到 `main` 分支后，等待工作流完成。

访问地址通常为：

- 用户/组织主页仓库：`https://<username>.github.io/`
- 项目仓库：`https://<username>.github.io/<repo>/`

注意：当前 DocFlow 模板默认使用根路径资源链接，若使用项目仓库子路径发布，建议配合自定义域名或按需调整路径策略。

### 部署前自检

```bash
npm test
npm run build
```
