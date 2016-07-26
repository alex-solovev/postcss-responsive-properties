# PostCSS Responsive Properties [![Build Status][ci-img]][ci]

[PostCSS] plugin that will make writing responsive style more easily.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/alexandr-solovyov/postcss-responsive-properties.svg
[ci]:      https://travis-ci.org/alexandr-solovyov/postcss-responsive-properties


#### Input:
```css
$desktop: 992px;

body {
  font-size: {
    default: 1em;
    desktop: 1.5em;
    1600: 2em;
  }
}

```


#### Output:
```css
body {
  font-size: 1em;
}

@media screen and (min-width: 992px) {
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
npm i postcss postcss-responsive-properties postcss-merge-rules --save-dev
```

#### Using with PostCSS:
```
var postcss = require("postcss"),
    mergerules = require("postcss-merge-rules"), // this dependency needed for clean-up plugin output
    variables = require("postcss-simple-vars"), // you also need this plugin for using variables in properties
    responsiveCSSProperties = require("postcss-responsive-css-properties");

postcss([
        responsiveCSSProperties,
        variables,
        mergerules
    ])
    .process(css, { from: "src/input.css", to: "dist/output.css" })
    .then(function (result) {
        fs.writeFileSync("dist/output.css", result.css);
        if ( result.map ) fs.writeFileSync("dist/output.css.map", result.map);
});
```

#### Using with gulp:
```js
var gulp = require("gulp"),
    postcss = require("gulp-postcss"),
    mergerules = require("postcss-merge-rules"), // this dependency needed for clean-up plugin output
    variables = require("postcss-simple-vars"), // you also need this plugin for using variables in properties
    responsiveCSSProperties = require("postcss-responsive-css-properties");

gulp.task("styles", function() {
    var processors = [
        responsiveCSSProperties,
        variables,
        mergerules
    ];

    return gulp.src("[input-file].css")
        .pipe(postcss(processors).on("error", function(err) { console.log(err)}))
        .pipe(gulp.dest("[output-file].css"));
});

gulp.task("watch", function() {
    gulp.watch("[input-file].css", ["styles"]);
});

gulp.task("default", ["styles", "watch"]);
```

See [PostCSS] docs for examples for your environment.
