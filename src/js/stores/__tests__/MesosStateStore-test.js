var _ = require("underscore");

jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../config/Config");
jest.dontMock("../MesosStateStore");
jest.dontMock("./fixtures/MockStates");
jest.dontMock("./fixtures/MockAppHealth");
jest.dontMock("./fixtures/MockAppMetadata");
jest.dontMock("./fixtures/MockParsedAppMetadata");

var AppDispatcher = require("../../events/AppDispatcher");
var ActionTypes = require("../../constants/ActionTypes");
var Config = require("../../config/Config");
var MesosStateStore = require("../MesosStateStore");
var MockStates = require("./fixtures/MockStates");
var MockAppHealth = require("./fixtures/MockAppHealth");
var MockAppMetadata = require("./fixtures/MockAppMetadata");
var MockParsedAppMetadata = require("./fixtures/MockParsedAppMetadata");

function getFrameworkAfterProcess(apps) {
  MesosStateStore.processMarathonApps(apps);
  MesosStateStore.processSummary(MockStates.oneTaskRunning);
  var frameworks = MesosStateStore.getFrameworks();
  return _.find(frameworks, function (fwk) {
    return fwk.name === MockStates.oneTaskRunning.frameworks[0].name;
  });
}

// mock global string decoder
global.atob = function () {
  return MockAppMetadata.decodedString;
};

MesosStateStore.init();

describe("Mesos State Store", function () {

  describe("#getTaskFailureRate", function () {

    beforeEach(function () {
      MesosStateStore.processSummary(MockStates.oneTaskRunning);
      // Necessary because _prevMesosStatesMap is only set by getFailureRate.
      MesosStateStore.getTaskFailureRate();
    });

    it("is 0% initially", function () {
      var taskFailureRate = MesosStateStore.getTaskFailureRate();
      expect(_.last(taskFailureRate).rate).toEqual(0);
    });

    it("is 0% when one task finishes", function () {
      MesosStateStore.processSummary(MockStates.oneTaskFinished);
      var taskFailureRate = MesosStateStore.getTaskFailureRate();
      expect(_.last(taskFailureRate).rate).toEqual(0);
    });

    it("is 100% when one task fails", function () {
      MesosStateStore.processSummary(MockStates.oneTaskFailed);
      var taskFailureRate = MesosStateStore.getTaskFailureRate();
      expect(_.last(taskFailureRate).rate).toEqual(100);
    });

    it("is 0% when one task is killed", function () {
      MesosStateStore.processSummary(MockStates.oneTaskKilled);
      var taskFailureRate = MesosStateStore.getTaskFailureRate();
      expect(_.last(taskFailureRate).rate).toEqual(0);
    });
  });

  describe("#getFrameworkHealth", function () {

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

    it("should parse metadata correctly", function () {
      var result = MesosStateStore.parseMetadata(
        MockAppMetadata.encodedString
      );
      expect(result).toEqual(MockParsedAppMetadata);
    });
  });

  describe("#getFrameworkImages", function () {
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

  describe("#normalizeFramworks", function () {
    it("should expose Marathon images if framework has marathon in name",
      function () {
        MesosStateStore.reset();
        MesosStateStore.init();
        MesosStateStore.processSummary(MockStates.frameworksWithMarathonName);

        var frameworks = MesosStateStore.getFrameworks();

        expect(frameworks[0].images).toEqual(MesosStateStore.MARATHON_IMAGES);
        expect(frameworks[1].images).toEqual(MesosStateStore.MARATHON_IMAGES);
        expect(frameworks[2].images).toEqual(MesosStateStore.NA_IMAGES);
      }
    );
  });

  describe("#getFrameworks", function () {

    beforeEach(function () {
      MesosStateStore.reset();
      MesosStateStore.init();
      MesosStateStore.processSummary(MockStates.frameworksWithSameName);
      this.frameworks = MesosStateStore.getFrameworks();
    });

    it("should have same amount of frameworks as in JSON", function () {
      expect(MockStates.frameworksWithSameName.frameworks.length)
        .toBe(this.frameworks.length);
    });

    it("should have same resources length as history length", function () {
      this.frameworks.forEach(function (framework) {
        expect(Config.historyLength).toBe(framework.used_resources.cpus.length);
      });
    });

  });

  describe("#getActiveHostsCount", function () {

    beforeEach(function () {
      MesosStateStore.reset();
      MesosStateStore.init();
    });

    it("should be prefilled with 0", function () {
      var activeHostsCount = MesosStateStore.getActiveHostsCount();
      expect(activeHostsCount[activeHostsCount.length - 1].slavesCount).toBe(0);
    });

    it("should have same length as history length", function () {
      MesosStateStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      MesosStateStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      MesosStateStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      var activeHostsCount = MesosStateStore.getActiveHostsCount();
      expect(Config.historyLength).toBe(activeHostsCount.length);
    });

    it("should default to 0 if active slaves is undefined", function () {
      MesosStateStore.processSummary(MockStates.frameworksWithNoActivatedSlaves);
      var activeHostsCount = MesosStateStore.getActiveHostsCount();
      expect(activeHostsCount[activeHostsCount.length - 1].slavesCount).toBe(0);
    });

    it("should reflect number of active slaves after processing", function () {
      MesosStateStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      var activeHostsCount = MesosStateStore.getActiveHostsCount();
      expect(activeHostsCount[activeHostsCount.length - 1].slavesCount).toBe(1);
    });

    it("should have correct number of active slaves in series", function () {
      MesosStateStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      MesosStateStore.processSummary(MockStates.frameworksWithNoActivatedSlaves);
      MesosStateStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      var activeHostsCount = MesosStateStore.getActiveHostsCount();
      expect(activeHostsCount[activeHostsCount.length - 3].slavesCount).toBe(1);
      expect(activeHostsCount[activeHostsCount.length - 2].slavesCount).toBe(0);
      expect(activeHostsCount[activeHostsCount.length - 1].slavesCount).toBe(1);
    });

  });

  describe("timestamps", function () {

    beforeEach(function () {
      Config.stateRefresh = 3333;
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_HISTORY_SUCCESS,
        data: [ { name: "a" }, { name: "b" }, { name: "c" } ]
      });
    });

    it("adds timestamps to each item", function () {
      var mostRecentState = _.last(MesosStateStore.getAll());
      expect(mostRecentState.name).toEqual("c");
      expect(mostRecentState.date).toBeDefined();
    });

    it("sets the timestamp by the configured step", function () {
      var twoMostRecentStates = _.last(MesosStateStore.getAll(), 2);
      var mostRecentState = _.last(twoMostRecentStates);
      var secondMostRecentState = _.first(twoMostRecentStates);
      var stateTimeDelta = mostRecentState.date - secondMostRecentState.date;
      expect(stateTimeDelta).toEqual(3333);
    });

  });

  describe("#processMarathonApps", function () {
    beforeEach(function () {
      MesosStateStore.reset();
      MesosStateStore.init();
    });

    it("should set Marathon health to idle with no apps", function () {
      MesosStateStore.processMarathonApps({apps: []});
      MesosStateStore.processSummary(MockStates.frameworksWithMarathonName);
      this.frameworks = MesosStateStore.getFrameworks();
      expect(this.frameworks[0].health.key).toEqual("IDLE");
    });

    it("should set Marathon health to healthy with some apps", function () {
      MesosStateStore.processMarathonApps(MockAppHealth.hasNoHealthy);
      MesosStateStore.processSummary(MockStates.frameworksWithMarathonName);
      this.frameworks = MesosStateStore.getFrameworks();
      expect(this.frameworks[0].health.key).toEqual("HEALTHY");
    });

    it("should have Marathon health NA if processMarathonApps is not called",
      function () {
        MesosStateStore.processMarathonApps = jasmine.createSpy();
        expect(MesosStateStore.processMarathonApps).not.toHaveBeenCalled();
        MesosStateStore.processSummary(MockStates.frameworksWithMarathonName);
        this.frameworks = MesosStateStore.getFrameworks();
        expect(this.frameworks[0].health.key).toEqual("NA");
      }
    );

  });

});
