var _ = require("underscore");

jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../config/Config");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../MesosSummaryStore");
jest.dontMock("./fixtures/MockStates");
jest.dontMock("./fixtures/MockAppMetadata");
jest.dontMock("./fixtures/MockParsedAppMetadata");
jest.dontMock("../../utils/MesosStateUtil");
jest.dontMock("../../utils/RequestUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/StringUtil");

var AppDispatcher = require("../../events/AppDispatcher");
var ActionTypes = require("../../constants/ActionTypes");
var Config = require("../../config/Config");
var MesosSummaryStore = require("../MesosSummaryStore");
var MockStates = require("./fixtures/MockStates");

MesosSummaryStore.init();

describe("Mesos State Store", function () {

  describe("#getTaskFailureRate", function () {

    beforeEach(function () {
      MesosSummaryStore.processSummary(MockStates.oneTaskRunning);
      // Necessary because prevMesosStatesMap is only set by getFailureRate.
      MesosSummaryStore.get("taskFailureRates");
    });

    it("is 0% initially", function () {
      var taskFailureRate = MesosSummaryStore.get("taskFailureRate");
      expect(_.last(taskFailureRate).rate).toEqual(0);
    });

    it("is 0% when one task finishes", function () {
      MesosSummaryStore.processSummary(MockStates.oneTaskFinished);
      var taskFailureRate = MesosSummaryStore.get("taskFailureRate");
      expect(_.last(taskFailureRate).rate).toEqual(0);
    });

    it("is 100% when one task fails", function () {
      MesosSummaryStore.processSummary(MockStates.oneTaskFailed);
      var taskFailureRate = MesosSummaryStore.get("taskFailureRate");
      expect(_.last(taskFailureRate).rate).toEqual(100);
    });

    it("is 0% when one task is killed", function () {
      MesosSummaryStore.processSummary(MockStates.oneTaskKilled);
      var taskFailureRate = MesosSummaryStore.get("taskFailureRate");
      expect(_.last(taskFailureRate).rate).toEqual(0);
    });
  });

  describe("#getFrameworks", function () {

    beforeEach(function () {
      MesosSummaryStore.set({initCalledAt: null});
      MesosSummaryStore.init();
      MesosSummaryStore.processSummary(MockStates.frameworksWithSameName);
      this.frameworks = MesosSummaryStore.getFrameworks();
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
      MesosSummaryStore.set({initCalledAt: null});
      MesosSummaryStore.init();
    });

    it("should be prefilled with 0", function () {
      var activeHostsCount = MesosSummaryStore.getActiveHostsCount();
      expect(activeHostsCount[activeHostsCount.length - 1].slavesCount).toBe(0);
    });

    it("should have same length as history length", function () {
      MesosSummaryStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      MesosSummaryStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      MesosSummaryStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      var activeHostsCount = MesosSummaryStore.getActiveHostsCount();
      expect(Config.historyLength).toBe(activeHostsCount.length);
    });

    it("should default to 0 if active slaves is undefined", function () {
      MesosSummaryStore.processSummary(MockStates.frameworksWithNoActivatedSlaves);
      var activeHostsCount = MesosSummaryStore.getActiveHostsCount();
      expect(activeHostsCount[activeHostsCount.length - 1].slavesCount).toBe(0);
    });

    it("should reflect number of active slaves after processing", function () {
      MesosSummaryStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      var activeHostsCount = MesosSummaryStore.getActiveHostsCount();
      expect(activeHostsCount[activeHostsCount.length - 1].slavesCount).toBe(1);
    });

    it("should have correct number of active slaves in series", function () {
      MesosSummaryStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      MesosSummaryStore.processSummary(MockStates.frameworksWithNoActivatedSlaves);
      MesosSummaryStore.processSummary(MockStates.frameworksWithActivatedSlaves);
      var activeHostsCount = MesosSummaryStore.getActiveHostsCount();
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
      var mostRecentState = _.last(MesosSummaryStore.get("mesosStates"));
      expect(mostRecentState.name).toEqual("c");
      expect(mostRecentState.date).toBeDefined();
    });

    it("sets the timestamp by the configured step", function () {
      var twoMostRecentStates = _.last(MesosSummaryStore.get("mesosStates"), 2);
      var mostRecentState = _.last(twoMostRecentStates);
      var secondMostRecentState = _.first(twoMostRecentStates);
      var stateTimeDelta = mostRecentState.date - secondMostRecentState.date;
      expect(stateTimeDelta).toEqual(3333);
    });

  });

});
