---
title: 示例
order: 5
---

# 示例

## Hello World

```
打印("你好，世界")
```

## 斐波那契数列

```
fn 斐波那契(n):
    if n <= 1:
        return n
    return 斐波那契(n - 1) + 斐波那契(n - 2)

for i in range(10):
    打印(斐波那契(i))
```

## 结构体与方法

```
结构体 矩形:
    宽: int
    高: int

    fn 面积(self):
        return self.宽 * self.高

    fn 描述(self):
        return f"矩形 {self.宽}x{self.高}，面积 {self.面积()}"

令 r = 矩形{宽: 10, 高: 5}
打印(r.描述())
```

## 生成器

```
fn 无限计数(起始):
    令 n = 起始
    当 真:
        产出 n
        n = n + 1

令 计数器 = 无限计数(1)
for i in range(5):
    打印(计数器.__next__())
```

## 多线程并行计算

```
fn 求和(列表):
    令 总 = 0
    for x in 列表:
        总 = 总 + x
    return 总

令 数据 = range(1000000)
令 一半 = len(数据) / 2

令 任务1 = 启动 fn(): return 求和(数据[0..一半])
令 任务2 = 启动 fn(): return 求和(数据[一半..len(数据)])

令 结果 = 任务1.等待() + 任务2.等待()
打印(f"总和：{结果}")
```

## HTTP 服务器

```
导入 网络, json

结构体 用户:
    id: int
    名字: str

令 用户列表 = [
    用户{id: 1, 名字: "小明"},
    用户{id: 2, 名字: "小红"}
]

令 应用 = 网络.应用()

应用.获取("/users", fn(请求, 响应):
    响应.json(用户列表)
)

应用.获取("/users/:id", fn(请求, 响应):
    令 id = 请求.params.id
    for u in 用户列表:
        if u.id == id:
            响应.json(u)
            return
    响应.状态(404).发送("未找到")
)

打印("服务器启动在 http://localhost:8080")
应用.监听(8080)
```

## 错误处理

```
fn 除法(a, b):
    if b == 0:
        throw "除数不能为零"
    return a / b

尝试:
    打印(除法(10, 2))
    打印(除法(10, 0))
捕获 err:
    打印(f"错误：{err}")
```

## 文件读写

```
导入 file

令 f = file.open("data.txt", "w")
file.write(f, "第一行\n第二行\n第三行\n")
file.close(f)

令 f = file.open("data.txt", "r")
令 行列表 = file.readlines(f)
file.close(f)

for 行 in 行列表:
    打印(行)
```
