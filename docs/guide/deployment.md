---
title: 部署指南
order: 5
---

# 部署指南

DocFlow 构建后是纯静态站点，输出目录为 `dist/`，可直接部署到 Vercel、Cloudflare、Netlify 和 GitHub Pages。

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FZerexaNet%2FDocFlow)
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FZerexaNet%2FDocFlow)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ZerexaNet/DocFlow)

## 部署前检查

```bash
npm test
npm run build
```

## Vercel

构建配置：

- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

## Cloudflare Pages

构建配置：

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`

## Netlify

构建配置：

- Build command: `npm run build`
- Publish directory: `dist`

## GitHub Pages（GitHub Actions）

1. 创建 `.github/workflows/deploy-pages.yml`
2. 写入：

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v4
        with:
          path: ./dist

  deploy:
    runs-on: ubuntu-latest
    needs: build
    permissions:
      pages: write
      id-token: write
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. 到仓库 `Settings -> Pages`，把 `Source` 设为 `GitHub Actions`
4. 推送到 `main` 分支等待部署

访问地址通常为：

- 用户/组织主页仓库：`https://<username>.github.io/`
- 项目仓库：`https://<username>.github.io/<repo>/`

注意：默认模板使用根路径资源链接，项目仓库子路径发布时建议绑定自定义域名或按需调整路径。

## 使用 CLI（可选）

```bash
npm i -g vercel
vercel
vercel --prod
```

```bash
npm i -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name DocFlow
```
