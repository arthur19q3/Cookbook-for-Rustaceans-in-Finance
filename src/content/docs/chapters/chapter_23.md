---
title: 'Polars 入门'
---

Polars 是一个基于 Rust 语言开发的数据操作和分析库，旨在提供高性能和易用性。它类似于 Python 中的 pandas 库，但是由于 Rust 的性能和内存安全特性，Polars 在处理大型数据集时通常比 pandas 更快。

以下是 Polars 的一些主要特点和功能：

1. **高性能**：Polars 使用 Rust 编写，能够充分利用 Rust 的性能优势，执行数据操作速度非常快。

2. **易用性**：Polars 提供了类似于 pandas 的 API，因此对于熟悉 pandas 的用户来说，学习曲线较低。

3. **数据操作**：Polars 支持各种数据操作，包括筛选、过滤、分组、聚合、连接和排序等。你可以对数据进行广泛的操作，以满足不同的分析需求。

4. **列式存储**：Polars 使用列式存储（columnar storage），这意味着它能够高效地处理大型数据集。列式存储通常比行式存储（如 CSV）更高效，特别是在需要执行复杂查询时。

5. **类型安全**：Rust 的类型系统确保了数据的安全性和正确性。Polars 在数据类型处理上非常严格，不会出现常见的类型错误。

6. **跨平台**：由于 Rust 的跨平台特性，Polars 可以在各种操作系统上运行，包括 Windows、Linux 和 macOS。

7. **整合性**：Polars 可以轻松地与其他 Rust 生态系统中的库进行整合，例如 Serde 用于序列化和反序列化数据。

8. **支持各种数据源**：Polars 可以从各种数据源中加载数据，包括 CSV、Parquet、JSON、Arrow 等。它还支持从内存中的数据结构（例如 Vec 或 DataFrames）创建数据集。

9. **分布式计算**：Polars 支持分布式计算，这意味着你可以在多台计算机上并行处理大规模数据。

10. **社区支持**：Polars 是一个活跃的开源项目，拥有一个积极的社区，持续开发和改进。

以下是一个使用 Polars 的简单示例【待重新测试】：

```rust
use polars::prelude::*;

fn main() -> Result<()> {
    // 创建一个示例的DataFrame
    let df = DataFrame::new(vec![
        Series::new("name", &["Alice", "Bob", "Charlie"]),
        Series::new("age", &[25, 30, 35]),
    ])?;

    // 执行数据操作，例如筛选
    let filtered_df = df.filter(col("age").lt(32))?;

    // 显示结果
    println!("{:?}", filtered_df);

    Ok(())
}
```

这个示例创建了一个包含姓名和年龄的 DataFrame，然后对年龄进行筛选，并显示结果。

总之，Polars 是一个强大的数据操作和分析库，特别适用于需要高性能和数据安全性的 Rust 项目。如果你正在开发需要处理大型数据集的应用程序，可以考虑使用 Polars 来提高数据操作效率。

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
        StockZhAHist { date: "1996-12-18T00:00:00.000".to_string(), open: 15.28, close: 16.69, high: 16.69, low: 15.18, volume: 445380.0, turnover: 719400000.0, amplitude: 9.95, change_rate: 10.02, change_amount: 1.52, turnover_rate: 6.24 },
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
| 1996-12-18T00 | 15.28 | 16.69 | 16.69 | …   | 9.95      | 10.02       | 1.52          | 6.24          |
| 0:00:00.000   |       |       |       |     |           |             |               |               |
| 1996-12-19T00 | 17.01 | 16.4  | 17.9  | …   | 11.44     | -1.74       | -0.29         | 8.03          |
| 0:00:00.000   |       |       |       |     |           |             |               |               |
