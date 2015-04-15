jasmine.VERBOSE = true;

var jasmineEnv = jasmine.getEnv();
var TeamCityReporter = require("../node_modules/jasmine-reporters/src/jasmine.teamcity_reporter");

jasmineEnv.addReporter(new jasmine.TeamcityReporter());
