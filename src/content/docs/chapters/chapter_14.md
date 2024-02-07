---
title: '泛型进阶(Advanced Generic Type Usage)'
---

泛型是一种编程概念，用于泛化类型和函数功能，以扩展它们的适用范围。使用泛型可以大大减少代码的重复，但使用泛型的语法需要谨慎。换句话说，使用泛型意味着你需要明确指定在具体情况下，哪种类型是合法的。

简单来说，泛型就是定义可以适用于不同具体类型的**代码模板**。在使用时，**我们会为这些泛型类型参数提供具体的类型，就像传递参数一样**。

在Rust中，我们使用尖括号和大写字母的名称(例如：`<Aaa, Bbb, ...>`)来指定泛型类型参数。通常情况下，我们使用`<T>`来表示一个泛型类型参数。在Rust中，泛型不仅仅表示类型，还表示可以接受一个或多个泛型类型参数`<T>`的任何内容。

让我们编写一个轻松的示例，以更详细地说明Rust中泛型的概念：

```rust
// 定义一个具体类型 `Fruit`。
struct Fruit {
    name: String,
}

// 在定义类型 `Basket` 时，第一次使用类型 `Fruit` 之前没有写 `<Fruit>`。
// 因此，`Basket` 是个具体类型，`Fruit` 取上面的定义。
struct Basket(Fruit);
//            ^ 这里是 `Basket` 对类型 `Fruit` 的第一次使用。

// 此处 `<T>` 在第一次使用 `T` 之前出现，所以 `BasketGen` 是一个泛型类型。
// 因为 `T` 是泛型的，所以它可以是任何类型，包括在上面定义的具体类型 `Fruit`。
struct BasketGen<T>(T);

fn main() {
    // `Basket` 是具体类型，并且显式地使用类型 `Fruit`。
    let apple = Fruit {
        name: String::from("Apple"),
    };
    let _basket = Basket(apple);

    // 创建一个 `BasketGen<String>` 类型的变量 `_str_basket`，并令其值为 `BasketGen("Banana")`
    // 这里的 `BasketGen` 的类型参数是显式指定的。
    let _str_basket: BasketGen<String> = BasketGen(String::from("Banana"));

    // `BasketGen` 的类型参数也可以隐式地指定。
    let _fruit_basket = BasketGen(Fruit {
        name: String::from("Orange"),
    }); // 使用在上面定义的 `Fruit`。
    let _weight_basket = BasketGen(42); // 使用 `i32` 类型。
}
```

在这个示例中，我们定义了一个具体类型 `Fruit`，然后使用它在 `Basket` 结构体中创建了一个具体类型的实例。接下来，我们定义了一个泛型结构体 `BasketGen<T>`，它可以存储任何类型的数据。我们创建了几个不同类型的 `BasketGen` 实例，有些是显式指定类型参数的，而有些则是隐式指定的。

这个示例演示了Rust中泛型的工作原理，以及如何在创建泛型结构体实例时明确或隐含地指定类型参数。泛型使得代码更加通用和可复用，允许我们创建能够处理不同类型的数据的通用数据结构。

## 14.1 泛型实现

泛型实现是Rust中一种非常强大的特性，它允许我们编写通用的代码，可以处理不同类型的数据，同时保持类型安全性。下面详细解释一下如何在Rust中使用泛型实现。

现在，让我们了解如何在结构体、枚举和trait中实现泛型。

### 14.1.1 在结构体中实现泛型

我们可以在结构体中使用泛型类型参数，并为该结构体实现方法。例如：

```rust
struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        Pair { first, second }
    }

    fn get_first(&self) -> &T {
        &self.first
    }

    fn get_second(&self) -> &T {
        &self.second
    }
}

fn main() {
    let pair_of_integers = Pair::new(1, 2);
    println!("First: {}", pair_of_integers.get_first());
    println!("Second: {}", pair_of_integers.get_second());

    let pair_of_strings = Pair::new("hello", "world");
    println!("First: {}", pair_of_strings.get_first());
    println!("Second: {}", pair_of_strings.get_second());
}
```

在上面的示例中，我们为泛型结构体`Pair<T>`实现了`new`方法和获取`first`和`second`值的方法。

### 14.1.2 在枚举中实现泛型

我们还可以在枚举中使用泛型类型参数。例如经典的Result枚举类型：

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}

fn main() {
    let success: Result<i32, &str> = Result::Ok(42);
    let failure: Result<i32, &str> = Result::Err("Something went wrong");

    match success {
        Result::Ok(value) => println!("Success: {}", value),
        Result::Err(err) => println!("Error: {}", err),
    }

    match failure {
        Result::Ok(value) => println!("Success: {}", value),
        Result::Err(err) => println!("Error: {}", err),
    }
}
```

在上面的示例中，我们定义了一个泛型枚举`Result<T, E>`，它可以表示成功(`Ok`)或失败(`Err`)的结果。在`main`函数中，我们创建了两个不同类型的`Result`实例。

### 14.1.3 在特性中实现泛型

在trait中定义泛型方法，然后**为不同类型实现该trait**。例如：

```rust
trait Summable<T> {
    fn sum(&self) -> T;
}

impl Summable<i32> for Vec<i32> {
    fn sum(&self) -> i32 {
        self.iter().sum()
    }
}

impl Summable<f64> for Vec<f64> {
    fn sum(&self) -> f64 {
        self.iter().sum()
    }
}

fn main() {
    let numbers_int = vec![1, 2, 3, 4, 5];
    let numbers_float = vec![1.1, 2.2, 3.3, 4.4, 5.5];

    println!("Sum of integers: {}", numbers_int.sum());
    println!("Sum of floats: {}", numbers_float.sum());
}
```

## 14.2 多重约束 (Multiple-Trait Bounds)

多重约束 (Multiple Trait Bounds) 是 Rust 中一种强大的特性，允许在泛型参数上指定多个 trait 约束。这意味着泛型类型必须同时实现多个 trait 才能满足这个泛型参数的约束。多重约束通常在需要对泛型参数进行更精确的约束时非常有用，因为它们允许你指定泛型参数必须具备多个特定的行为。

以下是如何使用多重约束的示例以及一些详细解释：

```rust
use std::fmt::{Debug, Display};

fn compare_prints<T: Debug + Display>(t: &T) {
    println!("Debug: `{:?}`", t);
    println!("Display: `{}`", t);
}

fn compare_types<T: Debug, U: Debug>(t: &T, u: &U) {
    println!("t: `{:?}`", t);
    println!("u: `{:?}`", u);
}

fn main() {
    let string = "words";
    let array = [1, 2, 3];
    let vec = vec![1, 2, 3];

    compare_prints(&string);
    // compare_prints(&array);   //因为&array并未实现std::fmt::Display，所以只要这行被激活就会编译失败。

    compare_types(&array, &vec);
}
```

因为`&array`并未实现`Display` trait，所以只要 `compare_prints(&array);` 被激活，就会编译失败。

## 14.3 where语句

在 Rust 中，`where` 语句是一种用于在 trait bounds 中提供更灵活和清晰的约束条件的方式。

下面是一个示例，演示了如何使用 `where` 语句来提高代码的可读性：

```rust
use std::fmt::{Debug, Display};

// 定义一个泛型函数，接受两个泛型参数 T 和 U，
// 并要求 T 必须实现 Display trait，U 必须实现 Debug trait。
fn display_and_debug<T, U>(t: T, u: U)
where
    T: Display,
    U: Debug,
{
    println!("Display: {}", t);
    println!("Debug: {:?}", u);
}

fn main() {
    let number = 42;
    let text = "hello";

    display_and_debug(number, text);
}
```

在这个示例中，我们定义了一个 `display_and_debug` 函数，它接受两个泛型参数 `T` 和 `U`。然后，我们使用 `where` 语句来指定约束条件：`T: Display` 表示 `T` 必须实现 `Display` trait，`U: Debug` 表示 `U` 必须实现 `Debug` trait。

## 14.4 关联项 (associated items)

在 Rust 中，"关联项"(associated items)是与特定 trait 或类型相关联的项，这些项可以包括与 trait 相关的关联类型(associated types)、关联常量(associated constants)和关联函数(associated functions)。关联项是 trait 和类型的一部分，它们允许在 trait 或类型的上下文中定义与之相关的数据和函数。

以下是关联项的详细解释：

1. **关联类型(Associated Types)**：

   当我们定义一个 trait 并使用关联类型时，我们希望在 trait 的实现中可以具体指定这些关联类型。关联类型允许我们在 trait 中引入与具体类型有关的占位符，**然后在实现时提供具体类型**。

   ```rust
   trait Iterator {
       type Item; // 定义关联类型
       fn next(&mut self) -> Option<Self::Item>; // 使用关联类型
   }

   // 实现 Iterator trait，并指定关联类型 Item 为 i32
   impl Iterator for Counter {
       type Item = i32;
       fn next(&mut self) -> Option<Self::Item> {
           // 实现方法
       }
   }
   ```

2. **关联常量(Associated Constants)**：

   - 关联常量是与 trait 相关联的常量值。
   - 与关联类型不同，关联常量是具体的值，而不是类型。
   - 关联常量使用 `const` 关键字来声明，并在实现 trait 时提供具体值。

   ```rust
   trait MathConstants {
       const PI: f64; // 定义关联常量
   }

   // 实现 MathConstants trait，并提供 PI 的具体值
   impl MathConstants for Circle {
       const PI: f64 = 3.14159265359;
   }
   ```

3. **关联函数(Associated Functions)**：

   - 关联函数是与类型关联的函数，通常用于创建该类型的实例。
   - 关联函数不依赖于具体的实例，因此它们可以在类型级别调用，而不需要实例。
   - 关联函数使用 `fn` 关键字来定义。

   ```rust
   struct Point {
       x: i32,
       y: i32,
   }

   impl Point {
       // 定义关联函数，用于创建 Point 的新实例
       fn new(x: i32, y: i32) -> Self {
           Point { x, y }
       }
   }

   fn main() {
       let point = Point::new(10, 20); // 调用关联函数创建实例
   }
   ```

关联项是 Rust 中非常强大和灵活的概念，它们使得 trait 和类型能够定义更抽象和通用的接口，并且可以根据具体类型的需要进行定制化。这些概念对于创建可复用的代码和实现通用数据结构非常有用。
