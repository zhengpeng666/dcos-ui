# DCOS UI

## Requirements

Node 0.10.x is **required** as versions 0.11 and 0.12 introduced compatibility issues with Jest as reported [here](https://github.com/facebook/jest/issues/243). We suggest using [nvm](https://github.com/creationix/nvm) or [n](https://github.com/tj/n) to keep multiple Node versions on your system.

## Working on assets

To work efficently on DCOS-UI you will need to setup 3 different environemtns.
* [DCOS Image](#dcos-image)
* [DCOS UI](#dcos-ui)
* [DCOS UI Proxy](#dcos-ui-proxy)

### DCOS Image

The DCOS Image will create a virtual machine on your computer. This machine will contain a small version of a DCOS cluster. In short, it'll have a Mesos master, slave, marathon along with other packages that are needed for DCOS to operate.

1. `$ mkdir vagrant-dcos-image && cd vagrant-dcos-image`
2. `$ curl https://downloads.mesosphere.io/dcos/testing/continuous/make_dcos_vagrant.sh > make_dcos_vagrant.sh`
3. `$ chmod +x make_dcos_vagrant.sh`
4. `$ ./make_dcos_vagrant.sh`
5. `$ vagrant up`

### DCOS UI

This repository contains the DCOS UI application. The application gathers data from endpoints located on the DCOS Image.

1. Clone this repository
2. Install [NPM](https://npmjs.org/)
3. Install dev dependencies

  ```sh
  npm install
  npm install -g gulp
  ```

4. Setup project configuration

  1. Copy `src/js/config/Config.template.js` to `src/js/config/Config.dev.js`

  2. Override variables in `Config.dev.js` to reflect
  your local development configuration

5. Run development environment

  ```sh
  npm run serve
  ```

6. Run the tests

  ```sh
  npm test
  ```

7. Build the assets

  ```sh
  npm run dist
  ```

### DCOS UI Proxy

This is a simple Vagrant machine which acts as a proxy.
Since the assets for DCOS UI application needs to make requests to endpoints located on the DCOS Image which resides on a different domain, this will normally cause CORS problems due to browser security policies.
This vagrant machine solves this problem by proxying both requests through the same domain.

1. Go to Google Drive and browse to the following directory `Engineering/Frontend/Vagrant Machines`
2. Download the `dcos-ui` file
3. `$ vagrant box add dcos-ui file:///PATH/dcos-ui` (replace PATH with the path to the dcos-ui file you just downloaded)
4. `$ mkdir vagrant-dcos-ui`
5. `$ vagrant init dcos-ui`
6. `$ vagrant up`
7. Create an entry in your `/etc/hosts` file of `192.168.50.5 dcos.local`
6. Go to http://dcos.local


## Adding npm package dependencies to package.json

If you want to add a new npm package to 'node_modules':

1. Install the new package

        npm install [your package] --save
    will install and save to dependencies in package.json and

        npm install [your package] --save-dev
    will add it to devDependencies.

2. Create a synced npm-shrinkwrap.json with devDependencies included

        npm run shrinkwrap

3. Commit to repository

## Development Setup (Sublime Text)

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

  2. SublimeLinter-eslint needs a global eslint in your system,
  see [instructions](https://github.com/roadhump/SublimeLinter-eslint#sublimelinter-eslint)

3. Syntax Highlihgting for files containing JSX

  1. Install Babel using Sublime Package Manager,
  see [instructions](https://github.com/babel/babel-sublime)
  From here you can decide to use Babel for all .js files. See their
  docs for that. If you don't want to do that, continue reading.

  2. Installing ApplySyntax using Sublime Package Manager,
  see [instructions](https://github.com/facelessuser/ApplySyntax)

  3. Open up the user configuration file for ApplySyntax: `Sublime Text` ->
  `Preferences` -> `Package Settings` -> `ApplySyntax` -> `Settings - User`

  4. Replace the contents with this:
  ```
  {
      // Put your custom syntax rules here:
      "syntaxes": [
          {
              "name": "Babel/JavaScript (Babel)",
              "rules": [
                  {"first_line": "^\\/\\*\\*\\s@jsx\\sReact\\.DOM\\s\\*\\/"}
              ]
          }
      ]
  }
  ```

## Testing

**Why is testing important?**

Many of us like to sleep at night. So to give us peace of mind when we release a new version of our software, we want to guarantee that the application works as it should, always.

To accomplish this we write two kinds of tests that will ensure that our applications behaves as it should even as we add new features.

### Unit tests

These tests ensure that individual units of code (functions/methods) return the expected results with different inputs.

Think of a `sum` function. When called as `sum(1)` we may expect a return value of `1`. When called as `sum(1, 2)` we may expect a return value of `3`. And when called with no arguments, we may expect an error to be thrown.

### Integration tests

We want to guarantee that our project DCOS UI works as it should within DCOS as a product. To do this we want our integration tests to run against a DCOS cluster.

For example we want to test that when an slave fails in a cluster, the UI visually shows this slave failure. A different example is validating that when a new service is installed on a cluster it will show up in the services page.

#### Setup

1. Install Cypress CLI

  ```sh
  npm install -g cypress
  ```

2. Install Cypress desktop app

  ```sh
  cypress install
  ```

3. Open Cypress

  ```sh
  cypress open
  ```

This should show a new icon on your desktop menu bar.
![img](../blob/master/docs/images/cypress-desktop-icon.png?raw=true)

4. Login with Github
Click on the icon on your desktop menu bar and login.
![img](../blob/master/docs/images/cypress-login.png?raw=true)

5. Add project to Cypress app
Once you've logged in click on the plus button and add the `dcos-ui` folder.
![img](../blob/master/docs/images/cypress-no-projects.png?raw=true)

6. Once the project is added click on it to start the server
![img](../blob/master/docs/images/cypress-project.png?raw=true)
![img](../blob/master/docs/images/cypress-server-running.png?raw=true)

7. Ask someone on the team to teach all about writing integration tests.
