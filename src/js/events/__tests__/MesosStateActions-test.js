var $ = require("jquery");

jest.dontMock("../../config/Config");
jest.dontMock("../MesosStateActions");
jest.dontMock("../../constants/TimeScales");

var Config = require("../../config/Config");
var MesosStateActions = require("../MesosStateActions");
var TimeScales = require("../../constants/TimeScales");

describe("Mesos State Actions", function () {

  beforeEach(function () {
    Config.historyServer = "http://historyserver";
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
  });

});
