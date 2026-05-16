---
title: 快速开始
order: 2
---

# 快速开始

## 下载

从 [GitHub Releases](https://github.com/ZerexaNet/Pico/releases/latest) 下载对应平台的二进制文件：

| 平台 | 文件名 |
|------|--------|
| Linux | `pico-linux-v*` |
| Windows | `pico-windows-v*.exe` |
| macOS | `pico-macos-v*` |

Linux / macOS 需要添加执行权限：

```bash
chmod +x pico-linux-v1.0.1
./pico-linux-v1.0.1
```

## 从源码编译

需要 GCC 和 Make：

```bash
git clone https://github.com/ZerexaNet/Pico.git
cd Pico
make
./pico
```

Windows 需要 MSYS2 UCRT64 环境：

```bash
make  # 自动链接 -lws2_32
```

## 运行 REPL

```
$ ./pico
pico> 打印("你好，世界")
你好，世界
pico> 令 x = 1 + 2
pico> x
3
pico> :quit
```

REPL 特殊命令：

| 命令 | 说明 |
|------|------|
| `:quit` / `:退出` | 退出 |
| `:type <表达式>` | 查看类型 |
| `:env` | 查看当前所有变量 |

## 运行脚本

```bash
./pico run hello.pico
```

## 编译为原生二进制

```bash
./pico build hello.pico   # 生成 ./hello
```
