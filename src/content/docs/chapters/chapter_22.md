---
title: '文件处理'
---

在 Rust 中进行文件处理涉及到多个标准库模块和方法，主要包括 `std::fs`、`std::io` 和 `std::path`。下面详细解释如何在 Rust 中进行文件的创建、读取、写入和删除等操作。

## 22.1 基础操作

### 22.1.1 打开和创建文件

要在 Rust 中打开或创建文件，可以使用 `std::fs` 模块中的方法。以下是一些常用的方法：

1. 打开文件以读取内容：

   ```rust
   use std::fs::File;
   use std::io::Read;

   fn main() -> std::io::Result<()> {
       let mut file = File::open("file.txt")?;
       let mut contents = String::new();
       file.read_to_string(&mut contents)?;
       println!("File contents: {}", contents);
       Ok(())
   }
   ```

   上述代码中，我们使用 `File::open` 打开文件并读取其内容。

2. 创建新文件并写入内容：

   ```rust
   use std::fs::File;
   use std::io::Write;

   fn main() -> std::io::Result<()> {
       let mut file = File::create("new_file.txt")?;
       file.write_all(b"Hello, Rust!")?;
       Ok(())
   }
   ```

   这里，我们使用 `File::create` 创建一个新文件并写入内容。

### 22.1.2 文件路径操作

在进行文件处理时，通常需要处理文件路径。`std::path` 模块提供了一些实用方法来操作文件路径，例如连接路径、获取文件名等。

```rust
use std::path::Path;

fn main() {
    let path = Path::new("folder/subfolder/file.txt");

    // 获取文件名
    let file_name = path.file_name().unwrap().to_str().unwrap();
    println!("File name: {}", file_name);

    // 获取文件的父目录
    let parent_dir = path.parent().unwrap().to_str().unwrap();
    println!("Parent directory: {}", parent_dir);

    // 连接路径
    let new_path = path.join("another_file.txt");
    println!("New path: {:?}", new_path);
}
```

### 22.1.3 删除文件

要删除文件，可以使用 `std::fs::remove_file` 方法。

```rust
use std::fs;

fn main() -> std::io::Result<()> {
    fs::remove_file("file_to_delete.txt")?;
    Ok(())
}
```

### 22.1.4 复制和移动文件

要复制和移动文件，可以使用 `std::fs::copy` 和 `std::fs::rename` 方法。

```rust
use std::fs;

fn main() -> std::io::Result<()> {
    // 复制文件
    fs::copy("source.txt", "destination.txt")?;

    // 移动文件
    fs::rename("old_name.txt", "new_name.txt")?;

    Ok(())
}
```

### 22.1.5 目录操作

要处理目录，你可以使用 `std::fs` 模块中的方法。例如，要列出目录中的文件和子目录，可以使用 `std::fs::read_dir`。

```rust
use std::fs;

fn main() -> std::io::Result<()> {
    for entry in fs::read_dir("directory")? {
        let entry = entry?;
        let path = entry.path();
        println!("{}", path.display());
    }

    Ok(())
}
```

以上是 Rust 中常见的文件处理操作的示例。要在实际应用中进行文件处理，请确保适当地处理可能发生的错误，以保证代码的健壮性。文件处理通常需要处理文件打开、读取、写入、关闭以及错误处理等情况。 Rust 提供了强大而灵活的标准库来支持这些操作。

### 案例：递归删除不符合要求的文件夹

这是一个经典的案例，现在我有一堆以期货代码所写为名的文件夹，里面包含着期货公司为我提供的大量的csv格式的原始数据（30 TB左右）， 如果我只想从中遴选出某几个我需要的品种的文件夹，剩下的所有的文件都删除掉，我该怎么办呢？。现在来一起看一下这是怎么实现的：

```rust
// 引入需要的外部库
use rayon::iter::ParallelBridge;
use rayon::iter::ParallelIterator;
use regex::Regex;
use std::sync::{Arc};
use std::fs;

// 定义一个函数，用于删除文件夹中不符合要求的文件夹
fn delete_folders_with_regex(
    top_folder: &str,         // 顶层文件夹的路径
    keep_folders: Vec<&str>, // 要保留的文件夹名称列表
    name_regex: Arc<Regex>,  // 正则表达式对象，用于匹配文件夹名称
) {
    // 内部函数：递归删除文件夹
    fn delete_folders_recursive(
        folder: &str,               // 当前文件夹的路径
        keep_folders: Arc<Vec<&str>>, // 要保留的文件夹名称列表（原子引用计数指针）
        name_regex: Arc<Regex>,    // 正则表达式对象（原子引用计数指针）
    ) {
        // 使用fs::read_dir读取文件夹内容，返回一个Result
        if let Ok(entries) = fs::read_dir(folder) {
            // 使用Rayon库的并行迭代器处理文件夹内容
            entries.par_bridge().for_each(|entry| {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if path.is_dir() {
                        if let Some(folder_name) = path.file_name() {
                            if let Some(folder_name_str) = folder_name.to_str() {
                                let name_regex_ref = &*name_regex;
                                // 使用正则表达式检查文件夹名称是否匹配
                                if name_regex_ref.is_match(folder_name_str) {
                                    if !keep_folders.contains(&folder_name_str) {
                                        println!("删除文件夹: {:?}", path);
                                        // 递归地删除文件夹及其内容
                                        fs::remove_dir_all(&path)
                                            .expect("Failed to delete folder");
                                    } else {
                                        println!("保留文件夹: {:?}", path);
                                    }
                                } else {
                                    println!("忽略非字母文件夹: {:?}", path);
                                }
                            }
                        }
                        // 递归进入子文件夹
                        delete_folders_recursive(
                            &path.display().to_string(),
                            keep_folders.clone(),
                            name_regex.clone()
                        );
                    }
                }
            });
        }
    }

    // 使用fs::metadata检查顶层文件夹的元数据信息
    if let Ok(metadata) = fs::metadata(top_folder) {
        if metadata.is_dir() {
            println!("开始处理文件夹: {:?}", top_folder);
            // 将要保留的文件夹名称列表包装在Arc中，以进行多线程访问
            let keep_folders = Arc::new(keep_folders);
            // 调用递归函数开始删除操作
            delete_folders_recursive(top_folder, keep_folders.clone(), name_regex);
        } else {
            println!("顶层文件夹不是一个目录: {:?}", top_folder);
        }
    } else {
        println!("顶层文件夹不存在: {:?}", top_folder);
    }
}

// 定义要保留的文件夹名称列表。此处使用了static声明，是因为这个列表在整个程序的运行时都是不变的。
static KEEP_FOLDERS: [&str; 11] = ["SR", "CF", "OI", "TA", "M", "P", "AG", "CU", "AL", "ZN", "RU"];

fn main() {
    let top_folder = "/opt/sample"; // 指定顶层文件夹的路径
    // 将静态数组转换为可变Vec以传递给函数
    let keep_folders: Vec<&str> = KEEP_FOLDERS.iter().map(|s| *s).collect();
    // 创建正则表达式对象，用于匹配文件夹名称
    let name_regex = Regex::new("^[a-zA-Z]+$").expect("Invalid regex pattern");
    // 将正则表达式包装在Arc中以进行多线程访问
    let name_regex = Arc::new(name_regex);

    // 调用主要函数以启动文件夹删除操作
    delete_folders_with_regex(top_folder, keep_folders, name_regex);
}


```

让我们详细讲解这个脚本的各个步骤：

1. 首先导入所需的库：

   ```rust
   use rayon::iter::ParallelBridge;
   use rayon::iter::ParallelIterator;
   use regex::Regex;
   use std::sync::Arc;
   use std::fs;
   ```

   首先，我们导入了所需的外部库。`rayon` 用于并发迭代，`regex` 用于处理正则表达式，`std::sync::Arc` 用于创建原子引用计数指针。

2. 创建 `delete_folders_with_regex` 函数：

   ```rust
   fn delete_folders_with_regex(
       top_folder: &str,
       keep_folders: Vec<&str>,
       name_regex: Arc<Regex>,
   ) -> Result<(), Box<dyn std::error::Error>> {
   ```

   我们定义了一个名为 `delete_folders_with_regex` 的函数，它接受顶层文件夹路径 `top_folder`、要保留的文件夹名称列表 `keep_folders` 和正则表达式对象 `name_regex` 作为参数。该函数返回一个 `Result`，以处理潜在的错误。

3. 创建 `delete_folders_recursive` 函数：

   ```rust
   fn delete_folders_recursive(
       folder: &str,
       keep_folders: &Arc<Vec<&str>>,
       name_regex: &Arc<Regex>,
   ) -> Result<(), Box<dyn std::error::Error>> {
   ```

   在 `delete_folders_with_regex` 函数内部，我们定义了一个名为 `delete_folders_recursive` 的内部函数，用于递归地删除文件夹。它接受当前文件夹路径 `folder`、要保留的文件夹名称列表 `keep_folders` 和正则表达式对象 `name_regex` 作为参数。同样，它返回一个 `Result`。

4. 使用 `fs::read_dir` 读取文件夹内容：

   ```rust
   for entry in fs::read_dir(folder)? {
   ```

   我们使用 `fs::read_dir` 函数读取了当前文件夹 `folder` 中的内容，并通过 `for` 循环迭代每个条目 `entry`。

5. 检查条目是否是文件夹：

   ```rust
   let entry = entry?;
   let path = entry.path();
   if path.is_dir() {
   ```

   我们首先检查 `entry` 是否是一个文件夹，因为只有文件夹才需要进一步处理，文件是会被忽略的。

6. 获取文件夹名称并匹配正则表达式：

   ```rust
   if let Some(folder_name) = path.file_name() {
       if let Some(folder_name_str) = folder_name.to_str() {
           if name_regex.is_match(folder_name_str) {
   ```

   我们获取了文件夹的名称，并将其转换为字符串形式。然后，我们使用正则表达式 `name_regex` 来检查文件夹名称是否与要求匹配。

7. 根据匹配结果执行操作：

   ```rust
   if !keep_folders.contains(&folder_name_str) {
       println!("删除文件夹: {:?}", path);
       fs::remove_dir_all(&path)?;
   } else {
       println!("保留文件夹: {:?}", path);
   }
   ```

   如果文件夹名称匹配了正则表达式，并且不在要保留的文件夹列表中，我们会删除该文件夹及其内容。否则，我们只是输出一条信息告诉用户，在命令行声明该文件夹将被保留。

8. 递归进入子文件夹：

   ```rust
   delete_folders_recursive(
       &path.join(&folder_name_str),
       keep_folders,
       name_regex
   )?;
   ```

   最后，我们递归地调用 `delete_folders_recursive` 函数，进入子文件夹进行相同的处理。

9. 处理顶层文件夹：

   ```rust
   let metadata = fs::metadata(top_folder)?;
   if metadata.is_dir() {
       println!("开始处理文件夹: {:?}", top_folder);
       let keep_folders = Arc::new(keep_folders);
       delete_folders_recursive(top_folder, &keep_folders, &name_regex)?;
   } else {
       println!("顶层文件夹不是一个目录: {:?}", top_folder);
   }
   ```

   在 `main` 函数中，我们首先检查顶层文件夹是否存在，如果存在，就调用 `delete_folders_recursive` 函数开始处理。我们还使用 `Arc` 包装了要保留的文件夹名称列表，以便多线程访问。

10. 完成处理并返回 `Result`：

    ```rust
    Ok(())
    ```

    最后，我们返回 `Ok(())` 表示操作成功完成。

### 补充学习：元数据

元数据可以理解为有关文件或文件夹的基本信息，就像一个文件的"身份证"一样。这些信息包括文件的大小、创建时间、修改时间以及文件是不是文件夹等。比如，你可以通过元数据知道一个文件有多大，是什么时候创建的，是什么时候修改的，还能知道这个东西是不是一个文件夹。

在Rust中，元数据（metadata）通常不包括实际的数据内容。元数据提供了关于文件或实体的属性和特征的信息。我们可以使用 `std::fs::metadata` 函数来获取文件或目录的元数据。

```rust
use std::fs;

fn main() -> Result<(), std::io::Error> {
    let file_path = "example.txt";

    // 获取文件的元数据
    let metadata = fs::metadata(file_path)?;

    // 获取文件大小（以字节为单位）
    let file_size = metadata.len();
    println!("文件大小: {} 字节", file_size);

    // 获取文件创建时间和修改时间
    let created = metadata.created()?;
    let modified = metadata.modified()?;

    println!("创建时间: {:?}", created);
    println!("修改时间: {:?}", modified);

    // 检查文件类型
    if metadata.is_file() {
        println!("这是一个文件。");
    } else if metadata.is_dir() {
        println!("这是一个目录。");
    } else {
        println!("未知文件类型。");
    }

    Ok(())
}
```

在这个示例中，我们首先使用 `fs::metadata` 获取文件 "example.txt" 的元数据，然后从元数据中提取文件大小、创建时间、修改时间以及文件类型信息。

一般操作文件系统的函数可能会返回 `Result` 类型，所以你需要处理潜在的错误。在示例中，我们使用了 `?` 运算符来传播错误，但你也可以选择使用模式匹配等其他方式来自定义地处理错误。

### 补充学习：正则表达式

现在我们再来学一下正则表达式。正则表达式是一种强大的文本模式匹配工具，它允许你以非常灵活的方式搜索、匹配和操作文本数据。使用前我们有一些基础的概念和语法需要了解。下面是正则表达式的一些基础知识：

#### 1. 字面量字符匹配

正则表达式的最基本功能是匹配字面量字符。这意味着你可以创建一个正则表达式来精确匹配输入文本中的特定字符。例如，正则表达式 `cat` 当然会匹配输入文本中的 "cat"。

#### 2. 元字符

正则表达式时中的元字符是具有特殊含义的。以下是一些常见的元字符以及它们的说明和示例：

1. `.`（点号）：匹配除换行符外的任意字符。

   - 示例：正则表达式 `c.t` 匹配 "cat"、"cut"、"cot" 等。

2. `*`（星号）：匹配前一个元素零次或多次。

   - 示例：正则表达式 `ab*c` 匹配 "ac"、"abc"、"abbc" 等。

3. `+`（加号）：匹配前一个元素一次或多次。

   - 示例：正则表达式 `ca+t` 匹配 "cat"、"caat"、"caaat" 等。

4. `?`（问号）：匹配前一个元素零次或一次。

   - 示例：正则表达式 `colou?r` 匹配 "color" 或 "colour"。

5. `|`（竖线）：表示或，用于在多个模式之间选择一个。

   - 示例：正则表达式 `apple|banana` 匹配 "apple" 或 "banana"。

6. `[]`（字符类）：用于定义一个字符集合，匹配方括号内的任何一个字符。

   - 示例：正则表达式 `[aeiou]` 匹配任何一个元音字母。

7. `()`（分组）：用于将多个模式组合在一起，以便对它们应用量词或其他操作。

   - 示例：正则表达式 `(ab)+` 匹配 "ab"、"abab"、"ababab" 等。

这些元字符允许你创建更复杂的正则表达式模式，以便更灵活地匹配文本。你可以根据需要组合它们来构建各种不同的匹配规则，用于解决文本处理中的各种任务。

#### 3. 字符类

字符类用于匹配一个字符集合中的任何一个字符。例如，正则表达式 `[aeiou]` 会匹配任何一个元音字母（a、e、i、o 或 u）。

#### 4. 量词

量词是正则表达式中用于指定模式重复次数的重要元素。它们允许你定义匹配重复出现的字符或子模式的规则。以下是常见的量词以及它们的说明和示例：

1. `*`（星号）：匹配前一个元素零次或多次。

   - 示例：正则表达式 `ab*c` 匹配 "ac"、"abc"、"abbc" 等。因为 `*` 表示零次或多次，所以它允许前一个字符 `b` 重复出现或完全缺失。

2. `+`（加号）：匹配前一个元素一次或多次。

   - 示例：正则表达式 `ca+t` 匹配 "cat"、"caat"、"caaat" 等。因为 `+` 表示一次或多次，所以它要求前一个字符 `a` 至少出现一次。

3. `?`（问号）：匹配前一个元素零次或一次。

   - 示例：正则表达式 `colou?r` 匹配 "color" 或 "colour"。因为 `?` 表示零次或一次，所以它允许前一个字符 `u` 的存在是可选的。

4. `{n}`：精确匹配前一个元素 n 次。

   - 示例：正则表达式 `x{3}` 匹配 "xxx"。它要求前一个字符 `x` 出现精确三次。

5. `{n,}`：至少匹配前一个元素 n 次。

   - 示例：正则表达式 `d{2,}` 匹配 "dd"、"ddd"、"dddd" 等。它要求前一个字符 `d` 至少出现两次。

6. `{n,m}`：匹配前一个元素 n 到 m 次。

   - 示例：正则表达式 `[0-9]{2,4}` 匹配 "123"、"4567"、"89" 等。它要求前一个元素是数字，且出现的次数在 2 到 4 次之间。

这些量词使你能够定义更灵活的匹配规则，以适应不同的文本模式。

#### 5. 锚点

锚点是正则表达式中用于指定匹配发生的位置的特殊字符。它们不匹配字符本身，而是匹配输入文本的特定位置。以下是一些常见的锚点以及它们的说明和示例：

1. `^`（脱字符）：匹配输入文本的开头。

   - 示例：正则表达式 `^Hello` 匹配以 "Hello" 开头的文本。例如，它匹配 "Hello, world!" 中的 "Hello"，但不匹配 "Hi, Hello" 中的 "Hello"，因为后者不在文本开头。

2. `$`（美元符号）：匹配输入文本的结尾。

   - 示例：正则表达式 `world!$` 匹配以 "world!" 结尾的文本。例如，它匹配 "Hello, world!" 中的 "world!"，但不匹配 "world! Hi" 中的 "world!"，因为后者不在文本结尾。

3. `\b`（单词边界）：匹配单词的边界，通常用于确保匹配的**单词完整**而不是**部分匹配**。
   - 示例：正则表达式 `\bapple\b` 匹配 "apple" 这个完整的单词。它匹配 "I have an apple." 中的 "apple"，但不匹配 "apples" 中的 "apple"。
4. `\B`（非单词边界）：匹配非单词边界的位置。

- 示例：正则表达式 `\Bcat\B` 匹配 "The cat sat on the cat." 中的第二个 "cat"，因为它位于两个非单词边界之间，而不是单词 "cat" 的一部分。

这些锚点允许你精确定位匹配发生的位置，在处理文本中的单词、行首、行尾等情况时非常有用。

#### 6. 转义字符

如果你需要匹配元字符本身，你可以使用反斜杠 `\` 进行转义。例如，要匹配 `.`，你可以使用 `\.`。

#### 7. 示例

以下是一些正则表达式的示例：

- 匹配一个邮箱地址：`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}`
- 匹配一个日期（例如，YYYY-MM-DD）：`[0-9]{4}-[0-9]{2}-[0-9]{2}`
- 匹配一个URL：`https?://[^\s/$.?#].[^\s]*`

#### 8. 工具和资源

为了学习和测试正则表达式，你可以使用在线工具或本地开发工具，例如：

- [regex101.com](https://regex101.com/): 一个在线正则表达式测试和学习工具，提供可视化解释和测试功能。
- Rust 的 regex 库文档：Rust 的 regex 库提供了强大的正则表达式支持，你可以查阅其文档以学习如何在 Rust 中使用正则表达式。

正则表达式是一个强大的文本处理工具，它可以在文本中查找、匹配和操作复杂的模式。掌握正则表达式可以帮助你处理各种文本和文件处理任务。

### 补充学习：使用rayon库进行并行处理
