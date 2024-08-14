# Chapter 11 - 模块

在 Rust 中，模块(Modules)是一种组织和管理代码的方式，它允许你将相关的函数、结构体、枚举、常量等项组织成一个单独的单元。模块有助于代码的组织、可维护性和封装性，使得大型项目更容易管理和理解。

以下是关于 Rust 模块的重要概念和解释：

1. **模块的定义：** 模块可以在 Rust 代码中通过 `mod` 关键字定义。一个模块可以包含其他模块、函数、结构体、枚举、常量和其他项。模块通常以一个包含相关功能的文件为单位进行组织。

   ```rust
   // 定义一个名为 `my_module` 的模块
   mod my_module {
       // 在模块内部可以包含其他项
       fn my_function() {
           println!("This is my function.");
       }
   }
   ```

2. **模块的嵌套：** 你可以在一个模块内部定义其他模块，从而创建嵌套的模块结构，这有助于更细粒度地组织代码。

   ```rust
   mod outer_module {
       mod inner_module {
           // ...
       }
   }
   ```

3. **访问项：** 模块内部的项默认是私有的，如果要从外部访问模块内的项，需要使用 `pub` 关键字来将它们标记为公共。

   ```rust
   mod my_module {
       pub fn my_public_function() {
           println!("This is a public function.");
       }
   }
   ```

4. **使用模块：** 在其他文件中使用模块内的项需要使用 `use` 关键字导入模块。

   ```rust
   // 导入模块
   use my_module::my_public_function;
   
   fn main() {
       // 调用模块内的函数
       my_public_function();
   }
   ```

5. **模块文件结构：** Rust 鼓励按照文件和目录的结构来组织模块。每个模块通常位于一个单独的文件中，文件的结构和模块结构相对应。例如，一个名为 `my_module` 的模块通常存储在一个名为 `my_module.rs` 的文件中。

   ```plaintext
   project/
   ├── src/
   │   ├── main.rs
   │   ├── my_module.rs
   │   └── other_module.rs
   ```

6. **模块的可见性：** 默认情况下，模块内的项对外是不可见的，除非它们被标记为 `pub`。这有助于封装代码，只有公共接口对外可见，内部实现细节被隐藏。

7. **模块的作用域：** Rust 的模块系统具有词法作用域。这意味着模块和项的可见性是通过它们在代码中的位置来确定的。一个模块可以访问其父模块的项，但不能访问其子模块的项，除非它们被导入。

模块是 Rust 语言中的一个关键概念，它有助于构建模块化、可维护和可扩展的代码结构。通过合理使用模块，可以将代码分解为更小的、可重用的单元，提高代码的可读性和可维护性。

### 案例：软件工程：组织金融产品模块

在金融领域，使用 Rust 的模块系统可以很好地组织和管理不同类型的金融工具和计算。以下是一个示例，演示如何使用模块来组织不同类型的金融工具和相关计算。

假设我们有几种金融工具，例如股票(Stock)、债券(Bond)和期权(Option)，以及一些计算函数，如计算收益、风险等。我们可以使用模块来组织这些功能。

首先，创建一个 `financial_instruments` 模块，其中包含不同类型的金融工具定义：

```rust
// financial_instruments.rs

pub mod stock {
    pub struct Stock {
        // ...
    }

    impl Stock {
        pub fn new() -> Self {
            // 初始化股票
            Stock {
                // ...
            }
        }

        // 其他股票相关方te x t法
    }
}

pub mod bond {
    pub struct Bond {
        // ...
    }

    impl Bond {
        pub fn new() -> Self {
            // 初始化债券
            Bond {
                // ...
            }
        }

        // 其他债券相关方法
    }
}

pub mod option {
    pub struct Option {
        // ...
    }

    impl Option {
        pub fn new() -> Self {
            // 初始化期权
            Option {
                // ...
            }
        }

        // 其他期权相关方法
    }
}
```

接下来，创建一个 `calculations` 模块，其中包含与金融工具相关的计算函数：

```rust
// calculations.rs

use crate::financial_instruments::{stock::Stock, bond::Bond, option::Option};

pub fn calculate_stock_return(stock: &Stock) -> f64 {
    // 计算股票的收益
    // ...
}

pub fn calculate_bond_return(bond: &Bond) -> f64 {
    // 计算债券的收益
    // ...
}

pub fn calculate_option_risk(option: &Option) -> f64 {
    // 计算期权的风险
    // ...
}
```

最后，在主程序中，你可以导入模块并使用定义的金融工具和计算函数：

```rust
// main.rs

mod financial_instruments;
mod calculations;

use financial_instruments::{stock::Stock, bond::Bond, option::Option};
use calculations::{calculate_stock_return, calculate_bond_return, calculate_option_risk};

fn main() {
    let stock = Stock::new();
    let bond = Bond::new();
    let option = Option::new();

    let stock_return = calculate_stock_return(&stock);
    let bond_return = calculate_bond_return(&bond);
    let option_risk = calculate_option_risk(&option);

    println!("Stock Return: {}", stock_return);
    println!("Bond Return: {}", bond_return);
    println!("Option Risk: {}", option_risk);
}
```

通过这种方式，你可以将不同类型的金融工具和相关计算函数封装在不同的模块中，使代码更有结构和组织性。这有助于提高代码的可维护性，使得在金融领域开发复杂应用程序更容易。
