
# Chapter 04 - 自定义类型

自定义类型有结构体（Struct）和枚举（Enum）。

## 4.1 结构体 `struct`

### 概念

结构体（Struct）是 Rust 中一种自定义的复合数据类型，它允许你组合多个不同类型的值并为它们定义一个新的数据结构。结构体用于表示和组织具有相关属性的数据。

以下是结构体的一些基本特点和概念：

- **自定义类型：**结构体允许你创建自己的用户定义类型，以适应特定问题领域的需求。

- **属性：**结构体包含属性（fields），每个属性都有自己的数据类型，这些属性用于存储相关的数据。

- **命名：**每个属性都有一个名称，用于标识和访问它们。这使得代码可读性和可维护性更好。

- **实例化：**可以创建结构体的实例，用于存储具体的数据。实例化一个结构体时，需要提供每个属性的值。

- **方法：**结构体可以拥有自己的方法，允许你在结构体上执行操作。

- **可变性：**你可以声明结构体实例为可变（mutable），允许在实例上修改属性的值。

- **生命周期：**结构体可以包含引用，从而引入了生命周期的概念，用于确保引用的有效性。

结构体是 Rust 中组织和抽象数据的重要工具，它们常常用于建模真实世界的实体、配置选项、状态等。结构体的定义通常包括了属性的名称和数据类型，以及可选的方法，以便在实际应用中对结构体执行操作。

### 案例：创建一个代表简单金融工具的结构体

在 Rust 中进行量化金融建模时，通常需要自定义类型来表示金融工具、交易策略或其他相关概念。自定义类型可以是结构体 `struct` 或枚举 `enum` ，具体取决于我们的需求。下面是一个简单的示例，演示如何在 Rust 中创建自定义结构体来表示一个简单的金融工具（例如股票）：

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

执行结果：

```text
股票代码: AAPL
股票价格: $150.50
股票数量: 1000
总价值: $150500.00
```

##  4.2 枚举 `enum`

### 概念

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

- **类型安全：**枚举确保变体的值是类型安全的，不会出现无效的值。

- **可读性：**枚举可以为每个值提供描述性的名称，使代码更具可读性。

- **模式匹配：**枚举与模式匹配结合使用，可用于处理不同的情况，使代码更具表达力。

- **可扩展性：**你可以随时添加新的变体来扩展枚举类型，而不会破坏现有代码。

枚举在 Rust 中被广泛用于表示各种不同的情况和状态，包括错误处理、选项类型等等。它是 Rust 强大的工具之一，有助于编写类型安全且清晰的代码。

### 案例1：投资组合管理系统

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

执行结果：

```text
投资组合总价值: $501150
```

在这个示例中，我们定义了一个名为 `AssetType` 的枚举，它代表不同类型的资产（股票、债券、房地产）。然后，我们定义了一个名为 `Asset` 的结构体，用于表示单个资产的详细信息，包括名称、资产类型和价格。接下来，我们定义了一个名为 `Portfolio` 的结构体，它包含一个 `Vec<Asset>`，表示投资组合中的多个资产。

在 `Portfolio` 结构体上，我们实现了一个方法 `calculate_total_value()`，用于计算投资组合的总价值。该方法遍历投资组合中的所有资产，并将它们的价格相加，得到总价值。

在 `main()` 函数中，我们创建了不同类型的资产，然后创建了一个投资组合并向其中添加资产。最后，我们调用 `calculate_total_value()` 方法计算投资组合的总价值，并将结果打印出来。

这个示例展示了如何使用枚举和结构体来建模复杂的量化金融问题，以及如何在 Rust 中实现相应的功能。在实际应用中，你可以根据需要扩展这个示例，包括更多的资产类型、交易规则等等。

### 案例2：订单执行模拟

当在量化金融中使用 Rust 时，枚举 `enum` 常常用于表示不同的金融工具或订单类型。以下是一个示例，演示如何在 Rust 中使用枚举来表示不同类型的金融工具和订单，并模拟执行这些订单：

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

然后，我们定义了一个 `Order` 结构体，它包含了金融工具类型、订单类型和订单数量。在 `Order` 结构体上，我们实现了一个 `execute()` 方法，用于模拟执行订单，并根据订单类型打印相应的信息。

在 `main` 函数中，我们创建了不同类型的订单，并使用 `execute()` 方法模拟执行它们。这个示例展示了如何使用枚举和结构体来表示量化金融中的不同概念，并模拟执行相关操作。你可以根据实际需求扩展这个示例，包括更多的金融工具类型和订单类型。