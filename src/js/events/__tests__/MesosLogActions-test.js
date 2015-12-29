jest.dontMock("../MesosLogActions");
jest.dontMock("../AppDispatcher");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../utils/RequestUtil");

var MesosLogActions = require("../MesosLogActions");
var ActionTypes = require("../../constants/ActionTypes");
var AppDispatcher = require("../AppDispatcher");
var RequestUtil = require("../../utils/RequestUtil");

describe("MesosLogActions", function () {

  describe("#fetchLog", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      MesosLogActions.fetchLog("foo", "bar", 0, 2000);
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url)
        .toEqual("/slave/foo/files/read.json?path=bar&offset=0&length=2000");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_MESOS_LOG_SUCCESS);
      });

      this.configuration.success();
    });

    it("dispatches the correct action when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_MESOS_LOG_ERROR);
      });

      this.configuration.error({});
    });

  });

});
