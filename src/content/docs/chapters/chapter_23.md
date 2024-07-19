---
title: '用 Polars 实现并加速数据框架处理'
---

## 23.1 Rust与数据框架处理工具Polars

经过以上的学习，我们很自然地知道，Rust 的编译器通过严格的编译检查和优化，能够生成接近于手写汇编的高效代码。它的零成本抽象特性确保了高效的运行时性能，非常适合处理大量数据和计算密集型任务。同时，Rust 提供了独特的所有权系统和借用检查器，能够防止数据竞争和内存泄漏。这些特性使得开发者可以编写更安全的多线程数据处理代码，减少并发错误的发生。另外，Rust 的并发模型使得编写高效的并行代码变得更加简单和安全。通过使用 `Tokio` 等异步编程框架，开发者可以高效地处理大量并发任务，提升数据处理的吞吐量。所以使用 Rust 进行数据处理，结合其性能、安全性、并发支持和跨平台兼容性，我们能够构建出高效、可靠和灵活的数据处理工具，满足现代数据密集型应用的需求。本节将以 Polars 为例教读者如何实现并加速数据框架处理。

### Polars 简介

Polars 起初是一个在2020年作为爱好项目开始的开源库，但很快在开源社区中获得了广泛关注。许多开发者一直在寻找一个既易用又高性能的 DataFrame 库，Polars 正是为了填补这一空缺而出现的。随着越来越多来自不同背景和编程语言的贡献者加入，Polars 社区迅速壮大。由于社区的巨大努力，Polars 现在正式支持三种语言（Rust、Python、JS），并计划支持两种新的语言（R、Ruby）。

### 哲学理念

Polars 的目标是提供一个极速的 DataFrame 库，其特点包括：

- 利用机器上的所有可用核心。
- 优化查询以减少不必要的工作和内存分配。
- 处理比可用内存更大的数据集。
- 提供一致且可预测的 API。
- 遵循严格的模式（在运行查询前应已知数据类型）。

Polars 使用 Rust 编写，具有 C/C++ 的性能，并能完全控制查询引擎中性能关键的部分。

### 主要功能

- **快速**：从头开始用 Rust 编写，设计紧贴机器且无外部依赖。
- **I/O 支持**：对本地、云存储和数据库的所有常见数据存储层提供一流支持。
- **直观的 API**：以自然的方式编写查询，Polars 内部会通过查询优化器确定最有效的执行方式。
- **Out of Core**：流式 API 允许处理结果时不需要将所有数据同时加载到内存中。
- **并行处理**：利用多核 CPU，无需额外配置即可分配工作负载。
- **向量化查询引擎**：使用 Apache Arrow 列式数据格式，以向量化方式处理查询，优化 CPU 使用。
- **LazyMode**：支持延迟计算模式，通过链式调用优化性能和资源使用。
- **PyO3 支持**：通过 PyO3 提供对 Python 的强大支持，使研究人员可以方便地使用 Python 进行数据分析。

在接下来的章节中，我们会频繁接触到这些Polars先进的特性。

### Rust 中的数据处理框架

1. **DataFusion**：DataFusion 是一个用于查询和数据处理的高性能查询引擎，支持 SQL 查询语法，并能够与 Arrow 格式的数据无缝集成，适用于大规模数据处理和分析。
2. **Arrow**：Apache Arrow 是一个跨语言的开发平台，旨在实现高性能的列式内存格式，支持高效的数据序列化和反序列化操作，广泛应用于大数据处理和数据分析领域。

这些其他也框架各有特点，为 Rust 开发者提供了丰富的数据处理和分析工具，能够满足不同的应用需求。

## 23.2 开始使用Polars

### 23.2.1 为项目加入polars库

本章节旨在帮助您开始使用 Polars。它涵盖了该库的所有基本功能和特性，使新用户能够轻松熟悉从初始安装和设置到核心功能的基础知识。如果您已经是高级用户或熟悉 DataFrame，您可以跳过本章节，直接进入下一个章节了解安装选项。

```toml
# 为项目加入polars库并且打开 'lazy' flag
cargo add polars -F lazy

# Or Cargo.toml
[dependencies]
polars = { version = "x", features = ["lazy", ...]}
```

### 23.2.2 读取与写入

Polars 支持读取和写入常见文件格式（如 csv、json、parquet）、云存储（S3、Azure Blob、BigQuery）和数据库（如 postgres、mysql）。以下示例展示了在磁盘上读取和写入的概念。

```rust
use std::fs::File; // 导入文件系统模块
use chrono::prelude::*; // 导入 Chrono 时间库
use polars::prelude::*; // 导入 Polars 库

// 创建一个 DataFrame，包含四列数据：整数、日期、浮点数和字符串
let mut df: DataFrame = df!(
    "integer" => &[1, 2, 3], // 整数列
    "date" => &[ // 日期列
        NaiveDate::from_ymd_opt(2025, 1, 1).unwrap().and_hms_opt(0, 0, 0).unwrap(), // 第一天
        NaiveDate::from_ymd_opt(2025, 1, 2).unwrap().and_hms_opt(0, 0, 0).unwrap(), // 第二天
        NaiveDate::from_ymd_opt(2025, 1, 3).unwrap().and_hms_opt(0, 0, 0).unwrap(), // 第三天
    ],
    "float" => &[4.0, 5.0, 6.0], // 浮点数列
    "string" => &["a", "b", "c"], // 字符串列
)
.unwrap(); // 创建 DataFrame 成功后，解除 Result 包装

// 打印 DataFrame 的内容
println!("{}", df);
```

这段代码展示了如何使用 Polars 在 Rust 中创建一个 DataFrame 并打印其内容。DataFrame 包含四列数据，分别是整数、日期、浮点数和字符串。通过这种方式，开发者可以方便地处理和分析数据。

```markdown
shape: (3, 4)
┌─────────┬─────────────────────┬───────┬────────┐
│ integer ┆ date ┆ float ┆ string │
│ --- ┆ --- ┆ --- ┆ --- │
│ i64 ┆ datetime[μs] ┆ f64 ┆ str │
╞═════════╪═════════════════════╪═══════╪════════╡
│ 1 ┆ 2025-01-01 00:00:00 ┆ 4.0 ┆ a │
│ 2 ┆ 2025-01-02 00:00:00 ┆ 5.0 ┆ b │
│ 3 ┆ 2025-01-03 00:00:00 ┆ 6.0 ┆ c │
└─────────┴─────────────────────┴───────┴────────┘
```

### 23.2.3 Polars 表达式

Polars 的表达式是其核心优势之一，提供了模块化结构，使得简单概念可以组合成复杂查询。以下是构建所有查询的基本组件：

- `select`
- `filter`
- `with_columns`
- `group_by`

要了解更多关于表达式和它们操作的上下文，请参阅用户指南中的上下文和表达式部分。

#### 23.2.3.1 选择（Select）

选择一列数据需要做两件事：

1. 定义我们要获取数据的 DataFrame。
2. 选择所需的数据。

在下面的示例中，我们选择 `col('*')`，星号代表所有列。

#### Rust 示例代码

```rust
use polars::prelude::*;

// 假设 df 是已创建的 DataFrame
let out = df.clone().lazy().select([col("*")]).collect()?;
println!("{}", out);
```

输出示例：

```bash
shape: (5, 4)
┌─────┬──────────┬─────────────────────┬───────┐
│ a   ┆ b        ┆ c                   ┆ d     │
│ --- ┆ ---      ┆ ---                 ┆ ---   │
│ i64 ┆ f64      ┆ datetime[μs]        ┆ f64   │
╞═════╪══════════╪═════════════════════╪═══════╡
│ 0   ┆ 0.10666  ┆ 2025-12-01 00:00:00 ┆ 1.0   │
│ 1   ┆ 0.596863 ┆ 2025-12-02 00:00:00 ┆ 2.0   │
│ 2   ┆ 0.691304 ┆ 2025-12-03 00:00:00 ┆ NaN   │
│ 3   ┆ 0.906636 ┆ 2025-12-04 00:00:00 ┆ -42.0 │
│ 4   ┆ 0.101216 ┆ 2025-12-05 00:00:00 ┆ null  │
└─────┴──────────┴─────────────────────┴───────┘
```

你也可以指定要返回的特定列，以下是传递列名的方式。

#### Rust 示例代码

```rust
use polars::prelude::*;

let out = df.clone().lazy().select([col("a"), col("b")]).collect()?;
println!("{}", out);
```

输出示例：

```bash
shape: (5, 2)
┌─────┬──────────┐
│ a   ┆ b        │
│ --- ┆ ---      │
│ i64 ┆ f64      │
╞═════╪══════════╡
│ 0   ┆ 0.10666  │
│ 1   ┆ 0.596863 │
│ 2   ┆ 0.691304 │
│ 3   ┆ 0.906636 │
│ 4   ┆ 0.101216 │
└─────┴──────────┘
```

#### 23.2.3.2 过滤（Filter）

过滤选项允许我们创建 DataFrame 的子集。我们使用之前的 DataFrame，并在两个指定日期之间进行过滤。

#### Rust 示例代码

下面的示例展示了如何使用 Polars 和 Rust 进行数据过滤操作。我们将基于两个指定日期对 DataFrame 进行过滤。

```rust
use polars::prelude::*;
use chrono::NaiveDate;

let start_date = NaiveDate::from_ymd(2025, 12, 2).and_hms(0, 0, 0); // 定义开始日期
let end_date = NaiveDate::from_ymd(2025, 12, 3).and_hms(0, 0, 0);   // 定义结束日期

let out = df.clone().lazy().filter( // 创建 DataFrame 的一个副本，并进入惰性计算模式
    col("c").gt_eq(lit(start_date)) // 过滤条件：列 "c" 的值大于等于开始日期
    .and(col("c").lt_eq(lit(end_date))) // 过滤条件：列 "c" 的值小于等于结束日期
).collect()?; // 收集结果并执行计算

println!("{}", out); // 打印过滤后的 DataFrame

```

**注意。**在这里`lit()` 全称是 `literal`。在 Polars 中，`lit()` 函数用于将一个常量值转换为 Polars 表达式，使其可以在查询中使用。

示例代码的输出示例如下：

```markdown
shape: (2, 4)
┌─────┬──────────┬─────────────────────┬─────┐
│ a ┆ b ┆ c ┆ d │
│ --- ┆ --- ┆ --- ┆ --- │
│ i64 ┆ f64 ┆ datetime[μs] ┆ f64 │
╞═════╪══════════╪═════════════════════╪═════╡
│ 1 ┆ 0.596863 ┆ 2025-12-02 00:00:00 ┆ 2.0 │
│ 2 ┆ 0.691304 ┆ 2025-12-03 00:00:00 ┆ NaN │
└─────┴──────────┴─────────────────────┴─────┘
```

你还可以创建包含多个列的更复杂的过滤器。

#### Rust 示例代码

下面的示例展示了如何使用 Polars 和 Rust 进行数据过滤操作。我们将基于一个条件对 DataFrame 进行过滤。

```rust
use polars::prelude::*;

let out = df.clone().lazy().filter(
    col("a").lt_eq(3) // 过滤条件：列 "a" 的值小于或等于 3
    .and(col("d").is_not_null()) // 过滤条件：列 "d" 的值不是空值
).collect()?; // 收集结果并执行计算

println!("{}", out); // 打印过滤后的 DataFrame
```

输出示例：

```markdown
shape: (3, 4)
┌─────┬──────────┬─────────────────────┬───────┐
│ a ┆ b ┆ c ┆ d │
│ --- ┆ --- ┆ --- ┆ --- │
│ i64 ┆ f64 ┆ datetime[μs] ┆ f64 │
╞═════╪══════════╪═════════════════════╪═══════╡
│ 0 ┆ 0.10666 ┆ 2025-12-01 00:00:00 ┆ 1.0 │
│ 1 ┆ 0.596863 ┆ 2025-12-02 00:00:00 ┆ 2.0 │
│ 3 ┆ 0.906636 ┆ 2025-12-04 00:00:00 ┆ -42.0 │
└─────┴──────────┴─────────────────────┴───────┘
```

#### 23.2.3.3 添加列（Add Columns）

`with_columns` 允许你为分析创建新列。我们将创建两个新列 `e` 和 `b+42`。首先，我们将列 `b` 的所有值求和并存储在新列 `e` 中。然后我们将列 `b` 的值加上 42，并将结果存储在新列 `b+42` 中。

#### Rust 示例代码

```rust
use polars::prelude::*;

// 创建新的列
let out = df
    .clone() // 克隆 DataFrame
    .lazy() // 进入惰性计算模式
    .with_columns([
        col("b").sum().alias("e"), // 新列 e：列 b 的所有值求和
        (col("b") + lit(42)).alias("b+42"), // 新列 b+42：列 b 的值加 42
    ])
    .collect()?; // 收集结果并执行计算

println!("{}", out); // 打印结果
```

输出示例：

```bash
shape: (5, 6)
┌─────┬──────────┬─────────────────────┬───────┬──────────┬───────────┐
│ a   ┆ b        ┆ c                   ┆ d     ┆ e        ┆ b+42      │
│ --- ┆ ---      ┆ ---                 ┆ ---   ┆ ---      ┆ ---       │
│ i64 ┆ f64      ┆ datetime[μs]        ┆ f64   ┆ f64      ┆ f64       │
╞═════╪══════════╪═════════════════════╪═══════╪══════════╪═══════════╡
│ 0   ┆ 0.10666  ┆ 2025-12-01 00:00:00 ┆ 1.0   ┆ 2.402679 ┆ 42.10666  │
│ 1   ┆ 0.596863 ┆ 2025-12-02 00:00:00 ┆ 2.0   ┆ 2.402679 ┆ 42.596863 │
│ 2   ┆ 0.691304 ┆ 2025-12-03 00:00:00 ┆ NaN   ┆ 2.402679 ┆ 42.691304 │
│ 3   ┆ 0.906636 ┆ 2025-12-04 00:00:00 ┆ -42.0 ┆ 2.402679 ┆ 42.906636 │
│ 4   ┆ 0.101216 ┆ 2025-12-05 00:00:00 ┆ null  ┆ 2.402679 ┆ 42.101216 │
└─────┴──────────┴─────────────────────┴───────┴──────────┴───────────┘
```

#### 23.2.3.4 分组（Group by）

我们将创建一个新的 DataFrame 来演示分组功能。这个新的 DataFrame 包含多个“组”，我们将按这些组进行分组。

#### 创建 DataFrame

```rust
use polars::prelude::*;

// 创建 DataFrame
let df2: DataFrame = df!("x" => 0..8, "y"=> &["A", "A", "A", "B", "B", "C", "X", "X"]).expect("should not fail");
println!("{}", df2);
```

输出示例：

```bash
shape: (8, 2)
┌─────┬─────┐
│ x   ┆ y   │
│ --- ┆ --- │
│ i64 ┆ str │
╞═════╪═════╡
│ 0   ┆ A   │
│ 1   ┆ A   │
│ 2   ┆ A   │
│ 3   ┆ B   │
│ 4   ┆ B   │
│ 5   ┆ C   │
│ 6   ┆ X   │
│ 7   ┆ X   │
└─────┴─────┘
```

#### 分组并聚合

```rust
use polars::prelude::*;

// 按列 "y" 进行分组，并聚合
let out = df2.clone().lazy().group_by(["y"]).agg([len()]).collect()?;
println!("{}", out);
```

输出示例：

```bash
shape: (4, 2)
┌─────┬─────┐
│ y   ┆ len │
│ --- ┆ --- │
│ str ┆ u32 │
╞═════╪═════╡
│ A   ┆ 3   │
│ B   ┆ 2   │
│ C   ┆ 1   │
│ X   ┆ 2   │
└─────┴─────┘
```

```rust
use polars::prelude::*;

// 按列 "y" 进行分组，并聚合多个统计量
let out = df2
    .clone()
    .lazy()
    .group_by(["y"])
    .agg([col("*").count().alias("count"), col("*").sum().alias("sum")])
    .collect()?;
println!("{}", out);
```

输出示例：

```bash
shape: (4, 3)
┌─────┬───────┬─────┐
│ y   ┆ count ┆ sum │
│ --- ┆ ---   ┆ --- │
│ str ┆ u32   ┆ i64 │
╞═════╪═══════╪═════╡
│ A   ┆ 3     ┆ 3   │
│ B   ┆ 2     ┆ 7   │
│ C   ┆ 1     ┆ 5   │
│ X   ┆ 2     ┆ 13  │
└─────┴───────┴─────┘
```

#### 23.2.3.5 组合操作

以下示例展示了如何组合操作来创建所需的 DataFrame。

#### 创建并选择列（排除c、d列）

```rust
use polars::prelude::*;

// 创建新列并选择
let out = df
    .clone()
    .lazy()
    .with_columns([(col("a") * col("b")).alias("a * b")])
    .select([col("*").exclude(["c", "d"])])
    .collect()?;
println!("{}", out);
```

输出示例：

```bash
shape: (5, 3)
┌─────┬──────────┬──────────┐
│ a   ┆ b        ┆ a * b    │
│ --- ┆ ---      ┆ ---      │
│ i64 ┆ f64      ┆ f64      │
╞═════╪══════════╪══════════╡
│ 0   ┆ 0.10666  ┆ 0.0      │
│ 1   ┆ 0.596863 ┆ 0.596863 │
│ 2   ┆ 0.691304 ┆ 1.382607 │
│ 3   ┆ 0.906636 ┆ 2.719909 │
│ 4   ┆ 0.101216 ┆ 0.404864 │
└─────┴──────────┴──────────┘
```

#### 创建并选择列（排除d列）

```rust
use polars::prelude::*;

// 创建新列并选择
let out = df
    .clone()
    .lazy()
    .with_columns([(col("a") * col("b")).alias("a * b")])
    .select([col("*").exclude(["d"])])
    .collect()?;
println!("{}", out);
```

输出示例：

```bash
shape: (5, 4)
┌─────┬──────────┬─────────────────────┬──────────┐
│ a   ┆ b        ┆ c                   ┆ a * b    │
│ --- ┆ ---      ┆ ---                 ┆ ---      │
│ i64 ┆ f64      ┆ datetime[μs]        ┆ f64      │
╞═════╪══════════╪═════════════════════╪══════════╡
│ 0   ┆ 0.10666  ┆ 2025-12-01 00:00:00 ┆ 0.0      │
│ 1   ┆ 0.596863 ┆ 2025-12-02 00:00:00 ┆ 0.596863 │
│ 2   ┆ 0.691304 ┆ 2025-12-03 00:00:00 ┆ 1.382607 │
│ 3   ┆ 0.906636 ┆ 2025-12-04 00:00:00 ┆ 2.719909 │
│ 4   ┆ 0.101216 ┆ 2025-12-05 00:00:00 ┆ 0.404864 │
└─────┴──────────┴─────────────────────┴──────────┘
```

### 23.2.4 合并 DataFrames

根据使用情况，DataFrames 可以通过两种方式进行合并：`join` 和 `concat`。

#### 23.2.4.1 连接（Join）

#### 数据表连接类型详解

在数据分析中，连接（Join）操作用于将两个 DataFrames 合并。Polars 支持多种连接类型，包括左连接（Left Join）、右连接（Right Join）、内连接（Inner Join）和外连接（Outer Join）。以下是每种连接类型的详细介绍和示例。

#### 左连接（Left Join）

左连接返回左表中的所有行以及与右表中匹配的行。如果右表中没有匹配的行，则结果中的相应列为 NULL。

```rust
use polars::prelude::*;
use rand::Rng;

let mut rng = rand::thread_rng();

let df1: DataFrame = df!(
    "a" => 0..8,
    "b" => (0..8).map(|_| rng.gen::<f64>()).collect::<Vec<f64>>()
).unwrap();

let df2: DataFrame = df!(
    "x" => 0..8,
    "y" => &["A", "A", "A", "B", "B", "C", "X", "X"]
).unwrap();

let joined = df1.join(&df2, ["a"], ["x"], JoinType::Left.into())?;
println!("{}", joined);
```

输出示例：

```bash
shape: (8, 4)
┌─────┬──────────┬───────┬─────┐
│ a   ┆ b        ┆ x     ┆ y   │
│ --- ┆ ---      ┆ ---   ┆ --- │
│ i64 ┆ f64      ┆ i64   ┆ str │
╞═════╪══════════╪═══════╪═════╡
│ 0   ┆ 0.495791 ┆ 0     ┆ A   │
│ 1   ┆ 0.786293 ┆ 1     ┆ A   │
│ 2   ┆ 0.847485 ┆ 2     ┆ A   │
│ 3   ┆ 0.839398 ┆ 3     ┆ B   │
│ 4   ┆ 0.060646 ┆ 4     ┆ B   │
│ 5   ┆ 0.251472 ┆ 5     ┆ C   │
│ 6   ┆ 0.13899  ┆ 6     ┆ X   │
│ 7   ┆ 0.676241 ┆ 7     ┆ X   │
└─────┴──────────┴───────┴─────┘
```

#### 右连接（Right Join）

右连接返回右表中的所有行以及与左表中匹配的行。如果左表中没有匹配的行，则结果中的相应列为 NULL。

```rust
let joined = df1.join(&df2, ["a"], ["x"], JoinType::Right.into())?;
println!("{}", joined);
```

#### 内连接（Inner Join）

内连接仅返回两个表中匹配的行。如果没有匹配的行，则该行不出现在结果中。

```rust
let joined = df1.join(&df2, ["a"], ["x"], JoinType::Inner.into())?;
println!("{}", joined);
```

#### 外连接（Outer Join）

外连接返回两个表中的所有行。如果一张表中没有匹配的行，则结果中的相应列为 NULL。

```rust
let joined = df1.join(&df2, ["a"], ["x"], JoinType::Outer.into())?;
println!("{}", joined);
```

#### 示例代码解释

1. **数据生成**：

   ```rust
   let df1: DataFrame = df!(
       "a" => 0..8,
       "b" => (0..8).map(|_| rng.gen::<f64>()).collect::<Vec<f64>>()
   ).unwrap();

   let df2: DataFrame = df!(
       "x" => 0..8,
       "y" => &["A", "A", "A", "B", "B", "C", "X", "X"]
   ).unwrap();
   ```

   这段代码创建了两个 DataFrames，`df1` 包含列 `a` 和 `b`，`df2` 包含列 `x` 和 `y`。

2. **连接操作**：

   ```rust
   let joined = df1.join(&df2, ["a"], ["x"], JoinType::Left.into())?;
   println!("{}", joined);
   ```

   这段代码执行了左连接，结果包含 `df1` 中的所有行以及 `df2` 中匹配的行。

通过这些示例，你可以更好地理解如何在 Rust 中使用 Polars 进行不同类型的连接操作。

#### 23.2.4.2 粘连（Concat）

我们也可以粘连两个 DataFrames。垂直粘连会使 DataFrame 变长，水平粘连会使 DataFrame 变宽。以下示例展示了水平粘连两个 DataFrames 的结果。

#### Rust 示例代码

```rust
use polars::prelude::*;

// 水平连接两个 DataFrames
let stacked = df.hstack(df2.get_columns())?;
println!("{}", stacked); // 打印连接后的 DataFrame
```

输出示例：

```bash
shape: (8, 5)
┌─────┬──────────┬───────┬─────┬─────┐
│ a   ┆ b        ┆ d     ┆ x   ┆ y   │
│ --- ┆ ---      ┆ ---   ┆ --- ┆ --- │
│ i64 ┆ f64      ┆ f64   ┆ i64 ┆ str │
╞═════╪══════════╪═══════╪═════╪═════╡
│ 0   ┆ 0.495791 ┆ 1.0   ┆ 0   ┆ A   │
│ 1   ┆ 0.786293 ┆ 2.0   ┆ 1   ┆ A   │
│ 2   ┆ 0.847485 ┆ NaN   ┆ 2   ┆ A   │
│ 3   ┆ 0.839398 ┆ NaN   ┆ 3   ┆ B   │
│ 4   ┆ 0.060646 ┆ 0.0   ┆ 4   ┆ B   │
│ 5   ┆ 0.251472 ┆ -5.0  ┆ 5   ┆ C   │
│ 6   ┆ 0.13899  ┆ -42.0 ┆ 6   ┆ X   │
│ 7   ┆ 0.676241 ┆ null  ┆ 7   ┆ X   │
└─────┴──────────┴───────┴─────┴─────┘
```

通过上述学习，你可以在 Rust 中使用 Polars 方便地进行 DataFrame 的连接和粘连。

### 23.2.5 基本数据类型

Polars 完全基于 Arrow 数据类型，并由 Arrow 内存数组支持。这使得数据处理缓存效率高，并且支持进程间通信。大多数数据类型完全遵循 Arrow 的实现，除了 String（实际上是 LargeUtf8）、Categorical 和 Object（支持有限）。数据类型如下：

#### 数值类型

- Int8：8 位有符号整数。
- Int16：16 位有符号整数。
- Int32：32 位有符号整数。
- Int64：64 位有符号整数。
- UInt8：8 位无符号整数。
- UInt16：16 位无符号整数。
- UInt32：32 位无符号整数。
- UInt64：64 位无符号整数。
- Float32：32 位浮点数。
- Float64：64 位浮点数。

#### 嵌套类型

- Struct：结构体数组，表示为 `Vec<Series>`，用于在单列中打包多个/异质值。
- List：列表数组，包含一个子数组和一个偏移数组（实际上是 Arrow LargeList）。

#### 时间类型

- Date：日期表示，内部表示为自 UNIX 纪元以来的天数，编码为 32 位有符号整数。
- Datetime：日期时间表示，内部表示为自 UNIX 纪元以来的微秒数，编码为 64 位有符号整数。
- Duration：时间间隔类型，内部表示为微秒。由 Date/Datetime 相减生成。
- Time：时间表示，内部表示为自午夜以来的纳秒数。

#### 其他类型

- Boolean：布尔类型，有效位打包。
- String：字符串数据（实际上是 Arrow LargeUtf8）。
- Binary：存储为字节的数据。
- Object：有限支持的数据类型，可以是任何值。
- Categorical：字符串集合的分类编码。
- Enum：字符串集合的固定分类编码。

#### 浮点数

Polars 通常遵循 IEEE 754 浮点标准用于 Float32 和 Float64，但有一些例外：

- 任何 NaN 与任何其他 NaN 比较时相等，并且大于任何非 NaN 值。
- 操作不保证零或 NaN 的符号，也不保证 NaN 值的有效负载。这不仅限于算术运算，例如排序或分组操作可能将所有零规范化为 +0，将所有 NaNs 规范化为没有负载的正 NaN，以便高效的相等性检查。

Polars 始终尝试提供合理准确的浮点计算结果，但除非另有说明，否则不保证误差。通常 100% 准确的结果获取代价高昂（需要比 64 位浮点数更大的内部表示），因此总会存在一些误差。

---

#### 示例

#### 数值类型示例

```rust
use polars::prelude::*;

let df = df! {
    "int8_col" => &[1i8, 2, 3],
    "int16_col" => &[100i16, 200, 300],
    "int32_col" => &[1000i32, 2000, 3000],
    "float64_col" => &[1.1f64, 2.2, 3.3],
}.unwrap();

println!("{}", df);
```

#### 嵌套类型示例

```rust
use polars::prelude::*;

let df = df! {
    "list_col" => &[vec![1, 2, 3], vec![4, 5, 6]],
}.unwrap();

println!("{}", df);
```

#### 时间类型示例

```rust
use polars::prelude::*;
use chrono::NaiveDate;

let df = df! {
    "date_col" => &[NaiveDate::from_ymd(2021, 1, 1), NaiveDate::from_ymd(2021, 1, 2)],
}.unwrap();

println!("{}", df);
```

通过这些示例，你可以了解如何在 Rust 中使用 Polars 处理各种数据类型。

### 23.2.6 数据结构

#### 数据结构

Polars 提供的核心数据结构是 Series 和 DataFrame。

##### Series

Series 是一维数据结构，其中所有元素具有相同的数据类型。以下代码展示了如何创建一个简单的 Series 对象：

```rust
use polars::prelude::*;

// 创建名为 "a" 的 Series 对象
let s = Series::new("a", &[1, 2, 3, 4, 5]);

// 打印 Series 对象
println!("{}", s);
```

输出示例：

```bash
shape: (5,)
Series: 'a' [i64]
[
    1
    2
    3
    4
    5
]
```

##### DataFrame

DataFrame 是由 Series 支持的二维数据结构，可以看作是一系列 Series 的抽象集合。可以对 DataFrame 执行类似 SQL 查询的操作，如 GROUP BY、JOIN、PIVOT 等，还可以定义自定义函数。

```rust
use chrono::NaiveDate;
use polars::prelude::*;

// 创建一个 DataFrame 对象
let df: DataFrame = df!(
    "integer" => &[1, 2, 3, 4, 5],
    "date" => &[
        NaiveDate::from_ymd_opt(2025, 1, 1).unwrap().and_hms_opt(0, 0, 0).unwrap(),
        NaiveDate::from_ymd_opt(2025, 1, 2).unwrap().and_hms_opt(0, 0, 0).unwrap(),
        NaiveDate::from_ymd_opt(2025, 1, 3).unwrap().and_hms_opt(0, 0, 0).unwrap(),
        NaiveDate::from_ymd_opt(2025, 1, 4).unwrap().and_hms_opt(0, 0, 0).unwrap(),
        NaiveDate::from_ymd_opt(2025, 1, 5).unwrap().and_hms_opt(0, 0, 0).unwrap(),
    ],
    "float" => &[4.0, 5.0, 6.0, 7.0, 8.0]
)
.unwrap();

// 打印 DataFrame 对象
println!("{}", df);
```

输出示例：

```bash
shape: (5, 3)
┌─────────┬─────────────────────┬───────┐
│ integer ┆ date                ┆ float │
│ ---     ┆ ---                 ┆ ---   │
│ i64     ┆ datetime[μs]        ┆ f64   │
╞═════════╪═════════════════════╪═══════╡
│ 1       ┆ 2022-01-01 00:00:00 ┆ 4.0   │
│ 2       ┆ 2022-01-02 00:00:00 ┆ 5.0   │
│ 3       ┆ 2022-01-03 00:00:00 ┆ 6.0   │
│ 4       ┆ 2022-01-04 00:00:00 ┆ 7.0   │
│ 5       ┆ 2022-01-05 00:00:00 ┆ 8.0   │
└─────────┴─────────────────────┴───────┘
```

#### 查看数据

以下部分将介绍如何查看 DataFrame 中的数据。我们将使用前面的 DataFrame 作为示例。

##### Head

`head` 函数默认显示 DataFrame 的前 5 行。你可以指定要查看的行数（例如 `df.head(10)`）。

```rust
let df_head = df.head(Some(3));

// 打印前 3 行数据
println!("{}", df_head);
```

输出示例：

```bash
shape: (3, 3)
┌─────────┬─────────────────────┬───────┐
│ integer ┆ date                ┆ float │
│ ---     ┆ ---                 ┆ ---   │
│ i64     ┆ datetime[μs]        ┆ f64   │
╞═════════╪═════════════════════╪═══════╡
│ 1       ┆ 2022-01-01 00:00:00 ┆ 4.0   │
│ 2       ┆ 2022-01-02 00:00:00 ┆ 5.0   │
│ 3       ┆ 2022-01-03 00:00:00 ┆ 6.0   │
└─────────┴─────────────────────┴───────┘
```

##### Tail

`tail` 函数显示 DataFrame 的最后 5 行。你也可以指定要查看的行数，类似于 `head`。

```rust
let df_tail = df.tail(Some(3));

// 打印后 3 行数据
println!("{}", df_tail);
```

输出示例：

```bash
shape: (3, 3)
┌─────────┬─────────────────────┬───────┐
│ integer ┆ date                ┆ float │
│ ---     ┆ ---                 ┆ ---   │
│ i64     ┆ datetime[μs]        ┆ f64   │
╞═════════╪═════════════════════╪═══════╡
│ 3       ┆ 2022-01-03 00:00:00 ┆ 6.0   │
│ 4       ┆ 2022-01-04 00:00:00 ┆ 7.0   │
│ 5       ┆ 2022-01-05 00:00:00 ┆ 8.0   │
└─────────┴─────────────────────┴───────┘
```

##### Sample

如果你想随机查看 DataFrame 中的一些数据，你可以使用 `sample`。`sample` 可以从 DataFrame 中获取 n 行随机行。

```rust
use polars::prelude::*;

let n = Series::new("", &[2]);
let sampled_df = df.sample_n(&n, false, false, None).unwrap();

// 打印随机抽样的数据
println!("{}", sampled_df);
```

输出示例：

```bash
shape: (2, 3)
┌─────────┬─────────────────────┬───────┐
│ integer ┆ date                ┆ float │
│ ---     ┆ ---                 ┆ ---   │
│ i64     ┆ datetime[μs]        ┆ f64   │
╞═════════╪═════════════════════╪═══════╡
│ 3       ┆ 2022-01-03 00:00:00 ┆ 6.0   │
│ 2       ┆ 2022-01-02 00:00:00 ┆ 5.0   │
└─────────┴─────────────────────┴───────┘
```

##### 描述（Describe）

`describe` 返回 DataFrame 的摘要统计信息。如果可能，它将提供一些快速统计信息。

注意，很遗憾，在 Rust 中，这个功能目前不可用。

## 23.3 Polars进阶学习

### 23.3.1 聚合操作 Aggregation

### 聚合操作在量化金融中的应用

Polars 实现了强大的语法，既可以在惰性 API 中定义，也可以在急性 API 中定义。让我们看一下这意味着什么。

我们可以从一个简单的期货和期权交易数据集开始。

```rust
use std::io::Cursor;
use reqwest::blocking::Client;
use polars::prelude::*;

let url = "https://example.com/financial-data.csv";

let mut schema = Schema::new();
schema.with_column(
    "symbol".into(),
    DataType::Categorical(None, Default::default()),
);
schema.with_column(
    "type".into(),
    DataType::Categorical(None, Default::default()),
);
schema.with_column(
    "trade_date".into(),
    DataType::Date,
);
schema.with_column(
    "open".into(),
    DataType::Float64,
);
schema.with_column(
    "close".into(),
    DataType::Float64,
);
schema.with_column(
    "volume".into(),
    DataType::Float64,
);

let data: Vec<u8> = Client::new().get(url).send()?.text()?.bytes().collect();

let dataset = CsvReadOptions::default()
    .with_has_header(true)
    .with_schema(Some(Arc::new(schema)))
    .map_parse_options(|parse_options| parse_options.with_try_parse_dates(true))
    .into_reader_with_file_handle(Cursor::new(data))
    .finish()?;

println!("{}", &dataset);
```

#### 基本聚合

我们可以按 `symbol` 和 `type` 分组，并计算每组的成交量总和、开盘价和收盘价的平均值。

```rust
let df = dataset
    .clone()
    .lazy()
    .group_by(["symbol", "type"])
    .agg([
        sum("volume").alias("total_volume"),
        mean("open").alias("avg_open"),
        mean("close").alias("avg_close"),
    ])
    .sort(
        ["total_volume"],
        SortMultipleOptions::default()
            .with_order_descending(true)
            .with_nulls_last(true),
    )
    .limit(5)
    .collect()?;

println!("{}", df);
```

#### 条件聚合

我们想知道每个交易日中涨幅超过5%的交易记录数。可以直接在聚合中查询：

```rust
let df = dataset
    .clone()
    .lazy()
    .group_by(["trade_date"])
    .agg([
        (col("close") - col("open")).gt(lit(0.05)).sum().alias("gains_over_5pct"),
    ])
    .sort(
        ["gains_over_5pct"],
        SortMultipleOptions::default().with_order_descending(true),
    )
    .limit(5)
    .collect()?;

println!("{}", df);
```

#### 嵌套分组

在嵌套分组中，表达式在组内工作，因此可以生成任意长度的结果。例如，我们想按 `symbol` 和 `type` 分组，并计算每组的交易量总和和记录数：

```rust
let df = dataset
    .clone()
    .lazy()
    .group_by(["symbol", "type"])
    .agg([
        col("volume").sum().alias("total_volume"),
        col("symbol").count().alias("record_count"),
    ])
    .sort(
        ["total_volume"],
        SortMultipleOptions::default()
            .with_order_descending(true)
            .with_nulls_last(true),
    )
    .limit(5)
    .collect()?;

println!("{}", df);
```

#### 过滤组内数据

我们可以计算每个交易日的平均涨幅，但不包含成交量低于 1000 的交易记录：

```rust
fn compute_change() -> Expr {
    (col("close") - col("open")) / col("open") * lit(100)
}

fn avg_change_with_volume_filter() -> Expr {
    compute_change()
        .filter(col("volume").gt(lit(1000)))
        .mean()
        .alias("avg_change_filtered")
}

let df = dataset
    .clone()
    .lazy()
    .group_by(["trade_date"])
    .agg([
        avg_change_with_volume_filter(),
        col("volume").sum().alias("total_volume"),
    ])
    .limit(5)
    .collect()?;

println!("{}", df);
```

#### 排序

我们可以按交易日期排序，并按 `symbol` 分组以获得每个 `symbol` 的最高和最低收盘价：

```rust
fn get_price_range() -> Expr {
    col("close")
}

let df = dataset
    .clone()
    .lazy()
    .sort(
        ["trade_date"],
        SortMultipleOptions::default()
            .with_order_descending(true)
            .with_nulls_last(true),
    )
    .group_by(["symbol"])
    .agg([
        get_price_range().max().alias("max_close"),
        get_price_range().min().alias("min_close"),
    ])
    .limit(5)
    .collect()?;

println!("{}", df);
```

我们还可以在 `group_by` 上下文中按另一列排序：

```rust
let df = dataset
    .clone()
    .lazy()
    .sort(
        ["trade_date"],
        SortMultipleOptions::default()
            .with_order_descending(true)
            .with_nulls_last(true),
    )
    .group_by(["symbol"])
    .agg([
        get_price_range().max().alias("max_close"),
        get_price_range().min().alias("min_close"),
        col("type")
            .sort_by(["symbol"], SortMultipleOptions::default())
            .first()
            .alias("first_type"),
    ])
    .sort(["symbol"], SortMultipleOptions::default())
    .limit(5)
    .collect()?;

println!("{}", df);
```

### 23.3.2 Folds

### Folds

Polars 提供了一些用于横向聚合的表达式和方法，如 sum、min、mean 等。然而，当你需要更复杂的聚合时，Polars 默认的方法可能不够用。这时，折叠（fold）操作就派上用场了。

折叠表达式在列上操作，最大限度地提高了速度。它非常高效地利用数据布局，并且通常具有向量化执行的特点。

#### 手动求和

我们从一个示例开始，通过折叠实现求和操作。

```rust
use polars::prelude::*;

let df = df!(
    "price" => &[100, 200, 300],
    "quantity" => &[2, 3, 4],
)?;

let out = df
    .lazy()
    .select([fold_exprs(lit(0), |acc, x| (acc + x).map(Some), [col("*")]).alias("sum")])
    .collect()?;
println!("{}", out);

shape: (3, 1)
┌─────┐
│ sum │
│ --- │
│ i64 │
╞═════╡
│ 102 │
│ 203 │
│ 304 │
└─────┘
```

上述代码递归地将函数 `f(acc, x) -> acc` 应用到累加器 `acc` 和新列 `x` 上。这个函数单独在列上操作，可以利用缓存效率和向量化执行。

#### 条件聚合

如果你想对 DataFrame 中的所有列应用条件或谓词，折叠操作可以非常简洁地表达这种需求。

```rust
let df = df!(
    "price" => &[100, 200, 300],
    "quantity" => &[2, 3, 4],
)?;

let out = df
    .lazy()
    .filter(fold_exprs(
        lit(true),
        |acc, x| acc.bitand(&x).map(Some),
        [col("*").gt(150)],
    ))
    .collect()?;
println!("{}", out);

shape: (1, 2)
┌───────┬─────────┐
│ price ┆ quantity│
│ ----- ┆ ------- │
│ i64   ┆ i64     │
╞═══════╪═════════╡
│ 300   ┆ 4       │
└───────┴─────────┘
```

在上述代码片段中，我们过滤出所有列值大于 150 的行。

#### 折叠和字符串数据

折叠可以用来连接字符串数据。然而，由于中间列的物化，这种操作的复杂度会呈平方级增长。因此，我们推荐使用 `concat_str` 表达式来完成这类操作。

```rust
use polars::prelude::*;

let df = df!(
    "symbol" => &["AAPL", "GOOGL", "AMZN"],
    "price" => &[150, 2800, 3400],
)?;

let out = df
    .lazy()
    .select([concat_str([col("symbol"), col("price")], "", false).alias("combined")])
    .collect()?;
println!("{:?}", out);

shape: (3, 1)
┌───────────┐
│ combined  │
│ ---       │
│ str       │
╞═══════════╡
│ AAPL150   │
│ GOOGL2800 │
│ AMZN3400  │
└───────────┘
```

通过使用 `concat_str` 表达式，我们可以高效地连接字符串数据，避免了复杂的操作。

### 23.3.3 CSV input

### CSV

#### 读取与写入

读取CSV文件的方式很常见：

```rust
use polars::prelude::*;

let df = CsvReadOptions::default()
    .try_into_reader_with_file_path(Some("docs/data/path.csv".into()))
    .unwrap()
    .finish()
    .unwrap();
```

在这个示例中，我们使用`CsvReadOptions`来设置CSV读取选项，然后将文件路径传递给`try_into_reader_with_file_path`方法，最终通过`finish`方法完成读取并获取DataFrame。

写入CSV文件使用`write_csv`函数：

```rust
use polars::prelude::*;

let mut df = df!(
    "foo" => &[1, 2, 3],
    "bar" => &[None, Some("bak"), Some("baz")],
).unwrap();

let mut file = std::fs::File::create("docs/data/path.csv").unwrap();
CsvWriter::new(&mut file).finish(&mut df).unwrap();
```

在这个示例中，我们创建一个DataFrame并将其写入指定路径的CSV文件中。

#### 扫描 CSV

Polars允许你扫描CSV输入。扫描延迟了文件的实际解析，返回一个名为LazyFrame的惰性计算持有者。

```rust
use polars::prelude::*;

let lf = LazyCsvReader::new("./test.csv").finish().unwrap();
```

使用`LazyCsvReader`，可以在不立即解析文件的情况下处理CSV输入，这对优化性能有很大帮助。

### 教程总结

#### 读取 CSV 文件

1. 导入Polars库。
2. 使用`CsvReadOptions`配置CSV读取选项。
3. 调用`try_into_reader_with_file_path`方法传入文件路径。
4. 使用`finish`方法完成读取并获取DataFrame。

#### 写入 CSV 文件

1. 创建一个DataFrame对象。
2. 使用`std::fs::File::create`创建文件。
3. 使用`CsvWriter`将DataFrame写入CSV文件。

#### 扫描 CSV 文件

1. 使用`LazyCsvReader`延迟解析CSV文件。
2. 使用`finish`方法获取LazyFrame。

通过以上方法，可以高效地读取、写入和扫描CSV文件，极大地提升数据处理的性能和灵活性。

### 参考代码示例

#### 读取 CSV 文件

```rust
use polars::prelude::*;

let df = CsvReadOptions::default()
    .try_into_reader_with_file_path(Some("docs/data/path.csv".into()))
    .unwrap()
    .finish()
    .unwrap();
println!("{}", df);
```

#### 写入 CSV 文件

```rust
use polars::prelude::*;

let mut df = df!(
    "foo" => &[1, 2, 3],
    "bar" => &[None, Some("bak"), Some("baz")],
).unwrap();

let mut file = std::fs::File::create("docs/data/path.csv").unwrap();
CsvWriter::new(&mut file).finish(&mut df).unwrap();
```

#### 扫描 CSV 文件

```rust
use polars::prelude::*;

let lf = LazyCsvReader::new("./test.csv").finish().unwrap();
println!("{:?}", lf);
```

通过上述步骤，用户可以轻松掌握在Rust中使用Polars处理CSV文件的基本方法。

### 23.3.4 JSON input

### JSON 文件

Polars 可以读取和写入标准 JSON 和换行分隔的 JSON (NDJSON)。

#### 读取

##### 标准 JSON

读取 JSON 文件的方式如下：

```rust
use polars::prelude::*;
let mut file = std::fs::File::open("docs/data/path.json").unwrap();
let df = JsonReader::new(&mut file).finish().unwrap();
```

##### 换行分隔的 JSON

Polars 可以更高效地读取 NDJSON 文件：

```rust
use polars::prelude::*;
let mut file = std::fs::File::open("docs/data/path.json").unwrap();
let df = JsonLineReader::new(&mut file).finish().unwrap();
```

#### 写入

将 DataFrame 写入 JSON 文件：

```rust
use polars::prelude::*;
let mut df = df!(
    "foo" => &[1, 2, 3],
    "bar" => &[None, Some("bak"), Some("baz")],
).unwrap();
let mut file = std::fs::File::create("docs/data/path.json").unwrap();

// 写入标准 JSON
JsonWriter::new(&mut file)
    .with_json_format(JsonFormat::Json)
    .finish(&mut df)
    .unwrap();

// 写入 NDJSON
JsonWriter::new(&mut file)
    .with_json_format(JsonFormat::JsonLines)
    .finish(&mut df)
    .unwrap();
```

#### 扫描

Polars 允许仅扫描换行分隔的 JSON 输入。扫描延迟了文件的实际解析，返回一个名为 LazyFrame 的惰性计算持有者。

```rust
use polars::prelude::*;
let lf = LazyJsonLineReader::new("docs/data/path.json")
    .finish()
    .unwrap();
```

### 23.3.5 Polars的急性和惰性模式 (Lazy / Eager API)

Polars 提供了两种操作模式：急性（Eager）和惰性（Lazy）。急性模式下，查询会立即执行，而惰性模式下，查询会在“需要”时才评估。推迟执行可以显著提升性能，因此在大多数情况下优先使用惰性 API。下面通过一个例子进行说明：

#### 急性模式示例

```rust
use polars::prelude::*;

let df = CsvReadOptions::default()
    .try_into_reader_with_file_path(Some("docs/data/iris.csv".into()))
    .unwrap()
    .finish()
    .unwrap();
let mask = df.column("sepal_length")?.f64()?.gt(5.0);
let df_small = df.filter(&mask)?;
#[allow(deprecated)]
let df_agg = df_small
    .group_by(["species"])?
    .select(["sepal_width"])
    .mean()?;
println!("{}", df_agg);
```

在这个例子中，我们使用急性 API：

1. 读取鸢尾花数据集。
2. 根据萼片长度过滤数据集。
3. 计算每个物种的萼片宽度平均值。

每一步都立即执行并返回中间结果。这可能会浪费资源，因为我们可能会执行不必要的工作或加载未使用的数据。

#### 惰性模式示例

```rust
use polars::prelude::*;

let q = LazyCsvReader::new("docs/data/iris.csv")
    .with_has_header(true)
    .finish()?
    .filter(col("sepal_length").gt(lit(5)))
    .group_by(vec![col("species")])
    .agg([col("sepal_width").mean()]);
let df = q.collect()?;
println!("{}", df);
```

在这个例子中，使用惰性 API 可以进行以下优化：

1. 谓词下推（Predicate pushdown）：在读取数据集时尽早应用过滤器，仅读取萼片长度大于 5 的行。
2. 投影下推（Projection pushdown）：在读取数据集时只选择所需的列，从而不需要加载额外的列（如花瓣长度和花瓣宽度）。

这些优化显著降低了内存和 CPU 的负载，从而允许在内存中处理更大的数据集并加快处理速度。一旦定义了查询，通过调用 `collect` 来执行它。在 Lazy API 章节中，我们将详细讨论其实现。

### 急性 API

在很多情况下，急性 API 实际上是在底层调用惰性 API，并立即收集结果。这具有在查询内部仍然可以进行查询计划优化的好处。

### 何时使用哪种模式

通常应优先使用惰性 API，除非您对中间结果感兴趣或正在进行探索性工作，并且尚不确定查询的最终形态。

### 量化金融案例

#### 急性模式示例：计算股票的简单移动平均线（SMA）

```rust
use polars::prelude::*;
use chrono::NaiveDate;

let df = df!(
    "date" => &[
        NaiveDate::from_ymd(2023, 1, 1),
        NaiveDate::from_ymd(2023, 1, 2),
        NaiveDate::from_ymd(2023, 1, 3),
        NaiveDate::from_ymd(2023, 1, 4),
        NaiveDate::from_ymd(2023, 1, 5),
    ],
    "price" => &[100.0, 101.0, 102.0, 103.0, 104.0],
)?;

let sma = df
    .clone()
    .select([col("price").rolling_mean(3, None, false, false).alias("SMA")])
    .collect()?;

println!("{}", sma);
```

#### 惰性模式示例：计算股票的加权移动平均线（WMA）

```rust
let df = df!(
    "date" => &[
        NaiveDate::from_ymd(2023, 1, 1),
        NaiveDate::from_ymd(2023, 1, 2),
        NaiveDate::from_ymd(2023, 1, 3),
        NaiveDate::from_ymd(2023, 1, 4),
        NaiveDate::from_ymd(2023, 1, 5),
    ],
    "price" => &[100.0, 101.0, 102.0, 103.0, 104.0],
)?;

let weights = vec![0.5, 0.3, 0.2];

let wma = df
    .lazy()
    .with_column(
        col("price")
            .rolling_apply(
                |s| {
                    let weighted_sum: f64 = s
                        .f64()
                        .unwrap()
                        .into_iter()
                        .zip(&weights)
                        .map(|(x, &w)| x.unwrap() * w)
                        .sum();
                    Some(weighted_sum)
                },
                3,
                polars::prelude::RollingOptions::default()
                    .min_periods(1)
                    .center(false)
                    .window_size(3)
            )
            .alias("WMA")
    )
    .collect()?;

println!("{}", wma);
```

### 23.3.6 流模式 (Streaming Mode)

Polars 引入了一个强大的功能叫做流模式（Streaming Mode），设计用于通过分块处理数据来高效处理大型数据集。该模式显著提高了数据处理任务的性能，特别是在处理无法全部装入内存的海量数据集时。

#### 流模式的关键特性

1. **基于块的处理**：Polars 以块的形式处理数据，减少内存使用，使其能够高效处理大型数据集。
2. **自动优化**：流模式包含诸如谓词下推（predicate pushdown）和投影下推（projection pushdown）等优化，以最小化处理和读取的数据量。
3. **并行执行**：Polars 利用所有可用的 CPU 核心，通过划分工作负载来加快数据处理速度。

#### 量化金融案例

考虑一个需要处理大型股票交易数据集的场景。使用 Polars 流模式，我们可以高效地从包含数百万交易记录的 CSV 文件中计算每个股票代码的平均交易价格。

##### 急性 API 示例

使用急性 API 时，操作会立即执行：

```rust
use polars::prelude::*;

let df = CsvReadOptions::default()
    .try_into_reader_with_file_path(Some("docs/data/stock_trades.csv".into()))
    .unwrap()
    .finish()
    .unwrap();

let mask = df.column("trade_price")?.f64()?.gt(100.0);
let df_filtered = df.filter(&mask)?;
#[allow(deprecated)]
let df_agg = df_filtered
    .group_by(["stock_symbol"])?
    .select(["trade_price"])
    .mean()?;
println!("{}", df_agg);
```

在这个示例中：

1. 读取数据集。
2. 基于交易价格过滤数据集。
3. 计算每个股票代码的平均交易价格。

##### 惰性 API 示例（带流模式）

使用惰性 API 并启用流模式可以延迟执行和优化：

```rust
use polars::prelude::*;

let q = LazyCsvReader::new("docs/data/stock_trades.csv")
    .with_has_header(true)
    .finish()?
    .filter(col("trade_price").gt(lit(100)))
    .group_by(vec![col("stock_symbol")])
    .agg([col("trade_price").mean()]);
let df = q.collect()?;
println!("{}", df);
```

在这个示例中：

1. 定义查询但不立即执行。
2. 查询计划器在数据扫描期间应用优化，如过滤和选择列。
3. 查询以块的形式执行，减少内存使用并提高性能。

#### 配置块大小

默认块大小由列数和可用线程数决定，但可以手动设置以进一步优化性能：

```rust
use polars::prelude::*;

pl::Config::set_streaming_chunk_size(50000);

let q = LazyCsvReader::new("docs/data/stock_trades.csv")
    .with_has_header(true)
    .finish()?
    .filter(col("trade_price").gt(lit(100)))
    .group_by(vec![col("stock_symbol")])
    .agg([col("trade_price").mean()]);
let df = q.collect()?;
println!("{}", df);
```

设置块大小有助于根据具体需求和硬件能力平衡内存使用和处理速度。

### 流模式的优势

1. **内存效率**：通过分块处理数据，显著减少内存使用。
2. **速度**：并行执行和查询优化加快了数据处理速度。
3. **可扩展性**：通过从磁盘中分块流式传输数据，处理超过内存限制的大型数据集。

Polars 流模式在量化金融中尤其有用，因为大量数据集很常见，高效的数据处理对于及时分析和决策至关重要。

### 使用流模式执行查询

Polars 支持通过传递 `streaming=True` 参数到 `collect` 方法，以流方式执行查询。

```rust
use polars::prelude::*;

let q1 = LazyCsvReader::new("docs/data/iris.csv")
    .with_has_header(true)
    .finish()?
    .filter(col("sepal_length").gt(lit(5)))
    .group_by(vec![col("species")])
    .agg([col("sepal_width").mean()]);

let df = q1.clone().with_streaming(true).collect()?;
println!("{}", df);
```

#### 何时可用流模式？

流模式仍在开发中。我们可以请求 Polars 以流模式执行任何惰性查询，但并非所有惰性操作都支持流模式。如果某个操作不支持流模式，Polars 将在非流模式下运行查询。

流模式支持许多操作，包括：

- 过滤、切片、头、尾
- with_columns、select
- group_by
- 连接
- 唯一
- 排序
- 爆炸、反透视
- scan_csv、scan_parquet、scan_ipc

这个列表并不详尽。Polars 正在积极开发中，更多操作可能会在没有明确通知的情况下添加。

#### 示例（带支持操作）

要确定查询的哪些部分是流式的，可以使用 `explain` 方法。以下是一个演示如何检查查询计划的示例：

```rust
use polars::prelude::*;

let query_plan = q1.with_streaming(true).explain(true)?;
println!("{}", query_plan);

STREAMING:
  AGGREGATE
    [col("sepal_width").mean()] BY [col("species")] FROM
    Csv SCAN [docs/data/iris.csv]
    PROJECT 3/5 COLUMNS
    SELECTION: [(col("sepal_length")) > (5.0)]
```

#### 示例（带非流式操作）

```rust
use polars::prelude::*;

let q2 = LazyCsvReader::new("docs/data/iris.csv")
    .finish()?
    .with_columns(vec![col("sepal_length")
        .mean()
        .over(vec![col("species")])
        .alias("sepal_length_mean")]);

let query_plan = q2.with_streaming(true).explain(true)?;
println!("{}", query_plan);

WITH_COLUMNS:
[col("sepal_length").mean().over([col("species")])]
STREAMING:
Csv SCAN [docs/data/iris.csv]
PROJECT */5 COLUMNS
```

### 23.3.7 缺失值处理 Missing Values

本页面介绍了在 Polars 中如何表示缺失数据以及如何填充缺失数据。

### null 和 NaN 值

在 Polars 中，每个 DataFrame（或 Series）中的列都是一个 Arrow 数组或基于 Apache Arrow 规范的 Arrow 数组集合。缺失数据在 Arrow 和 Polars 中用 null 值表示。这种 null 缺失值适用于所有数据类型，包括数值型数据。

此外，Polars 还允许在浮点数列中使用 NaN（非数值）值。NaN 值被视为浮点数据类型的一部分，而不是缺失数据。我们将在下面单独讨论 NaN 值。

可以使用 Rust 中的 `None` 值手动定义缺失值：

```rust
use polars::prelude::*;

let df = df!(
    "value" => &[Some(1), None],
)?;

println!("{}", &df);

shape: (2, 1)
┌───────┐
│ value │
│ ---   │
│ i64   │
╞═══════╡
│ 1     │
│ null  │
└───────┘
```

### 缺失数据元数据

每个由 Polars 使用的 Arrow 数组都存储了与缺失数据相关的两种元数据。这些元数据允许 Polars 快速显示有多少缺失值以及哪些值是缺失的。

第一种元数据是 `null_count`，即列中 null 值的行数：

```rust
let null_count_df = df.null_count();
println!("{}", &null_count_df);

shape: (1, 1)
┌───────┐
│ value │
│ ---   │
│ u32   │
╞═══════╡
│ 1     │
└───────┘
```

第二种元数据是一个叫做有效性位图（validity bitmap）的数组，指示每个数据值是有效的还是缺失的。有效性位图在内存中是高效的，因为它是按位编码的 - 每个值要么是 0 要么是 1。这种按位编码意味着每个数组的内存开销仅为（数组长度 / 8）字节。有效性位图由 Polars 的 `is_null` 方法使用。

可以使用 `is_null` 方法返回基于有效性位图的 Series：

```rust
let is_null_series = df
    .clone()
    .lazy()
    .select([col("value").is_null()])
    .collect()?;
println!("{}", &is_null_series);

shape: (2, 1)
┌───────┐
│ value │
│ ---   │
│ bool  │
╞═══════╡
│ false │
│ true  │
└───────┘
```

### 填充缺失数据

可以使用 `fill_null` 方法填充 Series 中的缺失数据。您需要指定希望 `fill_null` 方法如何填充缺失数据。主要有以下几种方式：

1. 使用字面值，例如 0 或 "0"
2. 使用策略，例如前向填充
3. 使用表达式，例如用另一列的值替换
4. 插值

我们通过定义一个简单的 DataFrame，其中 col2 有一个缺失值，来说明每种填充缺失值的方法：

```rust
let df = df!(
    "col1" => &[Some(1), Some(2), Some(3)],
    "col2" => &[Some(1), None, Some(3)],
)?;
println!("{}", &df);

shape: (3, 2)
┌──────┬──────┐
│ col1 ┆ col2 │
│ ---  ┆ ---  │
│ i64  ┆ i64  │
╞══════╪══════╡
│ 1    ┆ 1    │
│ 2    ┆ null │
│ 3    ┆ 3    │
└──────┴──────┘
```

#### 使用指定字面值填充

我们可以用一个指定的字面值填充缺失数据：

```rust
let fill_literal_df = df
    .clone()
    .lazy()
    .with_columns([col("col2").fill_null(lit(2))])
    .collect()?;
println!("{}", &fill_literal_df);

shape: (3, 2)
┌──────┬──────┐
│ col1 ┆ col2 │
│ ---  ┆ ---  │
│ i64  ┆ i64  │
╞══════╪══════╡
│ 1    ┆ 1    │
│ 2    ┆ 2    │
│ 3    ┆ 3    │
└──────┴──────┘
```

#### 使用策略填充

我们可以用一种策略来填充缺失数据，例如前向填充：

```rust
let fill_forward_df = df
    .clone()
    .lazy()
    .with_columns([col("col2").forward_fill(None)])
    .collect()?;
println!("{}", &fill_forward_df);

shape: (3, 2)
┌──────┬──────┐
│ col1 ┆ col2 │
│ ---  ┆ ---  │
│ i64  ┆ i64  │
╞══════╪══════╡
│ 1    ┆ 1    │
│ 2    ┆ 1    │
│ 3    ┆ 3    │
└──────┴──────┘
```

#### 使用表达式填充

为了更灵活地填充缺失数据，我们可以使用表达式。例如，用该列的中位数填充 null 值：

```rust
let fill_median_df = df
    .clone()
    .lazy()
    .with_columns([col("col2").fill_null(median("col2"))])
    .collect()?;
println!("{}", &fill_median_df);

shape: (3, 2)
┌──────┬──────┐
│ col1 ┆ col2 │
│ ---  ┆ ---  │
│ i64  ┆ f64  │
╞══════╪══════╡
│ 1    ┆ 1.0  │
│ 2    ┆ 2.0  │
│ 3    ┆ 3.0  │
└──────┴──────┘
```

在这种情况下，由于中位数是浮点数统计数据，列从整数类型转换为浮点类型。

#### 使用插值填充

此外，我们可以使用插值（不使用 `fill_null` 函数）来填充 null 值：

```rust
let fill_interpolation_df = df
    .clone()
    .lazy()
    .with_columns([col("col2").interpolate(InterpolationMethod::Linear)])
    .collect()?;
println!("{}", &fill_interpolation_df);

shape: (3, 2)
┌──────┬──────┐
│ col1 ┆ col2 │
│ ---  ┆ ---  │
│ i64  ┆ f64  │
╞══════╪══════╡
│ 1    ┆ 1.0  │
│ 2    ┆ 2.0  │
│ 3    ┆ 3.0  │
└──────┴──────┘
```

### NaN 值

Series 中的缺失数据有一个 null 值。然而，您可以在浮点数数据类型的列中使用 NaN 值。这些 NaN 值可以由 Numpy 的 `np.nan` 或原生的 `float('nan')` 创建：

```rust
let nan_df = df!(
    "value" => [1.0, f64::NAN, f64::NAN, 3.0],
)?;
println!("{}", &nan_df);

shape: (4, 1)
┌───────┐
│ value │
│ ---   │
│ f64   │
╞═══════╡
│ 1.0   │
│ NaN   │
│ NaN   │
│ 3.0   │
└───────┘
```

NaN 值被视为浮点数据类型的一部分，而不是缺失数据。这意味着：

- NaN 值不会被 `null_count` 方法计数。
- 当您使用 `fill_nan` 方法时，NaN 值会被填充，但不会被 `fill_null` 方法填充。

Polars 具有 `is_nan` 和 `fill_nan` 方法，类似于 `is_null` 和 `fill_null` 方法。基础 Arrow 数组没有预先计算的 NaN 值有效位图，因此 `is_nan` 方法必须计算这个位图。

null 和 NaN 值之间的另一个区别是，计算包含 null 值的列的平均值时，会排除 null 值，而包含 NaN 值的列的平均值结果为 NaN。这种行为可以通过用 null 值替换 NaN 值来避免：

```rust
let mean_nan_df = nan_df

```

### 23.3.8 窗口函数 Window functions

## 窗口函数

窗口函数是带有超级功能的表达式。它们允许您在选择上下文中对分组进行聚合。首先，我们创建一个数据集。在下面的代码片段中加载的数据集包含一些关于金融股票的信息：

### 数据集示例

```rust
use polars::prelude::*;
use reqwest::blocking::Client;

let data: Vec<u8> = Client::new()
    .get("https://example.com/financial_data.csv")  // 替换为实际的金融数据链接
    .send()?
    .text()?
    .bytes()
    .collect();

let file = std::io::Cursor::new(data);
let df = CsvReadOptions::default()
    .with_has_header(true)
    .into_reader_with_file_handle(file)
    .finish()?;

println!("{}", df);
```

### 在选择上下文中的分组聚合

下面展示了如何使用窗口函数在不同的列上进行分组并对它们进行聚合。这使得我们可以在单个查询中使用多个并行的分组操作。聚合的结果会投影回原始行，因此窗口函数几乎总是会导致一个与原始大小相同的 DataFrame。

```rust
let out = df
    .clone()
    .lazy()
    .select([
        col("sector"),
        col("market_cap"),
        col("price")
            .mean()
            .over(["sector"])
            .alias("avg_price_by_sector"),
        col("volume")
            .mean()
            .over(["sector", "market_cap"])
            .alias("avg_volume_by_sector_and_market_cap"),
        col("price").mean().alias("avg_price"),
    ])
    .collect()?;

println!("{}", out);
```

### 每个分组内的操作

窗口函数不仅可以用于聚合，还可以在分组内执行其他操作。例如，如果您想对分组内的值进行排序，可以使用 `col("value").sort().over("group")`。

```rust
let filtered = df
    .clone()
    .lazy()
    .filter(col("market_cap").gt(lit(1000000000)))  // 过滤市值大于 10 亿的公司
    .select([col("company"), col("sector"), col("price")])
    .collect()?;

println!("{}", filtered);

let out = filtered
    .lazy()
    .with_columns([cols(["company", "price"])
        .sort_by(
            ["price"],
            SortMultipleOptions::default().with_order_descending(true),
        )
        .over(["sector"])])
    .collect()?;
println!("{}", out);
```

Polars 会跟踪每个分组的位置，并将表达式映射到正确的行位置。这也适用于在单个选择中对不同分组的操作。

### 窗口表达式规则

假设我们将其应用于 `pl.Int32` 列，窗口表达式的评估如下：

```rust
// 在分组内聚合并广播
let _ = sum("price").over([col("sector")]);
// 在分组内求和并与分组元素相乘
let _ = (col("volume").sum() * col("price"))
    .over([col("sector")])
    .alias("volume_price_sum");
// 在分组内求和并与分组元素相乘并将分组聚合为列表
let _ = (col("volume").sum() * col("price"))
    .over([col("sector")])
    .alias("volume_price_list")
    .flatten();
```

### 更多示例

下面是一些窗口函数的练习示例：

1. 按行业对所有公司进行排序。
2. 选择每个行业中的前三家公司作为 "top_3_in_sector"。
3. 按价格对公司进行降序排序，并选择每个行业中的前三家公司作为 "top_3_by_price"。
4. 按市值对公司进行降序排序，并选择每个行业中的前三家公司作为 "top_3_by_market_cap"。

```rust
let out = df
    .clone()
    .lazy()
    .select([
        col("sector").head(Some(3)).over(["sector"]).flatten(),
        col("company")
            .sort_by(
                ["price"],
                SortMultipleOptions::default().with_order_descending(true),
            )
            .head(Some(3))
            .over(["sector"])
            .flatten()
            .alias("top_3_by_price"),
        col("company")
            .sort_by(
                ["market_cap"],
                SortMultipleOptions::default().with_order_descending(true),
            )
            .head(Some(3))
            .over(["sector"])
            .flatten()
            .alias("top_3_by_market_cap"),
    ])
    .collect()?;
println!("{:?}", out);
```

在量化金融中，这些窗口函数可以帮助我们对股票数据进行复杂的分析和聚合操作，例如计算行业内的平均价格，筛选出每个行业中价格最高的公司等。通过这些功能，我们可以更高效地处理和分析大量的金融数据。

### 案例：序列化 & 转化为polars的dataframe

为了简单说明序列化和反序列化在polars中的作用，我写了这段MWE代码以演示了如何定义一个包含历史股票数据的结构体，将数据序列化为 JSON 字符串，然后使用 Polars 库创建一个数据框架并打印出来。这对于介绍如何处理金融数据以及使用 Rust 进行数据分析非常有用。

```rust
// 引入所需的库
use serde::{Serialize, Deserialize}; // 用于序列化和反序列化
use serde_json; // 用于处理 JSON 数据
use polars::prelude::*; // 使用 Polars 处理数据
use std::io::Cursor; // 用于创建内存中的数据流

// 定义一个结构体，表示中国A股的历史股票数据
#[derive(Debug, Serialize, Deserialize)]
struct StockZhAHist {
    date: String,         // 日期
    open: f64,            // 开盘价
    close: f64,           // 收盘价
    high: f64,            // 最高价
    low: f64,             // 最低价
    volume: f64,          // 交易量
    turnover: f64,        // 成交额
    amplitude: f64,       // 振幅
    change_rate: f64,     // 涨跌幅
    change_amount: f64,   // 涨跌额
    turnover_rate: f64,   // 换手率
}

fn main() {
    // 创建一个包含历史股票数据的向量
    let data = vec![
        StockZhAHist { date: "1996-12-16T00:00:00.000".to_string(), open: 16.86, close: 16.86, high: 16.86, low: 16.86, volume: 62442.0, turnover: 105277000.0, amplitude: 0.0, change_rate: -10.22, change_amount: -1.92, turnover_rate: 0.87 },
        StockZhAHist { date: "1996-12-17T00:00:00.000".to_string(), open: 15.17, close: 15.17, high: 16.79, low: 15.17, volume: 463675.0, turnover: 718902016.0, amplitude: 9.61, change_rate: -10.02, change_amount: -1.69, turnover_rate: 6.49 },
        StockZhAHist { date: "1996-12-18T00:00:00.000".to_string(), open: 15.23, close: 16.69, high: 16.69, low: 15.18, volume: 445380.0, turnover: 719400000.0, amplitude: 9.95, change_rate: 10.02, change_amount: 1.52, turnover_rate: 6.24 },
        StockZhAHist { date: "1996-12-19T00:00:00.000".to_string(), open: 17.01, close: 16.4, high: 17.9, low: 15.99, volume: 572946.0, turnover: 970124992.0, amplitude: 11.44, change_rate: -1.74, change_amount: -0.29, turnover_rate: 8.03 }
    ];

    // 将历史股票数据序列化为 JSON 字符串并打印出来
    let json = serde_json::to_string(&data).unwrap();
    println!("{}", json);

    // 从 JSON 字符串创建 Polars 数据框架
    let df = JsonReader::new(Cursor::new(json))
        .finish().unwrap();

    // 打印 Polars 数据框架
    println!("{:#?}", df);
}

```

返回的 Polars Dataframe表格：

| date          | open  | close | high  | …   | amplitude | change_rate | change_amount | turnover_rate |
| ------------- | ----- | ----- | ----- | --- | --------- | ----------- | ------------- | ------------- |
| str           | f64   | f64   | f64   |     | f64       | f64         | f64           | f64           |
| 1996-12-16T00 | 16.86 | 16.86 | 16.86 | …   | 0.0       | -10.22      | -1.92         | 0.87          |
| 0:00:00.000   |       |       |       |     |           |             |               |               |
| 1996-12-17T00 | 15.17 | 15.17 | 16.79 | …   | 9.61      | -10.02      | -1.69         | 6.49          |
| 0:00:00.000   |       |       |       |     |           |             |               |               |
| 1996-12-18T00 | 15.23 | 16.69 | 16.69 | …   | 9.95      | 10.02       | 1.52          | 6.24          |
| 0:00:00.000   |       |       |       |     |           |             |               |               |
| 1996-12-19T00 | 17.01 | 16.4  | 17.9  | …   | 11.44     | -1.74       | -0.29         | 8.03          |
| 0:00:00.000   |       |       |       |     |           |             |               |               |
