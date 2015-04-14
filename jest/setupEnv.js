var path = require("path");
var fs = require("fs");

this.__stateJSON__ = JSON.parse(fs.readFileSync(path.join(__dirname, "./state.json")));
