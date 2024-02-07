---
title: '时序数据库 Clickhouse【未完成】'
---

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

#### 在Ubuntu上安装ClickHouse

1. 打开终端并更新包列表：

   ```shell
   sudo apt update
   ```

2. 安装ClickHouse的APT存储库：

   ```shell
   sudo apt install apt-transport-https ca-certificates dirmngr
   sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv E0C56BD4
   echo "deb https://repo.clickhouse.tech/deb/stable/ main/" | sudo tee /etc/apt/sources.list.d/clickhouse.list
   ```

3. 再次更新包列表以获取ClickHouse包：

   ```shell
   sudo apt update
   ```

4. 安装ClickHouse Server：

   ```shell
   sudo apt install clickhouse-server
   ```

5. 启动ClickHouse服务：

   ```shell
   sudo service clickhouse-server start
   ```

6. 我们可以使用以下命令检查ClickHouse服务器的状态：

   ```shell
   sudo service clickhouse-server status
   ```

#### 在Manjaro / Arch Linux上安装ClickHouse

1. 打开终端并使用以下命令安装ClickHouse：

   ```shell
   sudo pacman -S clickhouse
   ```

2. 启动ClickHouse服务：

   ```shell
   sudo systemctl start clickhouse-server
   ```

3. 我们可以使用以下命令检查ClickHouse服务器的状态：

   ```shell
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

### 24.2 ClickHouse for Rust: clickhouse-rs库【未完成】

### 24.3备份ClickHouse【未完成】

### 案例 在Clickhouse数据库中建表、删表、查询【未完成】
