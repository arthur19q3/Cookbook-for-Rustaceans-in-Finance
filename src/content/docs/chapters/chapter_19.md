---
title: '时间处理'
---

在Rust中进行时间处理通常涉及使用标准库中的`std::time`模块。这个模块提供了一些结构体和函数，用于获取、表示和操作时间。

以下是一些关于在Rust中进行时间处理的详细信息：

## 19.1 系统时间交互

要获取当前时间，可以使用`std::time::SystemTime`结构体和`SystemTime::now()`函数。

```rust
use std::time::{SystemTime};

fn main() {
    let current_time = SystemTime::now();
    println!("Current time: {:?}", current_time);
}
```

**执行结果：**

```text
Current time: SystemTime { tv_sec: 1694870535, tv_nsec: 559362022 }
```

## 19.2 时间间隔和时间运算

在Rust中，时间间隔通常由`std::time::Duration`结构体表示，它用于表示一段时间的长度。

```rust
use std::time::Duration;

fn main() {
    let duration = Duration::new(5, 0); // 5秒
    println!("Duration: {:?}", duration);
}
```

**执行结果：**

```text
Duration: 5s
```

时间间隔是可以直接拿来运算的，rust支持例如添加或减去时间间隔，以获取新的时间点。

```rust
use std::time::{SystemTime, Duration};

fn main() {
    let current_time = SystemTime::now();
    let five_seconds = Duration::new(5, 0);

    let new_time = current_time + five_seconds;
    println!("New time: {:?}", new_time);
}
```

**执行结果：**

```text
New time: SystemTime { tv_sec: 1694870769, tv_nsec: 705158112 }
```

## 19.3 格式化时间

若要将时间以特定格式显示为字符串，可以使用 `chrono` 库。

```rust
use chrono::{DateTime, Utc, Duration, Datelike};

fn main() {
    // 获取当前时间
    let now = Utc::now();

    // 将时间格式化为字符串
    let formatted_time = now.format("%Y-%m-%d %H:%M:%S").to_string();
    println!("Formatted Time: {}", formatted_time);

    // 解析字符串为时间
    let datetime_str = "1983 Apr 13 12:09:14.274 +0800"; //注意rust最近更新后，这个输入string需要带时区信息。此处为+800代表东八区。
    let format_str = "%Y %b %d %H:%M:%S%.3f %z";
    let dt = DateTime::parse_from_str(datetime_str, format_str).unwrap();
     println!("Parsed DateTime: {}", dt);

    // 进行日期和时间的计算
    let two_hours_from_now = now + Duration::hours(2);
    println!("Two Hours from Now: {}", two_hours_from_now);

    // 获取日期的部分
    let date = now.date_naive();
    println!("Date: {}", date);

    // 获取时间的部分
    let time = now.time();
    println!("Time: {}", time);

    // 获取星期几
    let weekday = now.weekday();
    println!("Weekday: {:?}", weekday);
}
```

**执行结果：**

```text
Formatted Time: 2023-09-16 13:47:10
Parsed DateTime: 1983-04-13 12:09:14.274 +08:00
Two Hours from Now: 2023-09-16 15:47:10.882155748 UTC
Date: 2023-09-16
Time: 13:47:10.882155748
Weekday: Sat
```

这些是Rust中进行时间处理的基本示例。你可以根据具体需求使用这些功能来执行更高级的时间操作，例如计算时间差、定时任务、处理时间戳等等。要了解更多关于时间处理的细节，请查阅Rust官方文档以及`chrono`库的文档。

## 19.4 时差处理

`chrono` 是 Rust 中用于处理日期和时间的库。它提供了强大的日期时间处理功能，可以帮助你执行各种日期和时间操作，包括时差的处理。下面详细解释如何使用 `chrono` 来处理时差。

首先，你需要在 Rust 项目中添加 `chrono` 库的依赖。在 `Cargo.toml` 文件中添加以下内容：

```toml
[dependencies]
chrono = "0.4"
chrono-tz = "0.8.3"
```

接下来，让我们从一些常见的日期和时间操作开始，以及如何处理时差：

```rust
use chrono::{DateTime, Utc, TimeZone};
use chrono_tz::{Tz, Europe::Berlin, America::New_York};

fn main() {
    // 获取当前时间，使用UTC时区
    let now_utc = Utc::now();
    println!("Current UTC Time: {}", now_utc);

    // 使用特定时区获取当前时间
    let now_berlin: DateTime<Tz> = Utc::now().with_timezone(&Berlin);
    println!("Current Berlin Time: {}", now_berlin);

    let now_new_york: DateTime<Tz> = Utc::now().with_timezone(&New_York);
    println!("Current New York Time: {}", now_new_york);

    // 时区之间的时间转换
    let berlin_time = now_utc.with_timezone(&Berlin);
    let new_york_time = berlin_time.with_timezone(&New_York);
    println!("Berlin Time in New York: {}", new_york_time);

    // 获取时区信息
    let berlin_offset = Berlin.offset_from_utc_datetime(&now_utc.naive_utc());
    println!("Berlin Offset: {:?}", berlin_offset);

    let new_york_offset = New_York.offset_from_utc_datetime(&now_utc.naive_utc());
    println!("New York Offset: {:?}", new_york_offset);
}

```

**执行结果**：

```text
Current UTC Time: 2023-09-17 01:15:56.812663350 UTC
Current Berlin Time: 2023-09-17 03:15:56.812673617 CEST
Current New York Time: 2023-09-16 21:15:56.812679483 EDT
Berlin Time in New York: 2023-09-16 21:15:56.812663350 EDT
Berlin Offset: CEST
New York Offset: EDT
```

### 补充学习： `with_timezone` 方法

在 `chrono` 中，你可以使用 `with_timezone` 方法将日期时间对象转换为常见的时区。以下是一些常见的时区及其在 `chrono` 中的表示和用法：

1. **UTC（协调世界时）：**

   ```rust
   use chrono::{DateTime, Utc};

   let utc: DateTime<Utc> = Utc::now();
   ```

   在 `chrono` 中，`Utc` 是用于表示协调世界时的类型。

2. **本地时区：**

   `chrono` 可以使用操作系统的本地时区。你可以使用 `Local` 来表示本地时区。

   ```rust
   use chrono::{DateTime, Local};

   let local: DateTime<Local> = Local::now();
   ```

3. **其他时区：**

   如果你需要表示其他时区，可以使用 `chrono-tz` 库。这个库扩展了 `chrono`，使其支持更多的时区。

   首先，你需要将 `chrono-tz` 添加到你的 `Cargo.toml` 文件中：

   ```toml
   [dependencies]
   chrono-tz = "0.8"
   ```

   创造一个datetime，然后把它转化成一个带时区信息的datetime：

   ```rust
   use chrono::{TimeZone, NaiveDate};
   use chrono_tz::Africa::Johannesburg;

   let naive_dt = NaiveDate::from_ymd(2038, 1, 19).and_hms(3, 14, 08);
   let tz_aware = Johannesburg.from_local_datetime(&naive_dt).unwrap();
   assert_eq!(tz_aware.to_string(), "2038-01-19 03:14:08 SAST");
   ```

请注意，`chrono-tz` 可以让我们表示更多的时区，但也会增加项目的依赖和复杂性。根据你的需求，你可以选择使用 `Utc`、`Local` 还是 `chrono-tz` 中的特定时区类型。

如果只需处理常见的 UTC 和本地时区，那么 `Utc` 和 `Local` 就足够了。如果需要更多的时区支持，可以考虑使用 `chrono-tz`，[[chrono-tz官方文档]](https://docs.rs/chrono-tz/latest/chrono_tz/#modules)中详细列有可用的时区的模块和常量，有需要可以移步查询。
