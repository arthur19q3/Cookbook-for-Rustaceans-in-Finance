# Chapter 17 - 特性 (trait) 详解

## 17.1 通过dyn关键词轻松实现多态性

在Rust中，dyn 关键字在 Rust 中用于表示和关联特征（associated trait）相关的方法调用，在运行时进行动态分发（runtime dynamic dispatch）。因此`dyn` 关键字可以用于实现动态多态性（也称为运行时多态性）。

通过 `dyn` 关键字，你可以创建接受不同类型的实现相同特征（trait）的对象，然后在运行时根据实际类型来调用此方法不同的实现方法（比如猫狗都能叫，但是叫法当然不一样）。以下是一个使用 `dyn` 关键字的多态性示例：

```rust
// 定义一个特征（trait）叫做 Animal
trait Animal {
    fn speak(&self);
}

// 实现 Animal 特征的结构体 Dog
struct Dog;

impl Animal for Dog {
    fn speak(&self) {
        println!("狗在汪汪叫！");
    }
}

// 实现 Animal 特征的结构体 Cat
struct Cat;

impl Animal for Cat {
    fn speak(&self) {
        println!("猫在喵喵叫！");
    }
}

fn main() {
    // 创建一个存放实现 Animal 特征的对象的动态多态性容器
    let animals: Vec<Box<dyn Animal>> = vec![Box::new(Dog), Box::new(Cat)];

    // 调用动态多态性容器中每个对象的 speak 方法
    for animal in animals.iter() {
        animal.speak();
    }
}
```

在这个示例中，我们定义了一个特征 `Animal`，并为其实现了两个不同的结构体 `Dog` 和 `Cat`。然后，我们在 `main` 函数中创建了一个包含实现 `Animal` 特征的对象的 `Vec`，并使用 `Box` 包装它们以实现动态多态性。最后，我们使用 `for` 循环迭代容器中的每个对象，并调用 `speak` 方法，根据对象的实际类型分别输出不同的声音。

## 17.2 派生(\#[derive])

在 Rust 中，通过 `#[derive]` 属性，编译器可以自动生成某些 traits 的基本实现，这些 traits 通常与 Rust 中的常见编程模式和功能相关。下面是关于不同 trait 的短例子：

### 17.2.1 `Eq` 和 `PartialEq` Trait

`Eq` 和 `PartialEq` 是 Rust 中用于比较两个值是否相等的 trait。它们通常用于支持自定义类型的相等性比较。

`Eq` 和 `PartialEq` 是 Rust 中用于比较两个值是否相等的 trait。它们通常用于支持自定义类型的相等性比较。

**`Eq` Trait**:

- `Eq` 是一个 trait，用于比较两个值是否完全相等。
- 它的定义看起来像这样：`trait Eq: PartialEq<Self> {}`，这表示 `Eq` **依赖于 `PartialEq`**，**因此，任何实现了 `Eq` 的类型也必须实现 `PartialEq`**。
- 当你希望两个值在语义上完全相等时，你应该为你的类型实现 `Eq`。**这意味着如果两个值通过 `==` 比较返回 `true`，则它们也应该通过 `eq` 方法返回 `true`。**
- 默认情况下，Rust 的内置类型都实现了 `Eq`，所以你可以对它们进行相等性比较。

**`PartialEq` Trait**:

- `PartialEq` 也是一个 trait，用于比较两个值是否部分相等。
- 它的定义看起来像这样：`trait PartialEq<Rhs> where Rhs: ?Sized {}`，这表示 `PartialEq` 有一个关联类型 `Rhs`，它表示要与自身进行比较的类型。
- `PartialEq` 的主要方法是 `fn eq(&self, other: &Rhs) -> bool;`，这个方法接受另一个类型为 `Rhs` 的引用，并返回一个布尔值，表示两个值是否相等。
- 当你希望自定义类型支持相等性比较时，你应该为你的类型实现 `PartialEq`。这允许你定义两个值何时被认为是相等的。
- 默认情况下，Rust 的内置类型也实现了 `PartialEq`，所以你可以对它们进行相等性比较。

下面是一个示例，演示如何为自定义结构体实现 `Eq` 和 `PartialEq`：

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl PartialEq for Point {
    fn eq(&self, other: &Self) -> bool {
        self.x == other.x && self.y == other.y
    }
}

impl Eq for Point {}

fn main() {
    let point1 = Point { x: 1, y: 2 };
    let point2 = Point { x: 1, y: 2 };
    let point3 = Point { x: 3, y: 4 };

    println!("point1 == point2: {}", point1 == point2); // true
    println!("point1 == point3: {}", point1 == point3); // false
}
```

在这个示例中，我们定义了一个名为 `Point` 的结构体，并为它实现了 `PartialEq` 和 `Eq`。在 `PartialEq` 的 `eq` 方法中，我们定义了何时认为两个 `Point` 实例是相等的，即当它们的 `x` 和 `y` 坐标都相等时。在 `main` 函数中，我们演示了如何使用 `==` 运算符比较两个 `Point` 实例，以及如何根据我们的相等性定义来判断它们是否相等。

### 17.2.2 `Ord` 和 `PartialOrd` Traits

`Ord` 和 `PartialOrd` 是 Rust 中用于比较值的 trait，它们通常用于支持自定义类型的大小比较。

**`Ord` Trait**:

- `Ord` 是一个 trait，用于定义一个类型的大小关系，即定义了一种全序关系（total order）。
- 它的定义看起来像这样：`trait Ord: Eq + PartialOrd<Self> {}`，**这表示 `Ord` 依赖于 `Eq` 和 `PartialOrd`，因此，任何实现了 `Ord` 的类型必须实现 `Eq` 和 `PartialOrd`。**
- `Ord` 主要方法是 `fn cmp(&self, other: &Self) -> Ordering;`，它接受另一个类型为 `Self` 的引用，并返回一个 `Ordering` 枚举值，表示两个值的大小关系。
- `Ordering` 枚举有三个成员：`Less`、`Equal` 和 `Greater`，分别表示当前值小于、等于或大于另一个值。

**`PartialOrd` Trait**:

- `PartialOrd` 也是一个 trait，用于定义两个值的部分大小关系。
- 它的定义看起来像这样：`trait PartialOrd<Rhs> where Rhs: ?Sized {}`，这表示 `PartialOrd` 有一个关联类型 `Rhs`，它表示要与自身进行比较的类型。
- `PartialOrd` 主要方法是 `fn partial_cmp(&self, other: &Rhs) -> Option<Ordering>;`，它接受另一个类型为 `Rhs` 的引用，并返回一个 `Option<Ordering>`，表示两个值的大小关系。
- `Option<Ordering>` 可以有三个值：`Some(Ordering)` 表示有大小关系，`None` 表示无法确定大小关系。

通常情况下，你应该首先实现 `PartialOrd`，然后基于 `PartialOrd` 的实现来实现 `Ord`。这样做的原因是，`Ord` 表示完全的大小关系，而 `PartialOrd` 表示部分的大小关系。如果你实现了 `PartialOrd`，那么 Rust 将会为你自动生成 `Ord` 的默认实现。

下面是一个示例，演示如何为自定义结构体实现 `PartialOrd` 和 `Ord`：

```rust
#[derive(Debug, PartialEq, Eq)]
struct Person {
    name: String,
    age: u32,
}

impl PartialOrd for Person {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.age.cmp(&other.age))
    }
}

impl Ord for Person {
    fn cmp(&self, other: &Self) -> Ordering {
        self.age.cmp(&other.age)
    }
}

use std::cmp::Ordering;

fn main() {
    let person1 = Person { name: "Alice".to_string(), age: 30 };
    let person2 = Person { name: "Bob".to_string(), age: 25 };

    println!("person1 < person2: {}", person1 < person2); // true
    println!("person1 > person2: {}", person1 > person2); // false
}
```

**执行结果**：

```text
person1 < person2: false
person1 > person2: true
```

在这个示例中，我们定义了一个名为 `Person` 的结构体，并为它实现了 `PartialOrd` 和 `Ord`。我们根据年龄来定义了两个 `Person` 实例之间的大小关系。在 `main` 函数中，我们演示了如何使用 `<` 和 `>` 运算符来比较两个 `Person` 实例，以及如何使用 `cmp` 方法来获取它们的大小关系。因为我们实现了 `PartialOrd` 和 `Ord`，所以 Rust 可以为我们生成完整的大小比较逻辑。



### 17.2.3  `Clone` Trait

`Clone` 是 Rust 中的一个 trait，用于允许创建一个类型的副本（复制），从而在需要时复制一个对象，而不是移动（转移所有权）它。`Clone` trait 对于某些类型的操作非常有用，例如需要克隆对象以避免修改原始对象时影响到副本的情况。

下面是有关 `Clone` trait 的详细解释：

1. **`Clone` Trait 的定义**：
   - `Clone` trait 定义如下：`pub trait Clone { fn clone(&self) -> Self; }`。
   - 它包含一个方法 `clone`，该方法接受 `self` 的不可变引用，并返回一个新的具有相同值的对象。

2. **为何需要 Clone**：
   - Rust 中的赋值默认是移动语义，即将值的所有权从一个变量转移到另一个变量。这意味着在默认情况下，如果你将一个对象分配给另一个变量，原始对象将不再可用。
   - 在某些情况下，你可能需要创建一个对象的副本，而不是移动它，以便保留原始对象的拷贝。这是 `Clone` trait 的用武之地。

3. **Clone 的默认实现**：
   - 对于实现了 `Copy` trait 的类型，它们也自动实现了 `Clone` trait。这是因为 `Copy` 表示具有复制语义，它们总是可以安全地进行克隆。
   - 对于其他类型，你需要手动实现 `Clone` trait。通常，这涉及到深度复制所有内部数据。

4. **自定义 Clone 实现**：
   - 你可以为自定义类型实现 `Clone`，并在 `clone` 方法中定义如何进行克隆。这可能涉及到创建新的对象并复制所有内部数据。
   - 注意，如果类型包含引用或其他非 `Clone` 类型的字段，你需要确保正确地处理它们的克隆。

下面是一个示例，演示如何为自定义结构体实现 `Clone`：

```rust
#[derive(Clone)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let original_point = Point { x: 1, y: 2 };
    let cloned_point = original_point.clone();

    println!("Original Point: {:?}", original_point);
    println!("Cloned Point: {:?}", cloned_point);
}
```

在这个示例中，我们定义了一个名为 `Point` 的结构体，并使用 `#[derive(Clone)]` 属性自动生成 `Clone` trait 的实现。然后，我们创建了一个 `Point` 实例，并使用 `clone` 方法来克隆它，从而创建了一个新的具有相同值的对象。

总之，`Clone` trait 允许你在需要时复制对象，以避免移动语义，并确保你有一个原始对象的副本，而不是共享同一份数据。这对于某些应用程序中的数据管理和共享非常有用。

### 17.2.4 `Copy` Trait

`Copy` 是 Rust 中的一个特殊的 trait，用于表示类型具有 "复制语义"（copy semantics）。这意味着当将一个值赋值给另一个变量时，不会发生所有权转移，而是会创建值的一个精确副本。因此，复制类型的变量之间的赋值操作不会导致原始值变得不可用。以下是有关 `Copy` trait 的详细解释：

1. **`Copy` Trait 的定义**：
   - `Copy` trait 定义如下：`pub trait Copy {}`。
   - 它没有任何方法，只是一个标记 trait，用于表示实现了该 trait 的类型可以进行复制操作。

2. **复制语义**：
   - 复制语义意味着当你将一个 `Copy` 类型的值赋值给另一个变量时，实际上是对内存中的原始数据进行了一份拷贝，而不是将所有权从一个变量转移到另一个变量。
   - 这意味着原始值和新变量都拥有相同的数据，它们是完全独立的。修改其中一个不会影响另一个。

3. **`Clone` 与 `Copy` 的区别**：
   - `Clone` trait 允许你实现自定义的克隆逻辑，通常涉及深度复制内部数据，因此它的操作可能会更昂贵。
   - `Copy` trait 用于类型，其中克隆操作可以通过简单的位拷贝完成，因此更高效。默认情况下，标量类型（如整数、浮点数、布尔值等）和元组（包含只包含 `Copy` 类型的元素）都实现了 `Copy`。

4. **`Copy` 的自动实现**：
   - 所有标量类型（例如整数、浮点数、布尔值）、元组（只包含 `Copy` 类型的元素）以及实现了 `Copy` 的结构体都自动实现了 `Copy`。
   - 对于自定义类型，如果类型的所有字段都实现了 `Copy`，那么该类型也可以自动实现 `Copy`。

下面是一个示例，演示了 `Copy` 类型的使用：

```rust
fn main() {
    let x = 5;  // 整数是 Copy 类型
    let y = x;  // 通过复制语义创建 y，x 仍然有效

    println!("x: {}", x);  // 仍然可以访问 x 的值
    println!("y: {}", y);
}
```

在这个示例中，整数是 `Copy` 类型，因此将 `x` 赋值给 `y` 时，实际上是创建了 `x` 的一个拷贝，而不是将 `x` 的所有权转移到 `y`。因此，`x` 和 `y` 都可以独立访问它们的值。

总之，`Copy` trait 表示类型具有复制语义，这使得在赋值操作时不会发生所有权转移，而是创建一个值的副本。这对于标量类型和某些结构体类型非常有用，因为它们可以在不涉及所有权的情况下进行复制。不过需要注意，如果类型包含不支持 `Copy` 的字段，那么整个类型也无法实现 `Copy`。

以下是关于 `Clone` 和 `Copy` 的比较表格，包括适用场景和适用的类型：

| 特征    | 描述                                                     | 适用场景                                                     | 适用类型                                                     |
| ------- | -------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `Clone` | 允许创建一个类型的副本，通常涉及深度复制内部数据。       | 当需要对类型进行自定义的克隆操作时，或者类型包含非 `Copy` 字段时。 | **自定义类型**，包括具有非 `Copy` 字段的类型。               |
| `Copy`  | 表示类型具有复制语义，复制操作是通过简单的位拷贝完成的。 | 当只需要进行简单的值复制，不需要自定义克隆逻辑时。           | **标量类型（整数、浮点数、布尔值等）、元组（只包含 `Copy` 类型的元素）、实现了 `Copy` 的结构体**。 |

注意：

- 对于 `Clone`，你可以实现自定义的克隆逻辑，通常需要深度复制内部数据，因此它的操作可能会更昂贵。
- 对于 `Copy`，复制操作可以通过简单的位拷贝完成，因此更高效。
- `Clone` 和 `Copy` trait 不是互斥的，某些类型可以同时实现它们，但大多数情况下只需要实现其中一个。
- 标量类型（如整数、浮点数、布尔值）通常是 `Copy` 类型，因为它们可以通过位拷贝复制。
- 自定义类型通常需要实现 `Clone`，除非它们包含只有 `Copy` 类型的字段。

根据你的需求和类型的特性，你可以选择实现 `Clone` 或让类型自动实现 `Copy`（如果适用）。

### 17.2.5 `Hash` Trait

```rust
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

#[derive(Debug)]
struct User {
    id: u32,
    username: String,
}

impl Hash for User {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.id.hash(state);
        self.username.hash(state);
    }
}

fn main() {
    let user = User { id: 1, username: "user123".to_string() };

    let mut hasher = DefaultHasher::new();
    user.hash(&mut hasher);

    println!("Hash value: {}", hasher.finish());
} // 执行后会返回 "Hash value: 11664658372174354745"
```

这个示例演示了如何使用 `Hash` trait 来计算自定义结构体 `User` 的哈希值。

6. `Default` Trait：

```rust
#[derive(Default)]
struct Settings {
    width: u32,
    height: u32,
    title: String,
}

fn main() {
    let default_settings = Settings::default();
    println!("{:?}", default_settings);
}
```

在这个示例中，我们使用 `Default` trait 来创建一个数据类型的默认实例。

7. `Debug` Trait：

```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: u32,
}

fn main() {
    let person = Person { name: "Alice".to_string(), age: 30 };
    println!("Person: {:?}", person);
}
```

这个示例演示了如何使用 `Debug` trait 和 `{:?}` 格式化器来格式化一个值。

## 17.3 迭代器 (Iterator Trait)

迭代器（Iterator Trait）是 Rust 中用于迭代集合元素的标准方法。它是一个非常强大和通用的抽象，用于处理数组、向量、哈希表等不同类型的集合。迭代器使你能够以统一的方式遍历和处理这些集合的元素。

比如作者乡下的家中养了18条小狗，需要向客人挨个介绍，作者就可以使用迭代器来遍历和处理狗的集合，就像下面的示例一样：

```rust
// 定义一个狗的结构体
struct Dog {
    name: String,
    breed: String,
}

fn main() {
    // 创建一个狗的集合，使用十八罗汉的名字命名
    let dogs = vec![
        Dog { name: "张飞".to_string(), breed: "吉娃娃".to_string() },
        Dog { name: "关羽".to_string(), breed: "贵宾犬".to_string() },
        Dog { name: "刘备".to_string(), breed: "柴犬".to_string() },
        Dog { name: "赵云".to_string(), breed: "边境牧羊犬".to_string() },
        Dog { name: "马超".to_string(), breed: "比熊犬".to_string() },
        Dog { name: "黄忠".to_string(), breed: "拉布拉多".to_string() },
        Dog { name: "吕布".to_string(), breed: "杜宾犬".to_string() },
        Dog { name: "貂蝉".to_string(), breed: "杰克罗素梗".to_string() },
        Dog { name: "王异".to_string(), breed: "雪纳瑞".to_string() },
        Dog { name: "诸葛亮".to_string(), breed: "比格犬".to_string() },
        Dog { name: "庞统".to_string(), breed: "波士顿梗".to_string() },
        Dog { name: "法正".to_string(), breed: "西高地白梗".to_string() },
        Dog { name: "孙尚香".to_string(), breed: "苏格兰梗".to_string() },
        Dog { name: "周瑜".to_string(), breed: "斗牛犬".to_string() },
        Dog { name: "大乔".to_string(), breed: "德国牧羊犬".to_string() },
        Dog { name: "小乔".to_string(), breed: "边境牧羊犬".to_string() },
        Dog { name: "黄月英".to_string(), breed: "西施犬".to_string() },
        Dog { name: "孟获".to_string(), breed: "比格犬".to_string() },
    ];

    // 创建一个迭代器，用于遍历狗的集合
    let mut dog_iterator = dogs.iter();

    // 使用 for 循环遍历迭代器并打印每只狗的信息
    println!("遍历狗的集合：");
    for dog in &dogs {
        println!("名字: {}, 品种: {}", dog.name, dog.breed);
    }

    // 使用 take 方法提取前两只狗并打印
    println!("\n提取前两只狗：");
    for dog in dog_iterator.clone().take(2) {
        println!("名字: {}, 品种: {}", dog.name, dog.breed);
    }

    // 使用 skip 方法跳过前两只狗并打印剩下的狗的信息
    println!("\n跳过前两只狗后的狗：");
    for dog in dog_iterator.skip(2) {
        println!("名字: {}, 品种: {}", dog.name, dog.breed);
    }
}

```

在这个示例中，我们定义了一个名为 `Dog` 的结构体，用来表示狗的属性。然后，我们创建了一个包含狗对象的向量 `dogs`。接下来，我们使用 `iter()` 方法将它转换成一个迭代器，并使用 `for` 循环遍历整个迭代器，使用 `take` 方法提取前两只狗，并使用 `skip` 方法跳过前两只狗来进行迭代。与之前一样，我们在使用 `take` 和 `skip` 方法后，使用 `clone()` 创建了新的迭代器以便重新使用。

## 17.4 超级特性(Super Trait)

Rust 中的超级特性（Super Trait）是一种特殊的 trait，它是其他多个 trait 的超集。它可以用来表示一个 trait 包含或继承了其他多个 trait 的所有功能，从而允许你以更抽象的方式来处理多个 trait 的实现。超级特性使得代码更加模块化、可复用和抽象化。

超级特性的语法很简单，只需在 trait 定义中使用 `+` 运算符来列出该 trait 继承的其他 trait 即可。例如：

```rust
trait SuperTrait: Trait1 + Trait2 + Trait3 {
    // trait 的方法定义
}
```

这里，`SuperTrait` 是一个超级特性，它继承了 `Trait1`、`Trait2` 和 `Trait3` 这三个 trait 的所有方法和功能。

好的，让我们将上面的示例构建为某封神题材游戏的角色，一个能够上天入地的角色，哪吒三太子：

```rust
// 定义三个 trait：Flight、Submersion 和 Superpower
trait Flight {
    fn fly(&self);
}

trait Submersion {
    fn submerge(&self);
}

trait Superpower {
    fn use_superpower(&self);
}

// 定义一个超级特性 Nezha，继承了 Flight、Submersion 和 Superpower 这三个 trait
trait Nezha: Flight + Submersion + Superpower {
    fn introduce(&self) {
        println!("我是哪吒三太子！");
    }

    fn describe_weapon(&self);
}

// 实现 Flight、Submersion 和 Superpower trait
struct NezhaCharacter;
impl Flight for NezhaCharacter {
    fn fly(&self) {
        println!("哪吒在天空翱翔，驾驭风火轮飞行。");
    }
}

impl Submersion for NezhaCharacter {
    fn submerge(&self) {
        println!("哪吒可以潜入水中，以莲花根和宝莲灯为助力。");
    }
}

impl Superpower for NezhaCharacter {
    fn use_superpower(&self) {
        println!("哪吒拥有火尖枪、风火轮和宝莲灯等神器，可以操控火焰和风，战胜妖魔。");
    }
}

// 实现 Nezha trait
impl Nezha for NezhaCharacter {
    fn describe_weapon(&self) {
        println!("哪吒的法宝包括火尖枪、风火轮和宝莲灯。");
    }
}

fn main() {
    let nezha = NezhaCharacter;
    nezha.introduce();
    nezha.fly();
    nezha.submerge();
    nezha.use_superpower();
    nezha.describe_weapon();
}

```

**执行结果：**

```text
我是哪吒三太子！
哪吒在天空翱翔，驾驭风火轮飞行。
哪吒可以潜入水中，以莲花根和宝莲灯为助力。
哪吒拥有火尖枪、风火轮和宝莲灯等神器，可以操控火焰和风，战胜妖魔。
哪吒的法宝包括火尖枪、风火轮和宝莲灯。


```

在这个主题中，我们定义了三个 trait：`Flight`、`Submersion` 和 `Superpower`，然后定义了一个超级特性 `Nezha`，它继承了这三个 trait。最后，我们为 `NezhaCharacter` 结构体实现了这三个 trait，并且还实现了 `Nezha` trait。通过这种方式，我们创建了一个能够上天入地并拥有超能力的角色，即哪吒。
