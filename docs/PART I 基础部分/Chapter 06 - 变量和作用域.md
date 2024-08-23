
# Chapter 6 - 变量和作用域

## 6.1 作用域和遮蔽

变量绑定有一个作用域(scope)，它被限定只在一个**代码块**(block)中生存(live)。 代码块是一个被 `{}` 包围的语句集合。另外也允许变量遮蔽。

```rust
fn main() {
    // 此绑定生存于 main 函数中
    let outer_binding = 1;

    // 这是一个代码块，比 main 函数拥有更小的作用域
    {
        // 此绑定只存在于本代码块
        let inner_binding = 2;

        println!("inner: {}", inner_binding);

        // 此绑定*遮蔽*了外面的绑定
        let outer_binding = 5_f32;

        println!("inner shadowed outer: {}", outer_binding);
    }
    // 代码块结束

    // 此绑定仍然在作用域内
    println!("outer: {}", outer_binding);

    // 此绑定同样*遮蔽*了前面的绑定
    let outer_binding = 'a';

    println!("outer shadowed outer: {}", outer_binding);
}
```

**执行结果：**

```text
inner: 2
inner shadowed outer: 5
outer: 1
outer shadowed outer: a
```



## 6.2 不可变变量

在Rust中，你可以使用 `mut` 关键字来声明可变变量。可变变量与不可变变量相比，允许在绑定后修改它们的值。以下是一些常见的可变类型：

1. **可变绑定(Mutable Bindings)**：使用 `let mut` 声明的变量是可变的。这意味着你可以在创建后修改它们的值。例如：

   ```rust
   let mut x = 5; // x是可变变量
   x = 10; // 可以修改x的值
   ```

2. **可变引用(Mutable References)**：通过使用可变引用，你可以在不改变变量绑定的情况下修改值。可变引用使用 `&mut` 声明。例如：

   ```rust
   fn main() {
       let mut x = 5;
       modify_value(&mut x); // 通过可变引用修改x的值
       println!("x: {}", x); // 输出 "x: 10"
   }
   
   fn modify_value(y: &mut i32) {
       *y = 10;
   }
   ```

3. **可变字段(Mutable Fields)**：结构体和枚举可以包含可变字段，这些字段在结构体或枚举创建后可以修改。你可以使用 `mut` 关键字来声明结构体或枚举的字段是可变的。例如：

   ```rust
   struct Point {
       x: i32,
       y: i32,
   }
   
   fn main() {
       let mut p = Point { x: 1, y: 2 };
       p.x = 10; // 可以修改Point结构体中的字段x的值
   }
   ```

4. **可变数组(Mutable Arrays)**：使用 `mut` 关键字声明的数组是可变的，允许修改数组中的元素。例如：

   ```rust
   fn main() {
       let mut arr = [1, 2, 3];
       arr[0] = 4; // 可以修改数组中的元素
   }
   ```

5. **可变字符串(Mutable Strings)**：使用 `String` 类型的变量和 `push_str`、`push` 等方法可以修改字符串的内容。例如：

   ```rust
   fn main() {
       let mut s = String::from("Hello");
       s.push_str(", world!"); // 可以修改字符串的内容
   }
   ```

这些是一些常见的可变类型示例。可变性是Rust的一个关键特性，它允许你在需要修改值时更改绑定，同时仍然提供了强大的安全性和借用检查。



##  6.3 可变变量

在Rust中，你可以使用 `mut` 关键字来声明可变变量。可变变量与不可变变量相比，允许在绑定后修改它们的值。以下是一些常见的可变类型：

1. **可变绑定(Mutable Bindings)**：使用 `let mut` 声明的变量是可变的。这意味着你可以在创建后修改它们的值。例如：

   ```rust
   let mut x = 5; // x是可变变量
   x = 10; // 可以修改x的值
   ```

2. **可变引用(Mutable References)**：通过使用可变引用，你可以在不改变变量绑定的情况下修改值。可变引用使用 `&mut` 声明。例如：

   ```rust
   fn main() {
       let mut x = 5;
       modify_value(&mut x); // 通过可变引用修改x的值
       println!("x: {}", x); // 输出 "x: 10"
   }
   
   fn modify_value(y: &mut i32) {
       *y = 10;
   }
   ```

3. **可变字段(Mutable Fields)**：结构体和枚举可以包含可变字段，这些字段在结构体或枚举创建后可以修改。你可以使用 `mut` 关键字来声明结构体或枚举的字段是可变的。例如：

   ```rust
   struct Point {
       x: i32,
       y: i32,
   }
   
   fn main() {
       let mut p = Point { x: 1, y: 2 };
       p.x = 10; // 可以修改Point结构体中的字段x的值
   }
   ```

4. **可变数组(Mutable Arrays)**：使用 `mut` 关键字声明的数组是可变的，允许修改数组中的元素。例如：

   ```rust
   fn main() {
       let mut arr = [1, 2, 3];
       arr[0] = 4; // 可以修改数组中的元素
   }
   ```

5. **可变字符串(Mutable Strings)**：使用 `String` 类型的变量和 `push_str`、`push` 等方法可以修改字符串的内容。例如：

   ```rust
   fn main() {
       let mut s = String::from("Hello");
       s.push_str(", world!"); // 可以修改字符串的内容
   }
   ```

这些是一些常见的可变类型示例。可变性是Rust的一个关键特性，它允许你在需要修改值时更改绑定，同时仍然提供了强大的安全性和借用检查。

## 6.4 语句(Statements)，表达式(Expressions) 和 变量绑定(Variable Bindings)

### 6.4.1 语句(Statements)

Rust 有多种语句。在Rust中，下面的内容通常被视为语句：

1. 变量声明语句，如 `let x = 5;`。
2. 赋值语句，如 `x = 10;`。
3. 函数调用语句，如 `println!("Hello, world!");`。
4. 控制流语句，如 `if`、`else`、`while`、`for` 等。

```rust
fn main() {
    // 变量声明语句
    let x = 5;

    // 赋值语句
    let mut y = 10;
    y = y + x;

    // 函数调用语句
    println!("The value of y is: {}", y);

    // 控制流语句
    if y > 10 {
        println!("y is greater than 10");
    } else {
        println!("y is not greater than 10");
    }
}
```

### 6.4.2 表达式(Expressions)

在Rust中，语句(Statements)和表达式(Expressions)有一些重要的区别：

1. **返回值：**
   - 语句没有返回值。它们执行某些操作或赋值，但不产生值本身。例如，赋值语句 `let x = 5;` 不返回任何值。
   - 表达式总是有返回值。每个表达式都会计算出一个值，并可以被用于其他表达式或赋值给变量。例如，`5 + 3` 表达式返回值 `8`。

2. **可嵌套性：**
   - 语句可以包含表达式，但不能嵌套其他语句。例如，`let x = { 5 + 3; };` 在代码块中包含了一个表达式，但代码块本身是一个语句。
   - 表达式可以包含其他表达式，形成复杂的表达式树。例如，`let y = 5 + (3 * (2 - 1));` 中的表达式包含了嵌套的子表达式。

3. **使用场景：**
   - 语句通常用于执行某些操作，如声明变量、赋值、执行函数调用等。它们不是为了返回值而存在的。
   - 表达式通常用于计算值，这些值可以被用于赋值、函数调用的参数、条件语句的判断条件等。它们总是有返回值。

4. **分号：**
   - 语句通常以分号 `;` 结尾，表示语句的结束。
   - 表达式也可以以分号 `;` 结尾，但这样做通常会忽略表达式的结果。如果省略分号，表达式的值将被返回。

下面是一些示例来说明语句和表达式之间的区别：

```rust
// 这是一个语句，它没有返回值
let x = 5;

// 这是一个表达式，它的值为 8
let y = 5 + 3;

// 这是一个语句块，其中包含了两个语句，但没有返回值
{
    let a = 1;
    let b = 2;
}

// 这是一个表达式，其值为 6，这个值可以被赋给变量或用于其他表达式中
let z = {
    let a = 2;
    let b = 3;
    a + b // 注意，没有分号，所以这是一个表达式
};
```

再来看一下，如果给表达式强制以分号 `;` 结尾的效果。

```rust
fn main() {
    //变量绑定， 创建一个无符号整数变量 `x`
    let x = 5u32;

    // 创建一个新的变量 `y` 并初始化它
    let y = {
        // 创建 `x` 的平方
        let x_squared = x * x;

        // 创建 `x` 的立方
        let x_cube = x_squared * x;

        // 计算 `x_cube + x_squared + x` 并将结果赋给 `y`
        x_cube + x_squared + x
    };
    
    // 代码块也是表达式，所以它们可以用作赋值中的值。
    // 这里的代码块的最后一个表达式是 `2 * x`，但由于有分号结束了这个代码块，所以将 `()` 赋给 `z`
    let z = {
        2 * x;
    };

    // 打印变量的值
    println!("x is {:?}", x);
    println!("y is {:?}", y);
    println!("z is {:?}", z);
}
```

返回的是

```rust
x is 5
y is 155
z is ()
```

总之，语句用于执行操作，而表达式用于计算值。理解这两者之间的区别对于编写Rust代码非常重要。
