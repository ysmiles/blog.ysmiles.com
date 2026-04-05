---
title: "Learning HTML"
date: 2016-05-27
summary: "A small early HTML exercise preserved as a simple static page example."
tags:
  - HTML
---

This was the first HTML file I wrote. I am keeping it here as a small early exercise and a reminder of how direct the first steps on the web can feel.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>My first HTML</title>
        <meta charset="UTF-8">
    </head>
    
    <body style="background-color:lightgrey;">
        <h1 style="color:red;">This is a red heading</h1>
        <hr>
        
        <p title="About YS">
            Frederick.
            I am YS.
        </p>
        <p style="font-family:verdana;font-size:300%;text-align:center;">
            This <br> paragraph
            contains a lot of lines
            in the source code,
            but the browser
            ignores it.
        </p>
        <!-- this is a comment -->
        <p>Here is a quote from WWF's website:</p>
        <blockquote cite="https://www.worldwildlife.org/who/index.html">
        For 50 years, WWF has been protecting the future of nature.
        The world's leading conservation organization,
        WWF works in 100 countries and is supported by
        1.2 million members in the United States and
        close to 5 million globally.
        </blockquote>
        
        <h2>Unordered List with Default Bullets</h2>
        
        <ul>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
        </ul>
        <p>I have a date on <time datetime="2008-02-14 20:00">Valentines day</time>.</p>
    </body>
</html>
```
