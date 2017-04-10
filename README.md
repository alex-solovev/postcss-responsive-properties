# PostCSS Responsive Properties [![Build Status][ci-img]][ci]

[PostCSS] plugin that will make writing responsive style more easily.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/alexandr-solovyov/postcss-responsive-properties.svg
[ci]:      https://travis-ci.org/alexandr-solovyov/postcss-responsive-properties


#### Input:
```css
body {
  color: red;
  font-size: {
    0: 1em;
    $tablet: 1.5em; /* use it with variables */
    1600: 2em;
  }
}

```


#### Output:
```css
body {
  color: red;
  font-size: 1em
}

@media screen and (min-width: $tablet) { /* use it with variables */
  body {
    font-size: 1.5em;
  }
}

@media screen and (min-width: 1600px) {
  body {
    font-size: 2em;
  }
}
```

## Usage

Install postcss and postcss-responsive-properties to your project:
```
npm i postcss postcss-responsive-properties --save
```

#### Using with PostCSS:
```js
var postcss = require("postcss"),
    responsiveCSSProperties = require("postcss-responsive-properties");

postcss([ responsiveCSSProperties ])
    .process(css, { from: "src/input.css", to: "dist/output.css" })
    .then(function (result) {
        fs.writeFileSync("dist/output.css", result.css);
        if ( result.map ) fs.writeFileSync("dist/output.css.map", result.map);
});
```

#### Using with gulp:

```
npm i gulp gulp-postcss postcss-responsive-properties --save
```

```js
var gulp = require("gulp"),
    postcss = require("gulp-postcss"),
    responsiveCSSProperties = require("postcss-responsive-properties");

gulp.task("styles", function() {
    var processors = [ responsiveCSSProperties ];

    return gulp.src("src/input.css")
        .pipe(postcss(processors).on("error", function(err) { console.log(err)}))
        .pipe(gulp.dest("dist/output.css"));
});
```

See [PostCSS] docs for examples for your environment.
