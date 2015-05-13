var _ = require("underscore");
var $ = require("jquery");

jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../AppDispatcher");
jest.dontMock("../../config/Config");
jest.dontMock("../MesosStateActions");
jest.dontMock("../../constants/TimeScales");

var Actions = require("../../actions/Actions");
var ActionTypes = require("../../constants/ActionTypes");
var AppDispatcher = require("../AppDispatcher");
var Config = require("../../config/Config");
var MesosStateActions = require("../MesosStateActions");
var TimeScales = require("../../constants/TimeScales");

global.analytics = {
  initialized: true,
  track: _.noop,
  log: _.noop
};

describe("Mesos State Actions", function () {

  beforeEach(function () {
    Config.historyServer = "http://historyserver";
    Config.rootUrl = "http://mesosserver";
    spyOn($, "ajax");
  });

  describe("#fetchSummary", function () {
    it("fetches the most recent state by default", function () {
      MesosStateActions.fetchSummary();
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mostRecentCall.args[0].url).toEqual("http://historyserver/dcos-history-service/history/last");
    });

    it("fetches a whole minute when instructed", function () {
      MesosStateActions.fetchSummary(TimeScales.MINUTE);
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mostRecentCall.args[0].url).toEqual("http://historyserver/dcos-history-service/history/minute");
    });

    it("fetches a whole hour when instructed", function () {
      MesosStateActions.fetchSummary(TimeScales.HOUR);
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mostRecentCall.args[0].url).toEqual("http://historyserver/dcos-history-service/history/hour");
    });

    it("fetches a whole day when instructed", function () {
      MesosStateActions.fetchSummary(TimeScales.DAY);
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mostRecentCall.args[0].url).toEqual("http://historyserver/dcos-history-service/history/day");
    });

    it("detects errors on the history server", function () {
      spyOn(AppDispatcher, "handleServerAction");
      $.ajax.andCallFake(function (req) {
        req.error({});
      });
      MesosStateActions.fetch(TimeScales.MINUTE);
      expect(AppDispatcher.handleServerAction).toHaveBeenCalled();
      expect(AppDispatcher.handleServerAction.mostRecentCall.args[0].type)
        .toEqual(ActionTypes.REQUEST_MESOS_HISTORY_ERROR);
    });

    it("falls back to the Mesos endpoint if the history service is offline on initial fetch", function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_HISTORY_ERROR
      });
      MesosStateActions.fetch();
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mostRecentCall.args[0].url).toContain("http://mesosserver/mesos/master/state-summary");
    });

    it("falls back to the Mesos endpoint if the history service goes offline", function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_STATE_ERROR
      });
      MesosStateActions.fetch();
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mostRecentCall.args[0].url).toContain("http://mesosserver/mesos/master/state-summary");
    });

    it("registers history server errors with analytics", function () {
      spyOn(Actions, "log");
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_HISTORY_ERROR,
        data: "Guru Meditation"
      });
      expect(Actions.log).toHaveBeenCalled();
      expect(Actions.log.mostRecentCall.args[0].description).toEqual("Server error");
      expect(Actions.log.mostRecentCall.args[0].type).toEqual(ActionTypes.REQUEST_MESOS_HISTORY_ERROR);
      expect(Actions.log.mostRecentCall.args[0].error).toEqual("Guru Meditation");
    });

    it("registers mesos server errors with analytics", function () {
      spyOn(Actions, "log");
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_STATE_ERROR,
        data: "Guru Meditation"
      });
      expect(Actions.log).toHaveBeenCalled();
      expect(Actions.log.mostRecentCall.args[0].description).toEqual("Server error");
      expect(Actions.log.mostRecentCall.args[0].type).toEqual(ActionTypes.REQUEST_MESOS_STATE_ERROR);
      expect(Actions.log.mostRecentCall.args[0].error).toEqual("Guru Meditation");
    });

  });

});
