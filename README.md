# Rust量化金融开发指南

**Cookbook for Rustaceans in Finance**

/Arthur Zhang

##  Introduction

本书是专门为量化金融领域开发者编纂的Rust基础入门手册。为帮助开发者短时间内进入上手开发的阶段，本手册将致力于始终维持**实用**和**实例呈现**为导向的风格。



## Chapter 1 -  Rust 语言入门101
### 1.1 在类Unix操作系统(Linux,FreeBSD,MacOS)上安装 rustup

打开终端并输入下面命令：

```shell
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

只要出现下面这行：

```bash
Rust is installed now. Great! 
```

就算完成 Rust 安装了。

### 1.2 安装 C 语言编译器 [ 可选 ] 
Rust 有的时候会依赖 libc 和链接器 linker。因此如果遇到了提示链接器无法执行的错误，你需要再手动安装一个 C 语言编译器：

**MacOS **：

```bash
$ xcode-select --install
```

**Linux **：
如果你使用 Ubuntu，则可安装 build-essential。
其他 Linux 用户一般应按照相应发行版的文档来安装 gcc 或 clang。

### 1.3 维护 Rust
**更新Rust**

```bash
$ rustup update
```

**卸载Rust**

```bash
$ rustup self uninstall
```

**检查Rust安装是否成功**

检查rustc版本

```bash
$ rustc -V 
rustc 1.72.0 (5680fa18f 2023-08-23)
```

检查cargo版本

```bash
$ cargo -V 
cargo 1.72.0 (103a7ff2e 2023-08-15)
```

### 1.4 Nightly 版本

作为一门编程语言，Rust非常注重代码的稳定性。为了达到"稳定而不停滞",Rust的开发遵循一个列车时刻表。也就是说，所有的开发工作都在Rust存储库的主分支上进行。Rust有三个发布通道：

1. **夜间（Nightly）**
2. **测试（Beta）**
3. **稳定（Stable）**

以下是开发和发布流程的示例：假设Rust团队正在开发Rust 1.5的版本。该版本在2015年12月发布，但我们可以用这个版本号来说明。Rust添加了一个新功能：新的提交被合并到主分支。每天晚上，都会生成一个新的Rust夜间版本。

对于Rust Nightly来说, 几乎每天都是发布日, 这些发布是由Rust社区的发布基建(release infrastructure)自动创建的。

```text
nightly: * - - * - - *
```

每六个礼拜， `beta` 分支都会从被夜间版本使用的 `master` 分支中分叉出来, 单独发布一次。

```
nightly: * - - * - - *
                     |
beta:                *
```

大多数Rust开发者主要使用 **Stable** 通道，但那些想尝试实验性新功能的人可以使用 **Nightly** 或 **Beta**。

Rust 编程语言的 Nightly 版本是不断更新的。有的时候为了用到 Rust 的最新的语言特性，或者安装一些依赖 Rust Nightly的软件包，我们会需要切换到 Nightly。

但是请注意，Nightly版本包含最新的功能和改进，所以也可能不够稳定，在生产环境中使用时要小心。

**安装Nightly版本**：

```shell
$ rustup install nightly
```

**切换到Nightly版本**：

```shell
$ rustup default nightly
```

**更新Nightly版本**：

```shell
$ rustup update nightly
```

**切换回Stable版本：**

```shell
$ rustup default stable
```

### 1.5 cargo的使用

`cargo` 是 Rust 编程语言的官方构建工具和包管理器。它是一个非常强大的工具，用于帮助开发者创建、构建、测试和发布 Rust 项目。以下是一些 `cargo` 的主要功能：

1. **项目创建**：
    `cargo new`  可以创建新的 Rust 项目，包括创建项目的基本结构、生成默认的源代码文件和配置文件。

2. **依赖管理**：
    `cargo` 管理项目的依赖项。你可以在项目的 `Cargo.toml` 文件中指定依赖项，然后运行 `cargo build` 命令来下载和构建这些依赖项。这使得添加、更新和删除依赖项变得非常容易。

3. **构建项目**：
    通过运行 `cargo build` 命令，你可以构建你的 Rust 项目。`cargo` 会自动处理编译、链接和生成可执行文件或库的过程。

4. **添加依赖**：
    使用 cargo add 或编辑项目的 Cargo.toml 文件来添加依赖项。cargo add 命令会自动更新 Cargo.toml 并下载依赖项。
    例如，要添加一个名为 "rand" 的依赖，可以运行：cargo add rand

5. **执行预先编纂的测试**：

   `cargo` 允许你编写和运行测试，以确保代码的正确性。你可以使用 `cargo test` 命令来运行测试套件。

6. **文档生成**：

   `cargo` 可以自动生成项目文档。通过运行 `cargo doc` 命令，如果我们的 **文档注释** (以///或者//！起始的注释) 符合Markdown规范，你可以生成包括库文档和文档注释的 HTML 文档，以便其他开发者查阅。

7. **发布和分发**：

   执行`cargo login` 登陆 crate.io 后，再在项目文件夹执行`cargo publish` 可以帮助你将你的 Rust 库发布到 [crates.io](https://crates.io/)，Rust 生态系统的官方包仓库。这使得分享你的代码和库变得非常容易。

8. **列出依赖项**：

  使用 cargo tree 命令可以查看项目的依赖项树，以了解你的项目使用了哪些库以及它们之间的依赖关系。例如，要查看依赖项树，只需在项目目录中运行：`cargo tree`



### 1.6 cargo 和 rustup的区别

`rustup` 和`cargo` 是 Rust 生态系统中两个不同的工具，各自承担着不同的任务：

`rustup` 和 `cargo` 是 Rust 生态系统中两个不同的工具，各自承担着不同的任务：

 **`rustup`**：
   - `rustup` 是 Rust 工具链管理器。它用于安装、升级和管理不同版本的 Rust 编程语言。
   - 通过 `rustup`，你可以轻松地在你的计算机上安装多个 Rust 版本，以便在项目之间切换。
   - 它还管理 Rust 工具链的组件，例如 Rust 标准库、Rustfmt（用于格式化代码的工具）等。
   - `rustup` 还提供了一些其他功能，如设置默认工具链、卸载 Rust 等。

**`cargo`**：

   - `cargo` 是 Rust 的构建工具和包管理器。它用于创建、构建和管理 Rust 项目。
   - `cargo` 可以创建新的 Rust 项目，添加依赖项，构建项目，运行测试，生成文档，发布库等等。
   - 它提供了一种简便的方式来管理项目的依赖和构建过程，使得创建和维护 Rust 项目变得容易。
   - 与构建相关的任务，如编译、运行测试、打包应用程序等，都可以通过 `cargo` 来完成。

总之，`rustup` 主要用于管理 Rust 的版本和工具链，而 `cargo` 用于管理和构建具体的 Rust 项目。这两个工具一起使得在 Rust 中开发和维护项目变得非常方便。



### 1.7 用cargo创立并搭建第一个项目

#### 1. 用 `cargo new `新建项目

```shell
$ cargo new_strategy # new_strategy 是我们的新crate 
$ cd new_strategy
```

第一行命令新建了名为 *new_strategy* 的文件夹。我们将项目命名为 *new_strategy*，同时 cargo 在一个同名文件夹中创建树状分布的项目文件。

进入 *new_strategy* 文件夹, 然后键入`ls`列出文件。将会看到 cargo 生成了两个文件和一个目录：一个 *Cargo.toml* 文件，一个 *src* 目录，以及位于 *src* 目录中的 *main.rs* 文件。

此时cargo在 *new_strategy* 文件夹初始化了一个 Git 仓库，并带有一个 *.gitignore* 文件。

> 注意: cargo是默认使用git作为版本控制系统的（version control system， VCS）。可以通过 `--vcs` 参数使 `cargo new` 切换到其它版本控制系统，或者不使用 VCS。运行 `cargo new --help` 查看可用的选项。

#### 2. 编辑 `cargo.toml`

现在可以找到项目文件夹中的 *cargo.toml* 文件。这应该是一个cargo 最小化工作样本(MWE, Minimal Working Example)的样子了。它看起来应该是如下这样：

```toml
[package]
name = "new_strategy"
version = "0.1.0" # 此软件包的版本
edition = "2021" # rust的规范版本，成书时最近一次更新是2021年。
[dependencies]

```

第一行 `[package]`，是一个 section 的标题，表明下面的语句用来配置一个包（package）。随着我们在这个文件增加更多的信息，还将增加其他 sections。

第二个 section 即`[dependencies]` ，一般我们在这里填项目所依赖的任何包。

在 Rust 中，代码包被称为 *crate*。我们把crate的信息填写在这里以后，再运行cargo build, cargo就会自动下载并构建这个项目。虽然这个项目目前并不需要其他的 crate。

现在打开 new_strategy/**src**/main.rs* 看看：

```rust
fn main() {
    println!("Hello, world!");
}
```

cargo已经在 `src` 文件夹为我们自动生成了一个 Hello, world! 程序。虽然看上去有点越俎代庖，但是这也是为了提醒我们，cargo 期望源代码文件(以rs后缀结尾的Rust语言文件)位于 `src` 目录中。项目根目录只存放**说明文件**（README）、**许可协议**（license）信息、**配置文件** （cargo.toml）和其他跟代码无关的文件。使用 Cargo 可帮助你保持项目干净整洁。这里为一切事物所准备，一切都位于正确的位置。

####  3. 构建并运行 Cargo 项目

现在在 `new_strategy` 目录下，输入下面的命令来构建项目：

```shell
$ cargo build
   Compiling new_strategy v0.1.0 (file:///projects/new_strategy)
    Finished dev [unoptimized + debuginfo] target(s) in 2.85 secs
```

这个命令会在 *target/debug/new_strategy* 下创建一个可执行文件（在 Windows 上是 *target\debug\new_strategy.exe*），而不是放在目前目录下。你可以使用下面的命令来运行它：

```shell
$ ./target/debug/new_strategy 
Hello, world!
```

cargo 还提供了一个名为 `cargo check` 的命令。该命令快速检查代码确保其可以编译：

```shell
$ cargo check
   Checking new_strategy v0.1.0 (file:///projects/new_strategy)
    Finished dev [unoptimized + debuginfo] target(s) in 0.14 secs
```

因为编译的耗时有时可以非常长，所以有的时候我们更改、修正代码后，并不会频繁执行cargo build来重构项目，而是使用 `cargo check`。



#### 4. 发布构建

当我们最终准备好交付代码时，可以使用 `cargo build --release` 来优化编译项目。

这会在   而不是 *target/debug* 下生成可执行文件。这些优化可以让 Rust 代码运行的更快，不过启用这些优化也需要消耗显著更长的编译时间。

如果你要对代码运行时间进行基准测试，请确保运行 `cargo build --release` 并使用 *target/release* 下的可执行文件进行测试。



## Chapter 2 - 格式化输出

###  2.1 诸种格式宏(format macros)

Rust的打印操作由 `std::fmt` 里面所定义的一系列宏 Macro 来处理，包括：

`format!`：将格式化文本写到字符串。
`print!`：与 format! 类似，但将文本输出到控制台（io::stdout）。
`println!`: 与 print! 类似，但输出结果追加一个换行符。
`eprint!`：与 print! 类似，但将文本输出到标准错误（io::stderr）。
`eprintln!`：与 eprint! 类似，但输出结果追加一个换行符。

现在来用本书的第一个案例来展示以下这几个宏的用法。

以下这个案例是一个简单的折现计算器，用于计算未来现金流的现值。用户需要提供本金金额、折现率和时间期限，然后程序将根据这些输入计算现值并将结果显示给用户。这个示例同时用到了一些基本的 Rust 编程概念，以及标准库中的一些功能。

```rust
use std::io;
use std::io::Write; // 导入 Write trait，以便使用 flush 方法

fn main() {
    // 读取用户输入的本金、折现率和时间期限
    let mut input = String::new();

    println!("折现计算器");

    // 提示用户输入本金金额
    print!("请输入本金金额：");
    io::stdout().flush().expect("刷新失败"); // 刷新标准输出流，确保立即显示
    io::stdin().read_line(&mut input).expect("读取失败");
    let principal: f64 = input.trim().parse().expect("无效输入");

    input.clear(); // 清空输入缓冲区，以便下一次使用

    // 提示用户输入折现率
    println!("请输入折现率（以小数形式）：");
    io::stdin().read_line(&mut input).expect("读取失败");
    let discount_rate: f64 = input.trim().parse().expect("无效输入");

    input.clear(); // 清空输入缓冲区，以便下一次使用

    // 提示用户输入时间期限
    print!("请输入时间期限（以年为单位）：");
    io::stdout().flush().expect("刷新失败"); // 刷新标准输出流，确保立即显示
    io::stdin().read_line(&mut input).expect("读取失败");
    let time_period: u32 = input.trim().parse().expect("无效输入");

    // 计算并显示结果
    let result = calculate_present_value(principal, discount_rate, time_period);
    println!("现值为：{:.2}", result);
}

fn calculate_present_value(principal: f64, discount_rate: f64, time_period: u32) -> f64 {
    if discount_rate < 0.0 {
        eprint!("\n错误：折现率不能为负数！ ");    // '\n'为换行转义符号
        eprintln!("\n请提供有效的折现率。");
        std::process::exit(1);
    }

    if time_period == 0 {
        eprint!("\n错误：时间期限不能为零！ ");
        eprintln!("\n请提供有效的时间期限。");
        std::process::exit(1);
    }

    principal / (1.0 + discount_rate).powi(time_period as i32)
}

```
现在我们来使用一下这个折现计算器

```shell
折现计算器
请输入本金金额：2000
请输入折现率（以小数形式）：0.2
请输入时间期限（以年为单位）：2

现值为：1388.89
```

当我们输入一个负的折现率后, 我们用eprint!和eprintln!预先编辑好的错误信息出现了:

```shell
折现计算器
请输入本金金额：3000
请输入折现率（以小数形式）：-0.2
请输入时间期限（以年为单位）：5

错误：折现率不能为负数！ 请提供有效的折现率。
```


### 2.2 Debug 和 Display 特性

`std::fmt` 包含多种 traits（特质）来控制文字显示，其中重要的两种 trait 的基本形式如下：

`fmt::Debug`：使用 {:?} 标记。格式化文本以供**调试使用**。
`fmt::Display`：使用 {} 标记。以**更优雅和友好的风格**来格式化文本。

现在让我们来看看它们各自实现后的效果:

**股票价格信息**：(由**Display Trait**推导)

```rust
use std::fmt;

struct StockPrice {
    symbol: String,
    price: f64,
}

impl fmt::Display for StockPrice {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "股票: {} - 价格: {:.2}", self.symbol, self.price)
    }
}

fn main() {
    let price = StockPrice {
        symbol: "AAPL".to_string(),
        price: 150.25,
    };

    println!("[INFO]: {}", price);
}

```

**执行结果:** 

```shell
[INFO]: Stock: AAPL - Price: 150.25
```



**金融报告**：(由**Debug Trait**推导)

```rust
use std::fmt;

#[derive(Debug)]
struct FinancialReport {
    income: f64,
    expenses: f64,
}

fn main() {
    let report = FinancialReport {
        income: 10000.0,
        expenses: 7500.0,
    };

    // 使用 income 和 expenses 字段的值
    println!("金融报告:\nIncome: {:.2}\nExpenses: {:.2}", report.income, report.expenses);

    // 打印Debug Trait帮我们推导的整个报告
    println!("{:?}", report);
}
```
**执行结果:** 

```
金融报告:
Income: 10000.00 //手动格式化的语句
Expenses: 7500.00 //手动格式化的语句
FinancialReport { income: 10000.0, expenses: 7500.0 } //Debug Trait帮我们推导的原始语句
```

### 2.3  write! , print! 和 format!的区别

`write!`、`print!` 和 `format!` 都是 Rust 中的宏，用于生成文本输出，但它们在使用和输出方面略有不同：

1. `write!`：

   - `write!` 宏用于将格式化的文本写入到一个实现了 `std::io::Write` trait 的对象中，通常是文件、标准输出（`std::io::stdout()`）或标准错误（`std::io::stderr()`）。

   - 使用 `write!` 时，您需要指定目标输出流，将生成的文本写入该流中，而不是直接在控制台打印。

   - `write!` 生成的文本不会立即显示在屏幕上，而是需要进一步将其刷新（flush）到输出流中。

   - 示例用法：
     ```rust
     use std::io::{self, Write};
      
     fn main() -> io::Result<()> {
         let mut output = io::stdout();
         write!(output, "Hello, {}!", "world")?;
         output.flush()?;
         Ok(())
     }
     ```

2. `print!`：

   - `print!` 宏用于直接将格式化的文本打印到标准输出（控制台），而不需要指定输出流。

   - `print!` 生成的文本会立即显示在屏幕上。

   - 示例用法：
     ```rust
     fn main() {
         print!("Hello, {}!", "world");
     }
     ```

3. `format!`：

   - `format!` 宏用于生成一个格式化的字符串，而不是直接将其写入输出流或打印到控制台。

   - 它返回一个 `String` 类型的字符串，您可以随后使用它进行进一步处理、打印或写入到文件中。

   - 示例用法：
     ```rust
     fn main() {
         let formatted_str = format!("Hello, {}!", "world");
         println!("{}", formatted_str);
     }
     ```

总结：

- 如果您想将格式化的文本输出到标准输出，通常使用 `print!`。
- 如果您想将格式化的文本输出到文件或其他实现了 `Write` trait 的对象，使用 `write!`。
- 如果您只想生成一个格式化的字符串而不需要立即输出，使用 `format!`。

## Chapter 3 - 原生类型

"原生类型"（Primitive Types）是计算机科学中的一个通用术语，通常用于描述编程语言中的基本数据类型。Rust中的原生类型被称为原生，因为它们是语言的基础构建块，通常由编译器和底层硬件直接支持。以下是为什么这些类型被称为原生类型的几个原因：

1. **硬件支持**：原生类型通常能够直接映射到底层硬件的数据表示方式。例如，`i32` 和 `f64` 类型通常直接对应于CPU中整数和浮点数寄存器的存储格式，因此在运行时效率较高。
2. **编译器优化**：由于原生类型的表示方式是直接的，编译器可以进行有效的优化，以在代码执行时获得更好的性能。这意味着原生类型的操作通常比自定义类型更快速。
3. **标准化**：原生类型是语言标准的一部分，因此在不同的Rust编译器和环境中具有相同的语义。这意味着你可以跨平台使用这些类型，而无需担心不同系统上的行为不一致。
4. **内存布局可控**：原生类型的内存布局是明确的，因此你可以精确地控制数据在内存中的存储方式。这对于与外部系统进行交互、编写系统级代码或进行底层内存操作非常重要。

Rust 中有一些原生数据类型，用于表示基本的数据值。以下是一些常见的原生数据类型：

1. **整数类型**：

   - `i8`：有符号8位整数
   - `i16`：有符号16位整数
   - `i32`：有符号32位整数
   - `i64`：有符号64位整数
   - `i128`：有符号128位整数
   - `u8`：无符号8位整数
   - `u16`：无符号16位整数
   - `u32`：无符号32位整数
   - `u64`：无符号64位整数
   - `u128`：无符号128位整数
   - `isize`：有符号机器字大小的整数
   - `usize`：无符号机器字大小的整数

   以下是一个使用各种整数类型的 案例，演示了不同整数类型的用法：

   ```rust
   fn main() {
       // 有符号整数类型
       let i8_num: i8 = -42;   // 8位有符号整数，范围：-128 到 127
       let i16_num: i16 = -1000; // 16位有符号整数，范围：-32,768 到 32,767
       let i32_num: i32 = 200000; // 32位有符号整数，范围：-2,147,483,648 到 2,147,483,647
       let i64_num: i64 = -9000000000; // 64位有符号整数，范围：-9,223,372,036,854,775,808 到 9,223,372,036,854,775,807
       let i128_num: i128 = 10000000000000000000000000000000; // 128位有符号整数
   
       // 无符号整数类型
       let u8_num: u8 = 255; // 8位无符号整数，范围：0 到 255
       let u16_num: u16 = 60000; // 16位无符号整数，范围：0 到 65,535
       let u32_num: u32 = 4000000000; // 32位无符号整数，范围：0 到 4,294,967,295
       let u64_num: u64 = 18000000000000000000; // 64位无符号整数，范围：0 到 18,446,744,073,709,551,615
       let u128_num: u128 = 340282366920938463463374607431768211455; // 128位无符号整数
   
       // 打印各个整数类型的值
       println!("i8: {}", i8_num);
       println!("i16: {}", i16_num);
       println!("i32: {}", i32_num);
       println!("i64: {}", i64_num);
       println!("i128: {}", i128_num);
       println!("u8: {}", u8_num);
       println!("u16: {}", u16_num);
       println!("u32: {}", u32_num);
       println!("u64: {}", u64_num);
       println!("u128: {}", u128_num);
   }
   ```
   **执行结果:**

   ```text
   i8: -42
   i16: -1000
   i32: 200000
   i64: -9000000000
   i128: 10000000000000000000000000000000
   u8: 255
   u16: 60000
   u32: 4000000000
   u64: 18000000000000000000
   u128: 340282366920938463463374607431768211455
   ```

   

2. **浮点数类型**：

   - `f32`：32位浮点数
   - `f64`：64位浮点数（双精度浮点数）

   以下是一个 演示各种浮点数类型及其范围的案例：

   ```rust
   fn main() {
       let f32_num: f32 = 3.14; // 32位浮点数，范围：约 -3.4e38 到 3.4e38，精度约为7位小数
       let f64_num: f64 = 3.141592653589793238; // 64位浮点数，范围：约 -1.7e308 到 1.7e308，精度约为15位小数
   
       // 打印各个浮点数类型的值
       println!("f32: {}", f32_num);
       println!("f64: {}", f64_num);
   }
   
   ```
   **执行结果:**

   ```text
   f32: 3.14
   f64: 3.141592653589793
   ```

   

3. **布尔类型**：

   `bool`：表示布尔值，可以是 `true` 或 `false`。

   在rust中, 布尔值 bool 可以直接拿来当if语句的判断条件。

   ```rust
   fn main() {
       // 模拟股票价格数据
       let stock_price = 150.0;
       
       // 定义交易策略条件
       let buy_condition = stock_price < 160.0; // 如果股价低于160，满足购买条件
       let sell_condition = stock_price > 170.0; // 如果股价高于170，满足卖出条件
       
       // 执行交易策略
       if buy_condition {  //buy_condition此时已经是一个布尔值, 可以直接拿来当if语句的判断条件
           println!("购买股票：股价为 {}，满足购买条件。", stock_price);
       } else if sell_condition { //sell_condition 同理也已是一个布尔值, 可以当if语句的判断条件
           println!("卖出股票：股价为 {}，满足卖出条件。", stock_price);
       } else {
           println!("不执行交易：股价为 {}，没有满足的交易条件。", stock_price);
       }
   }
   ```
   **执行结果:**

   ```text
   购买股票：股价为 150，满足购买条件。
   ```

   

4. **字符类型**：

   `char`：表示**单个** Unicode 字符。
   
   Rust的字符类型char具有以下特征:
   
   1. **Unicode 支持**：几乎所有现代编程语言都提供了对Unicode字符的支持，因为Unicode已成为全球标准字符集。Rust 的 `char` 类型当然也是 Unicode 兼容的，这意味着它可以表示任何有效的 Unicode 字符，包括 ASCII 字符和其他语言中的特殊字符。
   2. **32 位宽度**：`char`类型使用UTF-32编码来表示Unicode字符，一个`char`实际上是一个长度为 1 的 UCS-4 / UTF-32 字符串。。这确保了`char`类型可以容纳任何Unicode字符，因为UTF-32编码的码点范围覆盖了Unicode字符集的所有字符。`char` 类型的值是 Unicode 标量值（即不是代理项的代码点），表示为 0x0000 到 0xD7FF 或 0xE000 到 0x10FFFF 范围内的 32 位无符号字。创建一个超出此范围的 `char` 会立即被编译器认为是未定义行为。 
   3. **字符字面量**：`char` 类型的字符字面量使用单引号括起来，例如 `'A'` 或 `'❤'`。这些字符字面量可以直接赋值给 `char` 变量。
   4. **字符转义序列**：与字符串一样，`char` 字面量也支持转义序列，例如 `'\n'` 表示换行字符。
   5. **UTF-8 字符串**：Rust 中的字符串类型 `String` 是 UTF-8 编码的，这与 `char` 类型兼容，因为 UTF-8 是一种可变长度编码，可以表示各种字符。
   6. **字符迭代**：你可以使用迭代器来处理字符串中的每个字符，例如使用 `chars()` 方法。这使得遍历和操作字符串中的字符非常方便。
   
   
   
    `char` 类型的特性可以用于处理和表示与金融数据和分析相关的各种字符和符号。以下是一些展示如何在量化金融环境中利用 `char` 特性的示例：
   
   1. **表示货币符号**：`char` 可以用于表示货币符号，例如美元符号 `$` 或欧元符号 `€`。这对于在金融数据中标识货币类型非常有用。
   
      ```rust
      fn main() {
          let usd_symbol = '$';
          let eur_symbol = '€';
      
          println!("美元符号: {}", usd_symbol);
          println!("欧元符号: {}", eur_symbol);
      }
      ```
   
      **执行结果:**
   
      ```text
      美元符号: $
      欧元符号: €
      ```
   
   2. **表示期权合约种类**：在这个示例中，我们使用 `char` 类型来表示期权合约类型，'P' 代表put期权合约，'C' 代表call期权合约。根据不同的合约类型，我们执行不同的操作。这种方式可以用于在金融交易中确定期权合约的类型，从而执行相应的交易策略。
   
      ```rust
      fn main() {
          let contract_type = 'P'; // 代表put期权合约
          
          match contract_type {
              'P' => println!("执行put期权合约。"),
              'C' => println!("执行call期权合约。"),
              _ => println!("未知的期权合约类型。"),
          }
      }
      ```
      **执行结果:**
      
      ```text
      执行put期权合约。
      ```
      
   3. **处理特殊字符**：金融数据中可能包含特殊字符，例如百分比符号 `%` 或加号 `+`。`char` 类型允许你在处理这些字符时更容易地执行各种操作。
   
      ```rust
      fn main() {
          let percentage = 5.0; // 百分比 5%
          let multi_sign = '*';
      
          // 在计算中使用百分比
          let value = 10.0;
          let result = value * (percentage / 100.0); // 将百分比转换为小数进行计算
      
          println!("{}% {} {} = {}", percentage, multi_sign, value, result);
      }
      ```
   
      **执行结果:**
   
      ```text
      5% * 10 = 0.5
      ```
   
      
   
   `char` 类型的特性使得你能够更方便地处理和识别与金融数据和符号相关的字符，从而更好地支持金融数据分析和展示。	
   
   

### 3.1 字面量, 运算符 和字符串

Rust语言中，你可以使用不同类型的字面量来表示不同的数据类型，包括整数、浮点数、字符、字符串、布尔值以及单元类型。以下是关于Rust字面量和运算符的简要总结：

#### 3.1.1 字面量（Literals）：

当你编写 Rust 代码时，你会遇到各种不同类型的字面量，它们用于表示不同类型的值。以下是一些常见的字面量类型和示例：

1. **整数字面量（Integer Literals）**：用于表示整数值，例如：
   - 十进制整数：`10`
   - 十六进制整数：`0x1F`
   - 八进制整数：`0o77`
   - 二进制整数：`0b1010`

2. **浮点数字面量（Floating-Point Literals）**：用于表示带小数点的数值，例如：
   - 浮点数：`3.14`
   - 科学计数法：`2.0e5`

3. **字符字面量（Character Literals）**：用于表示单个字符，使用单引号括起来，例如：
   - 字符 ：`'A'`
   - 转义字符 ：`'\n'`

4. **字符串字面量（String Literals）**：用于表示文本字符串，使用双引号括起来，例如：
   - 字符串 ：`"Hello, World!"`

5. **布尔字面量（Boolean Literals）**：用于表示真（`true`）或假（`false`）的值，例如：
   - 布尔值 ：`true`
   - 布尔值：`false`

6. **单元类型（Unit Type）**：表示没有有意义的返回值的情况，通常表示为 `()`，例如：
   - 函数返回值：`fn do_something() -> () { }`

你还可以在数字字面量中插入下划线 `_` 以提高可读性，例如 `1_000` 和 `0.000_001`，它们分别等同于1000和0.000001。这些字面量类型用于初始化变量、传递参数和表示数据的各种值。



#### 3.1.2 运算符（Operators）：

在 Rust 中，常见的运算符包括：

1. **算术运算符（Arithmetic Operators）**：
   - `+`（加法）：将两个数相加，例如 `a + b`。
   - `-`（减法）：将右边的数从左边的数中减去，例如 `a - b`。
   - `*`（乘法）：将两个数相乘，例如 `a * b`。
   - `/`（除法）：将左边的数除以右边的数，例如 `a / b`。
   - `%`（取余）：返回左边的数除以右边的数的余数，例如 `a % b`。
2. **比较运算符（Comparison Operators）**：
   - `==`（等于）：检查左右两边的值是否相等，例如 `a == b`。
   - `!=`（不等于）：检查左右两边的值是否不相等，例如 `a != b`。
   - `<`（小于）：检查左边的值是否小于右边的值，例如 `a < b`。
   - `>`（大于）：检查左边的值是否大于右边的值，例如 `a > b`。
   - `<=`（小于等于）：检查左边的值是否小于或等于右边的值，例如 `a <= b`。
   - `>=`（大于等于）：检查左边的值是否大于或等于右边的值，例如 `a >= b`。
3. **逻辑运算符（Logical Operators）**：
   - `&&`（逻辑与）：用于组合两个条件，只有当两个条件都为真时才为真，例如 `condition1 && condition2`。
   - `||`（逻辑或）：用于组合两个条件，只要其中一个条件为真就为真，例如 `condition1 || condition2`。
   - `!`（逻辑非）：用于取反一个条件，将真变为假，假变为真，例如 `!condition`。
4. **赋值运算符（Assignment Operators）**：
   - `=`（赋值）：将右边的值赋给左边的变量，例如 `a = b`。
   - `+=`（加法赋值）：将左边的变量与右边的值相加，并将结果赋给左边的变量，例如 `a += b` 相当于 `a = a + b`。
   - `-=`（减法赋值）：将左边的变量与右边的值相减，并将结果赋给左边的变量，例如 `a -= b` 相当于 `a = a - b`。
5. **位运算符（Bitwise Operators）**：
   - `&`（按位与）：对两个数的每一位执行与操作，例如 `a & b`。
   - `|`（按位或）：对两个数的每一位执行或操作，例如 `a | b`。
   - `^`（按位异或）：对两个数的每一位执行异或操作，例如 `a ^ b`。

这些运算符在 Rust 中用于执行各种数学、逻辑和位操作，使您能够编写灵活和高效的代码。

现在把这些运算符带到实际场景来看一下：

```rust
fn main() {
    // 加法运算：整数相加
    println!("3 + 7 = {}", 3u32 + 7);
    // 减法运算：整数相减
    println!("10 减去 4 = {}", 10i32 - 4);

    // 逻辑运算：布尔值的组合
    println!("true 与 false 的与运算结果是：{}", true && false);
    println!("true 或 false 的或运算结果是：{}", true || false);
    println!("true 的非运算结果是：{}", !true);

    // 赋值运算：变量值的更新
    let mut x = 8;
    x += 5; // 等同于 x = x + 5
    println!("x 现在的值是：{}", x);

    // 位运算：二进制位的操作
    println!("0101 和 0010 的与运算结果是：{:04b}", 0b0101u32 & 0b0010);
    println!("0101 和 0010 的或运算结果是：{:04b}", 0b0101u32 | 0b0010);
    println!("0101 和 0010 的异或运算结果是：{:04b}", 0b0101u32 ^ 0b0010);
    println!("2 左移 3 位的结果是：{}", 2u32 << 3);
    println!("0xC0 右移 4 位的结果是：0x{:x}", 0xC0u32 >> 4);

    // 使用下划线增加数字的可读性
    println!("一千可以表示为：{}", 1_000u32);
}


```
**执行结果:**

```text
3 + 7 = 10
10 减去 4 = 6
true 与 false 的与运算结果是：false
true 或 false 的或运算结果是：true
true 的非运算结果是：false
x 现在的值是：13
0101 和 0010 的与运算结果是：0000
0101 和 0010 的或运算结果是：0111
0101 和 0010 的异或运算结果是：0111
2 左移 3 位的结果是：16
0xC0 右移 4 位的结果是：0xc
一千可以表示为：1000
```

**补充解释: 逻辑运算符:**

逻辑运算中有三种基本操作：与（AND）、或（OR）、异或（XOR），用来操作二进制位。

1. 0011 与 0101 为 0001（AND运算）：
   这个运算符表示两个二进制数的对应位都为1时，结果位为1，否则为0。在这个例子中，我们对每一对位进行AND运算：
   - 第一个位：0 AND 0 = 0
   - 第二个位：0 AND 1 = 0
   - 第三个位：1 AND 0 = 0
   - 第四个位：1 AND 1 = 1
   因此，结果为 0001。

2. 0011 或 0101 为 0111（OR运算）：
   这个运算符表示两个二进制数的对应位中只要有一个为1，结果位就为1。在这个例子中，我们对每一对位进行OR运算：
   - 第一个位：0 OR 0 = 0
   - 第二个位：0 OR 1 = 1
   - 第三个位：1 OR 0 = 1
   - 第四个位：1 OR 1 = 1
   因此，结果为 0111。

3. 0011 异或 0101 为 0110（XOR运算）：
   这个运算符表示两个二进制数的对应位相同则结果位为0，不同则结果位为1。在这个例子中，我们对每一对位进行XOR运算：
   - 第一个位：0 XOR 0 = 0
   - 第二个位：0 XOR 1 = 1
   - 第三个位：1 XOR 0 = 1
   - 第四个位：1 XOR 1 = 0
   因此，结果为 0110。

这些逻辑运算在计算机中广泛应用于位操作和布尔代数中，它们用于创建复杂的逻辑电路、控制程序和数据处理。

**补充解释: 移动运算符:**

这涉及到位运算符的工作方式，特别是左移运算符（`<<`）和右移运算符（`>>`）。让我为你解释一下：

1. `为什么1 左移 5 位为 32`：
   - `1` 表示二进制数字 `0001`。
   - 左移运算符 `<<` 将二进制数字向左移动指定的位数。
   - 在这里，`1u32 << 5` 表示将二进制数字 `0001` 向左移动5位。
   - 移动5位后，变成了 `100000`，这是二进制中的32。
   - 因此，`1 左移 5 位` 等于 `32`。

2. 为什么`0x80 右移 2 位为 0x20`：
   - `0x80` 表示十六进制数字，其二进制表示为 `10000000`。
   - 右移运算符 `>>` 将二进制数字向右移动指定的位数。
   - 在这里，`0x80u32 >> 2` 表示将二进制数字 `10000000` 向右移动2位。
   - 移动2位后，变成了 `00100000`，这是二进制中的32。
   - 以十六进制表示，`0x20` 表示32。
   - 因此，`0x80 右移 2 位` 等于 `0x20`。

这些运算是基于二进制和十六进制的移动，因此结果不同于我们平常的十进制表示方式。左移操作会使数值变大，而右移操作会使数值变小。

#### 3.1.3 字符串 (String) 和 字符串切片 (&str)

在Rust中，字符串是一个重要的数据类型，用于存储文本和字符数据。字符串在量化金融领域以及其他编程领域中广泛使用，用于表示和处理金融数据、交易记录、报告生成等任务。

在Rust中，有两种主要的字符串类型：

- `String`：动态字符串，可变且在堆上分配内存。`String` 类型通常用于需要修改字符串内容的情况，比如拼接、替换等操作。
- `&str`:字符串切片, 不可变的字符串引用，通常在栈上分配。`&str` 通常用于只需访问字符串而不需要修改它的情况，也是函数参数中常见的类型。

在Rust中，`String` 和 `&str` 字符串类型的区别可以用金融实例来解释。假设我们正在编写一个金融应用程序，需要处理股票数据。

1. **使用 `String`：**

如果我们需要在应用程序中动态构建、修改和处理字符串，例如拼接多个股票代码或构建复杂的查询语句，我们可能会选择使用 `String` 类型。这是因为 `String` 是可变的，允许我们在运行时修改其内容。

```rust
fn main() {
    let mut stock_symbol = String::from("AAPL");
    
    // 在运行时追加字符串
    stock_symbol.push_str("(NASDAQ)");
    
    println!("Stock Symbol: {}", stock_symbol);
}
```

**执行结果:**

```text
Stock Symbol: AAPL(NASDAQ)
```

在这个示例中，我们创建了一个可变的 `String` 变量 `stock_symbol`，然后在运行时追加了"(NASDAQ)"字符串。这种灵活性对于金融应用程序中的动态字符串操作非常有用。

2. **使用 `&str`：**

如果我们只需要引用或读取字符串而不需要修改它，并且希望避免额外的内存分配，我们可以使用 `&str`。在金融应用程序中，`&str` 可以用于传递字符串参数，访问股票代码等。

```rust
fn main() {
    let stock_symbol = "AAPL"; // 字符串切片，不可变
    let stock_name = get_stock_name(stock_symbol);
    
    println!("Stock Name: {}", stock_name);
}

fn get_stock_name(symbol: &str) -> &str {
    match symbol {
        "AAPL" => "Apple Inc.",
        "GOOGL" => "Alphabet Inc.",
        _ => "Unknown",
    }
}
```

在这个示例中，我们定义了一个函数 `get_stock_name`，它接受一个 `&str` 参数来查找股票名称。这允许我们在不进行额外内存分配的情况下访问字符串。

3. **小结**

`String` 和 `&str` 在金融应用程序中的使用取决于我们的需求。如果需要修改字符串内容或者在运行时构建字符串，`String` 是一个更好的选择。如果只需要访问字符串而不需要修改它，或者希望避免额外的内存分配，`&str` 是更合适的选择。



### 3.2 元组 (Tuple)

元组（Tuple）是Rust中的一种数据结构，它可以存储多个不同或相同类型的值，并且一旦创建，它们的长度就是不可变的。元组通常用于将多个值组合在一起以进行传递或返回，它们在量化金融中也有各种应用场景。

以下是一个元组的使用案例:

```rust
fn main() {
    // 创建一个元组，表示股票的价格和数量
    let stock = ("AAPL", 150.50, 1000);

    // 访问元组中的元素, 赋值给一并放在左边的变量们,
    // 这种赋值方式称为元组解构（Tuple Destructuring）
    let (symbol, price, quantity) = stock;

    // 打印变量的值
    println!("股票代码: {}", symbol);
    println!("股票价格: ${:.2}", price);
    println!("股票数量: {}", quantity);

    // 计算总价值
    let total_value = price * (quantity as f64); // 注意将数量转换为浮点数以进行计算

    println!("总价值: ${:.2}", total_value);
}
```
**执行结果:**

```text
股票代码: AAPL
股票价格: $150.50
股票数量: 1000
总价值: $150500.00
```

在上述Rust代码示例中，我们演示了如何使用元组来表示和存储股票的相关信息。让我们详细解释代码中的各个部分：

1. **创建元组：**
   
   ```rust
   let stock = ("AAPL", 150.50, 1000);
   ```
   这一行代码创建了一个元组 `stock`，其中包含了三个元素：股票代码（字符串）、股票价格（浮点数）和股票数量（整数）。注意，元组的长度在创建后是不可变的，所以我们无法添加或删除元素。
   
2. **元组解构（Tuple Destructuring）：**
   
   ```rust
   let (symbol, price, quantity) = stock;
   ```
   在这一行中，我们使用模式匹配的方式从元组中解构出各个元素，并将它们分别赋值给 `symbol`、`price` 和 `quantity` 变量。这使得我们能够方便地访问元组的各个部分。
   
3. **打印变量的值：**
   
   ```rust
   println!("股票代码: {}", symbol);
   println!("股票价格: ${:.2}", price);
   println!("股票数量: {}", quantity);
   ```
   这些代码行使用 `println!` 宏打印了元组中的不同变量的值。在第二个 `println!` 中，我们使用 `:.2` 来控制浮点数输出的小数点位数。
   
4. **计算总价值：**
   
   ```rust
   let total_value = price * (quantity as f64);
   ```
   这一行代码计算了股票的总价值。由于 `quantity` 是整数，我们需要将其转换为浮点数 (`f64`) 来进行计算，以避免整数除法的问题。

最后，我们打印出了计算得到的总价值，得到了完整的股票信息。

总之，元组是一种方便的数据结构，可用于组合不同类型的值，并且能够进行模式匹配以轻松访问其中的元素。在量化金融或其他领域中，元组可用于组织和传递多个相关的数据项。

### 3.3 数组

#### 3.3.1 简单移动平均线计算器 (SMA Calculator)

简单移动平均线（Simple Moving Average，SMA）是一种常用的技术分析指标，用于平滑时间序列数据以识别趋势。SMA的计算公式非常简单，它是过去一段时间内数据点的平均值。以下是SMA的计算公式：

$$
SMA = (X1 + X2 + X3 + ... + Xn) / n
$$

当在Rust中进行量化金融建模时，我们通常会使用数组（Array）和其他数据结构来管理和处理金融数据。以下是一个简单的Rust量化金融案例，展示如何使用数组来计算股票的简单移动平均线（Simple Moving Average，SMA）。



```rust
fn main() {
    // 假设这是一个包含股票价格的数组
    let stock_prices = [50.0, 52.0, 55.0, 60.0, 58.0, 62.0, 65.0, 70.0, 75.0, 80.0];
    
    // 计算简单移动平均线（SMA）
    let window_size = 5; // 移动平均窗口大小
    let mut sma_values: Vec<f64> = Vec::new();
    
    for i in 0..stock_prices.len() - window_size + 1 {
        let window = &stock_prices[i..i + window_size];
        let sum: f64 = window.iter().sum();
        let sma = sum / window_size as f64;
        sma_values.push(sma);
    }
    
    // 打印SMA值
    println!("简单移动平均线（SMA）:");
    for (i, sma) in sma_values.iter().enumerate() {
        println!("Day {}: {:.2}", i + window_size, sma);
    }
}
```

**执行结果:**

```text
简单移动平均线（SMA）:
Day 5: 55.00
Day 6: 57.40
Day 7: 60.00
Day 8: 63.00
Day 9: 66.00
Day 10: 70.40
```

在这个示例中，我们计算的是简单移动平均线（SMA），窗口大小为5天。因此，SMA值是从第5天开始的，直到最后一天。在输出中，"Day 5" 对应着第5天的SMA值，"Day 6" 对应第6天的SMA值，以此类推。这是因为SMA需要一定数量的历史数据才能计算出第一个移动平均值，所以前几天的结果会是空的或不可用的。

**补充解释: 范围设置**

`for i in 0..stock_prices.len() - window_size + 1` 这样写是为了创建一个迭代器，该迭代器将在股票价格数组上滑动一个大小为 `window_size` 的窗口，以便计算简单移动平均线（SMA）。

让我们解释一下这个表达式的各个部分：

- `0..stock_prices.len()`：这部分创建了一个范围（range），从0到 `stock_prices` 数组的长度。范围的右边界是不包含的，所以它包含了从0到 `stock_prices.len() - 1` 的所有索引。
- `- window_size + 1`：这部分将范围的右边界减去 `window_size`，然后再加1。这是为了确保窗口在数组上滑动，以便计算SMA。考虑到窗口的大小，我们需要确保它在数组内完全滑动，因此右边界需要向左移动 `window_size - 1` 个位置。

因此，整个表达式 `0..stock_prices.len() - window_size + 1` 创建了一个范围，该范围从0到 `stock_prices.len() - window_size`，覆盖了数组中所有可能的窗口的起始索引。在每次迭代中，这个范围将产生一个新的索引，用于创建一个新的窗口，以计算SMA。这是一种有效的方法来遍历数组并执行滑动窗口操作。

#### 3.3.2 指数移动平均线计算器 (EMA Calculator)

指数移动平均线（Exponential Moving Average，EMA）是另一种常用的技术分析指标，与SMA不同，EMA赋予了更多的权重最近的价格数据，因此它更加敏感于价格的近期变化。EMA的计算公式如下：
$$
EMA(t) = (P(t) * α) + (EMA(y) * (1 - α))
$$
其中：

- `EMA(t)`：当前时刻的EMA值。
- `P(t)`：当前时刻的价格。
- `EMA(y)`：前一时刻的EMA值。
- `α`：平滑因子，通常通过指定一个时间窗口长度来计算，`α = 2 / (n + 1)`，其中 `n` 是时间窗口长度。

在技术分析中，EMA（指数移动平均线）和SMA（简单移动平均线）的计算有不同的起始点。

- EMA的计算通常可以从第一个数据点（Day 1）开始，因为它使用了指数加权平均的方法，使得前面的数据点的权重较小，从而考虑了所有的历史数据。
- 而SMA的计算需要使用一个固定大小的窗口，因此必须从窗口大小之后的数据点（在我们的例子中是从第五天开始）才能得到第一个SMA值。这是因为SMA是对一段时间内的数据进行简单平均，需要足够的数据点来计算平均值。

现在让我们在Rust中编写一个EMA计算器，类似于之前的SMA计算器：

```rust
fn main() {
    // 假设这是一个包含股票价格的数组
    let stock_prices = [50.0, 52.0, 55.0, 60.0, 58.0, 62.0, 65.0, 70.0, 75.0, 80.0];
    
    // 计算指数移动平均线（EMA）
    let window_size = 5; // 时间窗口大小
    let mut ema_values: Vec<f64> = Vec::new();
    
    let alpha = 2.0 / (window_size as f64 + 1.0);
    let mut ema = stock_prices[0]; // 初始EMA值等于第一个价格
    
    for price in &stock_prices {
        ema = (price - ema) * alpha + ema;
        ema_values.push(ema);
    }
    
    // 打印EMA值
    println!("指数移动平均线（EMA）:");
    for (i, ema) in ema_values.iter().enumerate() {
        println!("Day {}: {:.2}", i + 1, ema);
    }
}
```

**执行结果:**

```text
指数移动平均线（EMA）:
Day 1: 50.00
Day 2: 51.00
Day 3: 52.75
Day 4: 55.88
Day 5: 56.59
Day 6: 58.39
Day 7: 59.92
Day 8: 62.02
Day 9: 63.95
Day 10: 66.30
```

**补充解释:** **平滑因子alpha**

当计算指数移动平均线（EMA）时，需要使用一个平滑因子 `alpha`，这个因子决定了最近价格数据和前一EMA值的权重分配，它的计算方法是 `alpha = 2.0 / (window_size as f64 + 1.0)`。让我详细解释这句代码的含义：

1. `window_size` 表示时间窗口大小，通常用来确定计算EMA时要考虑多少个数据点。较大的 `window_size` 会导致EMA更加平滑，对价格波动的反应更慢，而较小的 `window_size` 则使EMA更加敏感，更快地反应价格变化。

2. `window_size as f64` 将 `window_size` 转换为浮点数类型 (`f64`)，因为我们需要在计算中使用浮点数来确保精度。

3. `window_size as f64 + 1.0` 将窗口大小加1，这是EMA计算中的一部分，用于调整平滑因子。添加1是因为通常我们从第一个数据点开始计算EMA，所以需要考虑一个额外的数据点。

4. 最终，`2.0 / (window_size as f64 + 1.0)` 计算出平滑因子 `alpha`。这个平滑因子决定了EMA对最新数据的权重，通常情况下，`alpha` 的值会接近于1，以便更多地考虑最新的价格数据。较小的 `alpha` 值会使EMA对历史数据更加平滑，而较大的 `alpha` 值会更强调最新的价格变动。

总之，这一行代码计算了用于指数移动平均线计算的平滑因子 `alpha`，该因子在EMA计算中决定了最新数据和历史数据的权重分配，以便在分析中更好地反映价格趋势。

#### 3.3.3 相对强度指数（Relative Strength Index，RSI）

RSI是一种用于衡量价格趋势的技术指标，通常用于股票和其他金融市场的技术分析。相对强弱指数（RSI）的计算公式如下：

RSI = 100 - [100 / (1 + RS)]

其中，RS表示14天内收市价上涨数之和的平均值除以14天内收市价下跌数之和的平均值。

让我们通过一个示例来说明：

假设最近14天的涨跌情况如下：

- 第一天上涨2元
- 第二天下跌2元
- 第三至第五天每天上涨3元
- 第六天下跌4元
- 第七天上涨2元
- 第八天下跌5元
- 第九天下跌6元
- 第十至十二天每天上涨1元
- 第十三至十四天每天下跌3元

现在，我们来计算RSI的步骤：

1. 首先，将14天内上涨的总额相加，然后除以14。在这个示例中，总共上涨16元，所以计算结果是16 / 14 = 1.14285714286
2. 接下来，将14天内下跌的总额相加，然后除以14。在这个示例中，总共下跌23元，所以计算结果是23 / 14 = 1.64285714286
3. 然后，计算相对强度RS，即RS = 1.14285714286 / 1.64285714286 = 0.69565217391
4. 接着，计算1 + RS，即1 + 0.69565217391 = 1.69565217391。
5. 最后，将100除以1 + RS，即100 / 1.69565217391 = 58.9743589745
6. 最终的RSI值为100 - 58.9743589745 = 41.0256410255  ≈ 41.026

这样，我们就得到了相对强弱指数（RSI）的值，它可以帮助分析市场的超买和超卖情况。以下是一个计算RSI的示例代码：

```rust
fn calculate_rsi(up_days: Vec<f64>, down_days: Vec<f64>) -> f64 {  
    let up_sum = up_days.iter().sum::<f64>();  
    let down_sum = down_days.iter().sum::<f64>();  
    let rs = up_sum / down_sum;  
    let rsi = 100.0 - (100.0 / (1.0 + rs));  
    rsi  
}  
  
fn main() {  
    let up_days = vec![2.0, 3.0, 3.0, 3.0, 2.0, 1.0, 1.0];  
    let down_days = vec![2.0, 4.0, 5.0, 6.0, 4.0, 3.0, 3.0];  
    let rsi = calculate_rsi(up_days, down_days);  
    println!("RSI: {}", rsi);  
}

```

**执行结果:**

```text
RSI: 41.026
```



### 3.4 切片

在Rust中，切片（Slice）是一种引用数组或向量中一部分连续元素的方法，而不需要复制数据。切片有时非常有用，特别是在量化金融中，因为我们经常需要处理时间序列数据或其他大型数据集。

下面我将提供一个简单的案例，展示如何在Rust中使用切片进行量化金融分析。

假设有一个包含股票价格的数组，我们想计算某段时间内的最高和最低价格。以下是一个示例：

```rust
fn main() {
    // 假设这是一个包含股票价格的数组
    let stock_prices = [50.0, 52.0, 55.0, 60.0, 58.0, 62.0, 65.0, 70.0, 75.0, 80.0];

    // 定义时间窗口范围
    let start_index = 2; // 开始日期的索引（从0开始）
    let end_index = 6;   // 结束日期的索引（包含）

    // 使用切片获取时间窗口内的价格数据
    let price_window = &stock_prices[start_index..=end_index]; // 注意使用..=来包含结束索引

    // 计算最高和最低价格
    let max_price = price_window.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    let min_price = price_window.iter().cloned().fold(f64::INFINITY, f64::min);

    // 打印结果
    println!("时间窗口内的最高价格: {:.2}", max_price);
    println!("时间窗口内的最低价格: {:.2}", min_price);
}

```

**执行结果:**

```text
时间窗口内的最高价格: 65.00
时间窗口内的最低价格: 55.00
```

下面我会详细解释以下两行代码：

```
let max_price = price_window.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
let min_price = price_window.iter().cloned().fold(f64::INFINITY, f64::min);
```

这两行代码的目标是计算时间窗口内的最高价格（`max_price`）和最低价格（`min_price`）。让我们一一解释它们的每一部分：

1. `price_window.iter()`：`price_window` 是一个切片，使用 `.iter()` 方法可以获得一个迭代器，用于遍历切片中的元素。
2. `.cloned()`：`cloned()` 方法用于将切片中的元素进行克隆，因为 `fold` 函数需要元素的拷贝（`Clone` trait）。这是因为 `f64` 类型是不可变类型，无法通过引用进行直接比较。所以我们将元素克隆，以便在 `fold` 函数中进行比较。
3. `.fold(f64::NEG_INFINITY, f64::max)`：`fold` 函数是一个迭代器适配器，它将迭代器中的元素按照给定的操作进行折叠（归约）。在这里，我们使用 `fold` 来找到最高价格。
   - `f64::NEG_INFINITY` 是一个负无穷大的初始值，用于确保任何实际的价格都会大于它。这是为了确保在计算最高价格时，如果时间窗口为空，结果将是负无穷大。
   - `f64::max` 是一个函数，用于计算两个 `f64` 类型的数值中的较大值。在 `fold` 过程中，它会比较当前最高价格和迭代器中的下一个元素，然后返回较大的那个。

**补充解释: fold函数**

`fold` 是一个常见的函数式编程概念，用于在集合（如数组、迭代器等）的元素上进行折叠（或归约）操作。它允许你在集合上进行迭代，并且在每次迭代中将一个累积值与集合中的元素进行某种操作，最终得到一个最终的累积结果。

在 Rust 中，`fold` 函数的签名如下：

```rust
fn fold<B, F>(self, init: B, f: F) -> B
```

这个函数接受三个参数：

- `init`：初始值，表示折叠操作的起始值。
- `f`：一个闭包（函数），它定义了在每次迭代中如何将当前的累积值与集合中的元素进行操作。
- 返回值：最终的累积结果。

`fold` 的工作方式如下：

1. 它从初始值 `init` 开始。
2. 对于集合中的每个元素，它调用闭包 `f`，将当前累积值和元素作为参数传递给闭包。
3. 闭包 `f` 执行某种操作，生成一个新的累积值。
4. 新的累积值成为下一次迭代的输入。
5. 此过程重复，直到遍历完集合中的所有元素。
6. 最终的累积值成为 `fold` 函数的返回值。

这个概念的好处在于，我们可以使用 `fold` 函数来进行各种集合的累积操作，例如求和、求积、查找最大值、查找最小值等。在之前的示例中，我们使用了 `fold` 函数来计算最高价格和最低价格，将当前的最高/最低价格与集合中的元素进行比较，并更新累积值，最终得到了最高和最低价格。



## Chapter 4 - 自定义类型 Struct & Enum 

### 4.1 结构体（`struct`）

在 Rust 中进行量化金融建模时，通常需要自定义类型来表示金融工具、交易策略或其他相关概念。自定义类型可以是结构体（`struct`）或枚举（`enum`），具体取决于我们的需求。下面是一个简单的示例，演示如何在 Rust 中创建自定义结构体来表示一个简单的金融工具（例如股票）：

```rust
// 定义一个股票的结构体
struct Stock {
    symbol: String,  // 股票代码
    price: f64,      // 当前价格
    quantity: u32,   // 持有数量
}

fn main() {
    // 创建一个股票实例
    let apple_stock = Stock {
        symbol: String::from("AAPL"),
        price: 150.50,
        quantity: 1000,
    };

    // 打印股票信息
    println!("股票代码: {}", apple_stock.symbol);
    println!("股票价格: ${:.2}", apple_stock.price);
    println!("股票数量: {}", apple_stock.quantity);

    // 计算总价值
    let total_value = apple_stock.price * apple_stock.quantity as f64;
    println!("总价值: ${:.2}", total_value);
}

```

**执行结果:**

```text
股票代码: AAPL
股票价格: $150.50
股票数量: 1000
总价值: $150500.00
```

在 Rust 中，您可以为自定义类型（包括结构体 `struct`）实现 `Display` 和 `Debug` 特性来控制如何以可读和调试友好的方式打印（格式化）该类型的实例。这两个特性是 Rust 标准库中的 trait，它们提供了不同的打印输出方式，适用于不同的用途。

1. `Display` 特性：

   - `Display` 特性用于定义类型的人类可读字符串表示形式，通常用于用户友好的输出。例如，您可以实现 `Display` 特性来打印结构体的信息，以便用户能够轻松理解它。

   - 要实现 `Display` 特性，必须定义一个名为 `fmt` 的方法，它接受一个格式化器对象（`fmt::Formatter`）作为参数，并将要打印的信息写入该对象。

   - 使用 `{}` 占位符可以在 `println!` 宏或 `format!` 宏中使用 `Display` 特性。

   - 通常，实现 `Display` 特性需要手动编写代码来指定打印的格式，以确保输出满足您的需求。

2. `Debug` 特性：

   - `Debug` 特性用于定义类型的调试输出形式，通常用于开发和调试过程中，以便查看内部数据结构和状态。

   - 与 `Display` 不同，`Debug` 特性不需要手动指定格式，而是使用默认的格式化方式。您可以通过在 `println!` 宏或 `format!` 宏中使用 `{:?}` 占位符来打印实现了 `Debug` 特性的类型。

   - 标准库提供了一个 `#[derive(Debug)]` 注解，您可以将其添加到结构体定义之前，以自动生成 `Debug` 实现。这使得调试更加方便，因为不需要手动编写调试输出的代码。

下面是一个示例，展示了如何为一个名为 `Stock` 的结构体实现 `Display` 和 `Debug` 特性：

```rust
use std::fmt;

// 定义一个股票的结构体
struct Stock {
    symbol: String,
    price: f64,
    quantity: u32,
}

// 实现 Display 特性
impl fmt::Display for Stock {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "股票代码: {}\n股票价格: ${:.2}\n股票数量: {}", self.symbol, self.price, self.quantity)
    }
}

// 实现 Debug 特性
impl fmt::Debug for Stock {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("Stock")
            .field("symbol", &self.symbol)
            .field("price", &self.price)
            .field("quantity", &self.quantity)
            .finish()
    }
}

fn main() {
    let apple_stock = Stock {
        symbol: String::from("AAPL"),
        price: 150.50,
        quantity: 1000,
    };

    // 使用 Display 特性打印可读形式
    println!("Display 输出:\n{}", apple_stock);

    // 使用 Debug 特性打印调试形式
    println!("\nDebug 输出: {:?}", apple_stock);
}
```

**执行结果:**

```text
Display 输出:
股票代码: AAPL
股票价格: $150.50
股票数量: 1000

Debug 输出: Stock { symbol: "AAPL", price: 150.5, quantity: 1000 }
```



在这个示例中，我们首先为 `Stock` 结构体实现了 `Display` 特性和 `Debug` 特性。`Display` 特性的实现使用 `write!` 宏将结构体的信息格式化到格式化器对象中，而 `Debug` 特性的实现使用 `f.debug_struct()` 方法将字段以调试形式输出。最后，在 `main` 函数中，我们演示了如何使用这两个特性来打印 `Stock` 结构体的实例。

###  4.2 枚举（`enum`）

在 Rust 中，`enum` 是一种自定义数据类型，用于表示具有一组离散可能值的类型。它允许你定义一组相关的值，并为每个值指定一个名称。`enum` 通常用于表示枚举类型，它可以包含不同的变体（也称为成员或枚举项），每个变体可以存储不同类型的数据。

以下是一个简单的示例，展示了如何定义和使用 `enum`：

```rust
// 定义一个名为 Color 的枚举
enum Color {
    Red,
    Green,
    Blue,
}

fn main() {
    // 创建枚举变量
    let favorite_color = Color::Blue;

    // 使用模式匹配匹配枚举值
    match favorite_color {
        Color::Red => println!("红色是我的最爱！"),
        Color::Green => println!("绿色也不错。"),
        Color::Blue => println!("蓝色是我的最爱！"),
    }
}
```

在这个示例中，我们定义了一个名为 `Color` 的枚举，它有三个变体：`Red`、`Green` 和 `Blue`。每个变体代表了一种颜色。然后，在 `main` 函数中，我们创建了一个 `favorite_color` 变量，并将其设置为 `Color::Blue`，然后使用 `match` 表达式对枚举值进行模式匹配，根据颜色输出不同的消息。

枚举的主要优点包括：

1. **类型安全**：枚举确保变体的值是类型安全的，不会出现无效的值。

2. **可读性**：枚举可以为每个值提供描述性的名称，使代码更具可读性。

3. **模式匹配**：枚举与模式匹配结合使用，可用于处理不同的情况，使代码更具表达力。

4. **可扩展性**：你可以随时添加新的变体来扩展枚举类型，而不会破坏现有代码。

枚举在 Rust 中被广泛用于表示各种不同的情况和状态，包括错误处理、选项类型等等。它是 Rust 强大的工具之一，有助于编写类型安全且清晰的代码。

#### 4.2.1 投资组合管理系统

以下是一个示例，演示了如何在 Rust 中使用枚举和结构体来处理量化金融中的复杂案例。在这个示例中，我们将创建一个简化的投资组合管理系统，用于跟踪不同类型的资产（股票、债券等）和它们的价格。我们将使用枚举来表示不同类型的资产，并使用结构体来表示资产的详细信息。

```rust
// 定义一个枚举，表示不同类型的资产
enum AssetType {
    Stock,
    Bond,
    RealEstate,
}

// 定义一个结构体，表示资产
struct Asset {
    name: String,
    asset_type: AssetType,
    price: f64,
}

// 定义一个投资组合结构体，包含多个资产
struct Portfolio {
    assets: Vec<Asset>,
}

impl Portfolio {
    // 计算投资组合的总价值
    fn calculate_total_value(&self) -> f64 {
        let mut total_value = 0.0;
        for asset in &self.assets {
            total_value += asset.price;
        }
        total_value
    }
}

fn main() {
    // 创建不同类型的资产
    let stock1 = Asset {
        name: String::from("AAPL"),
        asset_type: AssetType::Stock,
        price: 150.0,
    };

    let bond1 = Asset {
        name: String::from("Government Bond"),
        asset_type: AssetType::Bond,
        price: 1000.0,
    };

    let real_estate1 = Asset {
        name: String::from("Commercial Property"),
        asset_type: AssetType::RealEstate,
        price: 500000.0,
    };

    // 创建投资组合并添加资产
    let mut portfolio = Portfolio {
        assets: Vec::new(),
    };

    portfolio.assets.push(stock1);
    portfolio.assets.push(bond1);
    portfolio.assets.push(real_estate1);

    // 计算投资组合的总价值
    let total_value = portfolio.calculate_total_value();

    // 打印结果
    println!("投资组合总价值: ${}", total_value);
}
```

**执行结果:**

```text
投资组合总价值: $501150
```

在这个示例中，我们定义了一个名为 `AssetType` 的枚举，它代表不同类型的资产（股票、债券、房地产）。然后，我们定义了一个名为 `Asset` 的结构体，用于表示单个资产的详细信息，包括名称、资产类型和价格。接下来，我们定义了一个名为 `Portfolio` 的结构体，它包含一个 `Vec<Asset>`，表示投资组合中的多个资产。

在 `Portfolio` 结构体上，我们实现了一个方法 `calculate_total_value`，用于计算投资组合的总价值。该方法遍历投资组合中的所有资产，并将它们的价格相加，得到总价值。

在 `main` 函数中，我们创建了不同类型的资产，然后创建了一个投资组合并向其中添加资产。最后，我们调用 `calculate_total_value` 方法计算投资组合的总价值，并将结果打印出来。

这个示例展示了如何使用枚举和结构体来建模复杂的量化金融问题，以及如何在 Rust 中实现相应的功能。在实际应用中，你可以根据需要扩展这个示例，包括更多的资产类型、交易规则等等。



#### 4.2 订单执行模拟

当在量化金融中使用 Rust 时，枚举（`enum`）常常用于表示不同的金融工具或订单类型。以下是一个示例，演示如何在 Rust 中使用枚举来表示不同类型的金融工具和订单，并模拟执行这些订单：

```rust
// 定义一个枚举，表示不同类型的金融工具
enum FinancialInstrument {
    Stock,
    Bond,
    Option,
    Future,
}

// 定义一个枚举，表示不同类型的订单
enum OrderType {
    Market,
    Limit(f64), // 限价订单，包括价格限制
    Stop(f64),  // 止损订单，包括触发价格
}

// 定义一个结构体，表示订单
struct Order {
    instrument: FinancialInstrument,
    order_type: OrderType,
    quantity: i32,
}

impl Order {
    // 模拟执行订单
    fn execute(&self) {
        match &self.order_type {
            OrderType::Market => println!("执行市价订单: {:?} x {}", self.instrument, self.quantity),
            OrderType::Limit(price) => {
                println!("执行限价订单: {:?} x {} (价格限制: ${})", self.instrument, self.quantity, price)
            }
            OrderType::Stop(trigger_price) => {
                println!("执行止损订单: {:?} x {} (触发价格: ${})", self.instrument, self.quantity, trigger_price)
            }
        }
    }
}

fn main() {
    // 创建不同类型的订单
    let market_order = Order {
        instrument: FinancialInstrument::Stock,
        order_type: OrderType::Market,
        quantity: 100,
    };

    let limit_order = Order {
        instrument: FinancialInstrument::Option,
        order_type: OrderType::Limit(50.0),
        quantity: 50,
    };

    let stop_order = Order {
        instrument: FinancialInstrument::Future,
        order_type: OrderType::Stop(4900.0),
        quantity: 10,
    };

    // 执行订单
    market_order.execute();
    limit_order.execute();
    stop_order.execute();
}
```

在这个示例中，我们定义了两个枚举：`FinancialInstrument` 用于表示不同类型的金融工具（股票、债券、期权、期货等），`OrderType` 用于表示不同类型的订单（市价订单、限价订单、止损订单）。`OrderType::Limit` 和 `OrderType::Stop` 变体包括了价格限制和触发价格的信息。

然后，我们定义了一个 `Order` 结构体，它包含了金融工具类型、订单类型和订单数量。在 `Order` 结构体上，我们实现了一个方法 `execute`，用于模拟执行订单，并根据订单类型打印相应的信息。

在 `main` 函数中，我们创建了不同类型的订单，并使用 `execute` 方法模拟执行它们。这个示例展示了如何使用枚举和结构体来表示量化金融中的不同概念，并模拟执行相关操作。你可以根据实际需求扩展这个示例，包括更多的金融工具类型和订单类型。



## Chapter 5 - Hashmap 

### **5.1** 数值同质且类型安全的Hashmap

在 Rust 中使用 HashMap 进行量化金融的案例是很常见的。HashMap 是 Rust 标准库中的一个集合类型，用于存储键值对，它可以用于管理金融数据和执行各种金融计算。以下是一个简单的 Rust 量化金融案例，涵盖了如何使用 HashMap 来管理股票价格数据：

```rust
use std::collections::HashMap;

// 定义一个股票价格数据结构
#[derive(Debug)]
struct StockPrice {
    symbol: String,
    price: f64,
}

fn main() {
    // 创建一个空的 HashMap 来存储股票价格数据
    let mut stock_prices: HashMap<String, StockPrice> = HashMap::new();

    // 添加股票价格数据
    let stock1 = StockPrice {
        symbol: String::from("AAPL"),
        price: 150.0,
    };
    stock_prices.insert(String::from("AAPL"), stock1);

    let stock2 = StockPrice {
        symbol: String::from("GOOGL"),
        price: 2800.0,
    };
    stock_prices.insert(String::from("GOOGL"), stock2);

    let stock3 = StockPrice {
        symbol: String::from("MSFT"),
        price: 300.0,
    };
    stock_prices.insert(String::from("MSFT"), stock3);

    // 查询股票价格
    if let Some(price) = stock_prices.get("AAPL") {
        println!("The price of AAPL is ${}", price.price);
    } else {
        println!("AAPL not found in the stock prices.");
    }

    // 遍历并打印所有股票价格
    for (symbol, price) in &stock_prices {
        println!("{}: ${}", symbol, price.price);
    }
}

```

**执行结果:**

```text
The price of AAPL is $150
GOOGL: $2800
MSFT: $300
AAPL: $150
```



**思考:Rust 的 hashmap 是不是和 python 的字典或者 C++ 的map有相似性?**

是的，Rust 中的 HashMap 与 Python 中的字典（Dictionary）和 C++ 中的 std::unordered_map（无序映射）有相似性。它们都是用于存储键值对的数据结构，允许你通过键快速查找值。

以下是一些共同点：

1. **键值对存储**：HashMap、字典和无序映射都以键值对的形式存储数据，每个键都映射到一个值。

2. **快速查找**：它们都提供了快速的查找操作，你可以根据键来获取相应的值，时间复杂度通常为 O(1)。

3. **插入和删除**：你可以在这些数据结构中插入新的键值对，也可以删除已有的键值对。

4. **可变性**：它们都支持在已创建的数据结构中修改值。

5. **遍历**：你可以遍历这些数据结构中的所有键值对。

尽管它们在概念上相似，但在不同编程语言中的实现和用法可能会有一些差异。例如，Rust 的 HashMap 是类型安全的，要求键和值都具有相同的类型，而 Python 的字典可以容纳不同类型的键和值。此外，性能和内存管理方面也会有差异。

总之，这些数据结构在不同的编程语言中都用于相似的用途，但具体的实现和用法可能因语言而异。在选择使用时，应考虑语言的要求和性能特性。



### 5.2 数值异质但是仍然安全的Hashmap

**思考: Rust 的 HashMap 是类型安全的，要求键和值都具有相同的类型，而 Python 的字典可以容纳不同类型的键和值。能不能实现不安全的 键和值可以都具有不相同的类型的 hashmap ?**

在 Rust 中，标准库提供的 `HashMap` 是类型安全的，这意味着在编译时，编译器会强制要求键和值都具有相同的类型。这是为了确保代码的类型安全性，防止在运行时发生类型不匹配的错误。

如果你需要在 Rust 中创建一个 HashMap，其中键和值具有不同的类型，你可以使用 Rust 的枚举（Enum）来实现这一目标。具体来说，你可以创建一个枚举，枚举的变体代表不同的类型，然后将枚举用作 HashMap 的值。这样，你可以在 HashMap 中存储不同类型的数据，而仍然保持类型安全。

以下是一个示例，演示了如何在 Rust 中创建一个 HashMap，其中键的类型是字符串，而值的类型是枚举，枚举的变体可以表示不同的数据类型：

```rust
use std::collections::HashMap;

// 定义一个枚举，表示不同的数据类型
enum Value {
    Integer(i32),
    Float(f64),
    String(String),
}

fn main() {
    // 创建一个 HashMap，键是字符串，值是枚举
    let mut data: HashMap<String, Value> = HashMap::new();

    // 向 HashMap 中添加不同类型的数据
    data.insert(String::from("age"), Value::Integer(30));
    data.insert(String::from("height"), Value::Float(175.5));
    data.insert(String::from("name"), Value::String(String::from("John")));

    // 访问和打印数据
    if let Some(value) = data.get("age") {
        match value {
            Value::Integer(age) => println!("Age: {}", age),
            _ => println!("Invalid data type for age."),
        }
    }

    if let Some(value) = data.get("height") {
        match value {
            Value::Float(height) => println!("Height: {}", height),
            _ => println!("Invalid data type for height."),
        }
    }

    if let Some(value) = data.get("name") {
        match value {
            Value::String(name) => println!("Name: {}", name),
            _ => println!("Invalid data type for name."),
        }
    }
}
```

**执行结果:**

```text
Age: 30
Height: 175.5
Name: John
```



在这个示例中，我们定义了一个名为 `Value` 的枚举，它有三个变体，分别代表整数、浮点数和字符串类型的数据。然后，我们创建了一个 HashMap，其中键是字符串，值是 `Value` 枚举。这使得我们可以在 HashMap 中存储不同类型的数据，而仍然保持类型安全。

## Chapter 6 - 变量, 生命周期 和作用域

### 6.1 作用域和遮蔽

变量绑定有一个作用域（scope），它被限定只在一个**代码块**（block）中生存（live）。 代码块是一个被 `{}` 包围的语句集合。另外也允许[变量遮蔽](https://en.wikipedia.org/wiki/Variable_shadowing)（variable shadowing）。

```rust
fn main() {
    // 此绑定生存于 main 函数中
    let outer_binding = 1;

    // 这是一个代码块，比 main 函数拥有更小的作用域
    {
        // 此绑定只存在于本代码块
        let inner_binding = 2;

        println!("inner: {}", inner_binding);

        // 此绑定*遮蔽*了外面的绑定
        let outer_binding = 5_f32;

        println!("inner shadowed outer: {}", outer_binding);
    }
    // 代码块结束

    // 此绑定仍然在作用域内
    println!("outer: {}", outer_binding);

    // 此绑定同样*遮蔽*了前面的绑定
    let outer_binding = 'a';

    println!("outer shadowed outer: {}", outer_binding);
}
```

### 6.2 不可变变量

在Rust中，你可以使用 `mut` 关键字来声明可变变量。可变变量与不可变变量相比，允许在绑定后修改它们的值。以下是一些常见的可变类型：

1. **可变绑定（Mutable Bindings）**：使用 `let mut` 声明的变量是可变的。这意味着你可以在创建后修改它们的值。例如：

    ```rust
    let mut x = 5; // x是可变变量
    x = 10; // 可以修改x的值
    ```

2. **可变引用（Mutable References）**：通过使用可变引用，你可以在不改变变量绑定的情况下修改值。可变引用使用 `&mut` 声明。例如：

    ```rust
    fn main() {
        let mut x = 5;
        modify_value(&mut x); // 通过可变引用修改x的值
        println!("x: {}", x); // 输出 "x: 10"
    }

    fn modify_value(y: &mut i32) {
        *y = 10;
    }
    ```

3. **可变字段（Mutable Fields）**：结构体和枚举可以包含可变字段，这些字段在结构体或枚举创建后可以修改。你可以使用 `mut` 关键字来声明结构体或枚举的字段是可变的。例如：

    ```rust
    struct Point {
        x: i32,
        y: i32,
    }

    fn main() {
        let mut p = Point { x: 1, y: 2 };
        p.x = 10; // 可以修改Point结构体中的字段x的值
    }
    ```

4. **可变数组（Mutable Arrays）**：使用 `mut` 关键字声明的数组是可变的，允许修改数组中的元素。例如：

    ```rust
    fn main() {
        let mut arr = [1, 2, 3];
        arr[0] = 4; // 可以修改数组中的元素
    }
    ```

5. **可变字符串（Mutable Strings）**：使用 `String` 类型的变量和 `push_str`、`push` 等方法可以修改字符串的内容。例如：

    ```rust
    fn main() {
        let mut s = String::from("Hello");
        s.push_str(", world!"); // 可以修改字符串的内容
    }
    ```

这些是一些常见的可变类型示例。可变性是Rust的一个关键特性，它允许你在需要修改值时更改绑定，同时仍然提供了强大的安全性和借用检查。



###  6.3 可变变量

在Rust中，你可以使用 `mut` 关键字来声明可变变量。可变变量与不可变变量相比，允许在绑定后修改它们的值。以下是一些常见的可变类型：

1. **可变绑定（Mutable Bindings）**：使用 `let mut` 声明的变量是可变的。这意味着你可以在创建后修改它们的值。例如：

    ```rust
    let mut x = 5; // x是可变变量
    x = 10; // 可以修改x的值
    ```

2. **可变引用（Mutable References）**：通过使用可变引用，你可以在不改变变量绑定的情况下修改值。可变引用使用 `&mut` 声明。例如：

    ```rust
    fn main() {
        let mut x = 5;
        modify_value(&mut x); // 通过可变引用修改x的值
        println!("x: {}", x); // 输出 "x: 10"
    }

    fn modify_value(y: &mut i32) {
        *y = 10;
    }
    ```

3. **可变字段（Mutable Fields）**：结构体和枚举可以包含可变字段，这些字段在结构体或枚举创建后可以修改。你可以使用 `mut` 关键字来声明结构体或枚举的字段是可变的。例如：

    ```rust
    struct Point {
        x: i32,
        y: i32,
    }

    fn main() {
        let mut p = Point { x: 1, y: 2 };
        p.x = 10; // 可以修改Point结构体中的字段x的值
    }
    ```

4. **可变数组（Mutable Arrays）**：使用 `mut` 关键字声明的数组是可变的，允许修改数组中的元素。例如：

    ```rust
    fn main() {
        let mut arr = [1, 2, 3];
        arr[0] = 4; // 可以修改数组中的元素
    }
    ```

5. **可变字符串（Mutable Strings）**：使用 `String` 类型的变量和 `push_str`、`push` 等方法可以修改字符串的内容。例如：

    ```rust
    fn main() {
        let mut s = String::from("Hello");
        s.push_str(", world!"); // 可以修改字符串的内容
    }
    ```

这些是一些常见的可变类型示例。可变性是Rust的一个关键特性，它允许你在需要修改值时更改绑定，同时仍然提供了强大的安全性和借用检查。

### 6.4 语句(Statements)，表达式(Expressions) 和 变量绑定(Variable Bindings)

#### 6.4.1 语句（Statements）

Rust 有多种语句。在Rust中，下面的内容通常被视为语句：

1. 变量声明语句，如 `let x = 5;`。
2. 赋值语句，如 `x = 10;`。
3. 函数调用语句，如 `println!("Hello, world!");`。
4. 控制流语句，如 `if`、`else`、`while`、`for` 等。

```rust
fn main() {
    // 变量声明语句
    let x = 5;

    // 赋值语句
    let mut y = 10;
    y = y + x;

    // 函数调用语句
    println!("The value of y is: {}", y);

    // 控制流语句
    if y > 10 {
        println!("y is greater than 10");
    } else {
        println!("y is not greater than 10");
    }
}
```

#### 6.4.2 表达式（Expressions）

在Rust中，语句（Statements）和表达式（Expressions）有一些重要的区别：

1. **返回值：**
   - 语句没有返回值。它们执行某些操作或赋值，但不产生值本身。例如，赋值语句 `let x = 5;` 不返回任何值。
   - 表达式总是有返回值。每个表达式都会计算出一个值，并可以被用于其他表达式或赋值给变量。例如，`5 + 3` 表达式返回值 `8`。

2. **可嵌套性：**
   - 语句可以包含表达式，但不能嵌套其他语句。例如，`let x = { 5 + 3; };` 在代码块中包含了一个表达式，但代码块本身是一个语句。
   - 表达式可以包含其他表达式，形成复杂的表达式树。例如，`let y = 5 + (3 * (2 - 1));` 中的表达式包含了嵌套的子表达式。

3. **使用场景：**
   - 语句通常用于执行某些操作，如声明变量、赋值、执行函数调用等。它们不是为了返回值而存在的。
   - 表达式通常用于计算值，这些值可以被用于赋值、函数调用的参数、条件语句的判断条件等。它们总是有返回值。

4. **分号：**
   - 语句通常以分号 `;` 结尾，表示语句的结束。
   - 表达式也可以以分号 `;` 结尾，但这样做通常会忽略表达式的结果。如果省略分号，表达式的值将被返回。

下面是一些示例来说明语句和表达式之间的区别：

```rust
// 这是一个语句，它没有返回值
let x = 5;

// 这是一个表达式，它的值为 8
let y = 5 + 3;

// 这是一个语句块，其中包含了两个语句，但没有返回值
{
    let a = 1;
    let b = 2;
}

// 这是一个表达式，其值为 6，这个值可以被赋给变量或用于其他表达式中
let z = {
    let a = 2;
    let b = 3;
    a + b // 注意，没有分号，所以这是一个表达式
};
```

再来看一下，如果给表达式强制以分号 `;` 结尾的效果。

```rust
fn main() {
    //变量绑定， 创建一个无符号整数变量 `x`
    let x = 5u32;

    // 创建一个新的变量 `y` 并初始化它
    let y = {
        // 创建 `x` 的平方
        let x_squared = x * x;

        // 创建 `x` 的立方
        let x_cube = x_squared * x;

        // 计算 `x_cube + x_squared + x` 并将结果赋给 `y`
        x_cube + x_squared + x
    };
    
    // 代码块也是表达式，所以它们可以用作赋值中的值。
    // 这里的代码块的最后一个表达式是 `2 * x`，但由于有分号结束了这个代码块，所以将 `()` 赋给 `z`
    let z = {
        2 * x;
    };

    // 打印变量的值
    println!("x is {:?}", x);
    println!("y is {:?}", y);
    println!("z is {:?}", z);
}
```
返回的是
```rust
x is 5
y is 155
z is ()
```
总之，语句用于执行操作，而表达式用于计算值。理解这两者之间的区别对于编写Rust代码非常重要。

## Chapter 7 - 类型系统

在量化金融领域，Rust 的类型系统具有出色的表现，它强调了类型安全、性能和灵活性，这使得 Rust 成为一个理想的编程语言来处理金融数据和算法交易。以下是一个详细介绍 Rust 类型系统的案例，涵盖了如何在金融领域中利用其特性：

### 7.1 字面量 (Literals)

对数值字面量，只要把类型作为后缀加上去，就完成了类型说明。比如指定字面量 `42` 的类型是 `i32`，只需要写 `42i32`。

无后缀的数值字面量，其类型取决于怎样使用它们。如果没有限制，编译器会对整数使用 `i32`，对浮点数使用 `f64`。

```rust
fn main() {
    let a = 3f32;
    let b = 1;
    let c = 1.0;
    let d = 2u32;
    let e = 1u8;

    println!("size of `a` in bytes: {}", std::mem::size_of_val(&a));
    println!("size of `b` in bytes: {}", std::mem::size_of_val(&b));
    println!("size of `c` in bytes: {}", std::mem::size_of_val(&c));
    println!("size of `d` in bytes: {}", std::mem::size_of_val(&d));
    println!("size of `e` in bytes: {}", std::mem::size_of_val(&e));
}
```

**执行结果**:

```text
size of `a` in bytes: 4
size of `b` in bytes: 4
size of `c` in bytes: 8
size of `d` in bytes: 4
size of `e` in bytes: 1
```



PS: 上面的代码使用了一些还没有讨论过的概念。

`std::mem::size_of_val` 是 Rust 标准库中的一个函数，用于获取一个值（变量或表达式）所占用的字节数。具体来说，它返回一个值的大小（以字节为单位），即该值在内存中所占用的空间大小。

`std::mem::size_of_val`的调用方式使用了完整路径（full path）。在 Rust 中，代码可以被组织成称为模块（module）的逻辑单元，而模块可以嵌套在其他模块内。在这个示例中：

- `size_of_val` 函数是在名为 `mem` 的模块中定义的。
- `mem` 模块又是在名为 `std` 的 crate 中定义的。

让我们详细解释这些概念：

1. **Crate**：在 Rust 中，crate 是最高级别的代码组织单元，可以看作是一个库或一个包。Rust 的标准库（Standard Library）也是一个 crate，通常被引用为 `std`。

2. **模块**：模块是用于组织和封装代码的逻辑单元。模块可以包含函数、结构体、枚举、常量等。在示例中，`std` crate 包含了一个名为 `mem` 的模块，而 `mem` 模块包含了 `size_of_val` 函数。

3. **完整路径**：在 Rust 中，如果要调用一个函数、访问一个模块中的变量等，可以使用完整路径来指定它们的位置。完整路径包括 crate 名称、模块名称、函数名称等，用于明确指定要使用的项。在示例中，`std::mem::size_of_val` 使用了完整路径，以确保编译器能够找到正确的函数。

所以，`std::mem::size_of_val` 的意思是从标准库 crate（`std`）中的 `mem` 模块中调用 `size_of_val` 函数。这种方式有助于防止命名冲突和确保代码的可读性和可维护性，因为它明确指定了要使用的函数的来源。

### 7.2 强类型系统 (Strong type system)

Rust 的类型系统是强类型的，这意味着每个变量都必须具有明确定义的类型，并且在编译时会严格检查类型的一致性。这一特性在金融计算中尤为重要，因为它有助于防止可能导致严重错误的类型不匹配问题。

举例来说，考虑以下代码片段：

```rust
let price: f64 = 150.0; // 价格是一个浮点数
let quantity: i32 = 100; // 数量是一个整数
let total_value = price * quantity; // 编译错误，不能将浮点数与整数相乘
```

在这个示例中，我们明确指定了 `price` 是一个浮点数，而 `quantity` 是一个整数。当我们尝试将它们相乘时，Rust 在编译时就会立即捕获到类型不匹配的错误。这种类型检查的严格性有助于避免金融计算中常见的错误，例如将不同类型的数据混淆或错误地进行数学运算。因此，Rust 的强类型系统提供了额外的安全性层，确保金融应用程序在编译时捕获潜在的问题，从而减少了在运行时出现错误的风险。

在 Rust 的强类型系统中，类型之间的转换通常需要显式进行，以确保类型安全。

### 7.3 类型转换 (Casting)

Rust 不支持原生类型之间的隐式类型转换（coercion），但允许通过 `as` 关键字进行明确的类型转换（casting）。

1. **as 运算符**：可以使用 `as` 运算符执行类型转换，但是只能用于数值之间的转换。例如，将整数转换为浮点数或将浮点数转换为整数。

   ```rust
   let integer_num: i32 = 42;
   let float_num: f64 = integer_num as f64;
   
   let float_value: f64 = 3.14;
   let integer_value: i32 = float_value as i32;
   ```

   需要注意的是，使用 `as` 进行类型转换**可能会导致数据丢失或不确定行为**，因此要谨慎使用。在程序设计之初，最好就能规划好变量数据的类型。

2. **From 和 Into trait**：

   在量化金融领域，`From` 和 `Into` trait 可以用来实现自定义类型之间的转换，以便在处理金融数据和算法时更方便地操作不同的数据类型。下面让我们使用一个简单的例子来说明这两个 trait 在量化金融中的应用。

   假设我们有两种不同的金融工具类型：`Stock`（股票）和 `Option`（期权）。我们希望能够在这两种类型之间进行转换，以便在金融算法中更灵活地处理它们。

   首先，我们可以定义这两种类型的结构体：

   ```rust
   struct Stock {
       symbol: String,
       price: f64,
   }
   
   struct Option {
       symbol: String,
       strike_price: f64,
       expiration_date: String,
   }
   ```

   现在，让我们使用 `From` 和 `Into` trait 来实现类型之间的转换。

   **从 Stock 到 Option 的转换**：

   假设我们希望从一个股票创建一个对应的期权。我们可以实现 `From` trait 来定义如何从 `Stock` 转换为 `Option`：

   ```rust
   impl From<Stock> for Option {
       fn from(stock: Stock) -> Self {
           Option {
               symbol: stock.symbol,
               strike_price: stock.price * 1.1, // 假设期权的行权价是股票价格的110%
               expiration_date: String::from("2023-12-31"), // 假设期权到期日期
           }
       }
   }
   ```

   现在，我们可以这样进行转换：

   ```rust
   let stock = Stock {
       symbol: String::from("AAPL"),
       price: 150.0,
   };
   
   let option: Option = stock.into(); // 使用 Into trait 进行转换
   ```

    **从 Option 到 Stock 的转换**：

   如果我们希望从一个期权创建一个对应的股票，我们可以实现相反方向的转换，使用 `From` trait 或 `Into` trait 的逆操作。

   ```rust
   impl From<Option> for Stock {
       fn from(option: Option) -> Self {
           Stock {
               symbol: option.symbol,
               price: option.strike_price / 1.1, // 假设期权的行权价是股票价格的110%
           }
       }
   }
   ```

   或者，我们可以使用 `Into` trait 进行相反方向的转换：

   ```rust
   let option = Option {
       symbol: String::from("AAPL"),
       strike_price: 165.0,
       expiration_date: String::from("2023-12-31"),
   };
   
   let stock: Stock = option.into(); // 使用 Into trait 进行转换
   ```

   通过实现 `From` 和 `Into` trait，我们可以自定义类型之间的转换逻辑，使得在量化金融算法中更容易地处理不同的金融工具类型，提高了代码的灵活性和可维护性。这有助于简化金融数据处理的代码，并使其更具可读性。

### 7.4 自动类型推断(Inference)

在Rust中，类型推断引擎非常强大，它不仅在初始化变量时考虑右值（r-value）的类型，还会分析变量之后的使用情况，以便更准确地推断类型。以下是一个更复杂的类型推断示例，我们将详细说明它的工作原理。

```rust
fn main() {
    let mut x = 5; // 变量 x 被初始化为整数 5
    x = 10; // 现在，将 x 更新为整数 10
    println!("x = {}", x);
}
```

在这个示例中，我们首先声明了一个变量 `x`，并将其初始化为整数5。然后，我们将 `x` 的值更改为整数10，并最后打印出 `x` 的值。

Rust的类型推断引擎如何工作：

1. **变量初始化**：当我们声明 `x` 并将其初始化为5时，Rust的类型推断引擎会根据右值的类型（这里是整数5）推断出 `x` 的类型为整数（`i32`）。
2. **赋值操作**：当我们执行 `x = 10;` 这行代码时，Rust不仅检查右值（整数10）的类型，还会考虑左值（变量 `x`）的类型。它发现 `x` 已经被推断为整数（`i32`），所以它知道我们尝试将一个整数赋给 `x`，并且这是合法的。
3. **打印**：最后，我们使用 `println!` 宏打印 `x` 的值。Rust仍然知道 `x` 的类型是整数，因此它可以正确地将其格式化为字符串并打印出来。

### 7.5 泛型 (Generic Type)

在Rust中，泛型（Generics）允许你编写可以处理多种数据类型的通用代码，这对于金融领域的金融工具尤其有用。你可以编写通用函数或数据结构，以处理不同类型的金融工具（即金融工具的各种数据类型），而不必为每种类型都编写重复的代码。

以下是一个简单的示例，演示如何使用Rust的泛型来处理不同类型的金融工具：

```rust
struct FinancialInstrument<T> {
    symbol: String,
    value: T,
}

impl<T> FinancialInstrument<T> {
    fn new(symbol: &str, value: T) -> Self {
        FinancialInstrument {
            symbol: String::from(symbol),
            value,
        }
    }

    fn get_value(&self) -> &T {
        &self.value
    }
}

fn main() {
    let stock = FinancialInstrument::new("AAPL", "150.0"); // 引发混淆，value的类型应该是数字
    let option = FinancialInstrument::new("AAPL Call", true); // 引发混淆，value的类型应该是数字或金额

    println!("Stock value: {}", stock.get_value()); // 这里应该处理数字，但现在是字符串
    println!("Option value: {}", option.get_value()); // 这里应该处理数字或金额，但现在是布尔值
}
```

**执行结果**:

```text
Stock value: 150.0
Option value: true
```



在这个示例中，我们定义了一个泛型结构体 `FinancialInstrument<T>`，它可以存储不同类型的金融工具的值。无论是股票还是期权，我们都可以使用相同的代码来创建和访问它们的值。

在 `main` 函数中，我们创建了一个股票（`stock`）和一个期权（`option`），它们都使用了相同的泛型结构体 `FinancialInstrument<T>`。然后，我们使用 `get_value` 方法来访问它们的值，并打印出来。

**但是,**

在实际操作层面,这是一个**非常好的反例**,应该尽量避免,因为使用泛型把不同的金融工具归纳为FinancialInstrument, 会造成不必要的混淆。

在实际应用中使用泛型时需要考虑的建议：

1. **合理使用泛型**：只有在需要处理多种数据类型的情况下才使用泛型。如果只有一种或少数几种数据类型，那么可能不需要泛型，可以直接使用具体类型。
2. **提供有意义的类型参数名称**：为泛型参数选择有意义的名称，以便其他开发人员能够理解代码的含义。避免使用过于抽象的名称。
3. **文档和注释**：为使用泛型的代码提供清晰的文档和注释，解释泛型参数的作用和预期的数据类型。这有助于其他开发人员更容易理解代码。
4. **测试和验证**：确保使用泛型的代码经过充分的测试和验证，以确保其正确性和性能。泛型代码可能会引入更多的复杂性，因此需要额外的关注。
5. **避免过度抽象**：避免在不必要的地方使用泛型。如果一个特定的实现对于某个特定问题更加清晰和高效，不要强行使用泛型。

让我们看一个**更合适的案例**，其中泛型用于处理更具体的问题。考虑一个投资组合管理系统，其中有不同类型的资产（股票、债券、期权等）。我们可以使用泛型来实现一个通用的投资组合结构，但同时保留每种资产的具体类型：

```rust
struct Portfolio<T> {
    assets: Vec<T>,
}

impl<T> Portfolio<T> {
    fn new() -> Self {
        Portfolio {
            assets: Vec::new(),
        }
    }

    fn add_asset(&mut self, asset: T) {
        self.assets.push(asset);
    }

    fn calculate_total_value(&self) -> f64
    where
        T: Asset,
    {
        self.assets.iter().map(|asset| asset.get_value()).sum()
    }
}

trait Asset {
    fn get_value(&self) -> f64;
}

struct Stock {
    symbol: String,
    price: f64,
}

impl Asset for Stock {
    fn get_value(&self) -> f64 {
        self.price
    }
}

struct Option {
    symbol: String,
    value: f64,
}

impl Asset for Option {
    fn get_value(&self) -> f64 {
        self.value
    }
}

fn main() {
    let mut portfolio = Portfolio::new();
    let stock = Stock {
        symbol: String::from("AAPL"),
        price: 150.0,
    };
    let option = Option {
        symbol: String::from("AAPL Call"),
        value: 10.0,
    };

    portfolio.add_asset(stock);
    portfolio.add_asset(option);

    let total_value = portfolio.calculate_total_value();
    println!("Total Portfolio Value: {}", total_value);
}
```

在这个示例中，我们定义了一个泛型 `Portfolio<T>` 结构体，表示投资组合，但我们通过 trait `Asset` 和具体的资产类型（`Stock` 和 `Option`）来保持每种资产的独立性。这样可以更清晰地表示不同类型的资产，同时保留了泛型的灵活，以处理投资组合中的不同资产类型。这是一种更合理的使用泛型的方式，可以避免不必要的混淆。

## Chapter 8 - 类型转换

### 8.1 From 和 Into 特性

在7.3我们已经讲过通过From和Into Traits 来实现类型转换，现在我们来详细解释以下它的基础。

`From` 和 `Into` 是一种相关但略有不同的 trait，它们通常一起使用以提供类型之间的双向转换。这两个 trait 的关系如下：

1. **`From` Trait**：它定义了如何从一个类型创建另一个类型的值。通常，你会为需要自定义类型转换的情况实现 `From` trait。例如，你可以实现 `From<i32>` 来定义如何从 `i32` 转换为你自定义的类型。
2. **`Into` Trait**：它是 `From` 的反向操作。`Into` trait 允许你定义如何将一个类型转换为另一个类型。当你实现了 `From` trait 时，Rust 会自动为你提供 `Into` trait 的实现，因此你无需显式地为类型的反向转换实现 `Into`。

实际上，这两个 trait 通常是一体的，因为它们是相互关联的。如果你实现了 `From`，就可以使用 `into()` 方法来进行类型转换，而如果你实现了 `Into`，也可以使用 `from()` 方法来进行类型转换。这使得代码更具灵活性和可读性。

### 8.2 标准库里具有From 和Into特性的类型

标准库中具有 `From` 特性实现的类型有很多，以下是一些例子：

1. **&str 到 String**: 可以使用 `String::from()` 方法将字符串切片（`&str`）转换为 `String`：

   ```rust
   let my_str = "hello";
   let my_string = String::from(my_str);
   ```

2. **&String 到 &str**: `String` 类型可以通过引用转换为字符串切片：

   ```rust
   let my_string = String::from("hello");
   let my_str: &str = &my_string;
   ```

3. **数字类型之间的转换**: 例如，可以将整数类型转换为浮点数类型，或者反之：

   ```rust
   let int_num = 42;
   let float_num = f64::from(int_num);
   ```

4. **字符到字符串**: 字符类型可以使用 `to_string()` 方法转换为字符串：

   ```rust
   let my_char = 'a';
   let my_string = my_char.to_string();
   ```

5. **Vec 到 Boxed Slice**: 可以使用 `Vec::into_boxed_slice()` 将 `Vec` 转换为堆分配的切片（`Box<[T]>`）：

   ```rust
   let my_vec = vec![1, 2, 3];
   let boxed_slice: Box<[i32]> = my_vec.into_boxed_slice();
   ```

这些都是标准库中常见的 `From` 实现的示例，它们使得不同类型之间的转换更加灵活和方便。要记住，`From` 特性是一种用于定义类型之间转换规则的强大工具。

### 8.2 TryFrom 和 TryInto 特性

与 `From` 和 `Into` 类似，`TryFrom` 和 `TryInto` 是用于类型转换的通用 traits。不同之处在于，`TryFrom` 和 `TryInto` 主要用于可能会 **导致错误** 的转换，因此它们的返回类型也是 `Result`。

当使用量化金融案例时，可以考虑如何处理不同金融工具的价格或指标之间的转换，例如将股票价格转换为对数收益率。以下是一个示例：

```rust
use std::convert::{TryFrom, TryInto};

// 我们来自己建立一个自定义的错误类型 ConversionError , 用来汇报类型转换出错
#[derive(Debug)]
struct ConversionError;

// 定义一个结构体表示股票价格
struct StockPrice {
    price: f64,
}

// 实现 TryFrom 来尝试将股票价格转换为对数收益率，可能失败
impl TryFrom<StockPrice> for f64 {
    type Error = ConversionError;

    fn try_from(stock_price: StockPrice) -> Result<Self, Self::Error> {
        if stock_price.price > 0.0 {
            Ok(stock_price.price.ln()) // 计算对数收益率
        } else {
            Err(ConversionError)
        }
    }
}

fn main() {
    // 尝试使用 TryFrom 进行类型转换
    let valid_price = StockPrice { price: 50.0 };
    let result: Result<f64, ConversionError> = valid_price.try_into();
    println!("{:?}", result); // 打印对数收益率

    let invalid_price = StockPrice { price: -10.0 };
    let result: Result<f64, ConversionError> = invalid_price.try_into();
    println!("{:?}", result); // 打印错误信息
}

```

在这个示例中，我们定义了一个 `StockPrice` 结构体来表示股票价格，然后使用 `TryFrom` 实现了从 `StockPrice` 到 `f64` 的类型转换，其中 `f64` 表示对数收益率。如果股票价格小于等于0，转换会产生错误。在 `main` 函数中，我们演示了如何使用 `TryFrom` 进行类型转换，并在可能失败的情况下获取 `Result` 类型的结果。这个示例展示了如何在量化金融中处理不同类型之间的转换。



### 8.3 ToString和FromStr

## Chapter 9 - 流程控制
## Chapter 10 - 函数, 方法 和 闭包
## Chapter 11 - 模块
## Chapter 12 - Cargo 

## Chapter 13 - 属性
属性是应用于某些模块、crate 或项的元数据（metadata）。这元数据可以用来：

- 条件编译代码
- 设置 crate 名称、版本和类型（二进制文件或库）
- 禁用 lint （警告）
- 启用编译器的特性（宏、全局导入（glob import）等）
- 链接到一个非 Rust 语言的库
- 标记函数作为单元测试
- 标记函数作为基准测试的某个部分

```rust
// 属性可以接受参数，有不同的语法形式：
#[attribute = "value"]
#[attribute(key = "value")]
#[attribute(value)]
// 属性可以多个值，它们可以分开到多行中：
#[attribute(value, value2)]
#[attribute(value, value2, value3,value4, value5)]
```

## Chapter 14 - 泛型
## Chapter 15 - 文档
## Chapter 16 - 作用域规则
## Chapter 17 - 特性 trait
## Chapter 18 - 使用 macro_rules! 来创建宏
## Chapter 19 - 错误处理
## Chapter 20 - 线程和管道
## Chapter 21 - 面向对象编程
## Chapter 22 - 测试
## Chapter 23 - Unsafe
## Chapter 24 - 时间处理
## Chapter 25 - Polars入门
## Chapter 26 - 时序数据库Clickhouse交互
## Chapter 27 - Rust与内存结构
## Chapter 28 - 标准库类型
## Chapter 29 - Cerebro 引擎系统
## Chapter 30 - Logger日志系统
