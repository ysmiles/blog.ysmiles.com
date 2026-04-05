---
layout:     post
title:      "Differences between an interface and abstract class"
subtitle:   "OOP Note - 1"
author:     "Frederick"
date:       2017-12-24
catalog:    true
header-mask: 
tags:
    - OOP
    - Java
    - C++
---


## Introduction 

This article is mainly talking about the difference between interface and abstract class,
which is a frequently asked questions at interview.
I will discuss Java first, and then C++.

Personally, I am more familiar with C++, although I can write Java.
So at the time one friend asked me about the question, I was shocked.
I did not know "interface" at all.
But after searching around, I learned that "interface" and "abstract class" are somehow ideas of OOP (especially, Java OOP).
C++ can get same things.
But it does not have "interface" and "abstract" keyword due to several reasons, such as functional reason, historical reason, and design choice.

## Interface and abstract class in Java

Interface and abstract class are two different ideas in Java.
Interface is only some patterns, with only constants and method names (stubs).
Abstract class is class, although not instantiable, besides abstract methods, it can have constants, general methods (with definition), value types.

Another important difference is that a class can implement multiple interfaces (somehow multiple inheritance), while all classes in Java do not support multiple inheritance.

Code example:

```java
// interface example
interface myInterface {
    void method1();

    int method2();
}

class myClass implements myInterface {
    int value;

    void method1() {
        System.out.println("123");
    }

    int method2() {
        return this.value;
    }
}


// abstract class example
abstract class myAbclass {
    // abstract method
    abstract void method1();

    int value;

    int method2() {
        return this.value;
    }
}

class myClass extends myAbclass {
    void method1() {
        System.out.println("123");
    }
}
```

Here I don't talk much about the speed (I don't know much about the implementation details of these two in JVM).

Generally speaking, because interface doesn't have real implementations and general local values, it can be faster than abstract class.
Then how about an abstract class with only abstract methods,
compared to the corresponding interface?
I am not sure.
But basically, they should be similar under good optimization of Java compiler and JVM.

Choice between them should not (mainly) depend on speed, but what functionalities you need in your code.

## The topic in C++

As a powerful OOP language, C++ can get same functionality of interface and abstract class just through abstract class declaration.
Because C++ class supports multiple inheritance, it doesn't need specific keywords "interface".

In C++, Abstract classes act as expressions of general concepts from which more specific classes can be derived. You cannot create an object of an abstract class type; however, you can use pointers and references to abstract class types.

A class that contains *at least one pure virtual function* is considered an abstract class. Classes derived from the abstract class must implement the pure virtual function or they, too, are abstract classes.

Here is the code example:

```cpp
// interface example (actually also abstract class)
class myInterface {
  public:
    // pure virtual methods
    virtual void method1() = 0;

    // pure virtual destructor
    // implementation needed outside
    virtual ~myInterface() = 0;

    // or just use
    // virtual ~myInterface() {}
};

// abstract class example
class myAbclass {
  public:
    // general virtual methods
    virtual void method1();

    // general methods
    void method2();

    // pure virtual methods
    // make myAbclass abstract class
    // so it is not instantiable
    virtual void method3() = 0;

    // virtual destructor
    virtual ~myAbclass() {}
};
```

Also you can refer Bjarne's FAQ about this: [Do we really need multiple inheritance?](http://www.stroustrup.com/bs_faq2.html#multiple)

## More about C++

I will introduce static polymorphism of C++ in my next article.

## Interfaces in Go

Unlike Java and C++, Go does not have class.
Instead Go only has *struct* and *methods* (functions with receiver argument) which is similar to the *methods* in Java and C++.
Go's *interface* type is defined as a set of method signatures.
And interfaces are implement implicitly.
All of these features make Go a light weight OOP language or not strictly an OOP language.

Here is a brief example from official tutorial:

```go
package main

import "fmt"

type I interface {
    M()
}

type T struct {
    S string
}

// This method means type T implements the interface I,
// but we don't need to explicitly declare that it does so.
func (t T) M() {
    fmt.Println(t.S)
}

func main() {
    var i I = T{"hello"}
    i.M()
}
```

## Reference links

[What is the difference between an interface and abstract class?](https://stackoverflow.com/questions/1913098/what-is-the-difference-between-an-interface-and-abstract-class)

[How do you declare an interface in C++?](https://stackoverflow.com/questions/318064/how-do-you-declare-an-interface-in-c)

[Abstract Class vs Interface in C++](https://stackoverflow.com/questions/12854778/abstract-class-vs-interface-in-c)

[Abstract Classes (C++)](https://docs.microsoft.com/en-us/cpp/cpp/abstract-classes-cpp)

[A tour of Go - Interfaces are implemented implicitly](https://tour.golang.org/methods/10)