---
title: 部署指南
order: 5
---

# 部署指南

DocFlow 构建后是纯静态站点，输出目录为 `dist/`，可直接部署到 Vercel 或 Cloudflare Pages。

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
