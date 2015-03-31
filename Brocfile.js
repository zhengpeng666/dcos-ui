// dependencies
var assetRev = require("broccoli-asset-rev");
var autoprefixer = require("broccoli-autoprefixer");
var chalk = require("chalk");
var cleanCSS = require("broccoli-clean-css");
var concatCSS = require("broccoli-concat");
var env = require("broccoli-env").getEnv();
var fs = require("fs");
var jscs = require("broccoli-jscs");
var jsHintTree = require("broccoli-jshint");
var less = require("broccoli-less-single");
var mergeTrees = require("broccoli-merge-trees");
var pickFiles = require("broccoli-static-compiler");
var replace = require("broccoli-replace");
var removeFile = require("broccoli-file-remover");
var uglifyJavaScript = require("broccoli-uglify-js");
var webpackify = require("broccoli-webpack");
var _ = require("underscore");
var packageConfig = require("./package.json");

/*
 * configuration
 * (use "." for root of dir)
 */
var dirs = {
  src: "src",
  js: "src/js",
  jsDist: ".",
  styles: "src/styles",
  stylesDist: ".",
  img: "src/img",
  imgDist: "img"
};

// without extensions
var fileNames = {
  mainJs: "main",
  mainJsDist: "main",
  mainStyles: "main",
  mainStylesDist: "main"
};

/*
 * Task definitions
 */
var tasks = {

  jsHint: function (jsTree) {
    // run jscs on compiled js
    var jscsTree = jscs(jsTree, {
      disableTestGenerator: true,
      enabled: true,
      jshintrcPath: dirs.js + "/.jscsrc"
    });

    // run jshint on compiled js
    var hintTree = jsHintTree(jsTree , {
      disableTestGenerator: true,
      jshintrcPath: dirs.js + "/.jshintrc"
    });

    // hack to strip test files from jshint tree
    hintTree = pickFiles(hintTree, {
      srcDir: "./",
      files: []
    });

    return mergeTrees(
      [jscsTree, hintTree, jsTree],
      { overwrite: true }
    );
  },

  webpack: function (masterTree) {
    // transform merge module dependencies into one file
    return webpackify(masterTree, {
      entry: "./" + fileNames.mainJs + ".jsx",
      output: {
        // library: "Test",
        filename: dirs.jsDist + "/" + fileNames.mainJsDist + ".js"
      },
      module: {
        loaders: [
          {
            // tell webpack to use jsx-loader for all *.jsx files
            test: /\.jsx$/,
            loader: "jsx-loader?harmony",
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        extensions: ["", ".js", ".jsx"]
      }
    });
  },

  minifyJs: function (masterTree) {
    return uglifyJavaScript(masterTree, {
      mangle: true,
      compress: true
    });
  },

  css: function (masterTree) {
    removeFile(dirs.styles, {
      srcFile: dirs.stylesDist + "/" + fileNames.mainStylesDist + ".css"
    });

    // create tree for less (pick all less and css files needed)
    var cssTree = pickFiles(dirs.styles, {
      srcDir: "./",
      files: ["**/*.less"],
      destDir: dirs.stylesDist
    });

    // compile main less to css
    cssTree = less(
      cssTree,
      fileNames.mainStyles + ".less",
      fileNames.mainStylesDist + ".css",
      {}
    );

    cssTree = autoprefixer(cssTree);

    // concatenate css
    cssTree = concatCSS(cssTree, {
      inputFiles: [
        "**/*.css",
      ],
      outputFile: "/" + dirs.stylesDist + "/" + fileNames.mainStylesDist + ".css",
    });

    return mergeTrees(
      [masterTree, cssTree],
      { overwrite: true }
    );
  },

  minifyCSS: function (masterTree) {
    return cleanCSS(masterTree);
  },

  index: function (masterTree) {
    // create tree for index
    var indexTree = pickFiles(dirs.src, {
      srcDir: "./",
      destDir: "",
      files: ["*.html"],
    });

    return mergeTrees(
      [masterTree, indexTree],
      { overwrite: true }
    );
  },

  img: function (masterTree) {
    // create tree for image files
    var imgTree = pickFiles(dirs.img, {
      srcDir: "./",
      destDir: dirs.imgDist,
    });

    return mergeTrees(
      [masterTree, imgTree],
      { overwrite: true }
    );
  },

  md5: function (masterTree) {
    // add md5 checksums to filenames
    return assetRev(masterTree, {
      extensions: ["js", "css", "png", "jpg", "gif"],
      replaceExtensions: ["html", "js", "css"]
    });
  }
  // https://github.com/bguiz/broccoli-sprite
  // https://github.com/imagemin/imagemin
};

/*
 * basic pre-processing before actual build
 */
function createJsTree() {
  // create tree for .js and .jsx
  var jsTree = pickFiles(dirs.js, {
    srcDir: "./",
    destDir: "",
    files: [
      "**/*.jsx",
      "**/*.js"
    ]
  });

  // replace @@ENV in js code with current BROCCOLI_ENV environment variable
  // {default: "development" | "production"}
  return replace(jsTree, {
    files: ["**/*.js"],
    patterns: [
      {
        match: "ENV", // replaces @@ENV
        replacement: env
      },
      {
        match: "VERSION",
        replacement: packageConfig.version
      }
    ]
  });
}

/*
 * Check if development environment is properly setup
 */
if (env === "development") {
  try {
    // Query the entry
    fs.lstatSync("src/js/utils/Config.dev.js");
  }
  catch (err) {
    err.message = chalk.red("Please copy 'src/js/utils/Config.template.js' " +
      "to 'src/js/utils/Config.dev.js' and make necessary changes " +
      "to start working on assets.");
    throw err;
  }
}
/*
 * Start the build
 */
var buildTree = _.compose(tasks.jsHint, createJsTree);

// export BROCCOLI_ENV={default : "development" | "production"}
if (env === "development" || env === "production" ) {
  // add steps used in both development and production
  buildTree = _.compose(
    tasks.img,
    tasks.index,
    tasks.css,
    tasks.webpack,
    buildTree
  );
}

if (env === "production") {
  // add steps that are exclusively used in production
  buildTree = _.compose(
    tasks.md5,
    tasks.minifyCSS,
    tasks.minifyJs,
    buildTree
  );
}

module.exports = buildTree();
