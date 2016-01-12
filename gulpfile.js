// dependencies
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var colorLighten = require("less-color-lighten");
var connect = require("gulp-connect");
var eslint = require("gulp-eslint");
var gulp = require("gulp");
var gulpif = require("gulp-if");
var gutil = require("gulp-util");
var imagemin = require("gulp-imagemin");
var less = require("gulp-less");
var minifyCSS = require("gulp-minify-css");
var replace = require("gulp-replace");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var webpack = require("webpack");

var config = require("./.build.config");
var packageInfo = require("./package");
var webpackConfig = require("./.webpack.config");

var development = process.env.NODE_ENV === "development";
var devBuild = development || (process.env.NODE_ENV === "testing");

function browserSyncReload() {
  if (development) {
    browserSync.reload();
  }
}

gulp.task("browsersync", function () {
  browserSync.init({
    online: true,
    open: false,
    port: 4200,
    server: {
      baseDir: config.dirs.dist
    },
    socket: {
      domain: "localhost:4200"
    }
  });
});

gulp.task("connect:server", function () {
  connect.server({
    port: 4200,
    root: config.dirs.dist
  });
});

// Create a function so we can use it inside of webpack's watch function.
function eslintFn () {
  return gulp.src([config.dirs.srcJS + "/**/*.?(js|jsx)"])
    .pipe(eslint())
    .pipe(eslint.formatEach("stylish", process.stderr));
};
gulp.task("eslint", eslintFn);

gulp.task("images", function () {
  return gulp.src([
      config.dirs.srcImg + "/**/*.*",
      "!" + config.dirs.srcImg + "/**/_exports/**/*.*"
    ])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(config.dirs.distImg));
});

gulp.task("html", function () {
  return gulp.src(config.files.srcHTML)
    .pipe(gulp.dest(config.dirs.dist))
    .on("end", browserSyncReload);
});

gulp.task("less", function () {
  return gulp.src(config.files.srcCSS)
    .pipe(gulpif(devBuild, sourcemaps.init()))
    .pipe(less({
      paths: [config.dirs.cssSrc], // @import paths
      plugins: [colorLighten]
    }))
    .on("error", function (err) {
        gutil.log(err);
        this.emit("end");
    })
    .pipe(autoprefixer())
    .pipe(gulpif(devBuild, sourcemaps.write()))
    .pipe(gulp.dest(config.dirs.distCSS))
    .pipe(gulpif(devBuild, browserSync.stream()));
});

gulp.task("minify-css", ["less"], function () {
  return gulp.src(config.files.distCSS)
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.dirs.distCSS));
});

gulp.task("minify-js", ["replace-js-strings"], function () {
  return gulp.src(config.files.distJS)
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulp.dest(config.dirs.distJS));
});

function replaceJsStringsFn () {
  return gulp.src(config.files.distJS)
    .pipe(replace("@@VERSION", packageInfo.version))
    .pipe(replace("@@ENV", process.env.NODE_ENV))
    .pipe(replace(
      "@@ANALYTICS_KEY",
      process.env.NODE_ENV === "production" ?
        "51ybGTeFEFU1xo6u10XMDrr6kATFyRyh" :
        "39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP"
    ))
    .pipe(gulp.dest(config.dirs.distJS))
    .on("end", browserSyncReload);
};
gulp.task("replace-js-strings", ["webpack"], replaceJsStringsFn);

gulp.task("swf", function () {
  return gulp.src(config.dirs.src + "/**/*.swf")
    .pipe(gulp.dest(config.dirs.dist));
});

gulp.task("watch", function () {
  gulp.watch(config.files.srcHTML, ["html"]);
  gulp.watch(config.dirs.srcCSS + "/**/*.less", ["less"]);
  gulp.watch(config.dirs.srcImg + "/**/*.*", ["images"]);
  // Why aren't we watching any JS files? Because we use webpack's
  // internal watch, which is faster due to insane caching.
});

// Use webpack to compile jsx into js.
gulp.task("webpack", function (callback) {
  var isFirstRun = true;

  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      children: false,
      chunks: false,
      colors: true,
      modules: false,
      timing: true
    }));

    if (isFirstRun) {
      // This runs on initial gulp webpack load.
      isFirstRun = false;
      callback();
    } else {
      // This runs after webpack's internal watch rebuild.
      eslintFn();
      replaceJsStringsFn();
    }
  });
});

gulp.task("default", ["webpack", "eslint", "replace-js-strings", "less", "images", "swf", "html"]);

gulp.task("dist", ["default", "minify-css", "minify-js"]);

gulp.task("serve", ["default", "connect:server", "watch"]);

gulp.task("livereload", ["default", "browsersync", "watch"]);
