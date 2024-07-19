---
title: '属性(Attributes)'
---

`属性(Attributes)` 在 Rust 中是一种特殊的语法，它们可以提供关于代码块、函数、结构体、枚举等元素的附加信息。Rust 编译器会使用这些信息来更好地理解、处理代码。

属性有两种主要形式：**内部属性**和外部属性。内部属性(Inner Attributes)用于设置 crate 级别的元数据，例如 crate 名称、版本和类型等。而外部属性(Outer Attributes)则应用于模块、函数、结构体等，用于设置编译条件、禁用 lint、启用编译器特性等。

之前我们已经反复接触过了属性应用的一个基本例子：

```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: u32,
}
```

在这个例子中，`#[derive(Debug)]` 是一个属性，它告诉 Rust 编译器自动为 `Person` 结构体实现 `Debug` trait。这样我们就可以打印出该结构体的调试信息。

下面是几个常用属性的具体说明：

## 13.1 条件编译

`#[cfg(...)]`。这个属性可以根据特定的编译条件来决定是否编译某段代码。

### 13.1.1 在特定操作系统执行不同代码

你可能想在只有在特定操作系统上才编译某段代码：

```rust
#[cfg(target_os = "linux")]  //编译时会检查代码中的 #[cfg(target_os = "linux")] 属性
fn on_linux() {
    println!("This code is compiled on Linux only.");
}

#[cfg(target_os = "windows")]  //编译时会检查代码中的 #[cfg(target_os = "windows")] 属性
fn on_windows() {
    println!("This code is compiled on Windows only.");
}

fn main() {
    on_linux();
    on_windows();
}
```

在上面的示例中，`on_linux`函数只在目标操作系统是Linux时被编译，而`on_windows`函数只在目标操作系统是Windows时被编译。你可以根据需要在`cfg`属性中使用不同的条件。

### 13.1.2 条件编译测试

`#[cfg(test)]` 通常属性用于条件编译，将测试代码限定在测试环境(`cargo test`)中。

当你的 Rust 源代码中包含 `#[cfg(test)]` 时，这些代码将仅在运行测试时编译和执行。**在正常构建时，这些代码会被排除在外。**所以一般用于编写测试相关的辅助函数或测试模拟。

**示例：**

```
rustCopy code#[cfg(test)]
mod tests {
    // 此模块中的代码仅在测试时编译和执行
    #[test]
    fn test_addition() {
        assert_eq!(2 + 2, 4);
    }
}
```

## 13.2 禁用 lint

`#[allow(...)]` 或 `#[deny(...)]`。这些属性可以禁用或启用特定的编译器警告。例如，你可能会允许一个被认为是不安全的代码模式，因为你的团队和你本人都确定你的代码是安全的。

### 13.2.1 允许可变引用转变为不可变

```rust
#[allow(clippy::mut_from_ref)]
fn main() {
    let x = &mut 42;
    let y = &*x;
    **y += 1;
    println!("{}", x); // 输出 43
}
```

在这个示例中，`#[allow(clippy::mut_from_ref)]`属性允许使用`&mut`引用转换为`&`引用的代码模式。如果没有该属性，编译器会发出警告，因为这种代码模式可能会导致意外的行为。但是在这个特定的例子中，你知道代码是安全的，因为你没有在任何地方对`y`进行再次的借用。

### 13.2.2 强制禁止未使用的`self`参数

另一方面，`#[deny(...)]`属性可以用于禁止特定的警告。这可以用于在团队中强制执行一些编码规则或安全性标准。例如：

```rust
#[deny(clippy::unused_self)]
fn main() {
    struct Foo;
    impl Foo {
        fn bar(&self) {}
    }
    Foo.bar(); // 这将引发一个编译错误，因为`self`参数未使用
}
```

在这个示例中，`#[deny(clippy::unused_self)]`属性禁止了未使用的`self`参数的警告。这意味着，如果团队成员在他们的代码中没有正确地使用`self`参数，他们将收到一个编译错误，而不是一个警告。这有助于确保团队遵循一致的编码实践，并减少潜在的错误或安全漏洞。

### 13.2.3 其他常见 可用属性

下面是一些其他常见的`allow`和`deny`选项：

1. `warnings`: 允许或禁止所有警告。
   示例：`#[allow(warnings)]` 或 `#[deny(warnings)]`
2. `unused_variables`: 允许或禁止未使用变量的警告。
   示例：`#[allow(unused_variables)]` 或 `#[deny(unused_variables)]`
3. `unused_mut`: 允许或禁止未使用可变变量的警告。
   示例：`#[allow(unused_mut)]` 或 `#[deny(unused_mut)]`
4. `unused_assignments`: 允许或禁止未使用赋值的警告。
   示例：`#[allow(unused_assignments)]` 或 `#[deny(unused_assignments)]`
5. `dead_code`: 允许或禁止死代码的警告。
   示例：`#[allow(dead_code)]` 或 `#[deny(dead_code)]`
6. `unreachable_patterns`: 允许或禁止不可达模式的警告。
   示例：`#[allow(unreachable_patterns)]` 或 `#[deny(unreachable_patterns)]`
7. `clippy::all`: 允许或禁止所有Clippy lints的警告。
   示例：`#[allow(clippy::all)]` 或 `#[deny(clippy::all)]`
8. `clippy::pedantic`: 允许或禁止所有Clippy lints的警告，包括一些可能误报的情况。
   示例：`#[allow(clippy::pedantic)]` 或 `#[deny(clippy::pedantic)]`

这些选项只是其中的一部分，Rust编译器和Clippy工具还提供了其他许多lint选项。你可以根据需要选择适当的选项来配置编译器的警告处理行为。

### 补充学习：不可达模式

'unreachable'宏是用来指示编译器某段代码是不可达的。

当编译器无法确定某段代码是否不可达时，这很有用。例如，在模式匹配语句中，如果某个分支的条件永远不会满足，编译器就可能标记这个分支的代码为'unreachable'。

如果这段被标记为'unreachable'的代码实际上能被执行到，程序会立即panic并终止。此外，Rust还有一个对应的不安全函数'unreachable_unchecked'，即如果这段代码被执行到，会导致未定义行为。

假设我们正在编写一个程序来处理股票交易。在这个程序中，我们可能会遇到这样的情况：

```rust
fn process_order(order: &Order) -> Result<(), Error> {
    match order.get_type() {
        OrderType::Buy => {
            // 执行购买逻辑...
            Ok(())
        },
        OrderType::Sell => {
            // 执行卖出逻辑...
            Ok(())
        },
        _ => unreachable!("Invalid order type"),
    }
}
```

在这个例子中，我们假设订单类型只能是“买入”或“卖出”。如果有其他的订单类型，我们就用 `unreachable!()` 宏来表示这种情况是不应该发生的。如果由于某种原因，我们的程序接收到了一个我们不知道的订单类型，程序就会立即 panic，这样我们就可以立即发现问题，而不是让程序继续执行并可能导致错误。

## 13.3 启用编译器的特性

在 Rust 中，`#[feature(...)]` 属性用于启用编译器的特定特性。以下是一个示例案例，展示了使用 `#[feature(...)]` 属性启用全局导入(glob import)和宏(macros)的特性：

```rust
#![feature(glob_import, proc_macro_hygiene)]

use std::collections::*; // 全局导入 std::collections 模块中的所有内容

#[macro_use]
extern crate my_macros; // 启用宏特性，并导入外部宏库 my_macros

fn main() {
    let mut map = HashMap::new(); // 使用全局导入的 HashMap 类型
    map.insert("key", "value");
    println!("{:?}", map);

    my_macro!("Hello, world!"); // 使用外部宏库 my_macros 中的宏 my_macro!
}
```

在这个示例中，`#![feature(glob_import, proc_macro_hygiene)]` 属性启用了全局导入和宏的特性。接下来，`use std::collections::*;` 语句使用全局导入将 `std::collections` 模块中的**所有内容**导入到当前作用域。然后，`#[macro_use] extern crate my_macros;` 语句启用了宏特性，并导入了名为 `my_macros` 的**外部宏库**。

在 `main` 函数中，我们创建了一个 `HashMap` 实例，并使用了全局导入的 `HashMap` 类型。接下来，我们调用了 `my_macro!("Hello, world!");` 宏，该宏在编译时会被扩展为相应的代码。

注意，使用 `#[feature(...)]` 属性启用特性是编译器相关的，**不同的 Rust 编译器版本可能支持不同的特性集合**。在实际开发中，应该根据所使用的 Rust 版本和编译器特性来选择适当的特性。

## 13.4 链接到一个非 Rust 语言的库

`#[link(...)]` 是 Rust 中用于告诉编译器如何链接到外部库的属性。它通常用于与非 Rust 语言编写的库进行交互。 `#[link]` 属性通常**不需要显式声明**，而是通过在 Cargo.toml 文件中的 `[dependencies]` 部分指定外部库的名称来完成链接。

假设你有一个C语言库，其中包含一个名为 `my_c_library` 的函数，你想在Rust中使用这个函数。

1. 首先，确保你已经安装了Rust，并且你的Rust项目已经初始化。

2. 创建一个新的Rust源代码文件，例如 `main.rs`。

3. 在Rust源代码文件中，使用 `extern` 关键字声明外部C函数的原型，并使用 `#[link]` 属性指定要链接的库的名称。示例如下：

```rust
extern {
    // 声明外部C函数的原型
    fn my_c_library_function(arg1: i32, arg2: i32) -> i32;
}

fn main() {
    let result;
    unsafe {
        // 调用外部C函数
        result = my_c_library_function(42, 23);
    }
    println!("Result from C function: {}", result);
}
```

4. 编译你的Rust代码，同时链接到C语言库，可以使用 `rustc` 命令，但更常见的是使用 `Cargo` 构建工具。首先，确保你的项目的 `Cargo.toml` 文件中包含以下内容：

```toml
[dependencies]
```

然后，运行以下命令：

```bash
cargo build
```

Cargo 将会自动查找系统中是否存在 `my_c_library`，如果找到的话，它将会链接到该库并编译你的Rust代码。

## 13.5 标记函数作为单元测试

`#[test]`。这个属性可以标记一个函数作为单元测试函数，这样你就可以使用 Rust 的测试框架来运行这个测试。下面是一个简单的例子：

```rust
#[test]
fn test_addition() {
    assert_eq!(2 + 2, 4);
}
```

在这个例子中，`#[test]` 属性被应用于 `test_addition` 函数，表示它是一个单元测试。函数体中的 `assert_eq!` 宏用于断言两个表达式是否相等。在这种情况下，它检查 `2 + 2` 是否等于 `4`。如果这个表达式返回 `true`，那么测试就会通过。如果返回 `false`，测试就会失败，并输出相应的错误信息。

你可以在测试函数中使用其他宏和函数来编写更复杂的测试逻辑。例如，你可以使用 `assert!` 宏来断言一个表达式是否为真，或者使用 `assert_ne!` 宏来断言两个表达式是否不相等。

**注意**，\#[test]和\#[cfg(test)]是有区别的：

| 特性             | `#[test]`                                     | `#[cfg(test)]`                        |
| ---------------- | --------------------------------------------- | ------------------------------------- |
| 用途             | 用于标记单元测试函数                          | 用于条件编译测试相关的代码            |
| 所属上下文       | 函数级别的属性                                | 代码块级别的属性                      |
| 执行时机         | 在测试运行时执行                              | 仅在运行测试时编译和执行              |
| 典型用法         | 编写和运行测试用例                            | 包含测试辅助函数或模拟的代码          |
| 示例             | `rust fn test_function() {...}`               | `rust #[cfg(test)] mod tests { ... }` |
| 测试运行方式     | 在测试模块中执行，通常由测试运行器管理        | 在测试环境中运行，正常构建时排除      |
| 是否需要断言宏   | 通常需要使用断言宏(例如 `assert_eq!`)进行测试 | 不一定需要，可以用于编写测试辅助函数  |
| 用于组织测试代码 | 直接包含在测试函数内部                        | 通常包含在模块中                      |

但是这两个属性通常一起使用，`#[cfg(test)]` 用于包装测试辅助代码和模拟，而 `#[test]` 用于标记要运行的测试用例函数。在19章我们还会详细叙述测试的应用。

## 13.6 标记函数作为基准测试的某个部分

使用 Rust 编写基准测试时，可以使用 `#[bench]` 属性来标记一个函数作为基准测试函数。下面是一个简单的例子，展示了如何使用 `#[bench]` 属性和 Rust 的基准测试框架来测试一个函数的性能。

```rust
use test::Bencher;

#[bench]
fn bench_addition(b: &mut Bencher) {
    b.iter(|| {
        let sum = 2 + 2;
        assert_eq!(sum, 4);
    });
}
```

在这个例子中，我们定义了一个名为 `bench_addition` 的函数，并使用 `#[bench]` 属性进行标记。函数接受一个 `&mut Bencher` 类型的参数 `b`，它提供了用于运行基准测试的方法。

在函数体中，我们使用 `b.iter` 方法来指定要重复运行的测试代码块。这里使用了一个闭包 `|| { ... }` 来定义要运行的代码。在这个例子中，我们简单地将 `2 + 2` 的结果存储在 `sum` 变量中，并使用 `assert_eq!` 宏来断言 `sum` 是否等于 `4`。

要运行这个基准测试，可以在终端中使用 `cargo bench` 命令。Rust 的基准测试框架会自动识别并使用 `#[bench]` 属性标记的函数，并运行它们以测量性能。
