---
title: Python basics for algorithm practices
date: 2021-12-20
summary: "Working notes on Python features and standard-library tools that come up often in algorithm practice."
tags: [Python, Algorithm]
---

Actively updating...

This post assume the reader to be familiar with at least one of other popular used programming language, preferably Java and C++; or know python before and just need refresh.

## Array

Python's `array` type is similar to C++'s `vector` or Java's `ArrayList`.

And for algorithm practice we usually use `list`, which will be introduced in next section.

Ref: [array — Efficient arrays of numeric values](https://docs.python.org/3.10/library/array.html)

```python
# create an array
array('u', 'hello \u2641')
array('l', [1, 2, 3, 4, 5])
array('d', [1.0, 2.0, 3.14])

# append value
array.append(x)

# insert
array.insert(i, x)

# remove by index (i default to -1)
array.pop([i])

# remove by value
array.remove(x)

# Return the number of occurrences of x in the array.
array.count(x)

# find first
array.index(x[, start[, stop]])

# reverse
array.reverse()
```

Note: [Numpy](https://numpy.org/) array is different. It's not often used in algorithm problem solving though.

## List

Ref: [class list](https://docs.python.org/3.10/library/stdtypes.html#list)

Lists implement all of the [common](https://docs.python.org/3.10/library/stdtypes.html#typesseq-common) and [mutable](https://docs.python.org/3.10/library/stdtypes.html#typesseq-mutable) sequence operations.

```python
# create a list
list([iterable])
[]
[a, b, c]
[x for x in iterable]


# Common sequence operations

x in s # True if an item of s is equal to x, else False

x not in s # False if an item of s is equal to x, else True

s + t # the concatenation of s and t

s * n or n * s # equivalent to adding s to itself n times

s[i] # ith item of s, origin 0

s[i:j] # slice of s from i to j

s[i:j:k] # slice of s from i to j with step k

len(s) # length of s

min(s) # smallest item of s

max(s) # largest item of s

s.index(x[, i[, j]]) # index of the first occurrence of x in s (at or after index i and before index j)

s.count(x) # total number of occurrences of x in s


# Mutable sequence operations

s[i] = x # item i of s is replaced by x

s[i:j] = t # slice of s from i to j is replaced by the contents of the iterable t

del s[i:j] # same as s[i:j] = []

s[i:j:k] = t # the elements of s[i:j:k] are replaced by those of t

del s[i:j:k] # removes the elements of s[i:j:k] from the list

s.append(x) # appends x to the end of the sequence (same as s[len(s):len(s)] = [x])

s.clear() # removes all items from s (same as del s[:])

s.copy() # creates a shallow copy of s (same as s[:])

s.extend(t) or s += t # extends s with the contents of t (for the most part the same as s[len(s):len(s)] = t)

s *= n # updates s with its contents repeated n times

s.insert(i, x) # inserts x into s at the index given by i (same as s[i:i] = [x])

s.pop() or s.pop(i) # retrieves the item at i and also removes it from s

s.remove(x) # remove the first item from s where s[i] is equal to x

s.reverse() # reverses the items of s in place


# sort a list
sorted()
list.sort()
```

More about sort: [Sorting HOW TO](https://docs.python.org/3.10/howto/sorting.html#sortinghowto)

## Ranges

Ref: [class range](https://docs.python.org/3.10/library/stdtypes.html#ranges)

```python
# class range(stop)
# class range(start, stop[, step])

# examples
>>> list(range(10))
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
>>> list(range(1, 11))
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
>>> list(range(0, 30, 5))
[0, 5, 10, 15, 20, 25]
>>> list(range(0, 10, 3))
[0, 3, 6, 9]
>>> list(range(0, -10, -1))
[0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
>>> list(range(0))
[]
>>> list(range(1, 0))
[]

```

## String

Ref: [class str](https://docs.python.org/3.10/library/stdtypes.html#text-sequence-type-str)

```python
# class str(object='')
# class str(object=b'', encoding='utf-8', errors='strict')

# Frequently used

str.count(sub[, start[, end]])

str.endswith(suffix[, start[, end]])

str.format(*args, **kwargs)

str.index(sub[, start[, end]])

str.isalnum()

str.isalpha()

str.isdigit()

str.islower()

str.isspace()

str.isupper()

str.join(iterable)

str.lower()

str.replace(old, new[, count])

str.split(sep=None, maxsplit=- 1)

str.startswith(prefix[, start[, end]])

str.swapcase()

str.upper()
```

More about formatting: [Format String Syntax](https://docs.python.org/3.10/library/string.html#formatstrings)

## Set/HashSet

```python
# class set([iterable])
# Use a comma-separated list of elements within braces: {'jack', 'sjoerd'}
# Use a set comprehension: {c for c in 'abracadabra' if c not in 'abc'}
# Use the type constructor: set(), set('foobar'), set(['a', 'b', 'foo'])

# Frequently used
len(s)

x in s

x not in s

union(*others)
set | other | ...

intersection(*others)
set & other & ...

add(elem)
# Add element elem to the set.

remove(elem)
# Remove element elem from the set. Raises KeyError if elem is not contained in the set.

discard(elem)
# Remove element elem from the set if it is present.

pop()
# Remove and return an arbitrary element from the set. Raises KeyError if the set is empty.

clear()
# Remove all elements from the set.
```

## Map/HashMap - dict

[Mapping Types - dict](https://docs.python.org/3.10/library/stdtypes.html#mapping-types-dict)

```python
a = dict(one=1, two=2, three=3)
b = {'one': 1, 'two': 2, 'three': 3}
c = dict(zip(['one', 'two', 'three'], [1, 2, 3]))
d = dict([('two', 2), ('one', 1), ('three', 3)])
e = dict({'three': 3, 'one': 1, 'two': 2})
f = dict({'one': 1, 'three': 3}, two=2)
a == b == c == d == e == f
# True

list(d) # Return a list of all the keys used in the dictionary d.

len(d) # Return the number of items in the dictionary d.

d[key] # Return the item of d with key 'key'. Raises a KeyError if key is not in the map.

d[key] = value # Set d[key] to value.

del d[key] # Remove d[key] from d. Raises a KeyError if key is not in the map.

key in d # Return True if d has a key key, else False.

key not in d # Equivalent to not key in d.

iter(d) # Return an iterator over the keys of the dictionary. This is a shortcut for iter(d.keys()).

clear() # Remove all items from the dictionary.

classmethod fromkeys(iterable[, value]) # Create a new dictionary with keys from iterable and values set to value.

get(key[, default]) # Return the value for key if key is in the dictionary, else default. If default is not given, it defaults to None, so that this method never raises a KeyError.

items() # Return a new view of the dictionary’s items ((key, value) pairs). See the documentation of view objects.

keys() # Return a new view of the dictionary’s keys. See the documentation of view objects.

pop(key[, default]) # If key is in the dictionary, remove it and return its value, else return default. If default is not given and key is not in the dictionary, a KeyError is raised.

popitem() # Remove and return a (key, value) pair from the dictionary. Pairs are returned in LIFO order.

>>> d = {"one": 1, "two": 2, "three": 3, "four": 4}
>>> d
{'one': 1, 'two': 2, 'three': 3, 'four': 4}
>>> list(d)
['one', 'two', 'three', 'four']
>>> list(d.values())
[1, 2, 3, 4]
>>> d["one"] = 42
>>> d
{'one': 42, 'two': 2, 'three': 3, 'four': 4}
>>> del d["two"]
>>> d["two"] = None
>>> d
{'one': 42, 'three': 3, 'four': 4, 'two': None}

>>> d = {"one": 1, "two": 2, "three": 3, "four": 4}
>>> d
{'one': 1, 'two': 2, 'three': 3, 'four': 4}
>>> list(reversed(d))
['four', 'three', 'two', 'one']
>>> list(reversed(d.values()))
[4, 3, 2, 1]
>>> list(reversed(d.items()))
[('four', 4), ('three', 3), ('two', 2), ('one', 1)]
```

### Counter

A [Counter](https://docs.python.org/3/library/collections.html#collections.Counter) is a dict subclass for counting hashable objects.

``` python
# class collections.Counter([iterable-or-mapping])

c = Counter()                           # a new, empty counter
c = Counter('gallahad')                 # a new counter from an iterable
c = Counter({'red': 4, 'blue': 2})      # a new counter from a mapping
c = Counter(cats=4, dogs=8)             # a new counter from keyword args

c = Counter(['eggs', 'ham'])
c['bacon']                              # count of a missing element is zero
# 0

c = Counter(a=4, b=2, c=0, d=-2)
sorted(c.elements())
# ['a', 'a', 'a', 'a', 'b', 'b']

c.total()                       # total of all counts
c.clear()                       # reset all counts
list(c)                         # list unique elements
set(c)                          # convert to a set
dict(c)                         # convert to a regular dictionary
c.items()                       # convert to a list of (elem, cnt) pairs
Counter(dict(list_of_pairs))    # convert from a list of (elem, cnt) pairs
c.most_common()[:-n-1:-1]       # n least common elements
+c                              # remove zero and negative counts
```

## Tree

## Lambda

## Queue

[queue — A synchronized queue class](https://docs.python.org/3.10/library/queue.html)

```python
queue.Queue(maxsize=0) # Constructor for a FIFO queue.

queue.LifoQueue(maxsize=0) # Constructor for a LIFO queue, i.e. stack.

queue.PriorityQueue(maxsize=0) # Constructor for a priority queue.

q = Queue()

q.qsize()
q.empty()
q.full() # when size > 0
q.put(val)
q.get() # pop
```

### Priority queue

[heap doc](https://docs.python.org/3/library/heapq.html)

```python
# method 1
q = PriorityQueue()
q.put((3, 'c'))
q.put((2, 'b'))
while not q.empty():
    item = q.get()
    print(item)

# method 2
pq = []
heappush(pq, (3, 'c'))
item = heappop()

# O(n) heapify an array/list
heapify(pq)
```

## Regex

## Numeric/Math module

```python
random.randrange(stop)
random.randrange(start, stop[, step])
# Return a randomly selected element from range(start, stop, step). This is equivalent to choice(range(start, stop, step)), but doesn’t actually build a range object.

random.randint(a, b)
# Return a random integer N such that a <= N <= b. Alias for randrange(a, b+1).
```
## Official docs

[Python docs main page](https://docs.python.org/)

[Build-in Types](https://docs.python.org/3.10/library/stdtypes.html)

[Build-in Functions](https://docs.python.org/3.10/library/functions.html)
