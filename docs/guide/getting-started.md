---
title: 快速开始
order: 2
---

# 快速开始

## 环境要求

- Node.js 18+
- npm 9+

## 安装依赖

```bash
npm install
```

## 启动开发模式

```bash
npm run dev
```

默认端口是 `4173`，修改 `PORT` 环境变量即可自定义端口。

## 构建静态站点

```bash
npm run build
```

构建完成后输出到 `dist/` 目录。

## 目录说明

```text
docs/               # Markdown 文档源
public/assets/      # 样式和前端脚本
scripts/            # build/dev 入口
src/                # 文档系统核心
test/               # 测试
```

## 新增一篇文档

1. 在 `docs/` 下创建 `.md` 文件，例如 `docs/guide/new-page.md`
2. 添加 Frontmatter：

```md
---
title: 新页面
order: 10
---
```

3. 写正文并保存，开发模式会自动重建
