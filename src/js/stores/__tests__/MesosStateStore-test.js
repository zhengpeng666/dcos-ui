var _ = require("underscore");

jest.dontMock("../../config/Config");
jest.dontMock("../MesosStateStore");
jest.dontMock("./fixtures/MockStates");

var Config = require("../../config/Config");
var MesosStateStore = require("../MesosStateStore");
var MockStates = require("./fixtures/MockStates");

describe("Mesos State Store", function () {

  describe("#getTaskFailureRate", function () {
    // Avoid repeatedly calling init.
    var initMesosStateStoreOnce = _.once(MesosStateStore.init);

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
