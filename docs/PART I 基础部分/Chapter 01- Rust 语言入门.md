# Chapter 1 -  Rust 语言入门101

开始之前我们不妨做一些简单的准备工作。

## 1.1 在类Unix操作系统(Linux,MacOS)上安装 rustup

打开终端并输入下面命令：

```shell
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

只要出现下面这行：

```bash
Rust is installed now. Great! 
```

就完成 Rust 安装了。



> **[建议]** 量化金融从业人员为什么应该尝试接触使用Linux？
>
> 1. 稳定性：Linux系统被认为是非常稳定的。在金融领域，系统的稳定性和可靠性至关重要，因为任何技术故障都可能对业务产生重大影响。因此，Linux成为了一个被广泛接受的选择。
> 2. 灵活性：Linux的灵活性允许用户根据需求定制系统。在量化金融领域，可能需要使用各种不同的软件和工具来处理数据、进行模型开发和测试等。Linux允许用户更灵活地使用这些工具，并通过修改源代码来提高性能。
> 3. 安全性：Linux的开源开发方式意味着错误可以更快地被暴露出来，这让技术人员可以更早地发现并解决潜在的安全隐患。此外，Linux对可能对系统产生安全隐患的远程程序调用进行了限制，进一步提高了系统的安全性。
> 4. 可维护性：Linux系统的维护要求相对较高，需要一定的技术水平。但是，对于长期运行的功能需求，如备份历史行情数据和实时行情数据的入库和维护，Linux系统提供了高效的命令行方式，可以更快速地进行恢复和维护。



## 1.2 安装 C 语言编译器 [ 可选 ] 

Rust 有的时候会依赖 libc 和链接器 linker， 比如PyTorch的C bindings的Rust版本tch.rs 就自然依赖C。因此如果遇到了提示链接器无法执行的错误，你需要再手动安装一个 C 语言编译器：

**MacOS **：

```bash
$ xcode-select --install
```

**Linux **：
如果你使用 Ubuntu，则可安装 build-essential。
其他 Linux 用户一般应按照相应发行版的文档来安装 gcc 或 clang。

## 1.3 维护 Rust 工具链

**更新Rust**

```bash
$ rustup update
```

**卸载Rust**

```bash
$ rustup self uninstall
```

**检查Rust安装是否成功**

检查rustc版本

```bash
$ rustc -V 
rustc 1.72.0 (5680fa18f 2023-08-23)
```

检查cargo版本

```bash
$ cargo -V 
cargo 1.72.0 (103a7ff2e 2023-08-15)
```

## 1.4 Nightly 版本

作为一门编程语言，Rust非常注重代码的稳定性。为了达到"稳定而不停滞",Rust的开发遵循一个列车时刻表。也就是说，所有的开发工作都在Rust存储库的主分支上进行。Rust有三个发布通道：

1. **夜间(Nightly)**
2. **测试(Beta)**
3. **稳定(Stable)**

以下是开发和发布流程的示例：假设Rust团队正在开发Rust 1.5的版本。该版本在2015年12月发布，但我们可以用这个版本号来说明。Rust添加了一个新功能：新的提交被合并到主分支。每天晚上，都会生成一个新的Rust夜间版本。

对于Rust Nightly来说, 几乎每天都是发布日, 这些发布是由Rust社区的发布基建(release infrastructure)自动创建的。

```text
nightly: * - - * - - *
```

每六个礼拜， `beta` 分支都会从被夜间版本使用的 `master` 分支中分叉出来, 单独发布一次。

```
nightly: * - - * - - *
                     |
beta:                *
```

大多数Rust开发者主要使用 **Stable** 通道，但那些想尝试实验性新功能的人可以使用 **Nightly** 或 **Beta**。

Rust 编程语言的 Nightly 版本是不断更新的。有的时候为了用到 Rust 的最新的语言特性，或者安装一些依赖 Rust Nightly的软件包，我们会需要切换到 Nightly。

但是请注意，Nightly版本包含最新的功能和改进，所以也可能不够稳定，在生产环境中使用时要小心。

**安装Nightly版本**：

```shell
$ rustup install nightly
```

**切换到Nightly版本**：

```shell
$ rustup default nightly
```

**更新Nightly版本**：

```shell
$ rustup update nightly
```

**切换回Stable版本：**

```shell
$ rustup default stable
```

## 1.5 cargo的使用

`cargo` 是 Rust 编程语言的官方构建工具和包管理器。它是一个非常强大的工具，用于帮助开发者创建、构建、测试和发布 Rust 项目。以下是一些 `cargo` 的主要功能：

1. **项目创建**：
   `cargo new`  可以创建新的 Rust 项目，包括创建项目的基本结构、生成默认的源代码文件和配置文件。

2. **依赖管理**：
   `cargo` 管理项目的依赖项。你可以在项目的 `Cargo.toml` 文件中指定依赖项，然后运行 `cargo build` 命令来下载和构建这些依赖项。这使得添加、更新和删除依赖项变得非常容易。

3. **构建项目**：
   通过运行 `cargo build` 命令，你可以构建你的 Rust 项目。`cargo` 会自动处理编译、链接和生成可执行文件或库的过程。

4. **添加依赖**：
   使用 cargo add 或编辑项目的 Cargo.toml 文件来添加依赖项。cargo add 命令会自动更新 Cargo.toml 并下载依赖项。
   例如，要添加一个名为 "rand" 的依赖，可以运行：cargo add rand

5. **执行预先编纂的测试**：

   `cargo` 允许你编写和运行测试，以确保代码的正确性。你可以使用 `cargo test` 命令来运行测试套件。

6. **文档生成**：

   `cargo` 可以自动生成项目文档。通过运行 `cargo doc` 命令，如果我们的 **文档注释** (以///或者//！起始的注释) 符合Markdown规范，你可以生成包括库文档和文档注释的 HTML 文档，以便其他开发者查阅。

7. **发布和分发**：

   执行`cargo login` 登陆 crate.io 后，再在项目文件夹执行`cargo publish` 可以帮助你将你的 Rust 库发布到 [crates.io](https://crates.io/)，Rust 生态系统的官方包仓库。这使得分享你的代码和库变得非常容易。

8. **列出依赖项**：

  使用 cargo tree 命令可以查看项目的依赖项树，以了解你的项目使用了哪些库以及它们之间的依赖关系。例如，要查看依赖项树，只需在项目目录中运行：`cargo tree`



## 1.6 cargo 和 rustup的区别

`rustup` 和`cargo` 是 Rust 生态系统中两个不同的工具，各自承担着不同的任务：

`rustup` 和 `cargo` 是 Rust 生态系统中两个不同的工具，各自承担着不同的任务：

 **`rustup`**：

   - `rustup` 是 Rust 工具链管理器。它用于安装、升级和管理不同版本的 Rust 编程语言。
   - 通过 `rustup`，你可以轻松地在你的计算机上安装多个 Rust 版本，以便在项目之间切换。
   - 它还管理 Rust 工具链的组件，例如 Rust 标准库、Rustfmt(用于格式化代码的工具)等。
   - `rustup` 还提供了一些其他功能，如设置默认工具链、卸载 Rust 等。

**`cargo`**：

   - `cargo` 是 Rust 的构建工具和包管理器。它用于创建、构建和管理 Rust 项目。
   - `cargo` 可以创建新的 Rust 项目，添加依赖项，构建项目，运行测试，生成文档，发布库等等。
   - 它提供了一种简便的方式来管理项目的依赖和构建过程，使得创建和维护 Rust 项目变得容易。
   - 与构建相关的任务，如编译、运行测试、打包应用程序等，都可以通过 `cargo` 来完成。

总之，`rustup` 主要用于管理 Rust 的版本和工具链，而 `cargo` 用于管理和构建具体的 Rust 项目。这两个工具一起使得在 Rust 中开发和维护项目变得非常方便。



## 1.7 用cargo创立并搭建第一个项目

### 1. 用 `cargo new `新建项目

```shell
$ cargo new_strategy # new_strategy 是我们的新crate 
$ cd new_strategy
```

第一行命令新建了名为 *new_strategy* 的文件夹。我们将项目命名为 *new_strategy*，同时 cargo 在一个同名文件夹中创建树状分布的项目文件。

进入 *new_strategy* 文件夹, 然后键入`ls`列出文件。将会看到 cargo 生成了两个文件和一个目录：一个 *Cargo.toml* 文件，一个 *src* 目录，以及位于 *src* 目录中的 *main.rs* 文件。

此时cargo在 *new_strategy* 文件夹初始化了一个 Git 仓库，并带有一个 *.gitignore* 文件。

> 注意: cargo是默认使用git作为版本控制系统的(version control system， VCS)。可以通过 `--vcs` 参数使 `cargo new` 切换到其它版本控制系统，或者不使用 VCS。运行 `cargo new --help` 查看可用的选项。

### 2. 编辑 `cargo.toml`

现在可以找到项目文件夹中的 *cargo.toml* 文件。这应该是一个cargo 最小化工作样本(MWE, Minimal Working Example)的样子了。它看起来应该是如下这样：

```toml
[package]
name = "new_strategy"
version = "0.1.0" # 此软件包的版本
edition = "2021" # rust的规范版本，成书时最近一次更新是2021年。
[dependencies]

```

第一行 `[package]`，是一个 section 的标题，表明下面的语句用来配置一个包(package)。随着我们在这个文件增加更多的信息，还将增加其他 sections。

第二个 section 即`[dependencies]` ，一般我们在这里填项目所依赖的任何包。

在 Rust 中，代码包被称为 *crate*。我们把crate的信息填写在这里以后，再运行cargo build, cargo就会自动下载并构建这个项目。虽然这个项目目前并不需要其他的 crate。

现在打开 new_strategy/**src**/main.rs* 看看：

```rust
fn main() {
    println!("Hello, world!");
}
```

cargo已经在 `src` 文件夹为我们自动生成了一个 Hello, world! 程序。虽然看上去有点越俎代庖，但是这也是为了提醒我们，cargo 期望源代码文件(以rs后缀结尾的Rust语言文件)位于 `src` 目录中。项目根目录只存放**说明文件**(README)、**许可协议**(license)信息、**配置文件** (cargo.toml)和其他跟代码无关的文件。使用 Cargo 可帮助你保持项目干净整洁。这里为一切事物所准备，一切都位于正确的位置。

###  3. 构建并运行 Cargo 项目

现在在 `new_strategy` 目录下，输入下面的命令来构建项目：

```shell
$ cargo build
   Compiling new_strategy v0.1.0 (file:///projects/new_strategy)
    Finished dev [unoptimized + debuginfo] target(s) in 2.85 secs
```

这个命令会在 *target/debug/new_strategy* 下创建一个可执行文件(在 Windows 上是 *target\debug\new_strategy.exe*)，而不是放在目前目录下。你可以使用下面的命令来运行它：

```shell
$ ./target/debug/new_strategy 
Hello, world!
```

cargo 还提供了一te x t个名为 `cargo check` 的命令。该命令快速检查代码确保其可以编译：

```shell
$ cargo check
   Checking new_strategy v0.1.0 (file:///projects/new_strategy)
    Finished dev [unoptimized + debuginfo] target(s) in 0.14 secs
```

因为编译的耗时有时可以非常长，所以此时我们更改或修正代码后，并不会频繁执行`cargo build`来重构项目，而是使用 `cargo check`。



### 4. 发布构建

当我们最终准备好交付代码时，可以使用 `cargo build --release` 来优化编译项目。

这会在   而不是 *target/debug* 下生成可执行文件。这些优化可以让 Rust 代码运行的更快，不过启用这些优化也需要消耗显著更长的编译时间。

如果你要对代码运行时间进行基准测试，请确保运行 `cargo build --release` 并使用 *target/release* 下的可执行文件进行测试。

##  1.8  需要了解的几个Rust概念

好的，让我为每个概念再提供一个更详细的案例，以帮助你更好地理解。

### 作用域 (Scope)

作用域是指在代码中变量或值的可见性和有效性范围。在作用域内声明的变量或值可以在该作用域内使用，而在作用域外无法访问。简单来说，作用域决定了你在哪里可以使用一个变量或值。

在大多数编程语言中，作用域通常由大括号 `{}` 来界定，例如在函数、循环、条件语句或代码块中。变量或值在进入作用域时创建，在离开作用域时销毁。这有助于确保程序的局部性和变量不会干扰其他部分的代码。

例如，在下面的Rust代码中，`x` 变量的作用域在函数 `main` 中，因此只能在函数内部使用：

```rust
fn main() {
    let x = 10; // 变量x的作用域从这里开始

    // 在这里可以使用变量x

} // 变量x的作用域在这里结束，x被销毁
```

总之，作用域是编程语言中用来控制变量和值可见性的概念，它确保了变量只在适当的地方可用，从而提高了代码的可维护性和安全性。在第6章我们还会详细讲解作用域 (Scope)。

### 所有权 (Ownership)

想象一下你有一个独特的玩具火车，只有你能够玩。这个火车是你的所有物。当你不再想玩这个火车时，你可以把它扔掉，它就不再存在了。在 Rust 中，每个值就像是这个玩具火车，有一个唯一的所有者。一旦所有者不再需要这个值，它会被销毁，这样就不会占用内存空间。

```rust
fn main() {
    let toy_train = "Awesome train".to_string(); // 创建一个玩具火车
    // toy_train 是它的所有者

    let train_name = get_name(&toy_train); // 传递火车的引用
    println!("Train's name: {}", train_name);
    // 接下来 toy_train 离开了main函数的作用域， 在main函数外面谁也不能再玩 toy_train了。
}

fn get_name(train: &String) -> String {
    // 接受 String 的引用，不获取所有权
    train.clone() // 返回火车的名字的拷贝
}
```

在这个例子中，我们创建了一个 `toy_train` 的值，然后将它的引用传递给 `get_name` 函数，而不是移动它的所有权。这样，函数可以读取 `toy_train` 的数据，但 `toy_train` 的所有权仍然在 `main` 函数中。当 `toy_train` 离开 `main` 函数的作用域时，它的所有权被移动到函数内部，所以在函数外部不能再使用 `toy_train`。

### 可变性 (mutability)

可变性(mutability)是指在编程中一个变量或数据是否可以被修改或改变的特性。在许多编程语言中，变量通常有二元对立的状态：可变(mutable)和不可变(immutable)。

- **可变 (Mutable)**：如果一个变量是可变的，意味着你可以在创建后更改它的值。你可以对可变变量进行赋值操作，修改其中的数据。这在编程中非常常见，因为它允许程序在运行时动态地改变数据。

- **不可变 (Immutable)**：如果一个变量是不可变的，意味着一旦赋值后，就无法再更改其值。不可变变量在多线程编程和并发环境中非常有用，因为它们可以避免竞争条件和数据不一致性。

在很多编程语言中，变量默认是可变的，但有些语言(如Rust)选择默认为不可变，需要显式地声明变量为可变才能进行修改。

在Rust中，可变性是一项强制性的特性，这意味着默认情况下变量是不可变的。如果你想要一个可变的变量，需要使用 `mut` 关键字显式声明它。例如：

```rust
fn main() {
    let x = 10; // 不可变变量x
    let mut y = 20; // 可变变量y，可以修改其值
    y = 30; // 可以修改y的值
}
```

这种默认的不可变性有助于提高代码的安全性，因为它防止了意外的数据修改。但也允许你选择在需要时显式地声明变量为可变，以便进行修改。

### 借用(Borrowing)

想象一下你有一本漫画书，你的朋友可以看，但不能把它带走或画在上面。你允许你的朋友借用这本书，但不能改变它。在 Rust 中，你可以创建共享引用，就像是让朋友看你的书，但不能修改它。

```rust
fn main() {
    let mut comic_book = "Spider-Man".to_string(); // 创建一本漫画书
    // comic_book 是它的所有者

    let book_title = get_title(&comic_book); // 传递书的引用
    println!("Book title: {}", book_title); // 返回 "Book title: Spider-Man"

    add_subtitle(&mut comic_book); // 尝试修改书，需要可变引用

    // comic_book 离开了作用域，它的所有权被移动到 get_title 函数
    // 这里不能再阅读或修改 comic_book
}

fn get_title(book: &String) -> String {
    // 接受 String 的引用，不获取所有权
    book.clone() // 返回书的标题的拷贝
}

fn add_subtitle(book: &mut String) {
    // 接受可变 String 的引用，可以修改书
    book.push_str(": The Amazing Adventures");
}
```

在这个例子中，我们首先创建了一本漫画书 `comic_book`，然后将它的引用传递给 `get_title` 函数，而不是移动它的所有权。这样，函数可以读取 `comic_book` 的数据，但不能修改它。然后，我们尝试调用 `add_subtitle` 函数，该函数需要一个可变引用，因为它要修改书的内容。在rust中，对变量的写的权限，可以通过可变引用来控制。

### 生命周期(Lifetime)

生命周期就像是你和朋友一起观看电影，但你必须确保电影结束前，你的朋友仍然在场。如果你的朋友提前离开，你不能再和他一起看电影。在 Rust 中，生命周期告诉编译器你的引用可以用多久，以确保引用不会指向已经消失的东西。这样可以防止出现问题。

```rust
fn main() {
    let result;
    {
        let number = 42;
        result = get_value(&number);
    } // number 离开了作用域，但 result 的引用仍然有效

    println!("Result: {}", result);
}

fn get_value<'a>(val: &'a i32) -> &'a i32 {
    // 接受 i32 的引用，返回相同生命周期的引用
    val // 返回 val 的引用，其生命周期与 val 相同
}
```

在这个示例中，我们创建了一个整数 `number`，然后将它的引用传递给 `get_value` 函数，并使用生命周期 `'a` 来标注引用的有效性。函数返回的引用的生命周期与传入的引用 `val` 相同，因此它仍然有效，即使 `number` 离开了作用域。

这些案例希望帮助你更容易理解 Rust 中的所有权、借用和生命周期这三个概念。这些概念是 Rust 的核心，有助于确保你的代码既安全又高效。
