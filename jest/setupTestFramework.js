jasmine.VERBOSE = true;

var jasmineEnv = jasmine.getEnv();
var SpecReporter = require("jasmine-spec-reporter");

jasmineEnv.addReporter(new SpecReporter());
