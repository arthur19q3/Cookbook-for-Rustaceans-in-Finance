---
title: '流程控制'
---

## 9.1 if 条件语句

在Rust中，`if` 语句用于条件控制，允许根据条件的真假来执行不同的代码块。Rust的`if`语句有一些特点和语法细节，以下是对Rust的`if`语句的介绍：

1. **基本语法**：

   ```rust
   if condition {
       // 如果条件为真(true)，执行这里的代码块
   } else {
       // 如果条件为假(false)，执行这里的代码块(可选)
   }
   ```

   `condition` 是一个布尔表达式，根据其结果，决定执行哪个代码块。`else`部分是可选的，你可以选择不包括它。

2. **多条件的`if`语句**：

   你可以使用 `else if` 来添加多个条件分支，例如：

   ```rust
   if condition1 {
       // 条件1为真时执行
   } else if condition2 {
       // 条件1为假，条件2为真时执行
   } else {
       // 所有条件都为假时执行
   }
   ```

   这允许你在多个条件之间进行选择。

3. **表达式返回值**：

   在Rust中，`if`语句是一个表达式，意味着它可以返回一个值。这使得你可以将`if`语句的结果赋值给一个变量，如下所示：

   ```rust
   let result = if condition { 1 } else { 0 };
   ```

   这里，`result`的值将根据条件的真假来赋值为1或0。注意并不是布尔值。

4. **模式匹配**：

   你还可以使用`if`语句进行模式匹配，而不仅仅是布尔条件。例如，你可以匹配枚举类型或其他自定义类型的值。

   ```rust
   enum Status {
       Success,
       Error,
   }

   let status = Status::Success;

   if let Status::Success = status {
       // 匹配成功
   } else {
       // 匹配失败
   }
   ```

总的来说，Rust的`if`语句提供了强大的条件控制功能，同时具有表达式和模式匹配的特性，使得它在处理不同类型的条件和场景时非常灵活和可读。

现在我们来简单应用一下if语句，顺便预习for语句：

```rust
fn main() {
    // 初始化投资组合的风险分数
    let portfolio_risk_scores = vec![0.8, 0.6, 0.9, 0.5, 0.7];
    let risk_threshold = 0.7; // 风险分数的阈值

    // 计算高风险资产的数量
    let mut high_risk_assets = 0;

    for &risk_score in portfolio_risk_scores.iter() {
        // 使用 if 条件语句判断风险分数是否超过阈值
        if risk_score > risk_threshold {
            high_risk_assets += 1;
        }
    }

    // 基于高风险资产数量输出不同的信息
    if high_risk_assets == 0 {
        println!("投资组合风险水平低，没有高风险资产。");
    } else if high_risk_assets <= 2 {
        println!("投资组合风险水平中等，有少量高风险资产。");
    } else {
        println!("投资组合风险水平较高，有多个高风险资产。");
    }
}

```

**执行结果：**

```text
投资组合风险水平中等，有少量高风险资产。
```

## 9.2 for 循环 (For Loops)

Rust 是一种系统级编程语言，它具有强大的内存安全性和并发性能。在 Rust 中，使用 `for` 循环来迭代集合(如数组、向量、切片等)中的元素或者执行某个操作一定次数。下面是 Rust 中 `for` 循环的基本语法和一些示例：

### 9.2.1 范围

你还可以使用 `for` 循环来执行某个操作一定次数，可以使用 `..` 运算符创建一个范围，并在循环中使用它：

```rust
fn main() {
    for i in 1..=5 {
        println!("Iteration: {}", i);
    }
}
```

上述示例将打印数字 1 到 5，包括 5。范围使用 `1..=5` 表示，包括起始值 1 和结束值 5。

### 9.2.2 迭代器

在 Rust 中，使用 `for` 循环来迭代集合(例如数组或向量)中的元素非常简单。下面是一个示例，演示如何迭代一个整数数组中的元素：

```rust
fn main() {
    let numbers = [1, 2, 3, 4, 5];

    for number in numbers.iter() {
        println!("Number: {}", number);
    }
}
```

在这个示例中，`numbers.iter()` 返回一个迭代器，通过 `for` 循环迭代器中的元素并打印每个元素的值。

## 9.3 迭代器的诸种方法

除了使用 `for` 循环，你还可以使用 Rust 的迭代器方法来处理集合中的元素。这些方法包括 `map`、`filter`、`fold` 等，它们允许你进行更复杂的操作。

### 9.3.1 map方法

在Rust中，`map`方法是用于迭代和转换集合元素的常见方法之一。`map`方法接受一个闭包(或函数)，并将其应用于集合中的每个元素，然后返回一个新的集合，其中包含了应用了闭包后的结果。这个方法通常用于对集合中的每个元素执行某种操作，然后生成一个新的集合，而不会修改原始集合。

### 案例1 用map计算并映射x的平方

```rust
fn main() {
    // 创建一个包含一些数字的向量
    let numbers = vec![1, 2, 3, 4, 5];

    // 使用map方法对向量中的每个元素进行平方操作，并创建一个新的向量
    let squared_numbers: Vec<i32> = numbers.iter().map(|&x| x * x).collect();

    // 输出新的向量
    println!("{:?}", squared_numbers);
}
```

在这个例子中，我们首先创建了一个包含一些整数的向量`numbers`。然后，我们使用`map`方法对`numbers`中的每个元素执行了平方操作，这个操作由闭包`|&x| x * x`定义。最后，我们使用`collect`方法将结果收集到一个新的向量` squared_numbers` 中，并打印出来。

### 案例2 计算对数收益率

```rust
fn main() {
    // 创建一个包含股票价格的向量
    let stock_prices = vec![100.0, 105.0, 110.0, 115.0, 120.0];

    // 使用map方法计算每个价格的对数收益率，并创建一个新的向量
    let log_returns: Vec<f64> = stock_prices.iter().map(|&price| price / 100.0f64.ln()).collect();

    // 输出对数收益率
    println!("{:?}", log_returns);
}

```

**执行结果：**

```text
[21.71472409516259, 22.80046029992072, 23.88619650467885, 24.971932709436977, 26.05766891419511]
```

在上述示例中，我们使用了 `map` 方法将原始向量中的每个元素都乘以 2，然后使用 `collect` 方法将结果收集到一个新的向量中。

### 9.3.2 filter 方法

filter方法是一个在金融数据分析中常用的方法，它用于筛选出符合特定条件的元素并返回一个新的迭代器。这个方法需要传入一个闭包作为参数，该闭包接受一个元素的引用并返回一个布尔值，用于判断该元素是否应该被包含在结果迭代器中。

在金融分析中，我们通常需要筛选出符合某些条件的数据进行处理，例如筛选出大于某个阈值的股票或者小于某个阈值的交易。filter方法可以帮助我们方便地实现这个功能。

下面是一个使用filter方法筛选出大于某个阈值的交易的例子：

```rust
// 定义一个Trade结构体
#[derive(Debug, PartialEq)]
struct Trade {
    price: f64,
    volume: i32,
}

fn main() {
    let trades = vec![
        Trade { price: 10.0, volume: 100 },
        Trade { price: 20.0, volume: 200 },
        Trade { price: 30.0, volume: 300 },
    ];

    let threshold = 25.0;

    let mut filtered_trades = trades.iter().filter(|trade| trade.price > threshold);

    match filtered_trades.next() {
        Some(&Trade { price: 30.0, volume: 300 }) => println!("第一个交易正确"),
        _ => println!("第一个交易不正确"),
    }

    match filtered_trades.next() {
        None => println!("没有更多的交易"),
        _ => println!("还有更多的交易"),
    }
}
```

**执行结果：**

```text
第一个交易正确
没有更多的交易
```

在这个例子中，我们有一个包含多个交易的向量，每个交易都有一个价格和交易量。我们想要筛选出价格大于25.0的交易。我们使用filter方法传入一个闭包来实现这个筛选。闭包接受一个Trade的引用并返回该交易的价格是否大于阈值。最终，我们得到一个只包含符合条件的交易的迭代器。

### 9.3.2 next方法

在金融领域，一个常见的用例是处理时间序列数据。假设我们有一个包含股票价格的时间序列数据集，我们想要找出大于给定阈值的下一个价格。我们可以使用Rust中的`next`方法来实现这个功能。

首先，我们需要定义一个结构体来表示时间序列数据。假设我们的数据存储在一个`Vec<f64>`中，其中每个元素代表一个时间点的股票价格。我们可以创建一个名为`TimeSeries`的结构体，并实现`Iterator` trait来使其可迭代。

```rust
pub struct TimeSeries {
    data: Vec<f64>,
    index: usize,
}

impl TimeSeries {
    pub fn new(data: Vec<f64>) -> Self {
        Self { data, index: 0 }
    }
}

impl Iterator for TimeSeries {
    type Item = f64;

    fn next(&mut self) -> Option<Self::Item> {
        if self.index < self.data.len() {
            let value = self.data[self.index];
            self.index += 1;
            Some(value)
        } else {
            None
        }
    }
}
```

接下来，我们可以创建一个函数来找到大于给定阈值的下一个价格。我们可以使用`filter`方法和`next`方法来遍历时间序列数据，并找到第一个大于阈值的价格。

```rust
pub fn find_next_threshold(time_series: &mut TimeSeries, threshold: f64) -> Option<f64> {
    time_series.filter(|&price| price > threshold).next()
}
```

现在，我们可以使用这个函数来查找时间序列数据中大于给定阈值的下一个价格。以下是一个示例：

```rust
fn main() {
    let data = vec![10.0, 20.0, 30.0, 40.0, 50.0];
    let mut time_series = TimeSeries::new(data);
    let threshold = 35.0;

    match find_next_threshold(&mut time_series, threshold) {
        Some(price) => println!("下一个大于{}的价格是{}", threshold, price),
        None => println!("没有找到大于{}的价格", threshold),
    }
}
```

在这个示例中，我们创建了一个包含股票价格的时间序列数据，并使用`find_next_threshold`函数找到大于35.0的下一个价格。输出将会是"下一个大于35的价格是40"。如果没有找到大于阈值的价格，输出将会是"没有找到大于35的价格"。

### 9.3.4 fold 方法

`fold` 是 Rust 标准库中 `Iterator` trait 提供的一个重要方法之一。它用于在迭代器中累积值，将一个初始值和一个闭包函数应用于迭代器的每个元素，并返回最终的累积结果。`fold` 方法的签名如下：

```rust
fn fold<B, F>(self, init: B, f: F) -> B
where
    F: FnMut(B, Self::Item) -> B,
```

- `self` 是迭代器本身。
- `init` 是一个初始值，用于累积操作的初始状态。
- `f` 是一个闭包函数，它接受两个参数：累积值（初始值或上一次迭代的结果）和迭代器的下一个元素，然后返回新的累积值。

`fold` 方法的执行过程如下：

1. 使用初始值 `init` 初始化累积值。
2. 对于迭代器的每个元素，调用闭包函数 `f`，传递当前累积值和迭代器的元素。
3. 将闭包函数的返回值更新为新的累积值。
4. 重复步骤 2 和 3，直到迭代器中的所有元素都被处理。
5. 返回最终的累积值。

现在，让我们通过一个金融案例来演示 `fold` 方法的使用。假设我们有一组金融交易记录，每个记录包含交易类型（存款或提款）和金额。我们想要计算总存款和总提款的差值，以查看账户的余额。

```rust
struct Transaction {
    transaction_type: &'static str,
    amount: f64,
}

fn main() {
    let transactions = vec![
        Transaction { transaction_type: "Deposit", amount: 100.0 },
        Transaction { transaction_type: "Withdrawal", amount: 50.0 },
        Transaction { transaction_type: "Deposit", amount: 200.0 },
        Transaction { transaction_type: "Withdrawal", amount: 75.0 },
    ];

    let initial_balance = 0.0; // 初始余额为零

    let balance = transactions.iter().fold(initial_balance, |acc, transaction| {
        match transaction.transaction_type {
            "Deposit" => acc + transaction.amount,
            "Withdrawal" => acc - transaction.amount,
            _ => acc,
        }
    });

    println!("Account Balance: ${:.2}", balance);
}
```

在这个示例中，我们首先定义了一个 `Transaction` 结构体来表示交易记录，包括交易类型和金额。然后，我们创建了一个包含多个交易记录的 `transactions` 向量。我们使用 `fold` 方法来计算总存款和总提款的差值，以获取账户的余额。

在 `fold` 方法的闭包函数中，我们根据交易类型来更新累积值 `acc`。如果交易类型是 "Deposit"，我们将金额添加到余额上，如果是 "Withdrawal"，则将金额从余额中减去。最终，我们打印出账户余额。

### 9.3.5 collect 方法

`collect` 是 Rust 中用于将迭代器的元素收集到一个集合（collection）中的方法。它是 `Iterator` trait 提供的一个重要方法。`collect` 方法的签名如下：

```rust
fn collect<B>(self) -> B
where
    B: FromIterator<Self::Item>,
```

- `self` 是迭代器本身。
- `B` 是要收集到的集合类型，它必须实现 `FromIterator` trait，这意味着可以从迭代器的元素类型构建该集合类型。
- `collect` 方法将迭代器中的元素转换为集合 `B` 并返回。

`collect` 方法的工作原理如下：

1. 创建一个空的集合 `B`，这个集合将用于存储迭代器中的元素。
2. 对于迭代器的每个元素，将元素添加到集合 `B` 中。
3. 返回集合 `B`。

现在，让我们通过一个金融案例来演示 `collect` 方法的使用。假设我们有一组金融交易记录，每个记录包含交易类型（存款或提款）和金额。我们想要将所有存款记录收集到一个向量中，以进一步分析。

```rust
struct Transaction {
    transaction_type: &'static str,
    amount: f64,
}

fn main() {
    let transactions = vec![
        Transaction { transaction_type: "Deposit", amount: 100.0 },
        Transaction { transaction_type: "Withdrawal", amount: 50.0 },
        Transaction { transaction_type: "Deposit", amount: 200.0 },
        Transaction { transaction_type: "Withdrawal", amount: 75.0 },
    ];

    // 使用 collect 方法将存款记录收集到一个向量中
    let deposits: Vec<Transaction> = transactions
        .iter()
        .filter(|&transaction| transaction.transaction_type == "Deposit")
        .cloned()
        .collect();

    println!("Deposit Transactions: {:?}", deposits);
}
```

在这个示例中，我们首先定义了一个 `Transaction` 结构体来表示交易记录，包括交易类型和金额。然后，我们创建了一个包含多个交易记录的 `transactions` 向量。

接下来，我们使用 `collect` 方法来将所有存款记录收集到一个新的 `Vec<Transaction>` 向量中。我们首先使用 `iter()` 方法将 `transactions` 向量转换为迭代器，然后使用 `filter` 方法筛选出交易类型为 "Deposit" 的记录。接着，我们使用 `cloned()` 方法来克隆这些记录，以便将它们收集到新的向量中。

最后，我们打印出包含所有存款记录的向量。这样，我们就成功地使用 `collect` 方法将特定类型的交易记录收集到一个集合中，以便进一步分析或处理。

## 9.4 while 循环 (While Loops)

`while` 循环是一种在 Rust 中用于重复执行代码块直到条件不再满足的控制结构。它的执行方式是在每次循环迭代之前检查一个条件表达式，只要条件为真，循环就会继续执行。一旦条件为假，循环将终止，控制流将跳出循环。

以下是 `while` 循环的一般形式：

```rust
while condition {
    // 循环体代码
}
```

- `condition` 是一个布尔表达式，它用于检查循环是否应该继续执行。只要 `condition` 为真，循环体中的代码将被执行。
- 循环体包含要重复执行的代码，通常会改变某些状态以最终使得 `condition` 为假，从而退出循环。

下面是一个使用 `while` 循环的示例，演示了如何计算存款和提款的总和，直到交易记录列表为空：

```rust
struct Transaction {
    transaction_type: &'static str,
    amount: f64,
}

fn main() {
    let mut transactions = vec![
        Transaction { transaction_type: "Deposit", amount: 100.0 },
        Transaction { transaction_type: "Withdrawal", amount: 50.0 },
        Transaction { transaction_type: "Deposit", amount: 200.0 },
        Transaction { transaction_type: "Withdrawal", amount: 75.0 },
    ];

    let mut total_balance = 0.0;

    while !transactions.is_empty() {
        let transaction = transactions.pop().unwrap(); // 从末尾取出一个交易记录
        match transaction.transaction_type {
            "Deposit" => total_balance += transaction.amount,
            "Withdrawal" => total_balance -= transaction.amount,
            _ => (),
        }
    }

    println!("Account Balance: ${:.2}", total_balance);
}
```

在这个示例中，我们定义了一个 `Transaction` 结构体来表示交易记录，包括交易类型和金额。我们创建了一个包含多个交易记录的 `transactions` 向量，并初始化 `total_balance` 为零。

然后，我们使用 `while` 循环来迭代处理交易记录，直到 `transactions` 向量为空。在每次循环迭代中，我们从 `transactions` 向量的末尾取出一个交易记录，并根据交易类型更新 `total_balance`。最终，当所有交易记录都处理完毕时，循环将终止，我们打印出账户余额。

这个示例演示了如何使用 `while` 循环来处理一个动态变化的数据集，直到满足退出条件为止。在金融领域，这种循环可以用于处理交易记录、账单或其他需要迭代处理的数据。

## 9.5 loop循环

`loop` 循环是 Rust 中的一种基本循环结构，它允许你无限次地重复执行一个代码块，直到明确通过 `break` 语句终止循环。与 `while` 循环不同，`loop` 循环没有条件表达式来判断是否退出循环，因此它总是会无限循环，直到遇到 `break`。

以下是 `loop` 循环的一般形式：

```rust
loop {
    // 循环体代码
    if condition {
        break; // 通过 break 语句终止循环
    }
}
```

- 循环体中的代码块将无限次地执行，直到遇到 `break` 语句。
- `condition` 是一个可选的条件表达式，当条件为真时，循环将终止。

下面是一个使用 `loop` 循环的示例，演示了如何计算存款和提款的总和，直到输入的交易记录为空：

```rust
struct Transaction {
    transaction_type: &'static str,
    amount: f64,
}

fn main() {
    let mut transactions = Vec::new();

    loop {
        let transaction_type: String = {
            println!("Enter transaction type (Deposit/Withdrawal) or 'done' to finish:");
            let mut input = String::new();
            std::io::stdin().read_line(&mut input).expect("Failed to read line");
            input.trim().to_string()
        };

        if transaction_type == "done" {
            break; // 通过 break 语句终止循环
        }

        let amount: f64 = {
            println!("Enter transaction amount:");
            let mut input = String::new();
            std::io::stdin().read_line(&mut input).expect("Failed to read line");
            input.trim().parse().expect("Invalid input")
        };

        transactions.push(Transaction {
            transaction_type: &transaction_type,
            amount,
        });
    }

    let mut total_balance = 0.0;

    for transaction in &transactions {
        match transaction.transaction_type {
            "Deposit" => total_balance += transaction.amount,
            "Withdrawal" => total_balance -= transaction.amount,
            _ => (),
        }
    }

    println!("Account Balance: ${:.2}", total_balance);
}
```

在这个示例中，我们首先定义了一个 `Transaction` 结构体来表示交易记录，包括交易类型和金额。然后，我们创建了一个空的 `transactions` 向量，用于存储用户输入的交易记录。

接着，我们使用 `loop` 循环来反复询问用户输入交易类型和金额，直到用户输入 "done" 为止。如果用户输入 "done"，则通过 `break` 语句终止循环。否则，我们将用户输入的交易记录添加到 `transactions` 向量中。

最后，我们遍历 `transactions` 向量，计算存款和提款的总和，以获取账户余额，并打印出结果。

这个示例演示了如何使用 `loop` 循环处理用户输入的交易记录，直到用户选择退出。在金融领域，这种循环可以用于交互式地记录和计算账户的交易信息。

## 9.6 if let 和 while let语法糖

`if let` 和 `while let` 是 Rust 中的语法糖，用于简化模式匹配的常见用例，特别是用于处理 `Option` 和 `Result` 类型。它们允许你以更简洁的方式进行模式匹配，以处理可能的成功或失败情况。

**1. if let 表达式：**

`if let` 允许你检查一个值是否匹配某个模式，并在匹配成功时执行代码块。语法如下：

```rust
if let Some(value) = some_option {
    // 匹配成功，使用 value
} else {
    // 匹配失败
}
```

在上述示例中，如果 `some_option` 是 `Some` 包装的值，那么匹配成功，并且 `value` 将被绑定到 `Some` 中的值，然后执行相应的代码块。如果 `some_option` 是 `None`，则匹配失败，执行 `else` 块。

**2. while let 循环：**

`while let` 允许你重复执行一个代码块，直到匹配失败（通常是直到 `None`）。语法如下：

```rust
while let Some(value) = some_option {
    // 匹配成功，使用 value
}
```

在上述示例中，只要 `some_option` 是 `Some` 包装的值，就会重复执行代码块，并且 `value` 会在每次迭代中被绑定到 `Some` 中的值。一旦匹配失败（即 `some_option` 变为 `None`），循环将终止。

**金融案例示例：**

假设我们有一个金融应用程序，其中用户可以进行存款和提款操作，而每个操作都以 `Transaction` 结构体表示。我们将使用 `Option` 来模拟用户输入的交易，然后使用 `if let` 和 `while let` 处理这些交易。

```rust
struct Transaction {
    transaction_type: &'static str,
    amount: f64,
}

fn main() {
    let mut account_balance = 0.0;

    // 模拟用户输入的交易列表
    let transactions = vec![
        Some(Transaction { transaction_type: "Deposit", amount: 100.0 }),
        Some(Transaction { transaction_type: "Withdrawal", amount: 50.0 }),
        Some(Transaction { transaction_type: "Deposit", amount: 200.0 }),
        None, // 用户结束输入
    ];

    for transaction in transactions {
        if let Some(tx) = transaction {
            match tx.transaction_type {
                "Deposit" => {
                    account_balance += tx.amount;
                    println!("Deposited ${:.2}", tx.amount);
                }
                "Withdrawal" => {
                    account_balance -= tx.amount;
                    println!("Withdrawn ${:.2}", tx.amount);
                }
                _ => println!("Invalid transaction type"),
            }
        } else {
            break; // 用户结束输入，退出循环
        }
    }

    println!("Account Balance: ${:.2}", account_balance);
}
```

在这个示例中，我们使用 `transactions` 向量来模拟用户输入的交易记录，包括存款和提款，以及一个 `None` 表示用户结束输入。然后，我们使用 `for` 循环和 `if let` 来处理每个交易记录，当遇到 `None` 时，循环终止。

这个示例演示了如何使用 `if let` 和 `while let` 简化模式匹配，以处理可能的成功和失败情况，以及在金融应用程序中处理用户输入的交易记录。

## 9.7 并发迭代器

在 Rust 中，通过标准库的 `rayon` crate，你可以轻松创建并发迭代器，用于在并行计算中高效处理集合的元素。`rayon` 提供了一种并发编程的方式，能够利用多核处理器的性能，特别适合处理大规模数据集。

以下是如何使用并发迭代器的一般步骤：

1. 首先，确保在 `Cargo.toml` 中添加 `rayon` crate 的依赖：

   ```toml
   [dependencies]
   rayon = "1.5"
   ```

2. 导入 `rayon` crate：

   ```rust
   use rayon::prelude::*;
   ```

3. 使用 `.par_iter()` 方法将集合转换为并发迭代器。然后，你可以调用 `.for_each()`、`.map()`、`.filter()` 等方法来进行并行操作。

以下是一个金融案例，演示如何使用并发迭代器计算多个账户的总余额。每个账户包含一组交易记录，每个记录都有交易类型（存款或提款）和金额。我们将并行计算每个账户的总余额，然后计算所有账户的总余额。

```rust
use rayon::prelude::*;

struct Transaction {
    transaction_type: &'static str,
    amount: f64,
}

struct Account {
    transactions: Vec<Transaction>,
}

impl Account {
    fn new(transactions: Vec<Transaction>) -> Self {
        Account { transactions }
    }

    fn calculate_balance(&self) -> f64 {
        self.transactions
            .par_iter() // 将迭代器转换为并发迭代器
            .map(|transaction| {
                match transaction.transaction_type {
                    "Deposit" => transaction.amount,
                    "Withdrawal" => -transaction.amount,
                    _ => 0.0,
                }
            })
            .sum() // 并行计算总和
    }
}

fn main() {
    let account1 = Account::new(vec![
        Transaction { transaction_type: "Deposit", amount: 100.0 },
        Transaction { transaction_type: "Withdrawal", amount: 50.0 },
        Transaction { transaction_type: "Deposit", amount: 200.0 },
    ]);

    let account2 = Account::new(vec![
        Transaction { transaction_type: "Deposit", amount: 300.0 },
        Transaction { transaction_type: "Withdrawal", amount: 75.0 },
    ]);

    let total_balance: f64 = vec![&account1, &account2]
        .par_iter()
        .map(|account| account.calculate_balance())
        .sum(); // 并行计算总和

    println!("Total Account Balance: ${:.2}", total_balance);
}
```

在这个示例中，我们定义了 `Transaction` 结构体表示交易记录和 `Account` 结构体表示账户。每个账户包含一组交易记录。在 `Account` 结构体上，我们实现了 `calculate_balance()` 方法，该方法使用并发迭代器计算账户的总余额。

在 `main` 函数中，我们创建了两个账户 `account1` 和 `account2`，然后将它们放入一个向量中。接着，我们使用并发迭代器来并行计算每个账户的余额，并将所有账户的总余额相加，最后打印出结果。

这个示例演示了如何使用 `rayon` crate 的并发迭代器来高效处理金融应用程序中的数据，特别是在处理多个账户时，可以充分利用多核处理器的性能。
