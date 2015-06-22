var $ = require("jquery");

jest.dontMock("../../config/Config");
jest.dontMock("../../utils/RequestUtil");

var Config = require("../../config/Config");
var RequestUtil = require("../../utils/RequestUtil");

describe("RequestUtil", function () {

  beforeEach(function () {
    spyOn($, "ajax");
  });

  describe("#json", function () {
    it("Should not make a request before called", function () {
      expect($.ajax).not.toHaveBeenCalled();
    });

    it("Should try to make a request even if no args are provided", function () {
      RequestUtil.json();
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mostRecentCall.args[0].url).toEqual(null);
    });

    it("Should use defaults for a GET json request", function () {
      RequestUtil.json({url: "lol"});
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mostRecentCall.args[0].url).toEqual("lol");
      expect($.ajax.mostRecentCall.args[0].contentType).toEqual("application/json; charset=utf-8");
      expect($.ajax.mostRecentCall.args[0].dataType).toEqual("json");
      expect($.ajax.mostRecentCall.args[0].timeout).toEqual(Config.stateRefresh);
      expect($.ajax.mostRecentCall.args[0].type).toEqual("GET");
    });

    it("Should override defaults with options given", function () {
      RequestUtil.json({type: "POST", contentType: "Yoghurt", dataType: "Bananas", timeout: 15});
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mostRecentCall.args[0].contentType).toEqual("Yoghurt");
      expect($.ajax.mostRecentCall.args[0].dataType).toEqual("Bananas");
      expect($.ajax.mostRecentCall.args[0].timeout).toEqual(15);
      expect($.ajax.mostRecentCall.args[0].type).toEqual("POST");
    });

  });

});
