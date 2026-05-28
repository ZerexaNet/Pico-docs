---
title: SDK
order: 6
---

# SDK

Pico 提供两套 C SDK：**嵌入 SDK**（在 C 项目中运行 Pico）和**扩展 SDK**（用 C 写 Pico 原生模块）。

---

## 嵌入 SDK

头文件：`sdk/pico.h`

### 基本用法

```c
#include "sdk/pico.h"

PicoVM *vm = pico_new();
pico_run_string(vm, "print(\"hello from Pico\")");
pico_free(vm);
```

### API 参考

#### 生命周期

```c
PicoVM *pico_new(void);       // 创建虚拟机
void    pico_free(PicoVM *vm); // 释放
```

#### 执行

```c
PicoVal pico_run_string(PicoVM *vm, const char *src);
PicoVal pico_run_file(PicoVM *vm, const char *path);
```

#### 设置全局变量

```c
void pico_set_int(PicoVM *vm, const char *name, int64_t v);
void pico_set_float(PicoVM *vm, const char *name, double v);
void pico_set_string(PicoVM *vm, const char *name, const char *v);
void pico_set_bool(PicoVM *vm, const char *name, bool v);
```

#### 读取全局变量

```c
PicoVal pico_get(PicoVM *vm, const char *name);
```

#### 注册 C 函数

```c
typedef PicoVal (*PicoNativeFn)(int argc, PicoVal *argv);
void pico_register(PicoVM *vm, const char *name, PicoNativeFn fn);
```

最多注册 64 个原生函数。

#### 错误检查

```c
bool        pico_has_error(PicoVM *vm);
const char *pico_error_msg(PicoVM *vm);
```

#### PicoVal 类型

```c
typedef enum { PICO_NIL, PICO_BOOL, PICO_INT, PICO_FLOAT, PICO_STRING, PICO_ERROR } PicoType;

typedef struct {
    PicoType type;
    union { bool boolean; int64_t integer; double floating; char *string; };
} PicoVal;

// 构造宏
PICO_NIL_V
PICO_INT_V(n)
PICO_FLOAT_V(f)
PICO_BOOL_V(b)
PICO_STR_V(s)
```

### 完整示例

```c
#include "sdk/pico.h"
#include <stdio.h>

static PicoVal c_add(int argc, PicoVal *argv) {
    if (argc < 2) return PICO_INT_V(0);
    return PICO_INT_V(argv[0].integer + argv[1].integer);
}

int main(void) {
    PicoVM *vm = pico_new();

    pico_set_string(vm, "app_name", "MyApp");
    pico_set_int(vm, "version", 1);
    pico_register(vm, "c_add", c_add);

    pico_run_string(vm, "print(app_name, version)");
    pico_run_string(vm, "print(c_add(10, 32))");

    pico_run_string(vm, "let result = c_add(100, 200)");
    PicoVal r = pico_get(vm, "result");
    printf("result: %lld\n", (long long)r.integer);

    if (pico_has_error(vm))
        fprintf(stderr, "error: %s\n", pico_error_msg(vm));

    pico_free(vm);
}
```

### 编译

```bash
gcc -std=c11 -Isdk -Isrc \
    examples/sdk/embed_example.c sdk/pico.c \
    src/*.c src/stdlib/*.c \
    -lm -lpthread -o embed_example
```

---

## 扩展 SDK

头文件：`sdk/pico_ext.h`

用 C 编写 Pico 原生模块，编译为共享库后通过 `import` 加载。

### 基本用法

```c
#include "sdk/pico_ext.h"
#include <math.h>

static PicoVal my_sqrt(int argc, PicoVal *argv) {
    if (argc < 1) return PICO_NIL_V;
    double x = argv[0].type == PICO_INT ? (double)argv[0].integer : argv[0].floating;
    return PICO_FLOAT_V(sqrt(x));
}

PICO_MODULE(mymod) {
    PICO_EXPORT("sqrt", my_sqrt);
}
```

### 宏参考

```c
// 定义模块入口
PICO_MODULE(模块名) { ... }

// 在模块内导出函数
PICO_EXPORT("函数名", c_函数指针);

// 参数数量检查辅助
pico_check_argc(got, want, &out_val);
```

### 编译

```bash
gcc -std=c11 -shared -fPIC -Isdk -Isrc mymod.c -o mymod.so
```

完整示例见 [examples/sdk/](https://github.com/ZerexaNet/Pico/tree/main/examples/sdk/)。
