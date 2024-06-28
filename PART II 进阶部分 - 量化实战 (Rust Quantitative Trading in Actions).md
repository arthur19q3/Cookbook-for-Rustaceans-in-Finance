# PART II 进阶部分 - 量化实战（Rust Quantitative Trading in Actions）

------------------------------------

#  Chapter 23 - Polars入门 

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

| date          | open  | close | high  | …    | amplitude | change_rate | change_amount | turnover_rate |
| ------------- | ----- | ----- | ----- | ---- | --------- | ----------- | ------------- | ------------- |
| str           | f64   | f64   | f64   |      | f64       | f64         | f64           | f64           |
| 1996-12-16T00 | 16.86 | 16.86 | 16.86 | …    | 0.0       | -10.22      | -1.92         | 0.87          |
| 0:00:00.000   |       |       |       |      |           |             |               |               |
| 1996-12-17T00 | 15.17 | 15.17 | 16.79 | …    | 9.61      | -10.02      | -1.69         | 6.49          |
| 0:00:00.000   |       |       |       |      |           |             |               |               |
| 1996-12-18T00 | 15.28 | 16.69 | 16.69 | …    | 9.95      | 10.02       | 1.52          | 6.24          |
| 0:00:00.000   |       |       |       |      |           |             |               |               |
| 1996-12-19T00 | 17.01 | 16.4  | 17.9  | …    | 11.44     | -1.74       | -0.29         | 8.03          |
| 0:00:00.000   |       |       |       |      |           |             |               |               |

#  Chapter 24 - 时序数据库Clickhouse【未完成】

ClickHouse 是一个开源的列式时序数据库管理系统（DBMS），专为高性能和低延迟的数据分析而设计。它最初由俄罗斯的互联网公司 Yandex 开发，用于处理海量的数据分析工作负载。以下是 ClickHouse 的主要特点和介绍：

1. **列式存储**：ClickHouse 采用列式存储，这意味着它将数据按列存储在磁盘上，而不是按行存储。这种存储方式对于数据分析非常高效，因为它允许查询只读取所需的列，而不必读取整个行。这导致了更快的查询性能和更小的存储空间占用。

2. **分布式架构**：ClickHouse 具有分布式架构，可以轻松扩展以处理大规模数据集。它支持数据分片、分布式复制和负载均衡，以确保高可用性和容错性。

3. **支持 SQL 查询**：ClickHouse 支持标准的 SQL 查询语言，使用户可以使用熟悉的查询语法执行数据分析操作。它还支持复杂的查询，如聚合、窗口函数和子查询。

4. **高性能**：ClickHouse 以查询性能和吞吐量为重点进行了优化。它专为快速的数据分析查询而设计，可以在毫秒级别内处理数十亿行的数据。

5. **实时数据注入**：ClickHouse 支持实时数据注入，允许将新数据迅速插入到表中，并能够在不停机的情况下进行数据更新。

6. **支持多种数据格式**：ClickHouse 可以处理多种数据格式，包括 JSON、CSV、Parquet 等，使其能够与各种数据源无缝集成。

7. **可扩展性**：ClickHouse 具有可扩展性，可以与其他工具和框架（如 Apache Kafka、Spark、Presto）集成，以满足各种数据处理需求。

8. **开源和活跃的社区**：ClickHouse 是一个开源项目，拥有活跃的社区支持。这意味着你可以免费获取并使用它，并且有一个庞大的开发者社区，提供了大量的文档和资源。

ClickHouse 在大数据分析、日志处理、事件追踪、时序数据分析等场景中得到了广泛的应用。它的高性能、可扩展性和强大的查询功能使其成为处理大规模数据的理想选择。如果你需要处理大量时序数据并进行快速数据分析，那么 ClickHouse 可能是一个非常有价值的数据库管理系统。

### 24.1 安装和配置ClickHouse数据库

### 24.1.1 安装

#### 在Ubuntu上安装ClickHouse：

1. 打开终端并更新包列表：

   ```
   sudo apt update
   ```

2. 安装ClickHouse的APT存储库：

   ```
   sudo apt install apt-transport-https ca-certificates dirmngr
   sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv E0C56BD4
   echo "deb https://repo.clickhouse.tech/deb/stable/ main/" | sudo tee /etc/apt/sources.list.d/clickhouse.list
   ```

3. 再次更新包列表以获取ClickHouse包：

   ```
   sudo apt update
   ```

4. 安装ClickHouse Server：

   ```
   sudo apt install clickhouse-server
   ```

5. 启动ClickHouse服务：

   ```
   sudo service clickhouse-server start
   ```

6. 我们可以使用以下命令检查ClickHouse服务器的状态：

   ```
   sudo service clickhouse-server status
   ```

#### 在Manjaro / Arch Linux上安装ClickHouse：

1. 打开终端并使用以下命令安装ClickHouse：

   ```
   sudo pacman -S clickhouse
   ```

2. 启动ClickHouse服务：

   ```
   sudo systemctl start clickhouse-server
   ```

3. 我们可以使用以下命令检查ClickHouse服务器的状态：

   ```
   sudo systemctl status clickhouse-server
   ```

这样ClickHouse就已经安装在你的Ubuntu或Arch Linux系统上了，并且服务已启动。

此时如果我们如果访问本地host上的这个网址：http://localhost:8123 ，会看到服务器返回了一个'Ok'给我们。

#### 24.1.2 配置clickhouse的密码

还是不要忘记，生产环境中安全是至关重要的，在ClickHouse中配置密码需要完成以下步骤：

1. **创建用户和设置密码**：
   首先，我们需要登录到ClickHouse服务器上，并使用管理员权限创建用户并设置密码。我们可以使用ClickHouse客户端或者通过在配置文件中执行SQL来完成这一步骤。

   使用ClickHouse客户端：

   ```sql
   CREATE USER 'your_username' IDENTIFIED BY 'your_password';
   ```

   请将 `'your_username'` 替换为我们要创建的用户名，将 `'your_password'` 替换为用户的密码。

2. **分配权限**：
   创建用户后，需要分配相应的权限。通常，我们可以使用`GRANT`语句来为用户分配权限。以下是一个示例，将允许用户对特定表执行SELECT操作：

   ```sql
   GRANT SELECT ON database_name.table_name TO 'your_username';
   ```

   这将授予 `'your_username'` 用户对 `'database_name.table_name'` 表的SELECT权限。我们可以根据需要为用户分配不同的权限。

3. **配置ClickHouse服务**：
   接下来，我们需要配置ClickHouse服务器以启用身份验证。在ClickHouse的配置文件中，找到并编辑`users.xml`文件。通常，该文件的位置是`/etc/clickhouse-server/users.xml`。在该文件中，我们可以为刚刚创建的用户添加相应的配置。

   ```xml
   <yandex>
       <profiles>
           <!-- 添加用户配置 -->
           <your_username>
               <password>your_password</password>
               <networks>
                   <ip>::/0</ip> <!-- 允许所有IP连接 -->
               </networks>
           </your_username>
       </profiles>
   </yandex>
   ```

   请注意，这只是一个示例配置，我们需要将 `'your_username'` 和 `'your_password'` 替换为实际的用户名和密码。此外，上述配置允许来自所有IP地址的连接，这可能不是最安全的配置。我们可以根据需要限制连接的IP地址范围。

4. **重启ClickHouse服务**：
   最后，重新启动ClickHouse服务器以使配置更改生效：

   ```bash
   sudo systemctl restart clickhouse-server
   ```

   这会重新加载配置文件并应用新的用户和权限设置。

完成上述步骤后，我们的ClickHouse服务器将配置了用户名和密码的身份验证机制，并且只有具有正确凭据的用户才能访问相应的数据库和表。请确保密码强度足够，以增强安全性。

### 24.2 ClickHouse for Rust: clickhouse.rs库

`clickhouse.rs` 是一个网友 Paul Loyd 开发的比较成熟的第三方 Rust 库，旨在与 ClickHouse 数据库进行交互，提供了便捷的查询执行、数据处理和连接管理功能。以下是该库的一些主要特点：

#### 主要特点

1. **异步支持**：`clickhouse.rs` 利用了 Rust 的异步编程能力，非常适合需要非阻塞数据库操作的高性能应用程序。
2. **类型化接口**：该库提供了强类型接口，使数据库交互更加安全和可预测，减少运行时错误并提高代码的健壮性。
3. **支持 ClickHouse 特性**：库支持多种 ClickHouse 特性，包括批量插入、复杂查询和不同的数据类型。
4. **连接池**：`clickhouse.rs` 包含连接池功能，在高负载场景下实现高效的数据库连接管理。
5. **易用性**：该库设计简洁明了的 API，使各级 Rust 开发者都能轻松上手。

#### 安装

要使用 `clickhouse.rs`，需要在 `Cargo.toml` 中添加依赖项：

```toml
[dependencies]
clickhouse = "0.11"  # 请确保使用最新版本
```

#### 基本用法

以下是使用 `clickhouse.rs` 连接 ClickHouse 数据库并执行查询的简单示例：

```rust
use clickhouse::{Client, Row};
use futures::stream::StreamExt;
use tokio;

#[tokio::main]
async fn main() {
    // 初始化客户端
    let client = Client::default()
        .with_url("http://localhost:8123")
        .with_database("default");

    // 执行查询示例
    let mut cursor = client.query("SELECT number FROM system.numbers LIMIT 10").fetch().unwrap();
    while let Some(row) = cursor.next().await {
        let number: u64 = row.unwrap().get("number").unwrap();
        println!("{}", number);
    }
}
```

#### 错误处理

该库使用标准的 Rust 错误处理机制，使得管理潜在问题变得简单。以下是处理查询执行错误的示例：

```rust
use clickhouse::{Client, Error};
use tokio;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let client = Client::default().with_url("http://localhost:8123");

    let result = client.query("SELECT number FROM system.numbers LIMIT 10")
        .fetch()
        .await;

    match result {
        Ok(mut cursor) => {
            while let Some(row) = cursor.next().await {
                let number: u64 = row.unwrap().get("number").unwrap();
                println!("{}", number);
            }
        }
        Err(e) => eprintln!("查询执行错误: {:?}", e),
    }

    Ok(())
}
```

#### 高级用法

对于批量插入或处理特定数据类型等复杂场景，请参阅库的文档和示例。该库支持多种 ClickHouse 特性，可以适应各种使用场景。

### 24.3 备份 ClickHouse 数据库的教程

备份 ClickHouse 数据库对于数据安全和业务连续性至关重要。通过定期备份，可以在数据丢失、硬件故障或人为错误时快速恢复，确保数据完整性和可用性。此外，备份有助于在系统升级或迁移过程中保护数据，避免意外损失。备份还支持增量备份和压缩，优化存储空间和备份速度，为企业提供灵活、高效的数据管理解决方案。通过良好的备份策略，可以大大降低数据丢失风险，保障业务稳定运行。

#### 配置备份目的地

首先，在 `/etc/clickhouse-server/config.d/backup_disk.xml` 中添加备份目的地配置：

```xml
<clickhouse>
    <storage_configuration>
        <disks>
            <backups>
                <type>local</type>
                <path>/backups/</path>
            </backups>
        </disks>
    </storage_configuration>
    <backups>
        <allowed_disk>backups</allowed_disk>
        <allowed_path>/backups/</allowed_path>
    </backups>
</clickhouse>
```

#### 备份整个数据库

执行以下命令将整个数据库备份到指定磁盘：

```sql
BACKUP DATABASE my_database TO Disk('backups', 'database_backup.zip');
```

#### 恢复整个数据库

从备份文件中恢复整个数据库：

```sql
RESTORE DATABASE my_database FROM Disk('backups', 'database_backup.zip');
```

#### 备份表

执行以下命令将表备份到指定磁盘：

```sql
BACKUP TABLE my_database.my_table TO Disk('backups', 'table_backup.zip');
```

#### 恢复表

从备份文件中恢复表：

```sql
RESTORE TABLE my_database.my_table FROM Disk('backups', 'table_backup.zip');
```

#### 增量备份

指定基础备份进行增量备份：

```sql
BACKUP DATABASE my_database TO Disk('backups', 'incremental_backup.zip') SETTINGS base_backup = Disk('backups', 'database_backup.zip');
```

#### 使用密码保护备份

备份文件使用密码保护：

```sql
BACKUP DATABASE my_database TO Disk('backups', 'protected_backup.zip') SETTINGS password='yourpassword';
```

#### 压缩设置

指定压缩方法和级别：

```sql
BACKUP DATABASE my_database TO Disk('backups', 'compressed_backup.zip') SETTINGS compression_method='lzma', compression_level=3;
```

#### 恢复特定分区

从备份中恢复特定分区：

```sql
RESTORE TABLE my_database.my_table PARTITIONS 'partition_id' FROM Disk('backups', 'table_backup.zip');
```

更多详细信息请参考 [ClickHouse 文档](https://clickhouse.com/docs/en/operations/backup)。

### 24.4  关于Clickhouse的优化 

在量化金融领域，处理大量实时数据至关重要。ClickHouse作为一款高性能列式数据库，提供了高效的查询和存储方案。然而，为了充分发挥其性能，必须对其进行优化。

#### 硬件优化

1. **存储设备**：选择高性能 SSD，可以显著提高数据读取和写入速度。
2. **内存**：增加内存容量，有助于更快地处理大量数据。
3. **网络**：优化网络带宽和延迟，确保分布式集群间的数据传输效率。

#### 配置优化

1. **设置合适的分区策略**：根据时间或其他关键维度分区，提高查询性能。
2. **合并设置**：配置合适的 `merge_tree` 设置，优化数据合并过程，减少碎片。
3. **缓存和内存设置**：调整 `mark_cache_size` 和 `max_memory_usage` 等参数，提升缓存命中率和内存使用效率。

#### 查询优化

1. **索引**：利用主键和二级索引，加速查询。
2. **并行查询**：启用 `max_threads` 参数，充分利用多核 CPU 并行处理查询。
3. **物化视图**：预计算常用查询结果，减少实时计算开销。

#### 数据模型优化

1. **列存储设计**：尽量将频繁查询的列存储在一起，减少 I/O 开销。
2. **压缩算法**：选择合适的压缩算法，如 `LZ4` 或 `ZSTD`，在压缩率和性能之间取得平衡。

#### 实践案例

以量化金融中的市场数据分析为例，优化 ClickHouse 的关键步骤如下：

1. **分区策略**：按日期分区，使查询特定时间段数据时更高效。
2. **物化视图**：预计算每日交易量、价格波动等关键指标，减少实时计算负担。
3. **并行查询**：调整 `max_threads`，确保查询时充分利用服务器多核资源。

#### 监控和维护

1. **监控工具**：使用 ClickHouse 提供的 `system` 表监控系统性能和查询效率。
2. **定期维护**：定期检查并优化分区和索引，防止性能下降。

通过合理的硬件配置、优化查询和数据模型设计，以及持续的监控和维护，ClickHouse 可以在量化金融领域中提供卓越的性能和可靠性，支持高频交易、实时数据分析等应用场景。以下我将介绍一些优化实例：

##### 24.4.1. 硬件配置

```xml
<clickhouse>
    <storage_configuration>
        <disks>
            <default>
                <path>/var/lib/clickhouse/</path>
            </default>
            <ssd>
                <type>local</type>
                <path>/mnt/ssd/</path>
            </ssd>
        </disks>
    </storage_configuration>
</clickhouse>
```

##### 24.4.2. 创建分区表

```sql
CREATE TABLE market_data (
    date Date,
    symbol String,
    price Float64,
    volume UInt64
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (symbol, date);
```

##### 24.4.3. 使用物化视图

```sql
CREATE MATERIALIZED VIEW market_summary
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (symbol, date)
AS
SELECT
    symbol,
    toYYYYMM(date) as month,
    avg(price) as avg_price,
    sum(volume) as total_volume
FROM market_data
GROUP BY symbol, month;
```

##### 24.4.4. 并行查询

```sql
SET max_threads = 8;

SELECT
    symbol,
    avg(price) as avg_price
FROM market_data
WHERE date >= '2023-01-01' AND date <= '2023-12-31'
GROUP BY symbol;
```

##### 24.4.5. 压缩算法

```sql
CREATE TABLE compressed_data (
    date Date,
    symbol String,
    price Float64,
    volume UInt64
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (symbol, date)
SETTINGS index_granularity = 8192,
    compress_on_write = 1,
    compression = 'lz4';
```

通过合理的硬件配置、优化查询和数据模型设计，以及持续的监控和维护，ClickHouse 可以在量化金融领域中提供卓越的性能和可靠性，支持高频交易、实时数据分析等应用场景。

### 案例1 通过Rust脚本在Clickhouse数据库中建表、删表、查询

在量化金融领域中，使用 Rust 脚本管理 ClickHouse 数据库可以实现高效的数据处理和管理。以下是一个基本案例 。

#### 准备工作

首先，确保在你的 `Cargo.toml` 中添加 `clickhouse` 依赖：

```toml
[dependencies]
clickhouse = { default-features = false, version = "0.11.6" }
```

#### 创建 ClickHouse 客户端

定义并初始化一个 ClickHouse 客户端：

```rust
use clickhouse::{Client, Row};
use lazy_static::lazy_static;

lazy_static! {
    pub static ref CLICKHOUSE_CLIENT: ClickHouseClient = ClickHouseClient::new();
}

pub struct ClickHouseClient {
    pub client: Client,
}

impl ClickHouseClient {
    pub fn new() -> Self {
        let client = Client::default().with_url("http://localhost:8123").with_database("default");
        ClickHouseClient { client }
    }
}
```

#### 创建表

创建一个新的表 `market_data`：

```rust
impl ClickHouseClient {
    pub async fn create_table(&self) -> Result<(), clickhouse::error::Error> {
        let query = r#"
            CREATE TABLE market_data (
                date Date,
                symbol String,
                price Float64,
                volume UInt64
            ) ENGINE = MergeTree()
            PARTITION BY date
            ORDER BY (symbol, date)
        "#;

        self.client.query(query).execute().await
    }
}
```

#### 删除表

删除一个已存在的表：

```rust
impl ClickHouseClient {
    pub async fn drop_table(&self, table_name: &str) -> Result<(), clickhouse::error::Error> {
        let query = format!("DROP TABLE IF EXISTS {}", table_name);
        self.client.query(&query).execute().await
    }
}
```

#### 查询数据

从表中查询数据：

```rust
#[derive(Debug, Serialize, Deserialize, Row)]
pub struct MarketData {
    pub date: String,
    pub symbol: String,
    pub price: f64,
    pub volume: u64,
}

impl ClickHouseClient {
    pub async fn query_data(&self) -> Result<Vec<MarketData>, clickhouse::error::Error> {
        let query = "SELECT * FROM market_data LIMIT 10";
        let result = self.client.query(query).fetch_all::<MarketData>().await?;
        Ok(result)
    }
}
```

#### 示例用法

完整的示例代码展示了如何使用这些功能：

```rust
#[tokio::main]
async fn main() -> Result<(), clickhouse::error::Error> {
    let client = ClickHouseClient::new();

    // 创建表
    client.create_table().await?;
    println!("Table created successfully.");

    // 查询数据
    let data = client.query_data().await?;
    for row in data {
        println!("{:?}", row);
    }

    // 删除表
    client.drop_table("market_data").await?;
    println!("Table dropped successfully.");

    Ok(())
}
```

通过这个基本教程，你可以在 Rust 脚本中实现对 ClickHouse 数据库的基本管理操作。这些示例代码可以根据具体需求进行扩展和优化，以满足量化金融领域的复杂数据处理需求。



### 案例2 创建布林带表的 SQL 脚本示例

本案例展示如何利用 Rust 脚本与 ClickHouse 交互，计算布林带 (Bollinger Bands) 和其他技术指标，帮助金融分析师和量化交易员优化他们的交易策略。

```sql
-- 创建名为 AG2305_TEST 的表，使用 MergeTree 引擎
CREATE TABLE AG2305_TEST
    ENGINE = MergeTree()
        ORDER BY (minute, mean_lastprice) -- 按 minute 和 mean_lastprice 排序
AS
-- 从子查询中选择字段
SELECT outer_query.minute,
       CAST(outer_query.mean_lastprice AS Float32) AS mean_lastprice, -- 将 mean_lastprice 转换为 Float32 类型
       CAST(sma AS Float32)                        AS sma,           -- 将 sma 转换为 Float32 类型
       CAST(stddev AS Float32)                     AS stddev,        -- 将 stddev 转换为 Float32 类型
       CAST(upper AS Float32)                      AS upper,         -- 将 upper 转换为 Float32 类型
       CAST(lower AS Float32)                      AS lower,         -- 将 lower 转换为 Float32 类型
       CAST(super_upper AS Float32)                AS super_upper,   -- 将 super_upper 转换为 Float32 类型
       CAST(super_lower AS Float32)                AS super_lower,   -- 将 super_lower 转换为 Float32 类型
       CAST(ssuper_upper AS Float32)               AS ssuper_upper,  -- 将 ssuper_upper 转换为 Float32 类型
       CAST(ssuper_lower AS Float32)               AS ssuper_lower,  -- 将 ssuper_lower 转换为 Float32 类型
       CASE
           -- 根据价格突破的不同情况赋值 bollinger_band_status
           WHEN super_upper > mean_lastprice AND mean_lastprice > upper THEN 1 -- 向上突破2个标准差
           WHEN super_lower < mean_lastprice AND mean_lastprice < lower THEN 2 -- 向下突破2个标准差
           WHEN ssuper_upper > mean_lastprice AND mean_lastprice > super_upper THEN 3 -- 向上突破4个标准差
           WHEN ssuper_lower < mean_lastprice AND mean_lastprice < super_lower THEN 4 -- 向下突破4个标准差
           WHEN mean_lastprice > ssuper_upper THEN 5 -- 向上突破5个标准差
           WHEN mean_lastprice < ssuper_lower AND upper != lower THEN 6 -- 向下突破5个标准差
           ELSE 0 -- 在布林带内及其他情况
       END AS bollinger_band_status
FROM (
    -- 从内层查询中选择字段
    SELECT subquery.minute,
           subquery.mean_lastprice,
           subquery.start_time,
           -- 计算简单移动平均线 (SMA)
           avg(subquery.mean_lastprice)
               OVER (PARTITION BY subquery.start_time ORDER BY subquery.minute ASC) AS sma,
           -- 计算标准差
           stddevPop(subquery.mean_lastprice)
               OVER (PARTITION BY subquery.start_time ORDER BY subquery.minute ASC) AS stddev,
           -- 计算布林带上下轨
           sma + 1.5 * stddevPop(subquery.mean_lastprice)
               OVER (PARTITION BY subquery.start_time ORDER BY subquery.minute ASC) AS upper,
           sma - 1.5 * stddevPop(subquery.mean_lastprice)
               OVER (PARTITION BY subquery.start_time ORDER BY subquery.minute ASC) AS lower,
           -- 计算更高和更低的布林带轨道
           sma + 3 * stddevPop(subquery.mean_lastprice)
               OVER (PARTITION BY subquery.start_time ORDER BY subquery.minute ASC) AS super_upper,
           sma - 3 * stddevPop(subquery.mean_lastprice)
               OVER (PARTITION BY subquery.start_time ORDER BY subquery.minute ASC) AS super_lower,
           sma + 4 * stddevPop(subquery.mean_lastprice)
               OVER (PARTITION BY subquery.start_time ORDER BY subquery.minute ASC) AS ssuper_upper,
           sma - 4 * stddevPop(subquery.mean_lastprice)
               OVER (PARTITION BY subquery.start_time ORDER BY subquery.minute ASC) AS ssuper_lower
    FROM (
        -- 最内层查询，按分钟聚合数据并计算均价
        SELECT toStartOfMinute(datetime) AS minute,
               AVG(lastprice)            AS mean_lastprice,
               -- 计算开始时间，根据 datetime 决定是当前日期的 21 点还是前一天的 21 点
               CASE
                   WHEN toHour(datetime) < 21 THEN toDate(datetime) - INTERVAL 1 DAY + INTERVAL 21 HOUR
                   ELSE toDate(datetime) + INTERVAL 21 HOUR
               END AS start_time
        FROM futures.AG2305
        GROUP BY minute, start_time
    ) subquery
) outer_query
ORDER BY outer_query.minute;
```

### 脚本解析

1. **创建表**：使用 MergeTree 引擎创建表 `AG2305_TEST`，并按 `minute` 和 `mean_lastprice` 排序。
2. **选择字段**：从内部查询中选择字段并进行类型转换。
3. **布林带状态**：根据价格与布林带上下轨的关系，确定 `bollinger_band_status` 的值。
4. **内部查询**：
   - **子查询**：聚合每分钟的平均价格 `mean_lastprice`，并计算开始时间 `start_time`。
   - **布林带计算**：计算简单移动平均线（SMA）和不同标准差倍数的上下轨。

通过这个逐行注释的 SQL 脚本，可以更好地理解如何在 ClickHouse 中创建复杂的计算表，并应用于量化金融领域的数据处理。

#   Chapter 25 - Unsafe

`unsafe` 关键字是 Rust 中的一个特性，允许你编写不受 Rust 安全性检查保护的代码块。使用 `unsafe` 可以执行一些不安全的操作，如手动管理内存、绕过借用检查、执行原生指针操作等。它为你提供了更多的灵活性，但也增加了出现内存不安全和其他错误的风险。

以下是 `unsafe` 在 Rust 中的一些典型应用：

1. **手动管理内存**：使用 `unsafe` 可以手动分配和释放内存，例如使用 `malloc` 和 `free` 类似的操作。这在编写操作系统、嵌入式系统或需要精细控制内存的高性能应用中很有用。

2. **原生指针**：`unsafe` 允许你使用原生指针（raw pointers），如裸指针（`*const T` 和 `*mut T`）来进行底层内存操作。这包括解引用、指针算术和类型转换等。

3. **绕过借用检查**：有时候，你可能需要在某些情况下绕过 Rust 的借用检查规则，以实现一些特殊的操作，如跨函数传递可变引用。

4. **调用外部代码**：当与其他编程语言（如 C 或 C++）进行交互时，你可能需要使用 `unsafe` 来调用外部的不受 Rust 控制的代码。这包括编写 Rust 绑定以与 C 库进行交互。

5. **多线程编程**：`unsafe` 有时候用于多线程编程，以管理共享状态、原子操作和同步原语。这包括 `std::sync` 和 `std::thread` 中的一些功能。

需要注意的是，使用 `unsafe` 需要非常小心，因为它可以导致内存不安全、数据竞争和其他严重的错误。Rust 的安全性特性是它的一大卖点，`unsafe` 的使用应该被限制在必要的情况下，并且必须经过仔细的审查和测试。在实际编程中，大多数情况下都可以避免使用 `unsafe`，因为 Rust 提供了强大的工具来确保代码的安全性和正确性。只有在需要访问底层系统资源、进行高性能优化或与外部代码交互等特殊情况下，才应该考虑使用 `unsafe`。

在金融领域，Rust 的 `unsafe` 关键字通常需要谨慎使用，因为金融系统涉及到重要的安全性和可靠性要求。`unsafe` 允许绕过 Rust 的安全检查和规则，这意味着你需要更加小心地管理代码，以确保它不会导致内存不安全或其他安全性问题。

以下是在金融领域中可能使用 `unsafe` 的一些场景和用例：

1. **与外部系统集成**：金融系统通常需要与底层硬件、操作系统、网络库等进行交互。在这些情况下，`unsafe` 可能用于编写与外部 C 代码进行交互的 Rust 绑定，以确保正确的内存布局和数据传递。

2. **性能优化**：金融计算通常涉及大量数据处理，对性能要求较高。在某些情况下，使用 `unsafe` 可能允许你进行底层内存操作或使用不安全的优化技巧，以提高计算性能。

3. **数据结构的自定义实现**：金融领域可能需要定制的数据结构，以满足特定的需求。在这种情况下，`unsafe` 可能用于实现自定义数据结构，但必须确保这些结构是正确和安全的。

4. **低级别的多线程编程**：金融系统通常需要高度并发的处理能力。在处理多线程和并发性时，可能需要使用 `unsafe` 来管理线程间的共享状态和同步原语，但必须小心避免数据竞争和其他多线程问题。

无论在金融领域还是其他领域，使用 `unsafe` 都需要严格的代码审查和测试，以确保代码的正确性和安全性。在金融领域特别需要保持高度的可信度，因此必须格外小心，遵循最佳实践，使用 `unsafe` 的时机应该非常明确，并且必须有充分的理由。另外，金融领域通常受到监管和合规性要求，这也需要确保代码的安全性和稳定性。因此，`unsafe` 应该谨慎使用，只在真正需要时才使用，并且应该由经验丰富的工程师来管理和审查。

在量化金融领域，有些情况下确实需要使用 `unsafe` 来执行一些底层操作，尤其是在与外部 C/C++ 库进行交互时。一个常见的案例是与某些量化金融库或市场数据提供商的 C/C++ API 进行集成。以下是一个示例，展示了如何在 Rust 中与外部 C/C++ 金融库进行交互，可能需要使用 `unsafe`。

### **案例：与外部金融库的交互**

假设你的量化金融策略需要获取市场数据，但市场数据提供商只提供了 C/C++ API。在这种情况下，你可以编写一个 Rust 绑定，以便在 Rust 中调用外部 C/C++ 函数。

首先，你需要创建一个 Rust 项目，并设置一个用于与外部库交互的 Rust 模块。然后，创建一个 Rust 绑定，将外部库的函数声明和数据结构导入到 Rust 中。这可能涉及到使用 `extern` 关键字和 `unsafe` 代码块来调用外部函数。

以下是一个简化的示例：

```rust
// extern声明，将外部库中的函数导入到Rust中
extern "C" {
    fn get_stock_price(symbol: *const u8) -> f64;
    // 还可以导入其他函数和数据结构
}

// 调用外部函数的Rust封装
pub fn get_stock_price_rust(symbol: &str) -> Option<f64> {
    let c_symbol = CString::new(symbol).expect("CString conversion failed");
    let price = unsafe { get_stock_price(c_symbol.as_ptr()) };
    if price < 0.0 {
        None
    } else {
        Some(price)
    }
}

fn main() {
    let symbol = "AAPL";
    if let Some(price) = get_stock_price_rust(symbol) {
        println!("The stock price of {} is ${:.2}", symbol, price);
    } else {
        println!("Failed to retrieve the stock price for {}", symbol);
    }
}
```

在这个示例中，我们假设有一个外部 C/C++ 函数 `get_stock_price`，它获取股票代码并返回股价。我们使用 `extern "C"` 声明将其导入到 Rust 中，并在 `get_stock_price_rust` 函数中使用 `unsafe` 调用它。

这个示例展示了在量化金融中可能需要使用 `unsafe` 的情况，因为你必须管理外部 C/C++ 函数的调用以及与它们的交互。在这种情况下，你需要确保 `unsafe` 代码块中的操作是正确且安全的，并且进行了适当的错误处理。在与外部库进行交互时，一定要小心确保代码的正确性和稳定性。

### **案例：高性能数值计算**

另一个可能需要使用 `unsafe` 的量化金融案例是执行高性能计算和优化，特别是在需要进行大规模数据处理和数值计算时。以下是一个示例，展示了如何使用 `unsafe` 来执行高性能数值计算的情况。

假设你正在开发一个量化金融策略，需要进行大规模的数值计算，例如蒙特卡洛模拟或优化算法。在这种情况下，你可能需要使用 Rust 中的 `ndarray` 或其他数值计算库来执行操作，但某些操作可能需要使用 `unsafe` 来提高性能。

以下是一个示例，展示了如何使用 `unsafe` 来执行矩阵操作：

```rust
use ndarray::{Array2, Axis, s};

fn main() {
    // 创建一个大矩阵
    let size = 1000;
    let mut matrix = Array2::zeros((size, size));

    // 使用 unsafe 来执行高性能操作
    unsafe {
        // 假设这是一个计算密集型的操作
        for i in 0..size {
            for j in 0..size {
                *matrix.uget_mut((i, j)) = i as f64 * j as f64;
            }
        }
    }

    // 执行其他操作
    let row_sum = matrix.sum_axis(Axis(0));
    let max_value = matrix.fold(0.0, |max, &x| if x > max { x } else { max });

    println!("Row sum: {:?}", row_sum);
    println!("Max value: {:?}", max_value);
}
```

在这个示例中，我们使用 `ndarray` 库创建了一个大矩阵，并使用 `unsafe` 块来执行计算密集型的操作以填充矩阵。这个操作假设你已经确保了正确性和安全性，因此可以使用 `unsafe` 来提高性能。

需要注意的是，使用 `unsafe` 应该非常小心，必须确保操作是正确的且不会导致内存不安全。在实际应用中，你可能需要使用更多的数值计算库和优化工具，但 `unsafe` 可以在某些情况下提供额外的性能优势。无论如何，对于量化金融策略，正确性和可维护性始终比性能更重要，因此使用 `unsafe` 应该谨慎，并且必须小心验证和测试代码。

#   Chapter 26 - 文档和测试

## 26.1 文档注释

在 Rust 中，文档的编写主要使用文档注释（Doc Comments）和 Rustdoc 工具来生成文档。文档注释以 `///` 或 `//!` 开始，通常位于函数、模块、结构体、枚举等声明的前面。以下是 Rust 中文档编写的基本写法和示例：

1. **文档注释格式**：

   文档注释通常遵循一定的格式，包括描述、用法示例、参数说明、返回值说明等。下面是一个通用的文档注释格式示例：

   ```rust
   /// This is a description of what the item does.
   ///
   /// # Examples
   ///
   /// ```
   /// let result = my_function(arg1, arg2);
   /// assert_eq!(result, expected_value);
   /// ```
   ///
   /// ## Parameters
   ///
   /// - `arg1`: Description of the first argument.
   /// - `arg2`: Description of the second argument.
   ///
   /// ## Returns
   ///
   /// Description of the return value.
   ///
   /// # Panics
   ///
   /// Description of panic conditions, if any.
   ///
   /// # Errors
   ///
   /// Description of possible error conditions, if any.
   ///
   /// # Safety
   ///
   /// Explanation of any unsafe code or invariants.
   pub fn my_function(arg1: Type1, arg2: Type2) -> ReturnType {
       // Function implementation
   }
   ```

   在上面的示例中，文档注释包括描述、用法示例、参数说明、返回值说明以及可能的 panic 和错误情况的描述。

2. **生成文档**：

   为了生成文档，你可以使用 Rust 内置的文档生成工具 Rustdoc。运行以下命令来生成文档：

   ```
   cargo doc
   ```

   这将生成文档并将其保存在项目目录的 `target/doc` 文件夹下。你可以在浏览器中打开生成的文档（位于 `target/doc` 中的 `index.html` 文件）来查看你的代码文档。

3. **链接到其他项**：

   你可以在文档中链接到其他项，如函数、模块、结构体等，以便创建交叉引用。使用 `[` 和 `]` 符号来创建链接，例如 `[`my_function`]` 将链接到名为 `my_function` 的项。

4. **测试文档示例**：

   你可以通过运行文档测试来确保文档中的示例代码是有效的。运行文档测试的命令是：

   ```
   cargo test --doc
   ```

   这将运行文档中的所有示例代码，确保它们仍然有效。

5. **文档主题**：

   你可以使用 Markdown 语法来美化文档。Rustdoc支持Markdown，所以你可以使用标题、列表、代码块、链接等Markdown元素来组织文档并增强其可读性。

文档编写是开发过程中的重要部分，它帮助你的代码更易于理解、使用和维护。好的文档不仅对其他开发人员有帮助，还有助于你自己更容易回顾和理解代码。因此，确保在 Rust 项目中编写清晰和有用的文档是一个良好的实践。

##  26.1 单元测试

Rust 是一种系统级编程语言，它鼓励编写高性能和安全的代码。为了确保代码的正确性，Rust 提供了一套强大的测试工具，包括单元测试、集成测试和属性测试。在这里，我们将详细介绍 Rust 的单元测试。

单元测试是一种测试方法，用于验证代码的各个单元（通常是函数或方法）是否按预期工作。在 Rust 中，单元测试通常包括编写测试函数，然后使用 `#[cfg(test)]` 属性标记它们，以便只在测试模式下编译和运行。

以下是 Rust 单元测试的详细解释：

1. **创建测试函数**：

   在 Rust 中，测试函数的命名通常以 `test` 开头，后面跟着描述性的函数名。测试函数应该返回 `()`（unit 类型），因为它们通常不返回任何值。测试函数可以使用 `assert!` 宏或其他断言宏来检查代码的行为是否与预期一致。例如：

   ```rust
   #[cfg(test)]
   mod tests {
       #[test]
       fn test_addition() {
           assert_eq!(2 + 2, 4);
       }
   }
   ```

   在这个示例中，我们有一个名为 `test_addition` 的测试函数，它使用 `assert_eq!` 宏来断言 2 + 2 的结果是否等于 4。如果不等于 4，测试将失败。

2. **使用 `#[cfg(test)]` 标志**：

   在 Rust 中，你可以使用 `#[cfg(test)]` 属性将测试代码标记为仅在测试模式下编译和运行。这可以防止测试代码影响生产代码的性能和大小。在示例中，我们在测试模块中使用了 `#[cfg(test)]`。

3. **运行测试**：

   要运行测试，可以使用 Rust 的测试运行器，通常是 `cargo test` 命令。在你的项目根目录下，运行 `cargo test` 将运行所有标记为测试的函数。测试运行器将输出测试结果，包括通过的测试和失败的测试。

4. **添加更多测试**：

   你可以在测试模块中添加任意数量的测试函数，以验证你的代码的不同部分。测试函数应该覆盖你的代码中的各种情况和边界条件，以确保代码的正确性。

5. **测试断言宏**：

   Rust 提供了许多测试断言宏，如 `assert_eq!`、`assert_ne!`、`assert!`、`assert_approx_eq!` 等，以适应不同的测试需求。你可以根据需要选择适当的宏来编写测试。

6. **测试组织**：

   你可以在不同的模块中组织你的测试，以使测试代码更清晰和易于管理。测试模块可以嵌套，以反映你的代码组织结构。

单元测试在量化金融领域具有重要的意义，它有助于确保量化金融代码的正确性、稳定性和可维护性：

1. **验证金融模型和算法的正确性**：在量化金融领域，代码通常涉及复杂的金融模型和算法。通过编写单元测试，可以验证这些模型和算法是否按照预期工作，从而提高了金融策略的可靠性。
2. **捕获潜在的问题**：单元测试可以帮助捕获潜在的问题和错误，包括数值计算错误、边界情况处理不当、算法逻辑错误等。这有助于在生产环境中避免意外的风险和损失。
3. **快速反馈**：单元测试提供了快速反馈的机制。当开发人员进行代码更改时，单元测试可以自动运行，并迅速告诉开发人员是否破坏了现有的功能。这有助于迅速修复问题，减少了错误的传播。
4. **确保代码的可维护性**：单元测试通常要求编写模块化和可测试的代码。这鼓励开发人员编写清晰、简洁和易于理解的代码，从而提高了代码的可维护性。
5. **支持重构和优化**：通过具有完善的单元测试套件，开发人员可以更加放心地进行代码重构和性能优化。单元测试可以确保在这些过程中不会破坏现有的功能。

所以单元测试在量化金融领域是一种关键的质量保证工具。通过合理编写和维护单元测试，可以降低金融策略的风险，提高交易系统的可靠性，并促进团队的协作和知识共享。因此，在量化金融领域，单元测试被认为是不可或缺的开发实践。

## 26.2 文档测试

文档测试是 Rust 中一种特殊类型的测试，它与单元测试有所不同。文档测试主要用于验证文档中的代码示例是否有效，可以作为文档的一部分运行。这些测试以 `cargo test` 命令运行，但它们会在文档构建期间执行，以确保示例代码仍然有效。以下是如何编写和运行文档测试的详细步骤：

1. **编写文档注释**：

   在你的 Rust 代码中，你可以使用特殊的注释块 `///` 或 `//!` 来编写文档注释。在文档注释中，你可以包括代码示例，如下所示：

   ```rust
   /// This function adds two numbers.
   ///
   /// # Examples
   ///
   /// ```
   /// let result = add(2, 3);
   /// assert_eq!(result, 5);
   /// ```
   pub fn add(a: i32, b: i32) -> i32 {
       a + b
   }
   ```

   在上面的示例中，我们编写了一个名为 `add` 的函数，并使用文档注释包含了一个示例。

2. **运行文档测试**：

   要运行文档测试，你可以使用 `cargo test` 命令，并包括 `--doc` 标志：

   ```
   cargo test --doc
   ```

   运行后，Cargo 将执行文档测试并输出结果。它将查找文档注释中的示例，并尝试运行这些示例。如果示例中的代码成功运行且产生的输出与注释中的示例匹配，测试将通过。

3. **检查文档测试结果**：

   文档测试的结果将包括通过的测试示例和失败的测试示例。你应该检查输出以确保示例代码仍然有效。如果有失败的示例，你需要检查并修复文档或代码中的问题。

文档测试（Document Testing）在量化金融领域具有重要的意义，它不仅有助于确保代码的正确性，还有助于提高代码的可维护性和可理解性。以下是文档测试在量化金融中的一些重要意义：

1. **验证金融模型的正确性**：量化金融领域涉及复杂的金融模型和算法。文档测试可以用于验证这些模型的正确性，确保它们按照预期工作。通过在文档中提供示例和预期结果，可以确保模型在代码实现中与理论模型一致。

2. **示例和文档**：文档测试的结果可以成为代码文档的一部分，提供示例和用法说明。这对于其他开发人员、研究人员和用户来说是非常有价值的，因为他们可以轻松地查看代码示例，了解如何使用量化金融工具和库。

3. **改进代码可读性**：编写文档测试通常需要清晰的文档注释和示例代码，这有助于提高代码的可读性和可理解性。通过清晰的注释和示例，其他人可以更容易地理解代码的工作原理，降低了学习和使用的难度。

4. **快速反馈**：文档测试是一种快速获得反馈的方式。当你修改代码时，文档测试可以自动运行，并告诉你是否破坏了现有的功能或预期结果。这有助于快速捕获潜在的问题并进行修复。

5. **合规性和审计**：在金融领域，合规性和审计是非常重要的。文档测试可以作为合规性和审计过程的一部分，提供可追溯的证据，证明代码的正确性和稳定性。

6. **教育和培训**：文档测试还可以用于培训和教育目的。新入职的开发人员可以通过查看文档测试中的示例和注释来快速了解代码的工作方式和最佳实践。

总之，文档测试在量化金融领域具有重要意义，它不仅有助于验证代码的正确性，还提供了示例、文档、可读性和合规性的好处。通过合理使用文档测试，可以提高量化金融代码的质量，减少错误和问题，并增强代码的可维护性和可理解性。

## 26.3 项目集成测试

Rust 项目的集成测试通常用于测试不同模块之间的交互，以确保整个项目的各个部分正常协作。与单元测试不同，集成测试涵盖了更广泛的范围，通常测试整个程序的功能而不是单个函数或模块。以下是在 Rust 项目中进行集成测试的一般步骤：

1. **创建测试文件**：

   集成测试通常与项目的源代码分开，因此你需要创建一个专门的测试文件夹和测试文件。一般来说，测试文件的命名约定是 `tests` 文件夹下的文件以 `.rs` 扩展名结尾，并且测试模块应该使用 `mod` 关键字定义。

   创建一个测试文件，例如 `tests/integration_test.rs`。

2. **编写集成测试**：

   在测试文件中，你可以编写测试函数来测试整个项目的功能。这些测试函数应该模拟实际的应用场景，包括模块之间的交互。你可以使用 Rust 的标准库中的 `assert!` 宏或其他断言宏来验证代码的行为是否与预期一致。

   ```rust
   // tests/integration_test.rs
   
   #[cfg(test)]
   mod tests {
       #[test]
       fn test_whole_system() {
           // 模拟整个系统的交互
           let result = your_project::function1() + your_project::function2();
           assert_eq!(result, 42);
       }
   }
   ```

   在这个示例中，我们有一个名为 `test_whole_system` 的集成测试函数，它测试整个系统的行为。

3. **配置测试环境**：

   在集成测试中，你可能需要配置一些测试环境，以模拟实际应用中的情况。这可以包括初始化数据库、设置配置选项等。

4. **运行集成测试**：

   使用 `cargo test` 命令来运行项目的集成测试：

   ```
   cargo test --test integration_test
   ```

   这将运行名为 `integration_test` 的测试文件中的所有集成测试函数。

5. **检查测试结果**：

   检查测试运行的结果，包括通过的测试和失败的测试。如果有失败的测试，你需要检查并修复与项目的整合相关的问题。

项目集成测试在 Rust 量化金融中具有关键的意义，它有助于确保整个量化金融系统在各个组件之间协同工作，并满足业务需求。以下是项目集成测试不可或缺的的原因：

1. **验证整个系统的一致性**：量化金融系统通常由多个组件组成，包括数据采集、模型计算、交易执行等。项目集成测试可以确保这些组件在整个系统中协同工作，并保持一致性。它有助于检测潜在的集成问题，例如数据流传输、算法接口等。

2. **模拟真实市场环境**：项目集成测试可以模拟真实市场环境，包括不同市场条件、波动性和交易活动水平。这有助于评估系统在各种市场情况下的性能和可靠性。

3. **检测潜在风险**：量化金融系统必须具备高度的可靠性，以避免潜在的风险和损失。项目集成测试可以帮助检测潜在的风险，例如系统崩溃、错误的交易执行等。

4. **评估系统性能**：集成测试可以用于评估系统的性能，包括响应时间、吞吐量和稳定性。这有助于确定系统是否能够在高负载下正常运行。

5. **测试策略的执行**：量化金融策略可能包括多个组件，包括数据处理、信号生成、仓位管理和风险控制等。项目集成测试可以确保整个策略的执行符合预期。

6. **合规性和审计**：在金融领域，合规性和审计非常重要。项目集成测试可以提供可追溯性和审计的证据，以确保系统在合规性方面达到要求。

7. **自动化测试流程**：通过自动化项目集成测试流程，可以快速发现问题并降低测试成本。自动化测试还可以在每次代码变更后持续运行，以捕获潜在问题。

8. **改进系统可维护性**：项目集成测试通常需要将系统的不同部分解耦合作，这有助于改进系统的可维护性。通过强调接口和模块化设计，可以使系统更容易维护和扩展。

项目集成测试在 Rust 量化金融中的意义在于确保系统的正确性、稳定性和性能，同时降低风险并提高系统的可维护性。这是构建高度可信赖的金融系统所必需的实践，有助于确保交易策略在实际市场中能够可靠执行。

**最后，让我们来对比以下三种测试的异同，以下是 Rust 中单元测试、文档测试和集成测试的对比表格：**

| 特征     | 单元测试                                              | 文档测试                                              | 集成测试                                              |
| -------- | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| 目的     | 验证代码的单个单元（通常是函数或方法）是否按预期工作  | 验证文档中的代码示例是否有效                          | 验证整个项目的各个部分是否正常协作                    |
| 代码位置 | 通常与生产代码位于同一文件中（测试模块）              | 嵌入在文档注释中                                      | 通常位于项目的测试文件夹中，与生产代码分开            |
| 运行方式 | 使用 `cargo test` 命令运行                            | 使用 `cargo test --doc` 命令运行                      | 使用 `cargo test` 命令运行，指定测试文件              |
| 测试范围 | 通常测试单个函数或模块的功能                          | 验证文档中的代码示例                                  | 测试整个项目的不同部分之间的交互                      |
| 断言宏   | 使用断言宏如 `assert_eq!`、`assert_ne!`、`assert!` 等 | 使用断言宏如 `assert_eq!`、`assert_ne!`、`assert!` 等 | 使用断言宏如 `assert_eq!`、`assert_ne!`、`assert!` 等 |
| 测试目标 | 确保单元的正确性                                      | 确保文档中的示例代码正确性                            | 确保整个项目的功能和协作正确性                        |
| 测试环境 | 通常不需要额外的测试环境                              | 可能需要模拟一些环境或配置                            | 可能需要配置一些测试环境，如数据库、配置选项等        |
| 分离性   | 通常与生产代码分开，但位于同一文件中                  | 与文档和代码紧密集成，位于文档注释中                  | 通常与生产代码分开，位于测试文件中                    |
| 自动化   | 通常在开发流程中频繁运行，可自动化                    | 通常在文档构建时运行，可自动化                        | 通常在开发流程中运行，可自动化                        |
| 用途     | 验证代码功能是否正确                                  | 验证示例代码是否有效                                  | 验证整个项目的各个部分是否正常协作                    |

请注意，这些测试类型通常用于不同的目的和测试场景。单元测试主要用于验证单个函数或模块的功能，文档测试用于验证文档中的示例代码，而集成测试用于验证整个项目的功能和协作。在实际开发中，你可能会同时使用这三种测试类型来确保代码的质量和可维护性。

# Chapter 27 常见技术指标及其实现

量化金融技术指标通常用于分析和预测金融市场的走势和价格变动。以下是一些常见的量化金融技术指标：

以下是关于各种常见技术指标的信息，包括它们的名称、描述以及主要用途：

| 技术指标                                            | 描述                                                         | 主要用途                                              |
| --------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| 移动平均线（Moving Averages）                       | 包括简单移动平均线（SMA）和指数移动平均线（EMA），用于平滑价格数据以识别趋势。 | 识别价格趋势和确定趋势的方向。                        |
| 相对强度指标（RSI）                                 | 衡量市场超买和超卖情况，用于判断价格是否过度波动。           | 识别市场的超买和超卖情况，判断价格是否具备反转潜力。  |
| 随机指标（Stochastic Oscillator）                   | 用于测量价格相对于其价格范围的位置，以确定超买和超卖情况。   | 识别资产的超买和超卖情况，产生买卖信号。              |
| 布林带（Bollinger Bands）                           | 通过在价格周围绘制波动性通道来识别价格波动性和趋势。         | 识别价格波动性，确定支撑和阻力水平。                  |
| MACD指标（Moving Average Convergence Divergence）   | 结合不同期限的移动平均线以识别价格趋势的强度和方向。         | 识别价格的趋势、方向和潜在的交叉点。                  |
| 随机强度指标（RSI）                                 | 衡量一种资产相对于市场指数的表现。                           | 评估资产的相对强度和相对弱点。                        |
| ATR指标（Average True Range）                       | 测量资产的波动性，帮助确定止损和止盈水平。                   | 评估资产的波动性，确定适当的风险管理策略。            |
| ADX指标（Average Directional Index）                | 衡量趋势的强度和方向。                                       | 识别市场趋势的强度和方向，帮助决策进出场时机。        |
| ROC指标（Rate of Change）                           | 衡量价格百分比变化以识别趋势的加速或减速。                   | 识别价格趋势的速度变化，潜在的反转或加速。            |
| CCI指标（Commodity Channel Index）                  | 用于识别价格相对于其统计平均值的偏离。                       | 评估资产是否处于超买或超卖状态。                      |
| Fibonacci回调和扩展水平                             | 基于黄金比例的数学工具，用于预测支撑和阻力水平。             | 识别潜在的支撑和阻力水平，帮助决策进出场时机。        |
| 成交量分析指标                                      | 包括成交量柱状图和成交量移动平均线，用于分析市场的活跃度和力量。 | 评估市场活跃度，辅助价格趋势分析。                    |
| 均线交叉                                            | 通过不同周期的移动平均线的交叉来识别买入和卖出信号。         | 识别趋势的改变，产生买卖信号。                        |
| Ichimoku云                                          | 提供了有关趋势、支撑和阻力水平的综合信息。                   | 提供多个指标的综合信息，帮助识别趋势和支撑/阻力水平。 |
| 威廉指标（Williams %R）                             | 类似于随机指标，用于测量超买和超卖情况。                     | 评估资产是否处于超买或超卖状态，产生买卖信号。        |
| 均幅指标（Average Directional Movement Index，ADX） | 用于确定趋势的方向和强度。                                   | 识别市场的趋势方向和趋势的强度，帮助决策进出场时机。  |
| 多重时间框架分析（Multiple Time Frame Analysis）    | 同时使用不同时间周期的图表来确认趋势。                       | 提供更全面的市场分析，减少错误信号的可能性。          |

这些技术指标是量化金融和股票市场分析中常用的工具，交易者使用它们来帮助做出买入和卖出决策，评估市场趋势和风险，并制定有效的交易策略。根据市场情况和交易者的需求，可以选择使用其中一个或多个指标来进行分析。

通常各个主要编程语言都有用于技术分析（Technical Analysis，TA）的库和工具，用于在金融市场数据上执行各种技术指标和分析。在C、Go和Python中常见的TA库一般有这些：

**C语言：**

1. **TA-Lib（Technical Analysis Library）：** TA-Lib是一种广泛使用的C库，提供了超过150种技术指标和图表模式的计算功能。它支持各种不同类型的金融市场数据，并且可以轻松与C/C++项目集成。

**Go语言：**

1. **tulipindicators：** tulipindicators是一个用Go编写的开源技术指标库，它提供了多种常用技术指标的实现。这个库易于使用，可以在Go项目中方便地集成。
2. **go-talib：**ta的go语言wrapper

**Python语言：**

1. **Pandas TA：** Pandas TA是一个基于Python的库，构建在Pandas DataFrame之上，它提供了超过150个技术指标的计算功能。Pandas TA与Pandas无缝集成，使得在Python中进行金融数据分析变得非常方便。
2. **TA-Lib for Python：** 与C版本类似，TA-Lib也有适用于Python的接口，允许Python开发者使用TA-Lib中的技术指标。这个库通过绑定C库的方式实现了高性能。

作为量化金融系统部署的前提之一，在Rust社区的生态中，当然也具有用于技术分析的库，虽然它的生态系统可能没有像Python或C那样丰富，但仍然存在一些可以用于量化金融分析的工具和库，配合自研的技术指标库和数学库，在生产环境下也足够使用。

以下是一些常见的可用于技术分析和量化金融的Rust库，：

1. **TAlib-rs：** TAlib-rs是一个Rust的TA-Lib绑定，它允许Rust开发者使用TA-Lib中的技术指标功能。TA-Lib包含了150多种技术指标的实现，因此通过TAlib-rs，你可以在Rust中执行广泛的技术分

2. **RustQuant：** Rust中的量化金融工具库。同时也是Rust中最大、最成熟的期权定价库。

3. **investments:** 一个用Rust编写的开源库，旨在提供一些用于金融和投资的工具和函数。这个库可能包括用于计算投资回报率、分析金融数据以及执行基本的投资分析的功能。

Rust在金融领域的应用确实相对较新，因此可用的库和工具有一定的可能阙如。不过，随着Rust的不断发展和生态系统的壮大，我预期将会有更多的金融分析和量化交易工具出现。当你已经熟悉Rust编程，并且希望在此领域进行开发的时候，也可以考虑一下为Rust社区贡献更多的金融相关项目和库。

好，之前在第3章我们已经实现了SMA、EMA和RSI，现在我们来尝试进行一些其他实用技术分析指标的rust实现。

### 27.1： 随机指标（Stochastic Oscillator）

在金融市场中，很多投资者会通过尝试识别**"超买"（Overbought）**和**"超卖"（Oversold）**状态并通过自己对这些状态的应对策略来套利。 超买是指市场或特定资产的价格被认为高于其正常或合理的价值水平的情况。这通常发生在价格迅速上升后，投资者情绪变得过于乐观，导致购买压力增加。超买时，市场可能出现过度购买的现象，价格可能会进一步下跌或趋于平稳。而超卖是指市场或特定资产的价格被认为低于其正常或合理的价值水平的情况。这通常发生在价格迅速下跌后，投资者情绪变得过于悲观，导致卖出压力增加。超卖时，市场可能出现过度卖出的现象，价格可能会进一步上涨或趋于平稳。

一些技术指标如相对强度指标（RSI）或随机指标（Stochastic Oscillator）常用来识别超买情况。当这些指标的数值超过特定阈值（通常为70～80），就被视为市场处于超买状态，可能预示着价格的下跌。而当这些指标的数值低于特定阈值（通常为20～30），就被视为市场处于超卖状态，可能预示着价格的上涨。

之前我们在第3章对RSI已经有所了解。现在我们再来学习一下随机指标，它由George C. Lane 在20世纪50年代开发，是一种相对简单但有效的、常用于技术分析的动量指标。

随机指标通常由以下几个主要组成部分构成：

1. **%K线（%K Line）：** %K线是当前价格与一段时间内的价格范围的比率，通常以百分比表示。它可以用以下公式计算：

   %K = [(当前收盘价 - 最低价) / (最高价 - 最低价)] * 100

   %K线的计算结果在0到100之间波动，可以帮助识别价格相对于给定周期内的价格范围的位置。

2. **%D线（%D Line）：** %D线是%K线的平滑线，通常使用移动平均线进行平滑处理。这有助于减少%K线的噪音，提供更可靠的信号。%D线通常使用简单移动平均线（SMA）或指数移动平均线（EMA）进行计算。

3. **超买和超卖水平：** 在随机指标中，通常会绘制两个水平线，一个表示超买水平（通常为80），另一个表示超卖水平（通常为20）。当%K线上穿80时，表明市场可能处于超买状态，可能会发生价格下跌。当%K线下穿20时，表明市场可能处于超卖状态，可能会发生价格上涨。

随机指标的典型用法包括：

- 当%K线上穿%D线时，产生买入信号，表示价格可能上涨。
- 当%K线下穿%D线时，产生卖出信号，表示价格可能下跌。
- 当%K线位于超买水平以上时，可能发生卖出信号。
- 当%K线位于超卖水平以下时，可能发生买入信号。

需要注意的是，随机指标并不是一种绝对的买卖信号工具，而是用于辅助决策的指标。它常常与其他技术指标和分析工具一起使用，以提供更全面的市场分析。交易者还应谨慎使用随机指标，特别是在非趋势市场中，因为在价格范围内波动较大时，可能会产生误导性的信号。因此，对于每个市场环境，需要根据其他指标和分析来进行综合判断。

以下是Stochastic Oscillator（随机指标）和RSI（相对强度指标）之间的主要区别：

| 特征           | Stochastic Oscillator                            | 相对强度指标 (RSI)                                |
| -------------- | ------------------------------------------------ | ------------------------------------------------- |
| 类型           | 动量指标                                         | 动量指标                                          |
| 创建者         | George C. Lane                                   | J. Welles Wilder                                  |
| 计算方式       | 基于当前价格与价格范围的比率                     | 基于平均增益和平均损失                            |
| 计算结果的范围 | 0 到 100                                         | 0 到 100                                          |
| 主要目的       | 识别超买和超卖情况，以及价格趋势变化             | 衡量资产价格的强弱                                |
| %K线和%D线     | 包括%K线和%D线，%D线是%K线的平滑线               | 通常只有一个RSI线                                 |
| 超买和超卖水平 | 通常在80和20之间，用于产生买卖信号               | 通常在70和30之间，用于产生买卖信号                |
| 信号产生       | 当%K线上穿%D线时产生买入信号，下穿时产生卖出信号 | 当RSI线上穿70时产生卖出信号，下穿30时产生买入信号 |
| 应用领域       | 用于识别超买和超卖情况以及价格的反转点           | 用于衡量资产的强弱并确定买卖时机                  |
| 时间周期       | 通常使用短期和长期周期进行计算                   | 通常使用14个交易日周期进行计算                    |
| 常见用途       | 适用于不同市场和资产类别，特别是适用于振荡市场   | 适用于评估股票、期货和外汇等资产的强弱            |

需要注意的是，虽然Stochastic Oscillator和RSI都是用于动量分析的指标，但它们的计算方式、信号产生方式和主要应用方向都略有不同。交易者可以根据自己的交易策略和市场条件选择使用其中一个或两者结合使用，以辅助决策。

### 27.2：布林带（Bollinger Bands）

布林带（Bollinger Bands）是一种常用于技术分析的指标，旨在帮助交易者识别资产价格的波动性和趋势方向。它由约翰·布林格（John Bollinger）于1980年代开发，是一种基于统计学原理的工具。以下是对布林带的详细解释：

**布林带的构成：** 布林带由以下三个主要部分组成：

1. **中轨（中间线）：** 中轨是布林带的中心线，通常是简单移动平均线（SMA）。中轨的计算通常基于一段固定的时间周期，例如20个交易日的收盘价的SMA。这个中轨代表了资产价格的趋势方向。

2. **上轨（上限线）：** 上轨是位于中轨上方的线，其位置通常是中轨加上两倍标准差（Standard Deviation）的值。标准差是一种测量数据分散程度的统计指标，用于衡量价格波动性。上轨代表了资产价格的波动性，通常用来识别价格上涨的潜力。

3. **下轨（下限线）：** 下轨是位于中轨下方的线，其位置通常是中轨减去两倍标准差的值。下轨同样代表了资产价格的波动性，通常用来识别价格下跌的潜力。

**布林带的应用：** 布林带有以下几个主要的应用和用途：

1. **波动性识别：** 布林带的宽窄可以用来衡量价格波动性。带宽收窄通常表示价格波动性较低，而带宽扩大则表示价格波动性较高。这可以帮助交易者判断市场的活跃度和价格趋势的稳定性。

2. **趋势识别：** 当价格趋势明显时，布林带的上轨和下轨可以帮助确定支撑和阻力水平。当价格触及或穿越上轨时，可能表明价格上涨趋势强劲，而当价格触及或穿越下轨时，可能表明价格下跌趋势较强。

3. **超买和超卖情况：** 当价格接近或穿越布林带的上轨时，可能表明市场处于超买状态，因为价格偏离了其正常波动范围。相反，当价格接近或穿越布林带的下轨时，可能表明市场处于超卖状态。

4. **交易信号：** 交易者经常使用布林带产生买入和卖出信号。一种常见的策略是在价格触及上轨时卖出，在价格触及下轨时买入。这可以帮助捕捉价格的短期波动。

需要注意的是，布林带是一种辅助工具，通常需要与其他技术指标和市场分析方法结合使用。交易者应谨慎使用布林带信号，并考虑市场的整体背景和趋势。此外，布林带的参数（如时间周期和标准差倍数）可以根据不同市场和交易策略进行调整。

### 27.3：MACD指标（Moving Average Convergence Divergence）

MACD（Moving Average Convergence Divergence）是一种常用于技术分析的动量指标，用于衡量资产价格趋势的强度和方向。它由杰拉尔德·阿佩尔（Gerald Appel）于1979年首次引入，并且在技术分析中广泛应用。以下是对MACD指标的详细解释：

**MACD指标的构成：** MACD指标由以下三个主要组成部分构成：

1. **快速线（Fast Line）：** 也称为MACD线（MACD Line），是资产价格的短期移动平均线与长期移动平均线之间的差值。通常，快速线的计算基于12个交易日的短期移动平均线减去26个交易日的长期移动平均线。

   快速线（MACD Line） = 12日EMA - 26日EMA

   其中，EMA代表指数加权移动平均线（Exponential Moving Average），它使得近期价格对快速线的影响较大。

2. **慢速线（Slow Line）：** 也称为信号线（Signal Line），是快速线的移动平均线。通常，慢速线的计算使用快速线的9日EMA。

   慢速线（Signal Line） = 9日EMA(MACD Line)

3. **MACD柱状图（MACD Histogram）：** MACD柱状图表示快速线和慢速线之间的差值，用于展示价格趋势的强度和方向。MACD柱状图的计算方法是：

   MACD柱状图 = 快速线（MACD Line） - 慢速线（Signal Line）

**MACD的应用：** MACD指标可以用于以下几个方面的技术分析：

1. **趋势识别：** 当MACD线位于慢速线上方并向上移动时，通常表示价格处于上升趋势，这可能是买入信号。相反，当MACD线位于慢速线下方并向下移动时，通常表示价格处于下降趋势，这可能是卖出信号。

2. **交叉信号：** 当MACD线上穿慢速线时，产生买入信号，表示价格可能上涨。当MACD线下穿慢速线时，产生卖出信号，表示价格可能下跌。

3. **背离（Divergence）：** 当MACD指标与价格图形出现背离时，可能表示趋势的弱化或反转。例如，如果价格创下新低而MACD柱状图创下高点，这可能是价格反转的信号。

4. **柱状图的观察：** MACD柱状图的高度可以反映价格趋势的强度。较高的柱状图表示价格动能较强，较低的柱状图表示价格动能较弱。

需要注意的是，MACD是一种多功能的指标，可以用于不同市场和不同时间周期的分析。它通常需要与其他技术指标和市场分析方法结合使用，以提供更全面的市场信息。MACD的参数可以根据具体情况进行调整，以满足不同的交易策略和市场条件。

### 27.4：ADX指标（Average Directional Index）

ADX（Average Directional Index）是一种用于技术分析的指标，旨在衡量资产价格趋势的强度和方向。ADX是由威尔斯·威尔德（Welles Wilder）于1978年首次引入，它通常与另外两个相关的指标，即DI+（Positive Directional Indicator）和DI-（Negative Directional Indicator）一起使用。以下是对ADX指标的详细解释：

**ADX指标的构成：** ADX指标主要由以下几个部分组成：

1. **DI+（Positive Directional Indicator）：** DI+用于测量正价格移动的强度和方向。它基于价格的正向变化量和总变化量来计算，然后用百分比来表示正向变化的比率。DI+的计算方式如下：

   DI+ = （今日最高价 - 昨日最高价） / 今日最高价与昨日最高价之差 * 100

2. **DI-（Negative Directional Indicator）：** DI-用于测量负价格移动的强度和方向。它类似于DI+，但是针对价格的负向变化量进行计算。DI-的计算方式如下：

   DI- = （昨日最低价 - 今日最低价） / 昨日最低价与今日最低价之差 * 100

3. **DX（Directional Movement Index）：** DX是计算DI+和DI-之间的相对关系的指标，用于确定价格趋势的方向。DX的计算方式如下：

   DX = |（DI+ - DI-）| / （DI+ + DI-） * 100

4. **ADX（Average Directional Index）：** ADX是DX的平滑移动平均线，通常使用14个交易日的EMA来计算。ADX的计算方式如下：

   ADX = 14日EMA(DX)

**ADX的应用：** ADX指标可以用于以下几个方面的技术分析：

1. **趋势强度：** ADX可以帮助交易者确定价格趋势的强度。当ADX值高于某一阈值（通常为25或30）时，表示价格趋势强劲。较高的ADX值可能意味着趋势可能会持续。反之，ADX值低于阈值时，表示价格可能处于横盘或弱势市场中。

2. **趋势方向：** 当DI+高于DI-时，表示市场可能处于上升趋势。当DI-高于DI+时，表示市场可能处于下降趋势。ADX的方向可以帮助确定趋势的方向。

3. **背离（Divergence）：** 当价格趋势与ADX指标出现背离时，可能表示趋势的强度正在减弱，这可能是趋势反转的信号。

需要注意的是，ADX指标主要用于衡量趋势的强度和方向，而不是价格的绝对水平。它通常需要与其他技术指标和分析方法结合使用，以提供更全面的市场信息。ADX的参数（如时间周期和阈值）可以根据具体情况进行调整，以满足不同的交易策略和市场条件。

### 27.5 ：ROC指标（Rate of Change）

ROC（Rate of Change）指标是一种用于技术分析的动量指标，用于衡量资产价格的百分比变化率。ROC指标的主要目的是帮助交易者识别价格趋势的加速或减速，以及潜在的超买和超卖情况。以下是对ROC指标的详细解释：

**ROC指标的计算：** ROC指标的计算非常简单，它通常基于某一时间周期内的价格变化。计算ROC的一般步骤如下：

1. 选择一个特定的时间周期（例如，14个交易日）。

2. 计算当前时刻的价格与过去一段时间内的价格之间的百分比变化率。计算公式如下：

   ROC = （当前价格 - 过去一段时间内的价格） / 过去一段时间内的价格 * 100

   过去一段时间内的价格可以是开盘价、收盘价或任何其他价格。

3. 最终得到的ROC值表示了在给定时间周期内价格的变化率，通常以百分比形式表示。

**ROC的应用：** ROC指标可以用于以下几个方面的技术分析：

1. **趋势识别：** ROC可以帮助交易者识别价格趋势的加速或减速。当ROC值处于正数区域时，表示价格上涨的速度较快；当ROC值处于负数区域时，表示价格下跌的速度较快。趋势的加速通常被视为买入信号或卖出信号，具体取决于市场情况。

2. **超买和超卖情况：** ROC指标也可以用来识别资产的超买和超卖情况。当ROC值迅速上升并达到较高水平时，可能表示市场处于超买状态，价格可能会下跌。相反，当ROC值迅速下降并达到较低水平时，可能表示市场处于超卖状态，价格可能会上涨。

3. **背离（Divergence）：** 当价格走势与ROC指标出现背离时，可能表示趋势的弱化或反转。例如，如果价格创下新高而ROC值没有创新高，这可能是价格反转的信号。

需要注意的是，ROC指标通常需要与其他技术指标和市场分析方法结合使用，以提供更全面的市场信息。ROC的参数（如时间周期）可以根据具体情况进行调整，以满足不同的交易策略和市场条件。

### 27.6：CCI指标（Commodity Channel Index）

CCI（Commodity Channel Index）是一种常用于技术分析的指标，旨在帮助交易者识别资产价格是否超买或超卖，以及趋势的变化。CCI指标最初是由唐纳德·兰伯特（Donald Lambert）在20世纪80年代为商品市场设计的，但后来也广泛用于其他金融市场的技术分析。以下是对CCI指标的详细解释：

**CCI指标的计算：** CCI指标的计算涉及以下几个步骤：

1. **计算Typical Price（典型价格）：** 典型价格是每个交易日的最高价、最低价和收盘价的均值。计算典型价格的公式如下：

   典型价格 = （最高价 + 最低价 + 收盘价） / 3

2. **计算平均典型价格（平均价）：** 平均典型价格是过去一段时间内的典型价格的简单移动平均值。通常，使用一个特定的时间周期（例如20个交易日）来计算平均典型价格。

3. **计算平均绝对偏差（Mean Absolute Deviation）：** 平均绝对偏差是每个交易日的典型价格与平均典型价格之间的差的绝对值的平均值。计算平均绝对偏差的公式如下：

   平均绝对偏差 = 平均值（|典型价格 - 平均典型价格|）

4. **计算CCI指标：** CCI指标的计算使用平均绝对偏差和一个常数倍数（通常为0.015）来计算。计算CCI的公式如下：

   CCI = （典型价格 - 平均典型价格） / （0.015 * 平均绝对偏差）

**CCI的应用：** CCI指标可以用于以下几个方面的技术分析：

1. **超买和超卖情况：** CCI指标通常在一个范围内波动，正值表示资产价格相对较高，负值表示价格相对较低。当CCI值大于100时，可能表示市场超买，价格可能会下跌。当CCI值小于-100时，可能表示市场超卖，价格可能会上涨。

2. **趋势确认：** CCI指标也可以用于确认价格趋势。当CCI持续保持正值时，可能表示上升趋势；当CCI持续保持负值时，可能表示下降趋势。

3. **背离（Divergence）：** 当CCI指标与价格图形出现背离时，可能表示趋势的弱化或反转。例如，如果价格创下新高而CCI没有创新高，这可能是价格反转的信号。

需要注意的是，CCI指标通常需要与其他技术指标和市场分析方法结合使用，以提供更全面的市场信息。CCI的参数（如时间周期和常数倍数）可以根据具体情况进行调整，以满足不同的交易策略和市场条件。

### 27.7：Fibonacci回调和扩展水平

Fibonacci回调和扩展水平是一种基于黄金比例和斐波那契数列的技术分析工具，用于预测资产价格的支撑和阻力水平，以及可能的价格反转点。这些水平是根据斐波那契数列中的特定比率来计算的。以下是对Fibonacci回调和扩展水平的详细解释：

**1. Fibonacci回调水平：**

- **0%水平：** 这是价格上涨或下跌前的起始点。它代表了没有任何价格变化的水平。

- **23.6%水平：** 这是最小的Fibonacci回调水平，通常用于标识价格回调的起始点。在上升趋势中，价格可能在达到一定高度后回调至此水平。在下降趋势中，价格可能在达到一定低点后回调至此水平。

- **38.2%水平：** 这是另一个重要的Fibonacci回调水平，通常用于识别更深的回调。在趋势中，价格可能在达到高点或低点后回调至此水平。

- **50%水平：** 这不是斐波那契数列的一部分，但它在技术分析中仍然常常被视为重要水平。价格回调至50%水平通常表示一种中性或平衡状态。

- **61.8%水平：** 这是最常用的Fibonacci回调水平之一，通常用于标识较深的回调。在趋势中，价格可能在达到高点或低点后回调至此水平。

- **76.4%水平：** 这是另一个较深的回调水平，有时被用作支撑或阻力水平。

**2. Fibonacci扩展水平：**

- **100%水平：** 这是价格的起始点，与0%水平相对应。在技术分析中，价格达到100%水平通常表示可能出现完全的价格反转。

- **123.6%水平：** 这是用于标识较深的价格反转点的扩展水平。在趋势中，价格可能在达到一定高度后反转至此水平。

- **138.2%水平：** 这是另一个扩展水平，通常用于识别更深的价格反转。

- **161.8%水平：** 这是最常用的Fibonacci扩展水平之一，通常用于标识较深的价格反转点。

- **200%水平：** 这是价格的终点，与0%水平相对应。在技术分析中，价格达到200%水平通常表示可能出现完全的价格反转。

Fibonacci回调和扩展水平可以帮助交易者识别可能的支撑和阻力水平，以及价格反转的潜在点。然而，需要注意的是，这些水平并不是绝对的，不能单独用于决策。它们通常需要与其他技术指标和分析方法结合使用，以提供更全面的市场信息。此外，市场中的价格行为可能会受到多种因素的影响，因此仍需要谨慎分析。

### 27.8：均线交叉策略

均线交叉策略是一种常用于技术分析和股票交易的简单但有效的策略。该策略利用不同时间周期的移动平均线的交叉来识别买入和卖出信号。以下是对均线交叉策略的详细解释：

**1. 移动平均线（Moving Averages）：** 均线交叉策略的核心是使用移动平均线，通常包括以下两种类型：

- **短期移动平均线（Short-term Moving Average）：** 通常使用较短的时间周期，如10天或20天，用来反映较短期的价格趋势。

- **长期移动平均线（Long-term Moving Average）：** 通常使用较长的时间周期，如50天或200天，用来反映较长期的价格趋势。

**2. 买入信号：** 均线交叉策略的买入信号通常发生在短期移动平均线向上穿越长期移动平均线时，这被称为“黄金交叉”。这意味着短期趋势正在上升，可能是买入的好时机。

**3. 卖出信号：** 均线交叉策略的卖出信号通常发生在短期移动平均线向下穿越长期移动平均线时，这被称为“死亡交叉”。这意味着短期趋势正在下降，可能是卖出的好时机。

**4. 确认信号：** 一些交易者使用其他技术指标或价格模式来确认均线交叉信号的有效性。例如，他们可能会查看相对强度指标（RSI）或MACD指标，以确保市场处于趋势状态。

**5. 风险管理：** 在执行均线交叉策略时，风险管理非常重要。交易者通常会设定止损和止盈水平，以控制风险并保护利润。止损水平通常设置在买入价格下方，而止盈水平则根据市场条件和交易者的目标而定。

**6. 适用性：** 均线交叉策略适用于不同市场和资产，包括股票、外汇、期货和加密货币。然而，它可能在不同市场环境下表现不同，因此需要根据市场情况进行调整。

**7. 缺点：** 均线交叉策略有时会产生虚假信号，特别是在市场处于横盘或震荡状态时。因此，交易者需要谨慎使用，并结合其他指标和分析方法来提高准确性。

总之，均线交叉策略是一种简单但常用的技术分析策略，用于识别买入和卖出信号。它可以作为交易决策的起点，但交易者需要谨慎使用，并结合其他因素来进行综合分析和风险管理。

### 27.9： Ichimoku云

![img_1.png](/home/arthur/Documents/Cookbook-for-Rustaceans-in-Finance/img_1.png)
Ichimoku云，也称为**一目均衡图**，是一种综合性的技术分析工具，最初由日本分析师兼记者一目山人（Goichi Hosoda）在20世纪20年代开发。该工具旨在提供有关资产价格趋势、支撑和阻力水平以及未来价格走势的综合信息。Ichimoku云由多个组成部分组成，以下是对每个组成部分的详细解释：

**1. 转换线（転換線 Tenkan-sen）：** 转换线是计算Ichimoku云的第一个组成部分，通常表示为红色线。它是最近9个交易日的最高价和最低价的平均值。转换线用于提供近期价格走势的参考。

**2. 基准线（基準線 Kijun-sen）：** 基准线是计算Ichimoku云的第二个组成部分，通常表示为蓝色线。它是最近26个交易日的最高价和最低价的平均值。基准线用于提供中期价格走势的参考。

**3. 云层（先行スパン Senkou Span/Kumo）：** 云层是Ichimoku云的主要组成部分之一，包括两条线，分别称为Senkou Span A和Senkou Span B。Senkou Span A通常表示为浅绿色线，是转换线和基准线的平均值，向前移动26个交易日。Senkou Span B通常表示为深绿色线，是最近52个交易日的最高价和最低价的平均值，向前移动26个交易日。云层的颜色表示价格走势的方向，例如，云层由浅绿色变为深绿色可能表示上升趋势。

**4. 未来云（Future Cloud）：** 未来云是Ichimoku云中的一部分，通常由两个Senkou Span线组成，即Senkou Span A和Senkou Span B。未来云的颜色也表示价格走势的方向，可以用来预测未来价格趋势。云层和未来云之间的区域称为“云中”也叫雲 kumo (抵抗帯 teikoutai )，可以用来识别支撑和阻力水平。

**5. 延迟线（遅行スパン Chikou Span）：** 延迟线是Ichimoku云的最后一个组成部分，通常表示为橙色线。它是当前收盘价移动到过去26个交易日的线。延迟线用于提供价格走势的确认，当延迟线在云层或未来云之上时，可能表示上升趋势，当它在云层或未来云之下时，可能表示下降趋势。

Ichimoku云的主要应用包括：

- 识别趋势：Ichimoku云可以帮助交易者识别价格的长期和中期趋势。上升趋势通常表现为云层由浅绿色变为深绿色，而下降趋势则相反。

- 支撑和阻力：云层和未来云中的区域可以用作支撑和阻力水平的参考。

- 买卖信号：均线的交叉以及价格与云层的相对位置可以提供买入和卖出信号。

需要注意的是，Ichimoku云是一种复杂的工具，通常需要深入学习和理解。交易者应该谨慎使用，并结合其他技术指标和市场分析方法来进行综合分析。

### 27.10：威廉指标（Williams %R）

威廉指标（Williams %R），也称为威廉超买超卖指标，是一种用于衡量市场超买和超卖情况的动量振荡指标。它是由拉里·威廉斯（Larry Williams）在20世纪70年代开发的。威廉指标的主要目标是帮助交易者识别价格反转点，并提供买入和卖出的时机。

以下是威廉指标的详细解释：

1. **计算方式：** 威廉指标的计算基于以下公式：

   威廉%R = [（最高价 - 当前收盘价） / （最高价 - 最低价）] * (-100)

   - 最高价是在一定时间内的最高价格。
   - 最低价是在一定时间内的最低价格。
   - 当前收盘价是当前周期的收盘价格。

   威廉%R的值通常在-100到0之间波动，其中-100表示市场处于最超卖状态，0表示市场处于最超买状态。

2. **超买和超卖情况：** 威廉指标的主要应用是识别市场的超买和超卖情况。当威廉%R的值位于-80或更高时，通常被认为市场处于超卖状态，可能会发生价格上涨的机会。相反，当威廉%R的值位于-20或更低时，通常被认为市场处于超买状态，可能会发生价格下跌的机会。

3. **买入和卖出信号：** 威廉指标的买入和卖出信号通常基于以下条件：

   - 买入信号：当威廉%R的值从超卖区域向上穿越-20时，产生买入信号。这表示市场可能正在从超卖状态中反弹，并可能迎来价格上涨。

   - 卖出信号：当威廉%R的值从超买区域向下穿越-80时，产生卖出信号。这表示市场可能正在从超买状态中回调，并可能迎来价格下跌。

4. **背离（Divergence）：** 交易者还可以使用威廉指标与价格图形之间的背离来确认信号。例如，如果价格创下新高而威廉%R没有创新高，这可能表示价格反转的信号。

5. **适用性：** 威廉指标适用于各种市场，包括股票、外汇、期货和加密货币。然而，需要注意的是，它在不同市场环境下表现可能不同，因此交易者应该谨慎使用，并结合其他技术指标和分析方法来提高准确性。

需要强调的是，威廉指标是一种动量振荡指标，通常用于短期交易。交易者应该将其与其他分析工具和风险管理策略结合使用，以作出更明智的交易决策。

### 27.11：均幅指标（Average Directional Movement Index，ADX）

均幅指标（Average Directional Movement Index，ADX）是一种用于衡量市场趋势强度和方向的技术指标。它是由威尔斯·威尔德（Welles Wilder）在1978年首次引入，并在他的著作《新概念技术分析》中详细描述。ADX的主要用途是帮助交易者确认是否存在趋势并评估趋势的强度。以下是对ADX的详细解释：

1. **计算方式：** ADX的计算基于一系列的步骤：

   a. **真实范围（True Range）：** 首先，需要计算每个周期的真实范围。真实范围是以下三个值中的最大值：

      - 当前周期的最高价与最低价之差。
      - 当前周期的最高价与前一个周期的收盘价之差的绝对值。
      - 当前周期的最低价与前一个周期的收盘价之差的绝对值。

   b. **方向定向运动（Directional Movement）：** 接下来，需要计算正方向定向运动（+DI）和负方向定向运动（-DI）。这些值用于测量上升和下降的趋势方向。+DI表示上升趋势方向，而-DI表示下降趋势方向。

   c. **方向定向运动指数（Directional Movement Index，DX）：** DX是+DI和-DI之间的差值的绝对值除以它们的和的百分比。

   d. **平均方向定向运动指数（Average Directional Movement Index，ADX）：** 最后，ADX是DX的移动平均线，通常使用14个周期的简单移动平均线。

2. **ADX的取值范围：** ADX的值通常在0到100之间，表示市场趋势的强度。一般来说，ADX的值越高，趋势越强。当ADX的值高于25到30时，通常被视为趋势强度足够，可以考虑进行趋势跟随交易。当ADX的值低于25到20时，通常被视为市场处于非趋势状态，可能更适合进行区间交易或避免交易。

3. **ADX的应用：** ADX可以用于以下方式：

   - **确认趋势：** ADX可以帮助交易者确认市场是否处于趋势状态。当ADX的值升高时，表示市场可能处于强烈的趋势中，可以考虑跟随趋势交易。反之，当ADX的值低时，市场可能处于震荡或横盘状态。

   - **评估趋势强度：** ADX的值可以用来评估趋势的强度。较高的ADX值表示趋势更强烈，而较低的ADX值表示趋势较弱。

   - **确定交易策略：** 交易者可以将ADX与其他技术指标结合使用，例如移动平均线或相对强度指标（RSI），来制定交易策略。

需要注意的是，ADX是一个延迟指标，因为它是基于一定周期的数据计算的。交易者应该将ADX与其他分析工具和风险管理策略一起使用，以作出明智的交易决策。

### 27.12：多重时间框架分析（Multiple Time Frame Analysis）

多重时间框架分析（Multiple Time Frame Analysis）是一种广泛用于技术分析和交易决策的方法。它的基本理念是，在进行技术分析时，不仅要考虑单一的时间框架（例如日线图或小时图），而是要同时考虑多个不同时间周期的图表，以获得更全面的市场信息和更可靠的交易信号。多重时间框架分析有助于交易者更好地了解市场的大趋势、中期趋势和短期趋势，以便更明智地做出交易决策。

以下是多重时间框架分析的详细解释：

1. **选择多个时间框架：** 首先，交易者需要选择多个不同的时间框架来分析市场。通常，会选择长期、中期和短期时间框架，如日线图（长期）、4小时图（中期）和1小时图（短期）。

2. **分析长期趋势：** 在最长时间框架上，交易者将查看市场的长期趋势。这有助于确定市场的主要趋势方向，例如是否是上升、下降或横盘。长期趋势分析通常涉及到趋势线、移动平均线和其他长期指标的使用。

3. **分析中期趋势：** 在中期时间框架上，交易者将更详细地研究市场的中期趋势。这有助于确定长期趋势中的次要波动。中期趋势通常以几天到几周为单位。交易者可以使用各种技术工具，如MACD（移动平均收敛散度）或RSI（相对强弱指标）来分析中期趋势。

4. **分析短期趋势：** 在短期时间框架上，交易者将更仔细地观察市场的短期波动。这有助于确定在中期和长期趋势中的适当入场和出场点。短期趋势通常以几小时到几天为单位。在这个时间框架上，交易者可能使用技术分析中的各种图形和信号，如头肩顶和双底，以及短期移动平均线。

5. **协调分析结果：** 最后，交易者需要协调不同时间框架的分析结果。例如，如果长期趋势是上升的，中期趋势也是上升的，那么短期内出现的下跌可能只是短期波动，而不是反转趋势的信号。这种协调有助于避免错误的交易决策。

多重时间框架分析的优势在于它提供了更全面的市场视角，有助于降低交易者因短期波动而做出的错误决策的风险。然而，这也需要更多的时间和分析工作，因此需要交易者有耐心和技术分析的知识。

最后，多重时间框架分析不是一种绝对的成功方法，而是一种帮助交易者更好地理解市场的工具。成功的交易还依赖于风险管理、资金管理和心理控制等其他因素。

### 27.13 指标的遴选和应用

有这么多判断超卖超买的指标，到底该怎么选择呢？选择哪种指标来判断超买和超卖情况，以及其他技术分析工具，取决于你的个人偏好、交易策略和市场状况。以下是一些建议，帮助你在使用这些指标时作出明智的选择：

1. **了解不同指标的原理和计算方法：** 首先，你应该深入了解每个指标的工作原理、计算方式以及它们所衡量的市场特征。这将帮助你更好地理解它们在不同市场情况下的适用性。

2. **根据交易策略选择指标：** 你的交易策略应该是决定使用哪些指标的关键因素。不同的策略可能需要不同类型的指标。例如，日内交易者可能更关心短期波动，而长期投资者可能更关心趋势的长期方向。

3. **多指标确认：** 通常，不应该依赖单一指标来做出决策。相反，使用多个指标来确认信号，可以提高你的决策的可靠性。例如，当多个指标同时显示超买信号时，这可能更具说服力。

4. **了解市场条件：** 不同的市场条件下，不同的指标可能更有效。在平静的市场中，可能更容易出现超买或超卖情况，而在趋势明显的市场中，其他趋势跟踪指标可能更有用。

5. **适应时间周期：** 选择指标时，要考虑你所交易的时间周期。某些指标可能在较短时间框架上更为有效，而其他指标可能在较长时间框架上更为有效。

6. **实践和回测：** 在真实市场之前，先在模拟环境中使用不同的指标进行回测和实践。这可以帮助你了解不同指标的表现，并找到最适合你的策略的指标组合。

7. **风险管理：** 无论你选择哪些指标，都要记住风险管理的重要性。不要仅仅依赖指标来做出决策，而是将其作为整个交易计划的一部分。

最终，选择哪些指标是一项个人化的决策，需要基于你的交易目标、风险承受能力和市场条件做出。建议与其他经验丰富的交易者交流，学习他们的方法，并根据自己的经验不断优化你的交易策略。

判断这些指标在回测中的表现需要进行系统性的分析和评估。以下是一些步骤，未来会帮助我们来评估指标在回测中的表现：

1. **选择回测平台和数据源：** 首先，选择一个可信赖的回测平台或软件，并获取高质量的历史市场数据。确保我们的回测环境与实际交易条件尽可能一致。
2. **制定明确的交易策略：** 在回测之前，明确定义我们的交易策略，包括入场规则、出场规则、止损和止盈策略，以及资本管理规则。确保策略清晰且可操作。
3. **回测参数设置：** 针对每个指标，设置适当的参数值。例如，对于RSI，我们可以测试不同的周期（通常是14天），并确定哪个周期在历史数据上表现最好。
4. **回测时间段：** 选择一个适当的回测时间段，可以是几年或更长时间的历史数据。确保涵盖不同市场情况，包括趋势市和横盘市。
5. **执行回测：** 使用所选的回测平台执行回测，根据我们的策略和参数值生成交易信号，并模拟实际交易。记录每笔交易的入场和出场价格、止损和止盈水平，以及交易成本（如手续费和滑点）。
6. **绩效度量：** 评估回测的绩效。常见的绩效度量包括：
   - **累积回报率（Cumulative Returns）：** 查看策略的总回报。
   - **胜率（Win Rate）：** 计算获利交易的比例。
   - **最大回撤（Maximum Drawdown）：** 识别策略在最差情况下可能遭受的损失。
   - **夏普比率（Sharpe Ratio）：** 衡量每单位风险所产生的回报。
   - **年化回报率（Annualized Returns）：** 将回报率 annualize 为年度水平。
7. **优化参数：** 如果回测结果不理想，可以尝试不同的参数组合或修改策略规则，然后重新进行回测，以寻找更好的表现。
8. **风险管理：** 在回测中也要考虑风险管理策略，如止损和止盈水平的设置，以及头寸规模的管理。
9. **实时模拟测试：** 最后，在回测表现良好后，进行实时模拟测试以验证策略在实际市场条件下的表现。

不过最好还是要有这个意识——回测是一种有限制的模拟，不能保证未来表现与历史表现相同。市场条件会不断变化，因此，我建议我们应该将回测作为策略开发的一部分，而不是最终的唯一决策依据。此外，在未来我们要持续注意避免他和7th过度拟合（过度优化）的问题，不要过于依赖特定的参数组合，而是寻找稳健的策略。最好的方法是持续监测和优化我们的交易策略，以适应不断变化的市场。



# Chapter 28 用Polars实现并加速数据框架处理

## 28.1 Rust与数据框架处理工具Polars

经过以上的学习，我们很自然地知道，Rust 的编译器通过严格的编译检查和优化，能够生成接近于手写汇编的高效代码。它的零成本抽象特性确保了高效的运行时性能，非常适合处理大量数据和计算密集型任务。同时，Rust 提供了独特的所有权系统和借用检查器，能够防止数据竞争和内存泄漏。这些特性使得开发者可以编写更安全的多线程数据处理代码，减少并发错误的发生。另外，Rust 的并发模型使得编写高效的并行代码变得更加简单和安全。通过使用 `Tokio` 等异步编程框架，开发者可以高效地处理大量并发任务，提升数据处理的吞吐量。所以使用 Rust 进行数据处理，结合其性能、安全性、并发支持和跨平台兼容性，我们能够构建出高效、可靠和灵活的数据处理工具，满足现代数据密集型应用的需求。本节将以Poars为例教读者如何实现并加速数据框架处理。

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

## 28.2 开始使用Polars

### 28.2.1 为项目加入polars库

本章节旨在帮助您开始使用 Polars。它涵盖了该库的所有基本功能和特性，使新用户能够轻松熟悉从初始安装和设置到核心功能的基础知识。如果您已经是高级用户或熟悉 DataFrame，您可以跳过本章节，直接进入下一个章节了解安装选项。

```toml
# 为项目加入polars库并且打开 'lazy' flag
cargo add polars -F lazy

# Or Cargo.toml
[dependencies]
polars = { version = "x", features = ["lazy", ...]}
```

### 28.2.2 读取与写入

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
│ integer ┆ date                ┆ float ┆ string │
│ ---     ┆ ---                 ┆ ---   ┆ ---    │
│ i64     ┆ datetime[μs]        ┆ f64   ┆ str    │
╞═════════╪═════════════════════╪═══════╪════════╡
│ 1       ┆ 2025-01-01 00:00:00 ┆ 4.0   ┆ a      │
│ 2       ┆ 2025-01-02 00:00:00 ┆ 5.0   ┆ b      │
│ 3       ┆ 2025-01-03 00:00:00 ┆ 6.0   ┆ c      │
└─────────┴─────────────────────┴───────┴────────┘
```



### 28.2.3 Polars 表达式

Polars 的表达式是其核心优势之一，提供了模块化结构，使得简单概念可以组合成复杂查询。以下是构建所有查询的基本组件：

- `select`
- `filter`
- `with_columns`
- `group_by`

要了解更多关于表达式和它们操作的上下文，请参阅用户指南中的上下文和表达式部分。

#### 28.2.3.1 选择（Select）

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

```
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

```
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

#### 28.2.3.2 过滤（Filter）

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
│ a   ┆ b        ┆ c                   ┆ d   │
│ --- ┆ ---      ┆ ---                 ┆ --- │
│ i64 ┆ f64      ┆ datetime[μs]        ┆ f64 │
╞═════╪══════════╪═════════════════════╪═════╡
│ 1   ┆ 0.596863 ┆ 2025-12-02 00:00:00 ┆ 2.0 │
│ 2   ┆ 0.691304 ┆ 2025-12-03 00:00:00 ┆ NaN │
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
│ a   ┆ b        ┆ c                   ┆ d     │
│ --- ┆ ---      ┆ ---                 ┆ ---   │
│ i64 ┆ f64      ┆ datetime[μs]        ┆ f64   │
╞═════╪══════════╪═════════════════════╪═══════╡
│ 0   ┆ 0.10666  ┆ 2025-12-01 00:00:00 ┆ 1.0   │
│ 1   ┆ 0.596863 ┆ 2025-12-02 00:00:00 ┆ 2.0   │
│ 3   ┆ 0.906636 ┆ 2025-12-04 00:00:00 ┆ -42.0 │
└─────┴──────────┴─────────────────────┴───────┘
```



#### 28.2.3.3 添加列（Add Columns）

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

```
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

#### 28.2.3.4 分组（Group by）

我们将创建一个新的 DataFrame 来演示分组功能。这个新的 DataFrame 包含多个“组”，我们将按这些组进行分组。

#### 创建 DataFrame

```rust
use polars::prelude::*;

// 创建 DataFrame
let df2: DataFrame = df!("x" => 0..8, "y"=> &["A", "A", "A", "B", "B", "C", "X", "X"]).expect("should not fail");
println!("{}", df2);
```

输出示例：

```
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

```
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

```
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

#### 28.2.3.5 组合操作

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

```
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

```
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

### 28.2.4 合并 DataFrames

根据使用情况，DataFrames 可以通过两种方式进行合并：`join` 和 `concat`。

####  28.2.4.1 连接（Join）

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

```
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



#### 28.2.4.2 粘连（Concat）

我们也可以粘连两个 DataFrames。垂直粘连会使 DataFrame 变长，水平粘连会使 DataFrame 变宽。以下示例展示了水平粘连两个 DataFrames 的结果。

#### Rust 示例代码

```rust
use polars::prelude::*;

// 水平连接两个 DataFrames
let stacked = df.hstack(df2.get_columns())?;
println!("{}", stacked); // 打印连接后的 DataFrame
```

输出示例：

```
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

### 28.2.5 基本数据类型

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

----------------------

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

### 28.3.6 数据结构 

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

```
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

```
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

```
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

```
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

```
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



## 28.3 Polars进阶学习

### 28.3.1 上下文 (Context )

### 28.3.2 惰性模式 (Lazy Mode)

### 28.3.3 流模式 (Streaming Mode)




# Upcoming Chapters 

> ####  Chapter 29 - 引擎系统
>
> ####  Chapter 30 - 日志系统
>
> ####  Chapter 31 - 投资组合管理
>
> ####  Chapter 32 - 量化计量经济学
>
> ####  Chapter 33 - 限价指令簿
>
> ####  Chapter 34 - 最优配置和执行
>
> ####  Chapter 35 - 风险控制策略
>
> ####  Chapter 36 - 机器学习



