var $ = require("jquery");

jest.dontMock("../../config/Config");
jest.dontMock("../../utils/RequestUtil");

var Config = require("../../config/Config");
var RequestUtil = require("../../utils/RequestUtil");

describe("RequestUtil", function () {

  describe("#json", function () {

    beforeEach(function () {
      spyOn($, "ajax");
    });

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

    it("Should return a request that is able to be aborted", function () {
      let prevAjax = $.ajax;
      $.ajax = function () {return {fakeProp: "faked"}; };

      var request = RequestUtil.json({url: "lolz"});
      expect(typeof request).toEqual("object");
      expect(request.fakeProp).toEqual("faked");

      $.ajax = prevAjax;
    });

    it("Should return undefined if there is an ongoing request", function () {
      RequestUtil.json({url: "double"});
      let request = RequestUtil.json({url: "double"});

      expect(request).toEqual(undefined);
    });

    it("stringifies data when not doing a GET request", function () {
      RequestUtil.json({type: "PUT", data: {hello: "world"}});
      expect($.ajax.calls[0].args[0].data).toEqual("{\"hello\":\"world\"}");
    });

    it("does not stringify when request is of type GET", function () {
      RequestUtil.json({type: "GET", data: {hello: "world"}});
      expect($.ajax.calls[0].args[0].data).toEqual({hello: "world"});
    });

    it("sets the correct datatype when doing a PUT request", function () {
      RequestUtil.json({type: "PUT", data: {hello: "world"}});
      expect($.ajax.calls[0].args[0].dataType).toEqual("text");
    });

    it("does not set the datatype when doing a GET request", function () {
      RequestUtil.json({type: "GET", data: {hello: "world"}});
      expect($.ajax.calls[0].args[0].dataType).toEqual("json");
    });

    it("does not set the datatype if it's already set", function () {
      RequestUtil.json({type: "PUT", data: {hello: "world"}, dataType: "foo"});
      expect($.ajax.calls[0].args[0].dataType).toEqual("foo");
    });

  });

  describe("#debounceOnError", function () {
    var successFn;
    var errorFn;

    beforeEach(function () {
      successFn = jest.genMockFunction();
      errorFn = jest.genMockFunction();

      spyOn($, "ajax").andCallFake(
        function (options) {
          // Trigger error for url "failRequest"
          if (/failRequest/.test(options.url)) {
            options.error();
          }

          // Trigger success for url "successRequest"
          if (/successRequest/.test(options.url)) {
            options.success();
          }

          return {};
        }
      );

      this.request = RequestUtil.debounceOnError(
        10,
        function (resolve, reject) {
          return function (url) {
            return RequestUtil.json({
              url: url,
              success: function () {
                successFn();
                resolve();
              },
              error: function () {
                errorFn();
                reject();
              }
            });
          };
        },
        {delayAfterCount: Config.delayAfterErrorCount}
      );

    });

    it("should not debounce on the first 5 errors", function () {
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      expect(errorFn.mock.calls.length).toEqual(5);
    });

    it("should debounce on more than 5 errors", function () {
      // These will all be called
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      // These will all be debounced
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      expect(errorFn.mock.calls.length).toEqual(5);
    });

    it("should reset debouncing after success call", function () {
      // These will all be called
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      this.request("successRequest");
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      this.request("failRequest");
      // This will be debounced
      this.request("failRequest");
      this.request("failRequest");
      expect(errorFn.mock.calls.length).toEqual(8);
      expect(successFn.mock.calls.length).toEqual(1);
    });

    it("should return the result of the function", function () {
      let result = this.request("successRequest");

      expect(typeof result).toEqual("object");
    });

  });

  describe("#parseResponseBody", function () {
    it("should parse the object correctly", function () {
      var originalObject = {name: "Kenny"};
      var xhr = {
        responseText: JSON.stringify(originalObject)
      };

      expect(RequestUtil.parseResponseBody(xhr)).toEqual(originalObject);
    });

    it("should return empty object if responseText doesnt exist", function () {
      expect(RequestUtil.parseResponseBody({})).toEqual({});
    });
  });

});
