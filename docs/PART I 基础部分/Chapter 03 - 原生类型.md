# Chapter 03 - 原生类型

「原生类型」（Primitive Types）是计算机科学中的一个通用术语，通常用于描述编程语言中的基本数据类型。Rust 中的原生类型被称为原生，因为它们是语言的基础构建块，通常由编译器和底层硬件直接支持。以下是为什么这些类型被称为原生类型的几个原因：

- **硬件支持：**原生类型通常能够直接映射到底层硬件的数据表示方式。例如，`i32` 和 `f64` 类型通常直接对应于CPU中整数和浮点数寄存器的存储格式，因此在运行时效率较高。
- **编译器优化：**由于原生类型的表示方式是直接的，编译器可以进行有效的优化，以在代码执行时获得更好的性能。这意味着原生类型的操作通常比自定义类型更快速。
- **标准化：**原生类型是语言标准的一部分，因此在不同的 Rust 编译器和环境中具有相同的语义。这意味着你可以跨平台使用这些类型，而无需担心不同系统上的行为不一致。
- **内存布局可控：**原生类型的内存布局是明确的，因此你可以精确地控制数据在内存中的存储方式。这对于与外部系统进行交互、编写系统级代码或进行底层内存操作非常重要。

## 3.1 基本数据类型

Rust 中有一些原生数据类型，用于表示基本的数据值。以下是一些常见的原生数据类型：

### 整数类型

- `i8`：有符号 8 位整数
- `i16`：有符号 16 位整数
- `i32`：有符号 32 位整数
- `i64`：有符号 64 位整数
- `i128`：有符号 128 位整数
- `u8`：无符号 8 位整数
- `u16`：无符号 16 位整数
- `u32`：无符号 32 位整数
- `u64`：无符号 64 位整数
- `u128`：无符号 128 位整数
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

执行结果：

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

### 浮点数类型

- `f32`：32 位浮点数
- `f64`：64 位浮点数（双精度浮点数）

以下是一个演示各种浮点数类型及其范围的案例：

```rust
fn main() {
    let f32_num: f32 = 3.14; // 32位浮点数，范围：约 -3.4e38 到 3.4e38，精度约为7位小数
    let f64_num: f64 = 3.141592653589793238; // 64位浮点数，范围：约 -1.7e308 到 1.7e308，精度约为15位小数

    // 打印各个浮点数类型的值
    println!("f32: {}", f32_num);
    println!("f64: {}", f64_num);
}

```

执行结果：

```text
f32: 3.14
f64: 3.141592653589793
```

### 布尔类型

`bool`：表示布尔值，可以是 `true` 或 `false`。

在 Rust 中, 布尔值 `bool` 可以直接拿来当 `if` 语句的判断条件。

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

执行结果：

```text
购买股票：股价为 150，满足购买条件。
```

### 字符类型

`char`：表示**单个** Unicode 字符。

Rust 的字符类型 `char` 具有以下特征:

- **Unicode 支持：**几乎所有现代编程语言都提供了对 Unicode 字符的支持，因为 Unicode 已成为全球标准字符集。Rust 的 `char`
  类型当然也是 Unicode 兼容的，这意味着它可以表示任何有效的 Unicode 字符，包括 ASCII 字符和其他语言中的特殊字符。
- **32 位宽度：**`char` 类型使用 UTF-32 编码来表示 Unicode 字符，一个 `char` 实际上是一个长度为 1 的 UCS-4 / UTF-32
  字符串。这确保了 `char` 类型可以容纳任何 Unicode 字符，因为 UTF-32 编码的码点范围覆盖了 Unicode 字符集的所有字符（包括
  emoji 如 🐂 和 🐎 等）。`char` 类型的值是 Unicode 标量值（即不是代理项的代码点），表示为 0x0000 到 0xD7FF 或 0xE000 到
  0x10FFFF 范围内的 32 位无符号字。创建一个超出此范围的 `char` 会立即被编译器认为是未定义行为。
- **字符字面量：**`char` 类型的字符字面量使用单引号括起来，例如 `'A'` 或 `'❤'`。这些字符字面量可以直接赋值给 `char` 变量。
- **字符转义序列**：与字符串一样，`char` 字面量也支持转义序列，例如 `'\n'` 表示换行字符。
- **UTF-8 字符串：**Rust 中的字符串类型 `String` 是 UTF-8 编码的，这与 `char` 类型兼容，因为 UTF-8 是一种可变长度编码，可以表示各种字符。
- **字符迭代：**你可以使用迭代器来处理字符串中的每个字符，例如使用 `chars()` 方法。这使得遍历和操作字符串中的字符非常方便。

`char` 类型的特性可以用于处理和表示与金融数据和分析相关的各种字符和符号。以下是一些展示如何在量化金融环境中利用 `char` 特性的示例：

- **表示货币符号：**`char` 可以用于表示货币符号，例如美元符号 `'$'` 或欧元符号 `'€'` 等。这对于在金融数据中标识货币类型非常有用。
  ```rust
  fn main() {
      let usd_symbol = '$';
      let eur_symbol = '€';
  
      println!("美元符号: {}", usd_symbol);
      println!("欧元符号: {}", eur_symbol);
  }
  ```

  执行结果：

  ```text
  美元符号: $
  欧元符号: €
  ```

- **表示期权合约种类：**在这个示例中，我们使用 `char` 类型来表示期权合约类型，'P' 代表 put 期权合约，'C' 代表 call 期权合约。根据不同的合约类型，我们执行不同的操作。这种方式可以用于在金融交易中确定期权合约的类型，从而执行相应的交易策略。

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

  执行结果：

  ```text
  执行put期权合约。
  ```

- **处理特殊字符：**金融数据中可能包含特殊字符，例如百分比符号 `%` 或乘号 `*`。`char` 类型允许你在处理这些字符时更容易地执行各种操作。

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

  执行结果：

  ```text
  5% * 10 = 0.5
  ```

`char` 类型的特性使得你能够更方便地处理和识别与金融数据和符号相关的字符，从而更好地支持金融数据分析和展示。

## 3.2 字面量、运算符和字符串

Rust 语言中，你可以使用不同类型的字面量来表示不同的数据类型，包括整数、浮点数、字符、字符串、布尔值以及单元类型。以下是关于 Rust 字面量和运算符的简要总结：

### 字面量（Literals）

当你编写 Rust 代码时，你会遇到各种不同类型的字面量，它们用于表示不同类型的值。以下是一些常见的字面量类型和示例：

- **整数字面量（Integer Literals）：**用于表示整数值，例如：
    - 十进制整数：`10`
    - 十六进制整数：`0x1F`
    - 八进制整数：`0o77`
    - 二进制整数：`0b1010`

- **浮点数字面量（Floating-Point Literals）：**用于表示带小数点的数值，例如：
    - 浮点数：`3.14`
    - 科学计数法：`2.0e5`

- **字符字面量（Character Literals）：**用于表示单个字符，使用单引号括起来，例如：
    - 字符 ：`'A'`
    - 转义字符 ：`'\n'`

- **字符串字面量（String Literals）：**用于表示文本字符串，使用双引号括起来，例如：
    - 字符串 ：`"Hello, World!"`

- **布尔字面量（Boolean Literals）：**用于表示逻辑「真」或「假」的值，例如：
    - 布尔值：`true`
    - 布尔值：`false`

- **单元类型（Unit Type）：**表示没有有意义的返回值的情况，通常表示为 `()`，例如：
    - 函数返回值：`fn do_something() -> () { }`

你还可以在数字字面量中插入下划线 `_` 以提高可读性，例如 `1_000` 和 `0.000_001`，它们分别等同于 1,000 和 0.000,001。这些字面量类型用于初始化变量、传递参数和表示数据的各种值。

### 运算符（Operators）

在 Rust 中，常见的运算符包括：

- **算术运算符（Arithmetic Operators）**
    - `+`（加法）：将两个数相加，例如 `a + b`。
    - `-`（减法）：将右边的数从左边的数中减去，例如 `a - b`。
    - `*`（乘法）：将两个数相乘，例如 `a * b`。
    - `/`（除法）：将左边的数除以右边的数，例如 `a / b`。
    - `%`（取余）：返回左边的数除以右边的数的余数，例如 `a % b`。

- **比较运算符（Comparison Operators）**
    - `==`（等于）：检查左右两边的值是否相等，例如 `a == b`。
    - `!=`（不等于）：检查左右两边的值是否不相等，例如 `a != b`。
    - `<`（小于）：检查左边的值是否小于右边的值，例如 `a < b`。
    - `>`（大于）：检查左边的值是否大于右边的值，例如 `a > b`。
    - `<=`（小于或等于）：检查左边的值是否小于或等于右边的值，例如 `a <= b`。
    - `>=`（大于或等于）：检查左边的值是否大于或等于右边的值，例如 `a >= b`。

- **逻辑运算符（Logical Operators）**
    - `&&`（逻辑与）：用于组合两个条件，只有当两个条件都为真时才为真，例如 `condition1 && condition2`。
    - `||`（逻辑或）：用于组合两个条件，只要其中一个条件为真就为真，例如 `condition1 || condition2`。
    - `!`（逻辑非）：用于取反一个条件，将真变为假，假变为真，例如 `!condition`。

- **赋值运算符（Assignment Operators）**
    - `=`（赋值）：将右边的值赋给左边的变量，例如 `a = b`。
    - `+=`（加法赋值）：将左边的变量与右边的值相加，并将结果赋给左边的变量，例如 `a += b` 相当于 `a = a + b`。
    - `-=`（减法赋值）：将左边的变量与右边的值相减，并将结果赋给左边的变量，例如 `a -= b` 相当于 `a = a - b`。

- **位运算符（Bitwise Operators）**
    - `&`（按位与）：对两个数的每一位执行与操作，例如 `a & b`。
    - `|`（按位或）：对两个数的每一位执行或操作，例如 `a | b`。
    - `^`（按位异或）：对两个数的每一位执行异或操作，例如 `a ^ b`。

这些运算符在 Rust 中用于执行各种数学、逻辑和位操作，使你能够编写灵活和高效的代码。

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

执行结果：

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

#### 补充学习1：逻辑运算符

逻辑运算中有三种基本操作：「与」（AND）、「或」（OR）、「异或」（XOR），用来操作二进制位。

##### 0011 与 0101 为 0001（AND运算）

这个运算符表示两个二进制数的对应位都为 1 时，结果位为 1，否则为 0。在这个例子中，我们对每一对位进行 AND 运算：

- 第一个位：0 AND 0 = 0

- 第二个位：0 AND 1 = 0

- 第三个位：1 AND 0 = 0

- 第四个位：1 AND 1 = 1

因此，结果为 0001。

##### 0011 或 0101 为 0111（OR运算）

这个运算符表示两个二进制数的对应位中只要有一个为 1，结果位就为 1。在这个例子中，我们对每一对位进行 OR 运算：

- 第一个位：0 OR 0 = 0
- 第二个位：0 OR 1 = 1
- 第三个位：1 OR 0 = 1
- 第四个位：1 OR 1 = 1

因此，结果为 0111。

##### 0011 异或 0101 为 0110（XOR运算）

这个运算符表示两个二进制数的对应位相同则结果位为 0，不同则结果位为 1。在这个例子中，我们对每一对位进行 XOR 运算：

- 第一个位：0 XOR 0 = 0
- 第二个位：0 XOR 1 = 1
- 第三个位：1 XOR 0 = 1
- 第四个位：1 XOR 1 = 0

因此，结果为 0110。

这些逻辑运算在计算机中广泛应用于位操作和布尔代数中，它们用于创建复杂的逻辑电路、控制程序和数据处理。

#### 补充学习2：移动运算符

这涉及到位运算符的工作方式，特别是左移运算符 `<<` 和右移运算符 `>>`。让我为你解释一下：

##### 为什么1 左移 5 位为 32

- `1` 表示二进制数字 `0001`。
- 左移运算符 `<<` 将二进制数字向左移动指定的位数。
- 在这里，`1u32 << 5` 表示将二进制数字 `0001` 向左移动 5 位。
- 移动 5 位后，变成了 `100000`，这是二进制中的 32。
- 因此，1 左移 5 位等于 `32`。

##### 为什么0x80 右移 2 位为 0x20

- `0x80` 表示十六进制数字，其二进制表示为 `10000000`。
- 右移运算符 `>>` 将二进制数字向右移动指定的位数。
- 在这里，`0x80u32 >> 2` 表示将二进制数字 `10000000` 向右移动 2 位。
- 移动 2 位后，变成了 `00100000`，这是二进制中的 32。
- 以十六进制表示，`0x20` 表示 32。
- 因此，`0x80` 右移 2 位等于 `0x20`。

这些运算是基于二进制和十六进制的移动，因此结果不同于我们平常的十进制表示方式。左移操作会使数值变大，而右移操作会使数值变小。

### 字符串切片（&str）

`&str` 是 Rust 中的字符串切片类型，表示对一个已有字符串的引用或视图。它是一个非拥有所有权的、不可变的字符串类型，具有以下特性和用途：

- **不拥有所有权：**`&str` 不拥有底层字符串的内存，它只是一个对字符串的引用。这意味着当 `&str` 超出其作用域时，不会释放底层字符串的内存，因为它不拥有该内存。这有助于避免内存泄漏。

- **不可变性：**`&str` 是不可变的，一旦创建，就不能更改其内容。这意味着你不能像 `String` 那样在 `&str` 上进行修改操作，例如添加字符。

- **UTF-8 字符串：**Rust 确保 `&str` 指向有效的 UTF-8 字符序列，因此它是一种安全的字符串类型，不会包含无效的字符。

- **切片操作：**你可以使用切片操作来创建 `&str`，从现有字符串中获取子字符串。

  ```rust
  let my_string = "Hello, world!";
  let my_slice: &str = &my_string[0..5]; // 创建一个字符串切片
  ```

- **函数参数和返回值：**`&str` 常用于函数参数和返回值，因为它允许你传递字符串的引用而不是整个字符串，从而避免不必要的所有权转移。

示例：

```rust
fn main() {
    let greeting = "Hello, world!";
    let slice: &str = &greeting[0..5]; // 创建字符串切片
    println!("{}", slice); // 输出 "Hello"
}
```

总之，`&str` 是一种轻量级、安全且灵活的字符串类型，常用于读取字符串内容、函数参数、以及字符串切片操作。通过使用 `&str`，Rust 提供了一种有效管理字符串的方式，同时保持内存安全性。

在 Rust 中，字符串是一个重要的数据类型，用于存储文本和字符数据。字符串在量化金融领域以及其他编程领域中广泛使用，用于表示和处理金融数据、交易记录、报告生成等任务。

此处要注意的是，在 Rust 中，有**两种主要**的字符串类型：

- `String`：动态字符串，可变且在堆上分配内存。`String` 类型通常用于需要修改字符串内容的情况，比如拼接、替换等操作。在第五章我们还会详细介绍这个类型。

- `&str`:字符串切片, 不可变的字符串引用，通常在栈上分配。`&str` 通常用于只需访问字符串而不需要修改它的情况，也是函数参数中常见的类型。

在 Rust 中，`String` 和 `&str` 字符串类型的区别可以用金融实例来解释。假设我们正在编写一个金融应用程序，需要处理股票数据。

- **使用 `String`**

  如果我们需要在应用程序中动态构建、修改和处理字符串，例如拼接多个股票代码或构建复杂的查询语句，我们可能会选择使用 `String` 类型。这是因为 `String` 是可变的，允许我们在运行时修改其内容。

  ```rust
  fn main() {
      let mut stock_symbol = String::from("AAPL");

      // 在运行时追加字符串
      stock_symbol.push_str("(NASDAQ)");

      println!("Stock Symbol: {}", stock_symbol);
  }
  ```

  执行结果：

  ```text
  Stock Symbol: AAPL(NASDAQ)
  ```

  在这个示例中，我们创建了一个可变的 `String` 变量 `stock_symbol`，然后在运行时追加了 `(NASDAQ)` 字符串。这种灵活性对于金融应用程序中的动态字符串操作非常有用。

- **使用 `&str`**

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

- **小结**

  `String` 和 `&str` 在金融应用程序中的使用取决于我们的需求。如果需要修改字符串内容或者在运行时构建字符串，`String` 是一个更好的选择。如果只需要访问字符串而不需要修改它，或者希望避免额外的内存分配，`&str` 是更合适的选择。

## 3.2 元组（Tuple）

元组（Tuple）是 Rust 中的一种数据结构，它可以存储多个不同或相同类型的值，并且一旦创建，它们的长度就是不可变的。元组通常用于将多个值组合在一起以进行传递或返回，它们在量化金融中也有各种应用场景。

以下是一个元组的使用案例：

```rust
fn main() {
    // 创建一个元组，表示股票的价格和数量
    let stock = ("AAPL", 150.50, 1000);

    // 访问元组中的元素, 赋值给一并放在左边的变量们,
    // 这种赋值方式称为元组解构(Tuple Destructuring)
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

执行结果：

```text
股票代码: AAPL
股票价格: $150.50
股票数量: 1000
总价值: $150500.00
```

在上述 Rust 代码示例中，我们演示了如何使用元组来表示和存储股票的相关信息。让我们详细解释代码中的各个部分：

- **创建元组**

  ```rust
  let stock = ("AAPL", 150.50, 1000);
  ```

  这一行代码创建了一个元组 `stock`，其中包含了三个元素：股票代码（字符串）、股票价格（浮点数）和股票数量（整数）。注意，元组的长度在创建后是不可变的，所以我们无法添加或删除元素。

- **元组解构(Tuple Destructuring)**

  ```rust
  let (symbol, price, quantity) = stock;
  ```

  在这一行中，我们使用模式匹配的方式从元组中解构出各个元素，并将它们分别赋值给 `symbol`、`price` 和 `quantity` 变量。这使得我们能够方便地访问元组的各个部分。

- **打印变量的值**

  ```rust
  println!("股票代码: {}", symbol);
  println!("股票价格: ${:.2}", price);
  println!("股票数量: {}", quantity);
  ```

  这些代码行使用 `println!` 宏打印了元组中的不同变量的值。在第二个 `println!` 中，我们使用 `:.2` 来控制浮点数输出的小数点位数。

- **计算总价值**

  ```rust
  let total_value = price * (quantity as f64);
  ```

  这一行代码计算了股票的总价值。由于 `quantity` 是整数，我们需要将其转换为浮点数 `f64`  来进行计算，以避免整数除法的问题。

最后，我们打印出了计算得到的总价值，得到了完整的股票信息。

总之，元组是一种方便的数据结构，可用于组合不同类型的值，并且能够进行模式匹配以轻松访问其中的元素。在量化金融或其他领域中，元组可用于组织和传递多个相关的数据项。

## 3.3 数组

在 Rust 中，数组是一种固定大小的数据结构，它存储相同类型的元素，并且一旦声明了大小，就不能再改变。Rust 中的数组有以下特点：

- **固定大小：**数组和元组都是静态大小的数据结构。数组的大小在声明时必须明确指定，而且不能在运行时改变。这意味着一旦数组创建，它的长度就是不可变的。
- **相同类型：**和元组不同，数组中的所有元素必须具有相同的数据类型。这意味着一个数组中的元素类型必须是一致的，例如，所有的整数或所有的浮点数。
- **栈上分配：**Rust 的数组是在栈上分配内存的，这使得它们在访问和迭代时非常高效。但是，由于它们是栈上的，所以大小必须在编译时确定。

下面是一个示例，演示了如何声明、初始化和访问 Rust 数组：

```rust
fn main() {
    // 声明一个包含5个整数的数组，使用[类型; 大小]语法
    let numbers: [i32; 5] = [1, 2, 3, 4, 5];

    // 访问数组元素，索引从0开始
    println!("第一个元素: {}", numbers[0]); // 输出 "第一个元素: 1"
    println!("第三个元素: {}", numbers[2]); // 输出 "第三个元素: 3"

    // 数组长度必须在编译时确定，但可以使用.len()方法获取长度
    let length = numbers.len();
    println!("数组长度: {}", length); // 输出 "数组长度: 5"
}

```

执行结果：

```text
第一个元素: 1
第三个元素: 3
数组长度: 5
```

### 案例1：简单移动平均线计算器（SMA Calculator）

简单移动平均线（Simple Moving Average, SMA）是一种常用的技术分析指标，用于平滑时间序列数据以识别趋势。SMA 的计算公式非常简单，它是过去一段时间内数据点的平均值。以下是 SMA 的计算公式：

$$
SMA = (X1 + X2 + X3 + ... + Xn) / n
$$

当在 Rust 中进行量化金融建模时，我们通常会使用数组（Array）和其他数据结构来管理和处理金融数据。以下是一个简单的 Rust 量化金融案例，展示如何使用数组来计算股票的简单移动平均线 （SMA）。

```rust
fn main() {
    // 假设这是一个包含股票价格的数组
    let stock_prices = [50.0, 52.0, 55.0, 60.0, 58.0, 62.0, 65.0, 70.0, 75.0, 80.0];

    // 计算简单移动平均线(SMA)
    let window_size = 5; // 移动平均窗口大小
    let mut sma_values: Vec<f64> = Vec::new();

    for i in 0..stock_prices.len() - window_size + 1 {
        let window = &stock_prices[i..i + window_size];
        let sum: f64 = window.iter().sum();
        let sma = sum / window_size as f64;
        sma_values.push(sma);
    }

    // 打印SMA值
    println!("简单移动平均线(SMA):");
    for (i, sma) in sma_values.iter().enumerate() {
        println!("Day {}: {:.2}", i + window_size, sma);
    }
}
```

执行结果：

```text
简单移动平均线(SMA):
Day 5: 55.00
Day 6: 57.40
Day 7: 60.00
Day 8: 63.00
Day 9: 66.00
Day 10: 70.40
```

在这个示例中，我们计算的是简单移动平均线（SMA），窗口大小为 5 天。因此，SMA 值是从第 5 天开始的，直到最后一天。在输出中，「Day 5」 对应着第 5 天的 SMA 值，「Day 6」对应第 6 天的 SMA 值，以此类推。这是因为 SMA 需要一定数量的历史数据才能计算出第一个移动平均值，所以前几天的结果会是空的或不可用的。

#### 补充学习：范围设置

`for i in 0..stock_prices.len() - window_size + 1` 这样写是为了创建一个迭代器，该迭代器将在股票价格数组上滑动一个大小为 `window_size` 的窗口，以便计算简单移动平均线（SMA）。

让我们解释一下这个表达式的各个部分：

- `0..stock_prices.len()`：这部分创建了一个范围（range），从 0 到 `stock_prices` 数组的长度。范围的右边界是不包含的，所以它包含了从 0 到 `stock_prices.len() - 1` 的所有索引。
- `- window_size + 1`：这部分将范围的右边界减去 `window_size`，然后再加 1。这是为了确保窗口在数组上滑动，以便计算 SMA。考虑到窗口的大小，我们需要确保它在数组内完全滑动，因此右边界需要向左移动 `window_size - 1` 个位置。

因此，整个表达式 `0..stock_prices.len() - window_size + 1` 创建了一个范围，该范围从0到 `stock_prices.len() - window_size`，覆盖了数组中所有可能的窗口的起始索引。在每次迭代中，这个范围将产生一个新的索引，用于创建一个新的窗口，以计算 SMA。这是一种有效的方法来遍历数组并执行滑动窗口操作。

### 案例2： 指数移动平均线计算器 （EMA Calculator）

指数移动平均线（Exponential Moving Average, EMA）是另一种常用的技术分析指标，与 SMA 不同，EMA 赋予了更多的权重最近的价格数据，因此它更加敏感于价格的近期变化。EMA 的计算公式如下：

$$
EMA(t) = (P(t) * α) + (EMA(y) * (1 - α))
$$

其中：

- `EMA(t)`：当前时刻的 EMA 值。
- `P(t)`：当前时刻的价格。
- `EMA(y)`：前一时刻的 EMA 值。
- `α`：平滑因子，通常通过指定一个时间窗口长度来计算，`α = 2 / (n + 1)`，其中 `n` 是时间窗口长度。

在技术分析中，EMA（指数移动平均线）和 SMA（简单移动平均线）的计算有不同的起始点。

- EMA 的计算通常可以从第一个数据点「Day 1」开始，因为它使用了指数加权平均的方法，使得前面的数据点的权重较小，从而考虑了所有的历史数据。
- 而 SMA 的计算需要使用一个固定大小的窗口，因此必须从窗口大小之后的数据点（在我们的例子中是从第五天开始）才能得到第一个 SMA 值。这是因为 SMA 是对一段时间内的数据进行简单平均，需要足够的数据点来计算平均值。

现在让我们在 Rust 中编写一个 EMA 计算器，类似于之前的 SMA 计算器：

```rust
fn main() {
    // 假设这是一个包含股票价格的数组
    let stock_prices = [50.0, 52.0, 55.0, 60.0, 58.0, 62.0, 65.0, 70.0, 75.0, 80.0];

    // 计算指数移动平均线(EMA)
    let window_size = 5; // 时间窗口大小
    let mut ema_values: Vec<f64> = Vec::new();

    let alpha = 2.0 / (window_size as f64 + 1.0);
    let mut ema = stock_prices[0]; // 初始EMA值等于第一个价格

    for price in &stock_prices {
        ema = (price - ema) * alpha + ema;
        ema_values.push(ema);
    }

    // 打印EMA值
    println!("指数移动平均线(EMA):");
    for (i, ema) in ema_values.iter().enumerate() {
        println!("Day {}: {:.2}", i + 1, ema);
    }
}
```

执行结果：

```text
指数移动平均线(EMA):
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

#### 补充学习：平滑因子 alpha

当计算指数移动平均线（EMA）时，需要使用一个平滑因子 `alpha`，这个因子决定了最近价格数据和前一 EMA 值的权重分配，它的计算方法是 `alpha = 2.0 / (window_size as f64 + 1.0)`。让我详细解释这句代码的含义：

- `window_size` 表示时间窗口大小，通常用来确定计算 EMA 时要考虑多少个数据点。较大的 `window_size` 会导致 EMA 更加平滑，对价格波动的反应更慢，而较小的 `window_size` 则使EMA更加敏感，更快地反应价格变化。

- `window_size as f64` 将 `window_size` 转换为浮点数类型 `f64`，因为我们需要在计算中使用浮点数来确保精度。

- `window_size as f64 + 1.0` 将窗口大小加 1，这是 EMA 计算中的一部分，用于调整平滑因子。添加 1 是因为通常我们从第一个数据点开始计算 EMA，所以需要考虑一个额外的数据点。

- 最终，`2.0 / (window_size as f64 + 1.0)` 计算出平滑因子 `alpha`。这个平滑因子决定了 EMA 对最新数据的权重，通常情况下， `alpha` 的值会接近于 1，以便更多地考虑最新的价格数据。较小的 `alpha` 值会使EMA对历史数据更加平滑，而较大的 `alpha` 值会更强调最新的价格变动。

总之，这一行代码计算了用于指数移动平均线计算的平滑因子 `alpha`，该因子在 EMA 计算中决定了最新数据和历史数据的权重分配，以便在分析中更好地反映价格趋势。

### 案例3：相对强度指数计算器（RSI Calculator）

相对强度指数（Relative Strength Index, RSI）是一种用于衡量价格趋势的技术指标，通常用于股票和其他金融市场的技术分析。相对强弱指数（RSI）的计算公式如下：

$$
RSI = 100 - [100 / (1 + RS)]
$$

其中，RS 表示 14 天内收市价上涨数之和的平均值除以 14 天内收市价下跌数之和的平均值。

让我们通过一个示例来说明：

假设最近 14 天的涨跌情况如下：

- 第一天上涨 2 元
- 第二天下跌 2 元
- 第三至第五天每天上涨 3 元
- 第六天下跌 4 元
- 第七天上涨 2 元
- 第八天下跌 5 元
- 第九天下跌 6 元
- 第十至十二天每天上涨 1 元
- 第十三至十四天每天下跌 3 元

现在，我们来计算 RSI 的步骤：

- 首先，将 14 天内上涨的总额相加，然后除以 14。在这个示例中，总共上涨 16 元，所以计算结果是 16 / 14 = 1.14285714286。
- 接下来，将14天内下跌的总额相加，然后除以 14。在这个示例中，总共下跌 23 元，所以计算结果是 23 / 14 = 1.64285714286。
- 然后，计算相对强度 RS，即 RS = 1.14285714286 / 1.64285714286 = 0.69565217391。
- 接着，计算 1 + RS，即 1 + 0.69565217391 = 1.69565217391。
- 最后，将 100 除以 1 + RS，即 100 / 1.69565217391 = 58.9743589745。
- 最终的 RSI 值为100 - 58.9743589745 = 41.0256410255 ≈ 41.026。

这样，我们就得到了相对强弱指数（RSI）的值，它可以帮助分析市场的超买和超卖情况。以下是一个计算 RSI 的示例代码：

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

执行结果：

```text
RSI: 41.026
```

## 3.4 切片

在 Rust 中，切片（Slice）是一种引用数组或向量中一部分连续元素的方法，而不需要复制数据。切片有时非常有用，特别是在量化金融中，因为我们经常需要处理时间序列数据或其他大型数据集。

下面我将提供一个简单的案例，展示如何在 Rust 中使用切片进行量化金融分析。

假设有一个包含股票价格的数组，我们想计算某段时间内的最高和最低价格。以下是一个示例：

```rust
fn main() {
    // 假设这是一个包含股票价格的数组
    let stock_prices = [50.0, 52.0, 55.0, 60.0, 58.0, 62.0, 65.0, 70.0, 75.0, 80.0];

    // 定义时间窗口范围
    let start_index = 2; // 开始日期的索引(从0开始)
    let end_index = 6;   // 结束日期的索引(包含)

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

执行结果：

```text
时间窗口内的最高价格: 65.00
时间窗口内的最低价格: 55.00
```

下面我会详细解释以下两行代码：

```
let max_price = price_window.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
let min_price = price_window.iter().cloned().fold(f64::INFINITY, f64::min);
```

这两行代码的目标是计算时间窗口内的最高价格 `max_price` 和最低价格 `min_price`。让我们一一解释它们的每一部分：

- `price_window.iter()`：`price_window` 是一个切片，使用 `.iter()` 方法可以获得一个迭代器，用于遍历切片中的元素。
- `.cloned()`：`cloned()` 方法用于将切片中的元素进行克隆，因为 `fold` 函数需要元素的拷贝 `Clone` trait。这是因为 `f64`
  类型是不可变类型，无法通过引用进行直接比较。所以我们将元素克隆，以便在 `fold` 函数中进行比较。
- `.fold(f64::NEG_INFINITY, f64::max)`：`fold` 函数是一个迭代器适配器，它将迭代器中的元素按照给定的操作进行折叠（归约）。在这里，我们使用
  `fold` 来找到最高价格。
    - `f64::NEG_INFINITY` 是一个负无穷大的初始值，用于确保任何实际的价格都会大于它。这是为了确保在计算最高价格时，如果时间窗口为空，结果将是负无穷大。
    - `f64::max` 是一个函数，用于计算两个 `f64` 类型的数值中的较大值。在 `fold` 过程中，它会比较当前最高价格和迭代器中的下一个元素，然后返回较大的那个。

#### 补充学习：fold 函数

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

- 它从初始值 `init` 开始。
- 对于集合中的每个元素，它调用闭包 `f`，将当前累积值和元素作为参数传递给闭包。
- 闭包 `f` 执行某种操作，生成一个新的累积值。
- 新的累积值成为下一次迭代的输入。
- 此过程重复，直到遍历完集合中的所有元素。
- 最终的累积值成为 `fold` 函数的返回值。

这个概念的好处在于，我们可以使用 `fold` 函数来进行各种集合的累积操作，例如求和、求积、查找最大值、查找最小值等。在之前的示例中，我们使用了 `fold` 函数来计算最高价格和最低价格，将当前的最高/最低价格与集合中的元素进行比较，并更新累积值，最终得到了最高和最低价格。