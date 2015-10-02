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

var packageInfo = require("./package");

var development = process.env.NODE_ENV === "development";

var dirs = {
  src: "src",
  dist: "./dist",
  js: "src/js",
  jsDist: "",
  styles: "src/styles",
  stylesDist: ".",
  img: "src/img",
  imgDist: "img"
};

var files = {
  mainJs: "main",
  mainJsDist: "main",
  mainLess: "main",
  mainCssDist: "main",
  html: "index.html"
};

var webpackDevtool = "source-map";
var webpackWatch = false;
if (development) {
  // eval-source-map is the same thing as source-map,
  // except with caching. Don't use in production.
  webpackDevtool = "eval-source-map";
  webpackWatch = true;
}

var webpackConfig = {
  devtool: webpackDevtool,
  entry: "./" + dirs.js + "/" + files.mainJs + ".js",
  output: {
    filename: dirs.dist + "/" + files.mainJsDist + ".js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader?cacheDirectory"
      }
    ],
    preLoaders: [
      {
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/
      }
    ],
    postLoaders: [
      {
        loader: "transform/cacheable?envify"
      }
    ]
  },
  resolve: {
    extensions: ["", ".js"]
  },
  watch: webpackWatch
};

gulp.task("browsersync", function () {
  browserSync.init({
    online: true,
    open: false,
    port: 4200,
    server: {
      baseDir: dirs.dist
    },
    socket: {
      domain: "localhost:4200"
    }
  });
});

gulp.task("connect:server", function () {
  connect.server({
    port: 4200,
    root: dirs.dist
  });
});

// Create a function so we can use it inside of webpack's watch function.
function eslintFn () {
  return gulp.src([dirs.js + "/**/*.?(js|jsx)"])
    .pipe(eslint())
    .pipe(eslint.formatEach("stylish", process.stderr));
};
gulp.task("eslint", eslintFn);

gulp.task("images", function () {
  return gulp.src([dirs.img + "/**/*.*", "!" + dirs.img + "/**/_exports/**/*.*"])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(dirs.dist + "/" + dirs.imgDist));
});

gulp.task("html", function () {
  return gulp.src(dirs.src + "/" + files.html)
    .pipe(replace(
      "@@ANALYTICS_KEY",
      process.env.NODE_ENV === "production" ?
        "51ybGTeFEFU1xo6u10XMDrr6kATFyRyh" :
        "39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP"
    ))
    .pipe(gulp.dest(dirs.dist));
});

gulp.task("less", function () {
  return gulp.src(dirs.styles + "/" + files.mainLess + ".less")
    .pipe(gulpif(development, sourcemaps.init()))
    .pipe(less({
      paths: [dirs.styles], // @import paths
      plugins: [colorLighten]
    }))
    .on('error', function (err) {
        gutil.log(err);
        this.emit('end');
    })
    .pipe(autoprefixer())
    .pipe(gulpif(development, sourcemaps.write(".")))
    .pipe(gulp.dest(dirs.dist + "/" + dirs.stylesDist))
    .pipe(gulpif(development, browserSync.stream()))
    .on('error', gutil.log);
});

gulp.task("minify-css", ["less"], function () {
  return gulp.src(dirs.dist + "/" + dirs.stylesDist + "/" + files.mainCssDist + ".css")
    .pipe(minifyCSS())
    .pipe(gulp.dest(dirs.dist + "/" + dirs.stylesDist));
});

gulp.task("minify-js", ["replace-js-strings"], function () {
  return gulp.src(dirs.dist + "/" + dirs.jsDist + "/" + files.mainJs + ".js")
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulp.dest(dirs.dist + "/" + dirs.jsDist));
});

gulp.task("reload", ["replace-js-strings"], function () {
  if (development) {
    browserSync.reload();
  }
});

gulp.task("replace-js-strings", ["webpack"], function () {
  return gulp.src(dirs.dist + "/**/*.?(js|jsx)")
    .pipe(replace("@@VERSION", packageInfo.version))
    .pipe(replace("@@ENV", process.env.NODE_ENV))
    .pipe(gulp.dest(dirs.dist));
});

gulp.task("swf", function () {
  return gulp.src(dirs.src + "/**/*.swf")
    .pipe(gulp.dest(dirs.dist));
});

gulp.task("watch", function () {
  gulp.watch(dirs.styles + "/**/*.less", ["less"]);
  gulp.watch(dirs.img + "/**/*", ["images"]);
  // Why aren't we watching any JS files? Because we use webpack's
  // internal watch, which is faster due to insane caching.
});

// Create a function so we can use it inside of webpack's watch function.
function replaceJsStringsFn (callback) {
  gulp.src(dirs.dist + "/**/*.?(js|jsx)")
    .pipe(replace("@@VERSION", packageInfo.version))
    .pipe(replace("@@ENV", process.env.NODE_ENV))
    .pipe(gulp.dest(dirs.dist))
    .on('end', callback);
};

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
      replaceJsStringsFn(function () {
        if (development) {
          browserSync.reload();
        }
      });
    }
  });
});

gulp.task("default", ["webpack", "eslint", "replace-js-strings", "less", "images", "swf", "html", "reload"]);

gulp.task("dist", ["default", "minify-css", "minify-js"]);

gulp.task("serve", ["default", "connect:server", "watch"]);

gulp.task("livereload", ["default", "browsersync", "watch"]);
