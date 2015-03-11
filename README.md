### DCOS UI

#### Working on assets

1. Install [NPM](https://npmjs.org/)
2. Install dev dependencies

  ```sh
  npm install
  npm install -g broccoli-cli
  ```

3. Setup project configuration

  1. Copy `src/js/utils/Config.template.js` to `src/js/utils/Config.dev.js`

  2. Override variables in `Config.dev.js` to reflect
  your local development configuration

4. Run development environment

  ```sh
  npm run serve
  ```

5. Build the assets

  ```sh
  npm run dist
  ```

#### Development Setup (Sublime Text)

1. Add the following to your Sublime Text User Settings:

  ```json
  {
    ...
    "rulers": [80], // lines no longer than 80 chars
    "tab_size": 2, // use two spaces for indentation
    "translate_tabs_to_spaces": true, // use spaces for indentation
    "ensure_newline_at_eof_on_save": true, // add newline on save
    "trim_trailing_white_space_on_save": true, // trim trailing white space on save
    "default_line_ending": "unix"
  }
  ```

2. Add Sublime-linter with jshint & jsxhint:

  1. Installing SublimeLinter is straightforward using Sublime Package Manager,
  see [instructions](http://sublimelinter.readthedocs.org/en/latest/installation.html#installing-via-pc)

  2. SublimeLinter-jshint needs a global jshint in your system,
  see [instructions](https://github.com/SublimeLinter/SublimeLinter-jshint#linter-installation)

  3. SublimeLinter-jsxhint needs a global jsxhint in your system,
  as well as JavaScript (JSX) bundle inside Packages/JavaScript,
  see [instructions](https://github.com/SublimeLinter/SublimeLinter-jsxhint#linter-installation)
