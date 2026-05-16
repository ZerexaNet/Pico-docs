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

> [!WARNING]
> WASM 环境下 Mutex 为 stub，lock/unlock 无效果。

```
令 锁 = Mutex()
锁.lock()
锁.unlock()
```

### Channel / 通道

> [!WARNING]
> WASM 环境下 Channel 为 stub，send/recv 无效果。

```
令 ch = Channel(容量)   # 有缓冲通道
ch.send(值)
令 v = ch.recv()        # 阻塞直到有值
```

---

## net / 网络

> [!WARNING]
> WASM 环境下 `net.listen` 为 stub，无法启动 HTTP 服务器。

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

> [!WARNING]
> Qt 绑定需编译时加 `-DQT_AVAILABLE` 并链接 Qt 库。未启用时所有 `ui.*` 调用返回 nil，不报错。WASM 构建中 Qt 完全不可用。

```
令 窗口 = ui.window("标题", 宽, 高)   # 创建窗口
令 按钮 = ui.button("文字")           # 创建按钮
令 标签 = ui.label("文字")            # 创建标签
令 输入 = ui.input("占位符")          # 创建输入框

ui.add(窗口, 按钮)                    # 向窗口添加控件
ui.show(窗口)                         # 显示窗口
ui.on_click(按钮, fn(): 打印("点击")) # 绑定点击事件
ui.exec()                             # 启动事件循环（阻塞）
```

中文别名：`ui.窗口` `ui.按钮` `ui.标签` `ui.输入框` `ui.添加` `ui.显示` `ui.点击时` `ui.运行`

完整示例：

```
令 窗口 = ui.窗口("Pico App", 400, 300)
令 按钮 = ui.按钮("点击我")
令 标签 = ui.标签("等待点击...")

ui.点击时(按钮, fn():
    打印("按钮被点击")
)

ui.添加(窗口, 标签)
ui.添加(窗口, 按钮)
ui.显示(窗口)
ui.运行()
```

---

## WASM / 浏览器运行

> [!WARNING]
> WASM 构建仅支持核心语言特性（运算、控制流、结构体、闭包、JSON）。线程、协程、网络（`net.listen`）、Qt GUI 均为 stub，调用无效果。

编译为 WebAssembly：

```bash
emcc -std=c11 -O2 -Isrc \
  src/ast.c src/error.c src/gc.c src/interpreter.c src/lexer.c \
  src/parser.c src/value.c src/wasm_entry.c src/wasm_stubs.c src/stdlib/json.c \
  -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_pico_wasm_run","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' \
  -o pico.js
```

在浏览器中调用：

```html
<script src="pico.js"></script>
<script>
Module.onRuntimeInitialized = () => {
  const run = Module.cwrap('pico_wasm_run', 'string', ['string']);
  const output = run('打印("hello from wasm")');
  console.log(output);
};
</script>
```

也可直接从 [Releases](https://github.com/ZerexaNet/Pico/releases/latest) 下载预编译的 `pico-v*.js` + `pico-v*.wasm`。

---

## 字节码 VM

Pico 内置字节码编译器和虚拟机，支持 30+ 指令：

| 指令类别 | 指令 |
|----------|------|
| 字面量 | `OP_CONST` `OP_NIL` `OP_TRUE` `OP_FALSE` |
| 变量 | `OP_GET_LOCAL` `OP_SET_LOCAL` `OP_GET_GLOBAL` `OP_SET_GLOBAL` |
| 算术 | `OP_ADD` `OP_SUB` `OP_MUL` `OP_DIV` `OP_MOD` `OP_NEG` |
| 比较 | `OP_EQ` `OP_NEQ` `OP_LT` `OP_LE` `OP_GT` `OP_GE` |
| 逻辑 | `OP_AND` `OP_OR` `OP_NOT` |
| 控制流 | `OP_JUMP` `OP_JUMP_IF_FALSE` `OP_LOOP` |
| 集合 | `OP_MAKE_LIST` `OP_MAKE_MAP` `OP_INDEX` `OP_GET_FIELD` `OP_SET_FIELD` |
| 函数 | `OP_CALL` `OP_RETURN` `OP_MAKE_FN` |

VM 与树遍历解释器并存，当前默认使用解释器。

---

## REPL 命令

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
