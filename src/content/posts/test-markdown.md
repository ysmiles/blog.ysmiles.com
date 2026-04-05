---
title: Test markdown
subtitle: Each post also has a subtitle
date: 2016-05-12
summary: A small formatting playground used to confirm how Markdown elements render after the migration.
tags: [SiteTest]
---

This post is now a small formatting playground for the Astro version of the site. It stays useful as a smoke test for tables, code blocks, and other common Markdown elements.

**Here is some bold text**

## Here is a secondary heading

Here's a useless table:

| Number | Next number | Previous number |
| :------ |:--- | :--- |
| Five | Six | Four |
| Ten | Eleven | Nine |
| Seven | Eight | Six |
| Two | Three | One |


How about a yummy crepe?

This example previously used an external image. I removed it to avoid depending on a remote demo asset for routine rendering checks.

Here's a code chunk:

~~~
var foo = function(x) {
  return(x + 5);
}
foo(3)
~~~

And here is the same code with syntax highlighting:

```javascript
var foo = function(x) {
  return(x + 5);
}
foo(3)
```

And here is the same code yet again in another fenced block:

```javascript
var foo = function(x) {
  return(x + 5);
}
foo(3)
```

## Boxes
The old theme supported custom callout classes here. The Astro migration does not carry those theme-specific box styles yet, so the examples remain as plain Markdown content.

### Notification

**Note:** This is a notification box.

### Warning

**Warning:** This is a warning box.

### Error

**Error:** This is an error box.
