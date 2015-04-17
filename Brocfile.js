// dependencies
var assetRev = require("broccoli-asset-rev");
var autoprefixer = require("broccoli-autoprefixer");
var chalk = require("chalk");
var cleanCSS = require("broccoli-clean-css");
var concatCSS = require("broccoli-concat");
var env = require("broccoli-env").getEnv();
var eslint = require("broccoli-lint-eslint");
var fs = require("fs");
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

  eslint: function (tree) {
    return eslint(tree, {config: '.eslintrc'});
  },

  webpack: function (masterTree) {
    // transform merge module dependencies into one file
    return webpackify(masterTree, {
      entry: "./" + fileNames.mainJs + ".js",
      output: {
        // library: "Test",
        filename: dirs.jsDist + "/" + fileNames.mainJsDist + ".js"
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: "jsx-loader?harmony",
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        extensions: ["", ".js"]
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

    // create tree for less (pick all less and css files needed)
    var cssTree = pickFiles(dirs.styles, {
      srcDir: "./",
      files: ["**/*.less", "**/*.css"],
      destDir: dirs.stylesDist
    });

    // remove old compiled file, from ealier build
    removeFile(cssTree, {
      srcFile: dirs.stylesDist + "/" + fileNames.mainStylesDist + ".css"
    });

    // compile main less to css
    var lessTree = less(
      cssTree,
      fileNames.mainStyles + ".less",
      fileNames.mainStylesDist + ".css",
      {}
    );

    lessTree = autoprefixer(lessTree);

    cssTree = mergeTrees([cssTree, lessTree], {overwrite: true});

    // concatenate css
    cssTree = concatCSS(cssTree, {
      inputFiles: [
        "**/*.css",
        "!" + dirs.stylesDist + "/" + fileNames.mainStyles + ".css",
        dirs.stylesDist + "/" + fileNames.mainStyles + ".css"
      ],
      outputFile: "/" + dirs.stylesDist + "/" + fileNames.mainStylesDist + ".css",
    });

    return mergeTrees(
      [masterTree, cssTree],
      {overwrite: true}
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
      files: ["index.html"],
    });

    indexTree = replace(indexTree, {
      files: ["index.html"],
      patterns: [
        {
          match: "ANALYTICS_KEY",  // replaces @@ANALYTICS_KEY
          replacement: env === "production" ?
            "51ybGTeFEFU1xo6u10XMDrr6kATFyRyh" :
            "39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP"
        }
      ]
    });

    return mergeTrees(
      [masterTree, indexTree],
      {overwrite: true}
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
      {overwrite: true}
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
  // create tree for .js
  var jsTree = pickFiles(dirs.js, {
    srcDir: "./",
    destDir: "",
    files: [
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
    fs.lstatSync("src/js/config/Config.dev.js");
  }
  catch (err) {
    err.message = chalk.red("Please copy 'src/js/config/Config.template.js' " +
      "to 'src/js/config/Config.dev.js' and make necessary changes " +
      "to start working on assets.");
    throw err;
  }
}
/*
 * Start the build
 */
var buildTree = _.compose(tasks.eslint, createJsTree);

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
