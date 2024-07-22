# 外部函数接口 (FFI)

你可以在月兔中通过外部函数接口来使用外部的函数，与宿主环境交互。一般在嵌入浏览器环境或命令行环境（通过[Wasmtime](https://wasmtime.dev/)等项目）时使用。

⚠ 警告：月兔还在初期开发阶段，内容可能会过时。

## 外部函数接口

### 声明外部引用

你可以定义一个这样的外部引用类型：

```moonbit
type Canvas_ctx
```

这将会定义一个外部对象的引用。在我们的例子中，它代表了宿主 JavaScript 环境中的一个`CanvasRenderingContext2D`对象。

### 声明外部函数

你可以像这样定义一个外部函数：

```moonbit
fn cos(d : Double) -> Double = "Math" "cos"
```

它和正常的函数定义十分相像，除了函数体被替换为两个字符串。

对于 WasmGC 后端，这两个字符串是用来在 Wasm 导入的对象中识别特定的函数：第一个字符串是模块名称，第二个字符串是函数名称。对于 JS 后端，这两个字符串被用于访问全局命名空间中的一个静态函数。上述例子会编译为类似`const cos = (d) => Math.cos(d)`

你也可以定义内联函数，函数体是一个字符串。

对于 WasmGC 后端，你可以以一个不含名称的 Wasm 函数定义它（名称将会在之后自动生成）：

```moonbit
extern "wasm" fn abs(d : Double) -> Double =
  #|(func (param f64) (result f64))
```

而对于 JS 后端，你可以定义一个箭头函数表达式：

```javascript
extern "js" fn abs(d : Double) -> Double =
  #|(d) => Math.abs(d)
```

在声明之后，你可以像普通的函数那样使用外部函数。

对于多后端项目，你可以在以`.wasm.mbt` `.wasm-gc.mbt` `.js.mbt`结尾的文件中定义后端相关代码。

你也可以定义一个使用外部引用类型的外部函数，就像这样：

```moonbit
fn begin_path(self: Canvas_ctx) = "canvas" "begin_path"
```

之后可以将它应用到拥有的外部对象的引用上，如：`context.begin_path()`。

### 导出函数

公开函数（非方法、非多态）可以被导出，需要在对应包的`moon.pkg.json`中添加链接设置：

```json
{
  "link": {
    "wasm": {
      "exports": ["add", "fib:test"]
    },
    "wasm-gc": {
      "exports": ["add", "fib:test"]
    },
    "js": {
      "exports": ["add", "fib:test"],
      "format": "esm"
    }
  }
}
```

每一个后端都有一个单独的定义。对 JS 后端，还有一个额外的`format`选项，可以用来指定生成的 JS 文件，是 ES Module（`esm`），还是 CommonJS module (`cjs`)，还是立即调用函数表达式（`iife`）。

上面的例子中，`add`和`fib`函数将会在编译时被导出，并且`fib`函数将被以`test`为名导出。

对于 WasmGC 后端，`_start`函数总是应当被使用，以初始化月兔程序中定义的全局实例。

### 使用编译的 Wasm

使用编译后的 Wasm ，你需要首先在宿主环境中初始化 Wasm 模块。这一步需要满足 Wasm 模块对外部函数的依赖。之后可以使用 Wasm 模块提供的函数。

#### 提供宿主函数

使用编译后的 WasmGC ，你需要在 WasmGC 导入对象中提供**所有**声明过的外部函数。

例如，在 JavaScript 中使用包含上述代码片段编译的 Wasm：

```js
WebAssembly.instantiateStreaming(fetch('xxx.wasm'), {
  Math: {
    cos: (d) => Math.cos(d)
  }
})
```

具体信息可以查阅嵌入 Wasm 的宿主环境的文档，例如[MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)。

## 例子：笑脸

让我们来看一个使用月兔利用画布（Canvas）API 画一个简单笑脸的例子。假设利用`moon new draw`创建了一个新项目。

```moonbit title="lib/draw.mbt"
// 我们首先定义一个类型，代表着绘画的上下文
type Canvas_ctx

// 我们再定义外部函数接口
fn begin_path(self : Canvas_ctx) = "canvas" "beginPath"
fn arc(self : Canvas_ctx, x : Int, y : Int, radius : Int, start_angle : Double,
    end_angle : Double, counterclockwise : Bool) = "canvas" "arc"
fn move_to(self : Canvas_ctx, x : Int, y : Int) = "canvas" "moveTo"
fn stroke(self : Canvas_ctx) = "canvas" "stroke"

fn get_pi() -> Double = "math" "PI"
let pi : Double = get_pi()

// 我们使用这些函数来定义一个在绘画上下文中绘制的函数
pub fn draw(self : Canvas_ctx) -> Unit {
  self.begin_path()
  self.arc(75, 75, 50, 0.0, pi * 2.0, true) // Outer circle
  self.move_to(110, 75)
  self.arc(75, 75, 35, 0.0, pi, false) // Mouth (clockwise)
  self.move_to(65, 65)
  self.arc(60, 65, 5, 0.0, pi * 2.0, true) // Left eye
  self.move_to(95, 65)
  self.arc(90, 65, 5, 0.0, pi * 2.0, true) // Right eye
  self.stroke()
}

// 我们在这里也演示`println`的功能
pub fn display_pi() -> Unit {
  println("PI: \(pi)")
}
```

```json title="lib/moon.pkg.json"
{
  "link": {
    "wasm": {
      "exports": ["draw", "display_pi"]
    },
    "wasm-gc": {
      "exports": ["draw", "display_pi"]
    }
  }
}
```

我们使用 `moon build` 构建项目。我们推荐尽可能地使用默认后端，即带有 GC 支持的 Wasm 来构建。如果宿主环境不支持 GC 特性，那么可以使用 `--target wasm` 选项来构建项目。

在 JavaScript 中使用它：

```html title="./index.html"
<html lang="en">
  <body>
    <canvas id="canvas" width="150" height="150"></canvas>
  </body>
  <script>
    // 定义宿主函数的导入对象
    const importObject = {
      // TODO
    }

    const canvas = document.getElementById('canvas')
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d')
      WebAssembly.instantiateStreaming(
        fetch('target/wasm-gc/release/build/lib/lib.wasm'),
        importObject
      ).then((obj) => {
        // 总是调用_start来初始化环境
        obj.instance.exports._start()
        // 将JS对象当作参数传递以绘制笑脸
        obj.instance.exports['draw'](ctx)
        // 显示PI的值
        obj.instance.exports['display_pi']()
      })
    }
  </script>
</html>
```

对于导入对象，我们需要提供先前定义的程序中用到的外部函数接口：画布的绘制接口、数学接口以及`println`和`print`使用的往控制台输出的接口。

对于画布的接口和数学接口，我们可以用以下代码，把对象的方法转化为一个函数，使得第一个参数是对象；并且将对象的常值转化为一个获得该值的函数：

```javascript
function prototype_to_ffi(prototype) {
  return Object.fromEntries(
    Object.entries(Object.getOwnPropertyDescriptors(prototype))
      .filter(([_key, value]) => value.value)
      .map(([key, value]) => {
        if (typeof value.value == 'function')
          return [key, Function.prototype.call.bind(value.value)]
        // TODO: 我们也可以将属性转化为getter和setter
        else return [key, () => value.value]
      })
  )
}

const importObject = {
  canvas: prototype_to_ffi(CanvasRenderingContext2D.prototype),
  math: prototype_to_ffi(Math)
  // ...
}
```

至于我们的输出功能，我们可以定义如下的闭包：它提供了一个缓存来存储字符串的字节，直到需要被输出到控制台为止：

```javascript
const [log, flush] = (() => {
  var buffer = []
  function flush() {
    if (buffer.length > 0) {
      console.log(
        new TextDecoder('utf-16').decode(new Uint16Array(buffer).valueOf())
      )
      buffer = []
    }
  }
  function log(ch) {
    if (ch == '\n'.charCodeAt(0)) {
      flush()
    } else if (ch == '\r'.charCodeAt(0)) {
      /* noop */
    } else {
      buffer.push(ch)
    }
  }
  return [log, flush]
})()

const importObject = {
  // ...
  spectest: {
    print_char: log
  }
}

// ...
WebAssembly.instantiateStreaming(
  fetch('target/wasm-gc/release/build/lib/lib.wasm'),
  importObject
).then((obj) => {
  obj.instance.exports._start()
  // ...
  flush()
})
```

现在我们可以把之前的内容结合起来，获得我们最终的`index.html`：

```html title="./index.html
<!doctype html>
<html>
  <head></head>

  <body>
    <canvas id="canvas" width="150" height="150"></canvas>
    <script>
      function prototype_to_ffi(prototype) {
        return Object.fromEntries(
          Object.entries(Object.getOwnPropertyDescriptors(prototype))
            .filter(([_key, value]) => value.value)
            .map(([key, value]) => {
              if (typeof value.value == 'function')
                return [key, Function.prototype.call.bind(value.value)]
              else return [key, () => value.value]
            })
        )
      }

      const [log, flush] = (() => {
        var buffer = []
        function flush() {
          if (buffer.length > 0) {
            console.log(
              new TextDecoder('utf-16').decode(
                new Uint16Array(buffer).valueOf()
              )
            )
            buffer = []
          }
        }
        function log(ch) {
          if (ch == '\n'.charCodeAt(0)) {
            flush()
          } else if (ch == '\r'.charCodeAt(0)) {
            /* noop */
          } else {
            buffer.push(ch)
          }
        }
        return [log, flush]
      })()

      const importObject = {
        canvas: prototype_to_ffi(CanvasRenderingContext2D.prototype),
        math: prototype_to_ffi(Math),
        spectest: {
          print_char: log
        }
      }

      const canvas = document.getElementById('canvas')
      if (canvas.getContext) {
        const ctx = canvas.getContext('2d')
        WebAssembly.instantiateStreaming(
          fetch('target/wasm-gc/release/build/lib/lib.wasm'),
          importObject
        ).then((obj) => {
          obj.instance.exports._start()
          obj.instance.exports['draw'](ctx)
          obj.instance.exports['display_pi']()
          flush()
        })
      }
    </script>
  </body>
</html>
```

确保`draw.wasm`以及`index.html`在同一个文件夹下，之后在文件夹中启动 HTTP 服务器，例如使用 Python ：

```bash
python3 -m http.server 8080
```

在浏览器中打开 [http://localhost:8080](http://localhost:8080) 后，应该可以看到屏幕上的一个笑脸以及控制台的输出：

![A smile face webpage with browser devtools open](./imgs/smile_face_with_log.png)
