---
title: '函数、方法和闭包'
---

在Rust中，函数、方法和闭包都是用于执行代码的可调用对象，但它们在语法和用途上有相当的不同。下面我会详细解释每种可调用对象的特点和用法：

1. **函数(Function)**：

   - 函数是Rust中最基本的可调用对象。
   - 函数通常在全局作用域或模块中定义，并且可以通过名称来调用。
   - 函数可以接受参数，并且可以返回一个值。
   - 函数的定义以 `fn` 关键字开头，如下所示：

     ```rust
     fn add(a: i32, b: i32) -> i32 {
         a + b
     }
     ```

   - 在调用函数时，你可以使用其名称，并传递适当的参数，如下所示：

     ```rust
     let result = add(5, 3);
     ```

2. **方法(Method)**：

   - 方法是与特定类型关联的函数。在Rust中，方法是面向对象编程的一部分。
   - 方法是通过将函数与结构体、枚举、或者 trait 相关联来定义的。
   - 方法使用 `self` 参数来访问调用它们的实例的属性和行为。
   - 方法的定义以 `impl` 关键字开始，如下所示：

     ```rust
     struct Rectangle {
         width: u32,
         height: u32,
     }

     impl Rectangle {
         fn area(&self) -> u32 {
             self.width * self.height
         }
     }
     ```

   - 在调用方法时，你首先创建一个实例，然后使用点号运算符调用方法，如下所示：

     ```rust
     let rect = Rectangle { width: 10, height: 20 };
     let area = rect.area();
     ```

3. **闭包(Closure)**：

   - 闭包是一个可以捕获其环境的匿名函数。它们类似于函数，但可以捕获局部变量和外部变量，使其具有一定的状态。
   - 闭包可以存储在变量中，传递给其他函数或返回作为函数的结果。
   - 闭包通常使用 `||` 语法来定义，如下所示：

     ```rust
     let add_closure = |a, b| a + b;
     ```

   - 你可以像调用函数一样调用闭包，如下所示：

     ```rust
     let result = add_closure(5, 3);
     ```

   - 闭包可以捕获外部变量，例如：

     ```rust
     let x = 5;
     let closure = |y| x + y;
     let result = closure(3); // result 等于 8
     ```

这些是Rust中函数、方法和闭包的基本概念和用法。每种可调用对象都有其自己的用途和适用场景，根据需要选择合适的工具来编写代码。本章的重点则是函数的进阶用法和闭包的学习。

## 10.1 函数进阶

如同python支持泛型函数、高阶函数、匿名函数;C语言也支持泛型函数和函数指针一样，Rust中的函数支持许多进阶用法，这些用法可以帮助你编写更灵活、更高效的代码。以下是一些常见的函数进阶用法：

### 10.1.1 泛型函数(Generic Functions)

(在第14章，我们会进一步详细了解泛型函数)

使用泛型参数可以编写通用的函数，这些函数可以用于不同类型的数据。

通过在函数签名中使用尖括号 `<T>` 来声明泛型参数，并在函数体中使用这些参数来编写通用代码。

以下是一个更简单的例子，演示如何编写一个泛型函数 `find_max` 来查找任何类型的元素列表中的最大值：

```rust
fn find_max_and_report_letters(list: &[&str]) -> Option<f64> {
    if list.is_empty() {
        return None; // 如果列表为空，返回 None
    }

    let mut max = None; // 用 Option 来存储最大值
    let mut has_letters = false; // 用来标记是否包含字母

    for item in list.iter() {
        match item.parse::<f64>() {
            Ok(number) => {
                // 如果成功解析为浮点数
                if max.is_none() || number > max.unwrap() {
                    max = Some(number);
                }
            }
            Err(_) => {
                // 解析失败，表示列表中不小心混入了字母，无法比较。把这个bool传给has_letters.
                has_letters = true;
            }
        }
    }

    if has_letters {
        println!("列表中包含字母。");
    }

    max // 返回找到的最大值作为 Option<f64>
}

fn main() {
    let data = vec!["3.5", "7.2", "1.8", "9.0", "4.7", "2.1", "A", "B"];
    let max_number = find_max_and_report_letters(&data);

    match max_number {
        Some(max) => println!("最大的数字是: {}", max),
        None => println!("没有找到有效的数字。"),
    }
}

```

**执行结果**：

```
列表中包含字母。
最大的数字是: 9
```

在这个例子中，`find_max` 函数接受一个泛型切片 `list`，并在其中查找最大值。首先，它检查列表是否为空，如果是，则返回 `None`。然后，它遍历列表中的每个元素，将当前最大值与元素进行比较，如果找到更大的元素，就更新 `max`，并且如果有字母还会汇报给我们。最后，函数返回找到的最大值作为 `Option<&T>`。

### 10.1.2 高阶函数(Higher-Order Functions)

高阶函数(Higher-Order Functions)是一种编程概念，指可以接受其他函数作为参数或者返回函数作为结果的函数, 它在Rust中有广泛的支持和应用。

以下是关于高阶函数在Rust中的详细介绍：

1. **函数作为参数：** 在Rust中，可以将函数作为参数传递给其他函数。这使得我们可以编写通用的函数，以便它们可以操作不同类型的函数。通常，这样的函数接受一个函数闭包(closure)作为参数，然后在其内部使用这个闭包来完成一些操作。

   ```rust
   fn apply<F>(func: F, value: i32) -> i32
   where
       F: Fn(i32) -> i32,
   {
       func(value)
   }

   fn double(x: i32) -> i32 {
       x * 2
   }

   fn main() {
       let result = apply(double, 5);
       println!("Result: {}", result);
   }
   ```

2. **返回函数：** 类似地，你可以编写函数，以函数作为它们的返回值。这种函数通常被称为工厂函数，因为它们返回其他函数的实例。

   ```rust
   fn create_multiplier(factor: i32) -> impl Fn(i32) -> i32 { //"impl Fn(i32) -> i32 " 是返回类型的标记，它用于指定闭包的类型签名。
       move |x| x * factor
   }

   fn main() {
       let multiply_by_3 = create_multiplier(3);
       let result = multiply_by_3(5);
       println!("Result: {}", result); // 输出 15
   }
   ```

   在上面的代码中，`move` 关键字用于定义一个闭包(匿名函数)，这个闭包捕获了外部的变量 `factor`。在 Rust 中，闭包默认是对外部变量的借用(borrow)，但在这个例子中，使用 `move` 关键字表示闭包会**拥有**捕获的变量 `factor` 的所有权：

   1. `create_multiplier` 函数接受一个 `factor` 参数，它是一个整数。然后，它返回一个闭包，这个闭包接受一个整数 `x` 作为参数，并返回 `x * factor` 的结果。

   2. 在 `main` 函数中，我们首先调用 `create_multiplier(3)`，这将返回一个闭包，这个闭包捕获了 `factor` 变量，其值为 3。

   3. 然后，我们调用 `multiply_by_3(5)`，这实际上是调用了我们之前创建的闭包。闭包中的 `factor` 值是 3，所以 `5 * 3` 的结果是 15。

   4. 最后，我们将结果打印到控制台，输出的结果是 `15`。

   `move` 关键字的作用是将外部变量的所有权移动到闭包内部，这意味着闭包在内部拥有这个变量的控制权，不再依赖于外部的变量。这对于在闭包中捕获外部变量并在之后继续使用它们非常有用，尤其是当这些外部变量可能超出了其作用域时(如在异步编程中)。

3. **迭代器和高阶函数：** Rust的标准库提供了丰富的迭代器方法，这些方法允许你对集合(如数组、向量、迭代器等)进行高级操作，例如`map`、`filter`、`fold`等。这些方法都可以接受函数闭包作为参数，使你能够非常灵活地处理数据。

   ```rust
   let numbers = vec![1, 2, 3, 4, 5];

   // 使用map高阶函数将每个数字加倍
   let doubled_numbers: Vec<i32> = numbers.iter().map(|x| x * 2).collect();

   // 使用filter高阶函数选择偶数
   let even_numbers: Vec<i32> = numbers.iter().filter(|x| x % 2 == 0).cloned().collect();
   ```

高阶函数使得在Rust中编写更具可读性和可维护性的代码变得更容易，同时也允许你以一种更加抽象的方式处理数据和逻辑。通过使用闭包和泛型，Rust的高阶函数提供了强大的工具，使得编程更加灵活和表达力强。

### 10.1.3 匿名函数(Anonymous Functions)

- 除了常规的函数定义，Rust还支持匿名函数，也就是闭包。
- 闭包可以在需要时定义，并且可以捕获其环境中的变量。

```rust
let add = |a, b| a + b;
let result = add(5, 3); // result 等于 8
```

### 案例：计算投资组合的预期收益和风险

在金融领域，高阶函数可以用来处理投资组合(portfolio)的各种分析和优化问题。以下是一个示例，演示如何使用高阶函数来计算投资组合的收益和风险。

假设我们有一个投资组合，其中包含多个不同的资产，每个资产都有一个预期收益率和风险(标准差)率。我们可以定义一个高阶函数来计算投资组合的预期收益和风险，以及根据风险偏好优化资产配置。

```rust
struct Asset {
    expected_return: f64,
    risk: f64,
}

fn calculate_portfolio_metrics(assets: &[Asset], weights: &[f64]) -> (f64, f64) {
    let expected_return: f64 = assets
        .iter()
        .zip(weights.iter())
        .map(|(asset, weight)| asset.expected_return * weight)
        .sum::<f64>();

    let portfolio_risk: f64 = assets
        .iter()
        .zip(weights.iter())
        .map(|(asset, weight)| asset.risk * asset.risk * weight * weight)
        .sum::<f64>();

    (expected_return, portfolio_risk)
}

fn optimize_with_algorithm<F>(_objective_function: F, initial_weights: Vec<f64>) -> Vec<f64>
where
    F: Fn(Vec<f64>) -> f64,
{
    // 这里简化为均匀分配权重的实现，实际中需要使用优化算法
    initial_weights
}

fn optimize_portfolio(assets: &[Asset], risk_preference: f64) -> Vec<f64> {
    let objective_function = |weights: Vec<f64>| -> f64 {
        let (expected_return, portfolio_risk) = calculate_portfolio_metrics(&assets, &weights);
        expected_return - risk_preference * portfolio_risk
    };

    let num_assets = assets.len();
    let initial_weights = vec![1.0 / num_assets as f64; num_assets];
    let optimized_weights = optimize_with_algorithm(objective_function, initial_weights);

    optimized_weights
}

fn main() {
    let asset1 = Asset {
        expected_return: 0.08,
        risk: 0.12,
    };
    let asset2 = Asset {
        expected_return: 0.12,
        risk: 0.18,
    };

    let assets = vec![asset1, asset2];
    let risk_preference = 2.0;

    let optimized_weights = optimize_portfolio(&assets, risk_preference);

    println!("Optimal Portfolio Weights: {:?}", optimized_weights);
}
```

在这个示例中，我们使用高阶函数来计算投资组合的预期收益和风险，并定义了一个优化函数作为闭包。通过传递不同的风险偏好参数，我们可以优化资产配置，以在风险和回报之间找到最佳平衡点。这是金融领域中使用高阶函数进行投资组合分析和优化的一个简单示例。实际中，会有更多复杂的模型和算法用于处理这类问题。

### 补充学习：zip方法

在Rust中，`zip` 是一个迭代器适配器方法，它用于将两个迭代器逐个元素地配对在一起，生成一个新的迭代器，该迭代器返回一个元组，其中包含来自两个原始迭代器的对应元素。

`zip` 方法的签名如下：

```rust
fn zip<U>(self, other: U) -> Zip<Self, U::IntoIter>
where
    U: IntoIterator;
```

这个方法接受另一个可迭代对象 `other` 作为参数，并返回一个 `Zip` 迭代器，该迭代器产生一个元组，其中包含来自调用 `zip` 方法的迭代器和 `other` 迭代器的对应元素。

以下是一个简单的示例，演示如何使用 `zip` 方法：

```rust
fn main() {
    let numbers = vec![1, 2, 3];
    let letters = vec!['A', 'B', 'C'];

    let zipped = numbers.iter().zip(letters.iter());

    for (num, letter) in zipped {
        println!("Number: {}, Letter: {}", num, letter);
    }
}
```

在这个示例中，我们有两个向量 `numbers` 和 `letters`，它们分别包含整数和字符。我们使用 `zip` 方法将它们配对在一起，创建了一个新的迭代器 `zipped`。然后，我们可以使用 `for` 循环遍历 `zipped` 迭代器，每次迭代都会返回一个包含整数和字符的元组，允许我们同时访问两个向量的元素。

输出结果将会是：

```
Number: 1, Letter: A
Number: 2, Letter: B
Number: 3, Letter: C
```

`zip` 方法在处理多个迭代器并希望将它们一一匹配在一起时非常有用。这使得同时遍历多个集合变得更加方便。

## 10.2 闭包进阶

闭包是 Rust 中非常强大和灵活的概念，它们允许你将代码块封装为值，以便在程序中传递和使用。闭包通常用于以下几种场景：

1. **匿名函数：** 闭包允许你创建匿名函数，它们可以在需要的地方定义和使用，而不必命名为函数。
2. **捕获环境：** 闭包可以捕获其周围的变量和状态，可以在闭包内部引用外部作用域中的变量。
3. **函数作为参数：** 闭包可以作为函数的参数传递，从而可以将自定义行为注入到函数中。
4. **迭代器：** Rust 中的迭代器方法通常接受闭包作为参数，用于自定义元素处理逻辑。

以下是闭包的一般语法：

```rust
|参数1, 参数2| -> 返回类型 {
    // 闭包体
    // 可以使用参数1、参数2以及捕获的外部变量
}
```

闭包参数可以根据需要包含零个或多个，并且可以指定返回类型。闭包体是代码块，它定义了闭包的行为。

**闭包的种类：**

Rust 中有三种主要类型的闭包，分别是：

1. **FnOnce：** 只能调用一次的闭包，通常会消耗（move）捕获的变量。
2. **FnMut：** 可以多次调用的闭包，通常会可变地借用捕获的变量。
3. **Fn：** 可以多次调用的闭包，通常会不可变地借用捕获的变量。

闭包的种类由闭包的行为和捕获的变量是否可变来决定。

**示例1：**

```rust
// 一个简单的闭包示例，计算两个数字的和
let add = |x, y| x + y;
let result = add(2, 3); // 调用闭包
println!("Sum: {}", result);
```

**示例2：**

```rust
// 捕获外部变量的闭包示例
let x = 10;
let increment = |y| y + x;
let result = increment(5); // 调用闭包
println!("Result: {}", result);
```

**示例3：**

```rust
// 使用闭包作为参数的函数示例
fn apply_operation<F>(a: i32, b: i32, operation: F) -> i32
where
    F: Fn(i32, i32) -> i32,
{
    operation(a, b)
}

let sum = apply_operation(2, 3, |x, y| x + y);
let product = apply_operation(2, 3, |x, y| x * y);

println!("Sum: {}", sum);
println!("Product: {}", product);
```

**金融案例1：**

假设我们有一个存储股票价格的向量，并希望计算这些价格的平均值。我们可以使用闭包来定义自定义的计算平均值逻辑。

```rust
fn main() {
    let stock_prices = vec![50.0, 55.0, 60.0, 65.0, 70.0];

    // 使用闭包计算平均值
    let calculate_average = |prices: &[f64]| {
        let sum: f64 = prices.iter().sum();
        sum / (prices.len() as f64)
    };

    let average_price = calculate_average(&stock_prices);
    println!("Average Stock Price: {:.2}", average_price);
}
```

**金融案例2：**

假设我们有一个银行应用程序，需要根据不同的账户类型计算利息。我们可以使用闭包作为参数传递到函数中，根据不同的账户类型应用不同的利息计算逻辑。

```rust
fn main() {
    struct Account {
        balance: f64,
        account_type: &'static str,
    }

    let accounts = vec![
        Account { balance: 1000.0, account_type: "Savings" },
        Account { balance: 5000.0, account_type: "Checking" },
        Account { balance: 20000.0, account_type: "Fixed Deposit" },
    ];

    // 使用闭包计算利息
    let calculate_interest = |balance: f64, account_type: &str| -> f64 {
        match account_type {
            "Savings" => balance * 0.03,
            "Checking" => balance * 0.01,
            "Fixed Deposit" => balance * 0.05,
            _ =>
```

接下来，让我们为 `FnOnce` 和 `FnMut` 也提供一个金融案例。

**金融案例3（`FnOnce`）：**

假设我们有一个账户管理应用程序，其中包含一个 `Transaction` 结构体表示交易记录。我们希望使用 `FnOnce` 闭包来处理每个交易，确保每笔交易只处理一次，以防止重复计算。

```rust
fn main() {
    struct Transaction {
        transaction_type: &'static str,
        amount: f64,
    }

    let transactions = vec![
        Transaction { transaction_type: "Deposit", amount: 100.0 },
        Transaction { transaction_type: "Withdrawal", amount: 50.0 },
        Transaction { transaction_type: "Deposit", amount: 200.0 },
    ];

    // 定义处理交易的闭包
    let process_transaction = |transaction: Transaction| {
        match transaction.transaction_type {
            "Deposit" => println!("Processed deposit of ${:.2}", transaction.amount),
            "Withdrawal" => println!("Processed withdrawal of ${:.2}", transaction.amount),
            _ => println!("Invalid transaction type"),
        }
    };

    // 使用FnOnce闭包处理交易，每笔交易只能处理一次
    for transaction in transactions {
        process_transaction(transaction);
    }
}
```

在这个示例中，我们有一个 `Transaction` 结构体表示交易记录，并定义了一个 `process_transaction` 闭包，用于处理每笔交易。由于 `FnOnce` 闭包只能调用一次，我们在循环中传递每个交易记录，并在每次迭代中使用 `process_transaction` 闭包处理交易。

**金融案例4（`FnMut`）：**

假设我们有一个股票监控应用程序，其中包含一个股票价格列表，我们需要周期性地更新股票价格。我们可以使用 `FnMut` 闭包来更新价格列表中的股票价格。

```rust
fn main() {
    let mut stock_prices = vec![50.0, 55.0, 60.0, 65.0, 70.0];

    // 定义更新股票价格的闭包
    let mut update_stock_prices = |prices: &mut Vec<f64>| {
        for price in prices.iter_mut() {
            // 模拟市场波动，更新价格
            let market_fluctuation = rand::random::<f64>() * 5.0 - 2.5;
            *price += market_fluctuation;
        }
    };

    // 使用FnMut闭包周期性地更新股票价格
    for _ in 0..5 {
        update_stock_prices(&mut stock_prices);
        println!("Updated Stock Prices: {:?}", stock_prices);
    }
}
```

在这个示例中，我们有一个股票价格列表 `stock_prices`，并定义了一个 `update_stock_prices` 闭包，该闭包使用 `FnMut` 特性以可变方式更新价格列表中的股票价格。我们在循环中多次调用 `update_stock_prices` 闭包，模拟市场波动和价格更新。
