var _ = require("underscore");

jest.dontMock("../../config/Config");
jest.dontMock("../MesosStateStore");
jest.dontMock("./fixtures/MockStates");
jest.dontMock("./fixtures/MockAppHealth");
jest.dontMock("./fixtures/MockAppMetadata");
jest.dontMock("./fixtures/MockParsedAppMetadata");

var Config = require("../../config/Config");
var MesosStateStore = require("../MesosStateStore");
var MockStates = require("./fixtures/MockStates");
var MockAppHealth = require("./fixtures/MockAppHealth");
var MockAppMetadata = require("./fixtures/MockAppMetadata");
var MockParsedAppMetadata = require("./fixtures/MockParsedAppMetadata");

function getFrameworkAfterProcess(apps) {
  MesosStateStore.processMarathonApps(apps);
  MesosStateStore.processState(MockStates.oneTaskRunning);
  var frameworks = MesosStateStore.getFrameworks();
  return _.find(frameworks, function (fwk) {
    return fwk.name === MockStates.oneTaskRunning.frameworks[0].name;
  });
}

// mock global string decoder
global.atob = function () {
  return MockAppMetadata.decodedString;
};

describe("Mesos State Store", function () {
    // Avoid repeatedly calling init.
  var initMesosStateStoreOnce = _.once(MesosStateStore.init);

  describe("#getTaskFailureRate", function () {

    beforeEach(function() {
      initMesosStateStoreOnce();
      MesosStateStore.processState(MockStates.oneTaskRunning);
      // Necessary because _prevMesosStatesMap is only set by getFailureRate.
      MesosStateStore.getTaskFailureRate();
    });

    it("is 0% initially", function () {
      var taskFailureRate = MesosStateStore.getTaskFailureRate();
      expect(_.last(taskFailureRate).rate).toEqual(0);
    });

    it("is 0% when one task finishes", function () {
      MesosStateStore.processState(MockStates.oneTaskFinished);
      var taskFailureRate = MesosStateStore.getTaskFailureRate();
      expect(_.last(taskFailureRate).rate).toEqual(0);
    });

    it("is 100% when one task fails", function () {
      MesosStateStore.processState(MockStates.oneTaskFailed);
      var taskFailureRate = MesosStateStore.getTaskFailureRate();
      expect(_.last(taskFailureRate).rate).toEqual(100);
    });

    it("is 0% when one task is killed", function () {
      MesosStateStore.processState(MockStates.oneTaskKilled);
      var taskFailureRate = MesosStateStore.getTaskFailureRate();
      expect(_.last(taskFailureRate).rate).toEqual(0);
    });
  });

  describe("#getFrameworkHealth", function () {

    beforeEach(function() {
      initMesosStateStoreOnce();
    });

    it("should return NA health when app has no health check", function () {
      var framework = getFrameworkAfterProcess(MockAppHealth.hasNoHealthy);
      expect(framework.health.key).toEqual("NA");
    });

    it("should return idle when app has no running tasks", function () {
      var framework = getFrameworkAfterProcess(MockAppHealth.hasNoRunningTasks);
      expect(framework.health.key).toEqual("IDLE");
    });

    it("should return unhealthy when app has only unhealthy tasks",
      function () {
        var framework = getFrameworkAfterProcess(MockAppHealth.hasOnlyUnhealth);
        expect(framework.health.key).toEqual("UNHEALTHY");
      }
    );

    it("should return unhealthy when app has both healthy and unhealthy tasks",
      function () {
        var framework = getFrameworkAfterProcess(MockAppHealth.hasOnlyUnhealth);
        expect(framework.health.key).toEqual("UNHEALTHY");
      }
    );

    it("should return healthy when app has healthy and no unhealthy tasks",
      function () {
        var framework = getFrameworkAfterProcess(MockAppHealth.hasHealth);
        expect(framework.health.key).toEqual("HEALTHY");
      }
    );
  });

  describe("#parseMetadata", function () {
    beforeEach(function() {
      initMesosStateStoreOnce();
    });

    it("should parse metadata correctly", function () {
      var result = MesosStateStore.parseMetadata(
        MockAppMetadata.encodedString
      );
      expect(result).toEqual(MockParsedAppMetadata);
    });
  });

  describe("#getFrameworkImages", function () {

    beforeEach(function() {
      initMesosStateStoreOnce();
    });

    it("should return parsed images when app has metadata with images",
      function () {
        var framework = getFrameworkAfterProcess(MockAppHealth.hasMetadata);
        expect(framework.images).toEqual(MockParsedAppMetadata.images);
      }
    );

    it("should return default images when app has metadata with images",
      function () {
        var framework = getFrameworkAfterProcess(MockAppHealth.hasHealth);
        expect(framework.images).toEqual(MesosStateStore.NA_IMAGES);
      }
    );
  });

  describe("#getFrameworks", function () {

    beforeEach(function() {
      MesosStateStore.reset();
      MesosStateStore.init();
      MesosStateStore.processState(MockStates.frameworksWithSameName);
      this.frameworks = MesosStateStore.getFrameworks();
    });

    it("should have same amount of frameworks as in JSON", function () {
      expect(MockStates.frameworksWithSameName.frameworks.length)
        .toBe(this.frameworks.length);
    });

    it("should have same resources length as history length", function () {
      this.frameworks.forEach(function(framework) {
        expect(Config.historyLength).toBe(framework.used_resources.cpus.length);
      });
    });

  });

});
