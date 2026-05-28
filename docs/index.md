---
title: Pico 语言
order: 1
---

# Pico 语言

Pico 是一门伪代码风格的通用编程语言，用 C 实现。

- **语法直觉**：一眼能猜出意思，关键字中英文皆可
- **即时反馈**：REPL 交互式环境，脚本直接运行
- **友好错误**：精确定位 + "你是否想说？"建议
- **标准库齐全**：IO、字符串、列表、字典、网络、文件
- **多平台**：Linux / Windows / macOS，支持编译为原生二进制

## 快速体验

```
令 名字 = "世界"
打印("你好，" + 名字)

fn 斐波那契(n):
    if n <= 1:
        return n
    return 斐波那契(n - 1) + 斐波那契(n - 2)

for i in range(10):
    打印(斐波那契(i))
```

## 文档导航

- [快速开始](/guide/getting-started/) — 安装与运行
- [语法参考](/guide/syntax/) — 完整语法说明
- [标准库](/guide/stdlib/) — 内置模块文档
- [SDK](/guide/sdk/) — C 嵌入 SDK 与扩展 SDK
- [示例](/guide/examples/) — 实用代码示例
