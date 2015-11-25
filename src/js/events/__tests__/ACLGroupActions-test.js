jest.dontMock("../ACLGroupActions");
jest.dontMock("../AppDispatcher");
jest.dontMock("../../config/Config");
jest.dontMock("../../utils/RequestUtil");

let ACLGroupActions = require("../ACLGroupActions");
var AppDispatcher = require("../AppDispatcher");
let Config = require("../../config/Config");
let RequestUtil = require("../../utils/RequestUtil");

describe("ACLGroupActions", function () {

  describe("#fetch", function () {

    beforeEach(function () {
      Config.rootUrl = "http://mesosserver";
      Config.useFixtures = false;
      spyOn(AppDispatcher, "handleServerAction");
    });

    it("fetches the most recent state by default", function () {
      spyOn(RequestUtil, "json");
      ACLGroupActions.fetch();
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it("fetches data from the correct URL", function () {
      spyOn(RequestUtil, "json");
      ACLGroupActions.fetch();
      expect(RequestUtil.json.mostRecentCall.args[0].url)
        .toEqual("http://mesosserver/groups");
    });

  });

});
