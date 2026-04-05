---
title: "Vim Notes 1"
date: 2016-09-12
summary: "Early Vim notes focused on search, replace, and macro basics for everyday editing."
tags:
  - Vim
  - Python
---

# Beginning
In fact I have been learning Vim editor for a while.
At the beginning, after getting basic knowledge of [Python](http://www.python.org), I just need an editor to write my Python scripts.
Before that I used [MATLAB](http://www.mathworks.com) and wrote scripts in MATLAB environment.
(I changed between MATLAB and Python for several times due to their different advantages, but that is another story.)
Since my python primer is [A Byte of Python](http://python.swaroopch.com) and the author Swaroop C.H. also have a book [A Byte of Vim](http://www.swaroopch.com/notes/vim/), I just follow him and build my brief on Vim.

# Basics
Always we think Vim is difficult to learn.
But after you trying to get started, you won't find it that hard.
Here I don't introduce it much.
Please just go to [Interactive Vim tutorial](http://www.openvim.com/).
One can try it for several times to know the basics quickly.

# Search and replace
To become an advanced Vim user, I think the first step is to learn search and replace.
I find most of useful information at [Vim Tips Wiki](http://vim.wikia.com/wiki/Search_and_replace).
So let's begin.

Suppose we have such a `test.txt` file as follow.

```
are you okare you okare you okare you ok
are you okare you okare you okare you ok
are you okare you okare you okare you ok
are you okare you okare you okare you ok
```

First I want to add a space between 'ok' and 'are' in each line. Use `:%s/okare/ok are/g`. It will become

```
are you ok are you ok are you ok are you ok
are you ok are you ok are you ok are you ok
are you ok are you ok are you ok are you ok
are you ok are you ok are you ok are you ok
```

Here *%* means 'all lines' and *g* means 'global' for all this pattern in a line.

Add '!' to the end of first 'ok' in line 2 to 4. Use `:2,4s/ok/ok!/`
 
```
are you ok are you ok are you ok are you ok
are you ok! are you ok are you ok are you ok
are you ok! are you ok are you ok are you ok
are you ok! are you ok are you ok are you ok
```

Add '?' to the end of line 1 and next line. Use `:.,+1s/\zs\ze\n/?/`

```
are you ok are you ok are you ok are you ok?
are you ok! are you ok are you ok are you ok?
are you ok! are you ok are you ok are you ok
are you ok! are you ok are you ok are you ok
```

Here *.* means first line, *+1* means next line, and *+1s* means excited.
Also *\zs*, *\ze* means only replacing pattern between them. See next example with `:2s/are \zsyou\ze ok?/YOU/`

```
are you ok are you ok are you ok are you ok?
are you ok! are you ok are you ok are YOU ok?
are you ok! are you ok are you ok are you ok
are you ok! are you ok are you ok are you ok
```

Delete last 'are' in all lines. `:%s/.*\zsare//`

```
are you ok are you ok are you ok  you ok?
are you ok! are you ok are you ok  YOU ok?
are you ok! are you ok are you ok  you ok
are you ok! are you ok are you ok  you ok
```

Delete last word. `:%s/\s\+\w\+.$//`

```
are you ok are you ok are you ok  you
are you ok! are you ok are you ok  YOU
are you ok! are you ok are you ok  you
are you ok! are you ok are you ok  you
```

Notice here the pattern is somehow difficult than before. *\s\+\w\+.$* means *a space + a word + a single chracter (here could be ?) and endline*. For more details please check [regular expression](https://en.wikipedia.org/wiki/Regular_expression).

And last example. Delete first 2 charactor in each lines. Use `:%s/^.\{1}//`

```
e you ok are you ok are you ok  you
e you ok! are you ok are you ok  YOU
e you ok! are you ok are you ok  you
e you ok! are you ok are you ok  you
```

Other questions:

- Delete second 'are' in each lines.
- Change second last 'ok' into upper case.

# Macro 
Using macro is very easy. Just start with *q* followed by a macro name, say *a* here, and end with another *q*.
Please see this example. Original file is as follow

```
Hello
Thank
You
Are
You
OK
```

First go to the line of 'Hello' and my control sequence is `^v$y$a = print("^[pa")^[j`. Here *^[* means \<Esc\>. Then put in `5@a` it will become

```
Hello = print("Hello")
Thank = print("Thank")
You = print("You")
Are = print("Are")
You = print("You")
OK = print("OK")
```

This is my fist Vim study notes. Hope it would be helpful! To become a master of Vim, there is a long way to go.
