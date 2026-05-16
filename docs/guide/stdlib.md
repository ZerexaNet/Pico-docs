---
title: 标准库
order: 4
---

# 标准库

## 内置函数（无需导入）

### print / 打印

```
print(值1, 值2, ...)
打印(值1, 值2, ...)
```

打印所有参数，空格分隔，末尾换行。

```
打印("hello", "world")   # hello world
打印(1, 2, 3)            # 1 2 3
```

### range

```
range(n)         # 生成 [0, 1, ..., n-1]
range(start, end) # 生成 [start, ..., end-1]
```

```
range(5)         # [0, 1, 2, 3, 4]
range(2, 6)      # [2, 3, 4, 5]
```

### len / 长度

```
len(字符串)   # 字节长度
len(列表)     # 元素个数
```

### Mutex / 互斥锁

```
令 锁 = Mutex()
锁.lock()
锁.unlock()
```

### Channel / 通道

```
令 ch = Channel(容量)   # 有缓冲通道
ch.send(值)
令 v = ch.recv()        # 阻塞直到有值
```

---

## net / 网络

```
net.listen(端口, 处理函数)
网络.监听(端口, 处理函数)
```

启动 HTTP/1.1 服务器，阻塞运行：

```
net.listen(8080, fn(请求, 响应):
    响应.发送("hello")
)
```

---

## data / 数据

### data.json / 数据.json

序列化为 JSON 字符串：

```
data.json({name: "pico", ok: true})
# '{"name":"pico","ok":true}'

data.json([1, 2, 3])
# '[1,2,3]'
```

支持：nil → `null`，bool，int，float，string，list，map。

---

## ui / 界面

> 仅 Windows（Qt）平台可用，其他平台返回 nil。

```
令 窗口 = ui.window(标题, 宽, 高)
令 按钮 = ui.button(文字)
```

---

## REPL 命令

在交互式 REPL 中可用：

| 命令 | 说明 |
|------|------|
| `:quit` / `:exit` / `:退出` | 退出 REPL |

---

## CLI 用法

```bash
pico                    # 启动 REPL
pico run <文件.pico>    # 运行脚本
pico build <文件.pico>  # 编译为原生二进制（开发中）
```
