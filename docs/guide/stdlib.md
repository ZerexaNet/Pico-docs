---
title: 标准库
order: 4
---

# 标准库

所有模块通过 `import` / `导入` 加载，内置函数无需导入直接使用。

## 内置函数

| 函数 | 中文别名 | 说明 |
|------|----------|------|
| `print(...)` | `打印(...)` | 打印，不换行 |
| `println(...)` | `打印行(...)` | 打印并换行 |
| `input(提示)` | `输入(提示)` | 读取一行输入 |
| `len(x)` | `长度(x)` | 字符串或列表长度 |
| `range(n)` | — | 生成 0..n-1 的列表 |
| `range(a, b)` | — | 生成 a..b-1 的列表 |

## str — 字符串

```
导入 str

str.upper("hello")        # "HELLO"
str.lower("HELLO")        # "hello"
str.trim("  hi  ")        # "hi"
str.split("a,b,c", ",")   # ["a", "b", "c"]
str.join(["a","b"], "-")  # "a-b"
str.contains("hello", "ell")  # true
str.replace("hello", "l", "r")  # "herro"
```

## list — 列表

```
导入 list

令 l = [3, 1, 2]
list.push(l, 4)           # [3, 1, 2, 4]
list.pop(l)               # 移除并返回最后一个
list.sort(l)              # 原地排序
list.map(l, fn(x): return x * 2)
list.filter(l, fn(x): return x > 1)
list.reduce(l, fn(acc, x): return acc + x, 0)
```

## map — 字典

```
导入 map

令 m = {name: "pico", version: 1}
map.keys(m)               # ["name", "version"]
map.values(m)             # ["pico", 1]
map.has(m, "name")        # true
map.delete(m, "version")
```

## math — 数学

```
导入 math

math.abs(-5)      # 5
math.sqrt(16)     # 4.0
math.pow(2, 10)   # 1024
math.floor(3.7)   # 3
math.ceil(3.2)    # 4
math.min(1, 2)    # 1
math.max(1, 2)    # 2
math.rand()       # 0.0 ~ 1.0 随机数
math.pi           # 3.14159...
```

## file — 文件

```
导入 file

令 f = file.open("data.txt", "r")
令 内容 = file.read(f)
令 行列表 = file.readlines(f)
file.close(f)

令 f = file.open("out.txt", "w")
file.write(f, "hello\n")
file.close(f)

file.exists("data.txt")   # true / false
```

## 网络 — HTTP

```
导入 网络

# HTTP 客户端
令 响应 = 网络.获取("https://api.example.com/data")

# HTTP 服务器
令 应用 = 网络.应用()
应用.获取("/", fn(请求, 响应):
    响应.发送("hello world")
)
应用.监听(8080)
```

## json

```
导入 json

令 文本 = json.stringify({name: "pico", ok: true})
# '{"name":"pico","ok":true}'
```
