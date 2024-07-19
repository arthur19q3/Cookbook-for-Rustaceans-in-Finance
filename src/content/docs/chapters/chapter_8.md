---
title: '类型转换'
---

## 8.1 From 和 Into 特性

在7.3我们已经讲过通过From和Into Traits 来实现类型转换，现在我们来详细解释以下它的基础。

`From` 和 `Into` 是一种相关但略有不同的 trait，它们通常一起使用以提供类型之间的双向转换。这两个 trait 的关系如下：

1. **`From` Trait**：它定义了如何从一个类型创建另一个类型的值。通常，你会为需要自定义类型转换的情况实现 `From` trait。例如，你可以实现 `From<i32>` 来定义如何从 `i32` 转换为你自定义的类型。
2. **`Into` Trait**：它是 `From` 的反向操作。`Into` trait 允许你定义如何将一个类型转换为另一个类型。当你实现了 `From` trait 时，Rust 会自动为你提供 `Into` trait 的实现，因此你无需显式地为类型的反向转换实现 `Into`。

实际上，这两个 trait 通常是一体的，因为它们是相互关联的。如果你实现了 `From`，就可以使用 `into()` 方法来进行类型转换，而如果你实现了 `Into`，也可以使用 `from()` 方法来进行类型转换。这使得代码更具灵活性和可读性。

标准库中具有 `From` 特性实现的类型有很多，以下是一些例子：

1. **&str 到 String**: 可以使用 `String::from()` 方法将字符串切片(`&str`)转换为 `String`：

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

5. **Vec 到 Boxed Slice**: 可以使用 `Vec::into_boxed_slice()` 将 `Vec` 转换为堆分配的切片(`Box<[T]>`)：

   ```rust
   let my_vec = vec![1, 2, 3];
   let boxed_slice: Box<[i32]> = my_vec.into_boxed_slice();
   ```

这些都是标准库中常见的 `From` 实现的示例，它们使得不同类型之间的转换更加灵活和方便。要记住，`From` 特性是一种用于定义类型之间转换规则的强大工具。

## 8.2 TryFrom 和 TryInto 特性

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

在这个示例中，我们定义了一个 `StockPrice` 结构体来表示股票价格，然后使用 `TryFrom` 实现了从 `StockPrice` 到 `f64` 的类型转换，其中 `f64` 表示对数收益率。

![自然对数函数示意](https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Logarithm.svg/300px-Logarithm.svg.png)

自然对数(英语：Natural logarithm)为以数学常数e为底数的对数函数，我们知道它的定义域是**(0, +∞)**，也就是取值是要大于0的。如果股票价格小于等于0，转换会产生错误。在 `main` 函数中，我们演示了如何使用 `TryFrom` 进行类型转换，并在可能失败的情况下获取 `Result` 类型的结果。这个示例展示了如何在量化金融中处理不同类型之间的转换。

## 8.3 ToString和FromStr

这两个 trait 是用于类型转换和解析字符串的常用方法。让我给你解释一下它们的作用和在量化金融领域中的一个例子。

首先，ToString trait 是用于将类型转换为字符串的 trait。它是一个通用 trait，可以为任何类型实现。通过实现ToString trait，类型可以使用to_string()方法将自己转换为字符串。例如，如果有一个表示价格的自定义结构体，可以实现ToString trait以便将其价格转换为字符串形式。

```rust
struct Price {
    currency: String,
    value: f64,
}

impl ToString for Price {
    fn to_string(&self) -> String {
        format!("{} {}", self.value, self.currency)
    }
}

fn main() {
    let price = Price {
        currency: String::from("USD"),
        value: 10.99,
    };
    let price_string = price.to_string();
    println!("Price: {}", price_string); // 输出: "Price: 10.99 USD"
}

```

接下来，FromStr trait 是用于从字符串解析出指定类型的 trait。它也是通用 trait，可以为任何类型实现。通过实现FromStr trait，类型可以使用from_str()方法从字符串中解析出自身。

例如，在金融领域中，如果有一个表示股票价格的类型，可以实现FromStr trait以便从字符串解析出股票价格。

```rust
use std::str::FromStr;

// 自定义结构体，表示股票价格
struct StockPrice {
    ticker_symbol: String,
    price: f64,
}

// 实现ToString trait，将StockPrice转换为字符串
impl ToString for StockPrice {
    // 将StockPrice结构体转换为字符串
    fn to_string(&self) -> String {
        format!("{}:{}", self.ticker_symbol, self.price)
    }
}

// 实现FromStr trait，从字符串解析出StockPrice
impl FromStr for StockPrice {
    type Err = ();

    // 从字符串解析StockPrice
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        // 将字符串s根据冒号分隔成两个部分
        let components: Vec<&str> = s.split(':').collect();

        // 如果字符串不由两部分组成，那一定是发生错误了，返回错误
        if components.len() != 2 {
            return Err(());
        }

        // 解析第一个部分为股票代码
        let ticker_symbol = String::from(components[0]);

        // 解析第二个部分为价格
        // 这里使用unwrap()用于简化示例，实际应用中可能需要更完备的错误处理
        let price = components[1].parse::<f64>().unwrap();

        // 返回解析后的StockPrice
        Ok(StockPrice {
            ticker_symbol,
            price,
        })
    }
}

fn main() {
    let price_string = "AAPL:150.64";

    // 使用from_str()方法从字符串解析出StockPrice
    let stock_price = StockPrice::from_str(price_string).unwrap();

    // 输出解析得到的StockPrice字段
    println!("Ticker Symbol: {}", stock_price.ticker_symbol); // 输出: "AAPL"
    println!("Price: {}", stock_price.price); // 输出: "150.64"

    // 使用to_string()方法将StockPrice转换为字符串
    let price_string_again = stock_price.to_string();

    // 输出转换后的字符串
    println!("Price String: {}", price_string_again); // 输出: "AAPL:150.64"
}
```

**执行结果：**

```shell
Ticker Symbol: AAPL # from_str方法解析出来的股票代码信息
Price: 150.64 # from_str方法解析出来的价格信息
Price String: AAPL:150.64 # 和"let price_string = "AAPL:150.64";"又对上了
```
