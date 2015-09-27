# Hecate
======================

What is it
----------------------

The inspiration of `Hecate` is from [impress.js](https://github.com/impress/impress.js)

`Hecate` enables you to create beautiful interactive slides by using markdown.

^`Hecate`'s output is just one Html file.^

Install
----------------------

``` bash
npm install hecate -g
```

How to Use
----------------------

+ step1: create the markdown tempate.

``` bash
hecate crete example.md -p
```

+ step2: build the md to html file.

``` bash
hecate crete example.md
```

Advance
----------------------
The created tempalte md file will teach u how to config and fulfill your contents.

+ U can use the meta-tag to control the "Page" dom-element's "Transition-Data-Props", style, class, id

The "Transition-Data-Props" is from [impress.js](https://github.com/impress/impress.js)

```javascript

  ```meta
     {
       "data-x":2000,
       "data-y":1000,
       "data-scale":2,
       "data-rotate": 45,
       "class":"slide-card"
     }
  ```

```

+ U also can use these meta-tag `embed-js` `embed-css` `embed-html`

to control the html element contents.

```javascript
  ```embed-js
    console.log('hello~');
  ```
```

```css
  ```embed-css
    .my-class {
      font-size: 16px;
    }
  ```
```

+ U also can use meta-tag `meta-end` to end the last "Page" element range.

```javascript
  ```meta-end
  ```
```

+ U also can create the html directly, not from the markdown file.

```bash
  hecate create hello.html
```

 but it's hrad to modify.

[wiki/Hecate](https://en.wikipedia.org/wiki/Hecate)

![hecate](./hecate.png)



