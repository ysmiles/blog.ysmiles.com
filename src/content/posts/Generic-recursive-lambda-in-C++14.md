---
layout:     post
title:      "Generic recursive lambda in C++14"
subtitle:   "An alternative way to write your helper function"
author:     "Frederick"
date:       2018-04-19
catalog:    true
header-mask: 
tags:
    - C++
    - lambda
---

When we practice LeetCode questions, we always need to write a helper recursive function outside the main solution function.
For example, to find the max value in a binary tree, we can have the following codes: (method-1)

```cpp
class Solution {
    // pre-order DFS
    void helper(TreeNode *root, int &ret) {
        if (!root)
            return;
        ret = std::max(ret, root->val);
        helper(root->left);
        helper(root->right);
    }

  public:
    int findMax(TreeNode *root) {
        int maxval = std::numeric_limits<int>::min();

        helper(root, maxval);

        return maxval;
    }
};
```

Sometimes we don't want to write the helper outside our working function,
i.e. `findMax` in previous example.
The reasons can be different.
For me, I don't want to add the reference type parameter `ret`.
In fact, for questions in LeetCode, we always need to add many reference type parameters, such as problems related to backtracking.
Since C++11, we can write lambda, further more, recursive lambda locally.
This relies on the standard function type. (method-2) 

```cpp
class Solution {
  public:
    int findMax(TreeNode *root) {
        int maxval = std::numeric_limits<int>::min();

        // pre-order DFS
        function<void(TreeNode*)> helper = [&](TreeNode *root) {
            if (!root)
                return;
            maxval = std::max(ret, root->val);
            helper(root->left);
            helper(root->right);
        };

        helper(root);

        return maxval;
    }
};
```

In the code above, `[&]` indicates the `helper` lambda to capture the local variables (by references) before the statement.
Actually, for the inside call of `helper`, it also references the name of itself.
That's why we cannot change `function<void(TreeNode*)>` to `auto`.
If we use `auto`, the call to `helper` inside the function body will make it impossible for compiler to deduce the type of helper.

But we really do not want `function<void(TreeNode*)>`, because it is too long and it has the same content as `(TreeNode *root)` later.
The reason we want to write lambda is to reduce length, but method-2 seems to make it longer (actually running time also becomes longer).

Luckily, since C++14, we have a better way to do it, that is the generic lambda.
We still cannot use `helper` inside the lambda body for same reason.
But taking advantages of generic parameter, here we have a more tricky way to do it. (method-3)

```cpp
class Solution {
  public:
    int findMax(TreeNode *root) {
        int maxval = std::numeric_limits<int>::min();

        // pre-order DFS
        auto helper = [&](auto &&self, auto root) {
            if (!root)
                return;
            maxval = std::max(ret, root->val);
            self(self, root->left);
            self(self, root->right);
        };

        helper(helper, root);

        return maxval;
    }
};
```

This code can successfully compile and result in relatively same runtime efficiency as method-1.
We avoid the call to `helper` inside the body.
Instead, we introduce an r-value reference parameter called `self`.
In this way, compiler can deduce out the type of helper when we call it later by `helper(helper, root)`.

`auto &&self` can also be `const auto &self` to fit both l-value and r-value.

The reason why method-2 is slightly slower than method-1 and method-3 might be that capture by `[&]` has more overheads than directly pass the r-value reference argument.
For more details, please refer to the reference links below.

## References

[Recursive lambda functions in C++14 - Stack Overflow](https://stackoverflow.com/questions/18085331/recursive-lambda-functions-in-c14)

[Recursive lambdas in C++(14) - Pedro Melendez](http://pedromelendez.com/blog/2015/07/16/recursive-lambdas-in-c14/)