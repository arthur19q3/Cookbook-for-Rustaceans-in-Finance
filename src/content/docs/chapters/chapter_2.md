---
title: 格式化输出
---

## 2.1 诸种格式宏(format macros)

Rust的打印操作由 `std::fmt` 里面所定义的一系列宏 Macro 来处理，包括：

`format!`：将格式化文本写到字符串。

`print!`：与 format! 类似，但将文本输出到控制台(io::stdout)。

`println!`: 与 print! 类似，但输出结果追加一个换行符。

`eprint!`：与 print! 类似，但将文本输出到标准错误(io::stderr)。

`eprintln!`：与 eprint! 类似，但输出结果追加一个换行符。

### 案例：折现计算器

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
    println!("请输入折现率(以小数形式)：");
    io::stdin().read_line(&mut input).expect("读取失败");
    let discount_rate: f64 = input.trim().parse().expect("无效输入");

    input.clear(); // 清空输入缓冲区，以便下一次使用

    // 提示用户输入时间期限
    print!("请输入时间期限(以年为单位)：");
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
请输入折现率(以小数形式)：0.2
请输入时间期限(以年为单位)：2

现值为：1388.89
```

当我们输入一个负的折现率后, 我们用eprint!和eprintln!预先编辑好的错误信息就出现了:

```shell
折现计算器
请输入本金金额：3000
请输入折现率(以小数形式)：-0.2
请输入时间期限(以年为单位)：5

错误：折现率不能为负数！ 请提供有效的折现率。
```

## 2.2 Debug 和 Display 特性

> `fmt::Debug`：使用 {:?} 标记。格式化文本以供**调试使用**。
> `fmt::Display`：使用 {} 标记。以**更优雅和友好的风格**来格式化文本。

在 Rust 中，你可以为自定义类型(包括结构体 `struct`)实现 `Display` 和 `Debug` 特性来控制如何以可读和调试友好的方式打印(格式化)该类型的实例。这两个特性是 Rust 标准库中的 trait，它们提供了不同的打印输出方式，适用于不同的用途。

**Display 特性：**

- `Display` 特性用于定义类型的人类可读字符串表示形式，通常用于用户友好的输出。例如，你可以实现 `Display` 特性来打印结构体的信息，以便用户能够轻松理解它。

- 要实现 `Display` 特性，必须定义一个名为 `fmt` 的方法，它接受一个格式化器对象(`fmt::Formatter`)作为参数，并将要打印的信息写入该对象。

- 使用 `{}` 占位符可以在 `println!` 宏或 `format!` 宏中使用 `Display` 特性。

- 通常，实现 `Display` 特性需要手动编写代码来指定打印的格式，以确保输出满足你的需求。

**Debug 特性：**

- `Debug` 特性用于定义类型的调试输出形式，通常用于开发和调试过程中，以便查看内部数据结构和状态。

- 与 `Display` 不同，`Debug` 特性不需要手动指定格式，而是使用默认的格式化方式。你可以通过在 `println!` 宏或 `format!` 宏中使用 `{:?}` 占位符来打印实现了 `Debug` 特性的类型。

- 标准库提供了一个 `#[derive(Debug)]` 注解，你可以将其添加到结构体定义之前，以自动生成 `Debug` 实现。这使得调试更加方便，因为不需要手动编写调试输出的代码。

### 案例： 打印股票价格信息和金融报告

**股票价格信息**：(由**Display Trait**推导)

```rust
// 导入 fmt 模块中的 fmt trait，用于实现自定义格式化
use std::fmt;

// 定义一个结构体 StockPrice，表示股票价格
struct StockPrice {
    symbol: String, // 股票符号
    price: f64,     // 价格
}

// 实现 fmt::Display trait，允许我们自定义格式化输出
impl fmt::Display for StockPrice {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // 使用 write! 宏将格式化后的字符串写入 f 参数
        write!(f, "股票: {} - 价格: {:.2}", self.symbol, self.price)
    }
}

fn main() {
    // 创建一个 StockPrice 结构体实例
    let price = StockPrice {
        symbol: "AAPL".to_string(), // 使用 to_string() 方法将字符串字面量转换为 String 类型
        price: 150.25,
    };

    // 使用 println! 宏打印格式化后的字符串，这里会自动调用 Display 实现的 fmt 方法
    println!("[INFO]: {}", price);
}
```

**执行结果:**

```shell
[INFO]: Stock: AAPL - Price: 150.25
```

**金融报告**：(由**Debug Trait**推导)

```rust
// 导入 fmt 模块中的 fmt trait，用于实现自定义格式化
use std::fmt;

// 定义一个结构体 FinancialReport，表示财务报告
// 使用 #[derive(Debug)] 属性来自动实现 Debug trait，以便能够使用 {:?} 打印调试信息
struct FinancialReport {
    income: f64,    // 收入
    expenses: f64,  // 支出
}

fn main() {
    // 创建一个 FinancialReport 结构体实例
    let report = FinancialReport {
        income: 10000.0,  // 设置收入
        expenses: 7500.0, // 设置支出
    };

    // 使用 income 和 expenses 字段的值，打印财务报告的收入和支出
    println!("金融报告:\nIncome: {:.2}\nExpenses: {:.2}", report.income, report.expenses);

    // 打印整个财务报告的调试信息，利用 #[derive(Debug)] 自动生成的 Debug trait
    println!("{:?}", report);
}
```

**执行结果:**

```shell
金融报告:
Income: 10000.00 //手动格式化的语句
Expenses: 7500.00 //手动格式化的语句
FinancialReport { income: 10000.0, expenses: 7500.0 } //Debug Trait帮我们推导的原始语句
```

## 2.3 write! , print! 和 format!的区别

`write!`、`print!` 和 `format!` 都是 Rust 中的宏，用于生成文本输出，但它们在使用和输出方面略有不同：

1. `write!`：

   - `write!` 宏用于将格式化的文本写入到一个实现了 `std::io::Write` trait 的对象中，通常是文件、标准输出(`std::io::stdout()`)或标准错误(`std::io::stderr()`)。

   - 使用 `write!` 时，你需要指定目标输出流，将生成的文本写入该流中，而不是直接在控制台打印。

   - `write!` 生成的文本不会立即显示在屏幕上，而是需要进一步将其刷新(flush)到输出流中。

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

   - `print!` 宏用于直接将格式化的文本打印到标准输出(控制台)，而不需要指定输出流。

   - `print!` 生成的文本会立即显示在屏幕上。

   - 示例用法：

     ```rust
     fn main() {
         print!("Hello, {}!", "world");
     }
     ```

3. `format!`：

   - `format!` 宏用于生成一个格式化的字符串，而不是直接将其写入输出流或打印到控制台。

   - 它返回一个 `String` 类型的字符串，你可以随后使用它进行进一步处理、打印或写入到文件中。

   - 示例用法：

     ```rust
     fn main() {
         let formatted_str = format!("Hello, {}!", "world");
         println!("{}", formatted_str);
     }
     ```

总结：

- 如果你想将格式化的文本输出到标准输出，通常使用 `print!`。
- 如果你想将格式化的文本输出到文件或其他实现了 `Write` trait 的对象，使用 `write!`。
- 如果你只想生成一个格式化的字符串而不需要立即输出，使用 `format!`。
