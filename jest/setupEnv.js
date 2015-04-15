var path = require("path");
var fs = require("fs");

this.__stateJSON__ = JSON.parse(fs.readFileSync(path.join(__dirname,
    "../src/js/stores/__tests__/fixtures/state.json"
  )));
