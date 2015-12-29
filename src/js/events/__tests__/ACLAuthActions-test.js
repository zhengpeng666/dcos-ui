jest.dontMock("../ACLAuthActions");
jest.dontMock("../AppDispatcher");
jest.dontMock("../../constants/ActionTypes");
jest.dontMock("../../utils/RequestUtil");

var ACLAuthActions = require("../ACLAuthActions");
var ActionTypes = require("../../constants/ActionTypes");
var AppDispatcher = require("../AppDispatcher");
var RequestUtil = require("../../utils/RequestUtil");

describe("ACLAuthActions", function () {

  describe("#fetchRole", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLAuthActions.fetchRole("foo");
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url)
        .toEqual("/acs/api/v1/users/foo");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_ROLE_SUCCESS);
      });

      this.configuration.success();
    });

    it("dispatches the correct action when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_ROLE_ERROR);
      });

      this.configuration.error({});
    });

  });

  describe("#login", function () {

    beforeEach(function () {
      spyOn(RequestUtil, "json");
      ACLAuthActions.login();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it("calls #json from the RequestUtil", function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      expect(this.configuration.url)
        .toEqual("/acs/api/v1/auth/login");
    });

    it("dispatches the correct action when successful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGIN_SUCCESS);
      });

      this.configuration.success();
    });

    it("dispatches the correct action when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGIN_ERROR);
      });

      this.configuration.error({responseJSON: {description: "bar"}});
    });

    it("dispatches the correct error when unsuccessful", function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual("bar");
      });

      this.configuration.error({responseJSON: {description: "bar"}});
    });

  });

});
