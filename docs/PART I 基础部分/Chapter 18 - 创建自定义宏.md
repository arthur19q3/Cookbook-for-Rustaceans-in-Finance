# Chapter 18 - 创建自定义宏

在计算机编程中，宏（Macro）是一种元编程技术，它允许程序员编写用于生成代码的代码。宏通常被用于简化重复性高的任务，自动生成代码片段，或者创建领域特定语言（DSL）的扩展，以简化特定任务的编程。

在Rust中，我们可以用`macro_rules!`创建自定义的宏。自定义宏允许你编写自己的代码生成器，以在编译时生成代码。以下是`macro_rules!`的基本语法和一些详解：

```rust
macro_rules! my_macro {
    // 规则1
    ($arg1:expr, $arg2:expr) => {
        // 宏展开时执行的代码
        println!("Argument 1: {:?}", $arg1);
        println!("Argument 2: {:?}", $arg2);
    };
    // 规则2
    ($arg:expr) => {
        // 单个参数的情况
        println!("Only one argument: {:?}", $arg);
    };
    // 默认规则
    () => {
        println!("No arguments provided.");
    };
}
```

上面的代码定义了一个名为`my_macro`的宏，它有三个不同的规则。每个规则由`=>`分隔，规则本身以模式（pattern）和展开代码（expansion code）组成。下面是对这些规则的解释：

1. 第一个规则：`($arg1:expr, $arg2:expr) => { ... }`
   - 这个规则匹配两个表达式作为参数，并将它们打印出来。

2. 第二个规则：`($arg:expr) => { ... }`
   - 这个规则匹配单个表达式作为参数，并将它打印出来。

3. 第三个规则：`() => { ... }`
   - 这是一个默认规则，如果没有其他规则匹配，它将被用于展开。

现在，让我们看看如何使用这个自定义宏：

```rust
fn main() {
    my_macro!(42); // 调用第二个规则，打印 "Only one argument: 42"
    
    my_macro!(10, "Hello"); // 调用第一个规则，打印 "Argument 1: 10" 和 "Argument 2: "Hello"
    
    my_macro!(); // 调用默认规则，打印 "No arguments provided."
}
```

在上述示例中，我们通过`my_macro!`来调用自定义宏，根据传递的参数数量和类型，宏会选择匹配的规则来展开并执行相应的代码。

总结一下，`macro_rules!`可以用于创建自定义宏，你可以定义**多个规则来匹配不同的输入模式**，并在展开时执行相应的代码。这使得Rust中的宏非常强大，可以用于**代码复用**(Code reuse)和**元编程**(Metaprogramming)。

### 补充学习：元编程(Metaprogramming)

元编程，又称超编程，是一种计算机编程的方法，它允许程序操作或生成其他程序，或者在编译时执行一些通常在运行时完成的工作。这种编程方法可以提高编程效率和程序的灵活性，因为它允许程序**动态地生成和修改代码**，而无需手动编写每一行代码。如在Unix Shell中：

1. **代码生成：** 在元编程中，程序可以生成代码片段或整个程序。这对于自动生成重复性高的代码非常有用。例如，在Shell脚本中，你可以使用循环来生成一系列命令，而不必手动编写每个命令。

```bash
for i in {1..10}; do
  echo "This is iteration $i"
done
```

2. **模板引擎：** 元编程还可用于创建通用模板，根据不同的输入数据自动生成特定的代码或文档。这对于动态生成网页内容或配置文件非常有用。

```bash
#!/bin/bash
cat <<EOF > config.txt
ServerName $server_name
Port $port
EOF
```

我们也可以使用Rust的元编程工具来执行这类任务。Rust有一个强大的宏系统，可以用于生成代码和进行元编程。以下是与之前的Shell示例相对应的Rust示例：

1. **代码生成：** 在Rust中，你可以使用宏来生成代码片段。

```rust
macro_rules! generate_code {
    ($count:expr) => {
        for i in 1..=$count {
            println!("This is iteration {}", i);
        }
    };
}

fn main() {
    generate_code!(10);
}
```

2. **模板引擎：** 在Rust中，你可以使用宏来生成配置文件或其他文档。

```rust
macro_rules! generate_config {
    ($server_name:expr, $port:expr) => {
        format!("ServerName {}\nPort {}", $server_name, $port)
    };
}

fn main() {
    let server_name = "example.com";
    let port = 8080;
    let config = generate_config!(server_name, port);
    println!("{}", config);
}
```

### 案例：用宏来计算一组金融时间序列的平均值

现在让我们来进入实战演练，下面是一个用于量化金融的简单Rust宏的示例。这个宏用于计算一组金融时间序列的平均值，并将其用于简单的均线策略。

首先，让我们定义一个包含金融时间序列的结构体：

```rust
struct TimeSeries {
    data: Vec<f64>,
}

impl TimeSeries {
    fn new(data: Vec<f64>) -> Self {
        TimeSeries { data }
    }
}
```

接下来，我们将创建一个自定义宏，用于计算平均值并执行均线策略：

```rust
macro_rules! calculate_average {
    ($ts:expr) => {
        {
            let sum: f64 = $ts.data.iter().sum();
            let count = $ts.data.len() as f64;
            sum / count
        }
    };
}

macro_rules! simple_moving_average_strategy {
    ($ts:expr, $period:expr) => {
        {
            let avg = calculate_average!($ts);
            let current_value = $ts.data.last().unwrap();
            
            if *current_value > avg {
                "Buy"
            } else {
                "Sell"
            }
        }
    };
}
```

上述代码中，我们创建了两个宏：

1. `calculate_average!($ts:expr)`：这个宏计算给定时间序列`$ts`的平均值。

2. `simple_moving_average_strategy!($ts:expr, $period:expr)`：这个宏使用`calculate_average!`宏计算平均值，并根据当前值与平均值的比较生成简单的"Buy"或"Sell"策略信号。

现在，让我们看看如何使用这些宏：

```rust
fn main() {
    let prices = vec![100.0, 110.0, 120.0, 130.0, 125.0];
    let time_series = TimeSeries::new(prices);

    let period = 3;

    let signal = simple_moving_average_strategy!(time_series, period);

    println!("Signal: {}", signal);
}
```

在上述示例中，我们创建了一个包含价格数据的时间序列`time_series`，并使用`simple_moving_average_strategy!`宏来生成交易信号。如果最后一个价格高于平均值，则宏将生成"Buy"信号，否则生成"Sell"信号。

这只是一个简单的示例，展示了如何使用自定义宏来简化量化金融策略的实现。在实际的金融应用中，你可以使用更复杂的数据处理和策略规则。但这个示例演示了如何使用Rust的宏系统来增强代码的可读性和可维护性。
