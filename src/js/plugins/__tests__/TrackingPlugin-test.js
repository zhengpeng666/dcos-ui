jest.dontMock("../Plugins");
jest.dontMock("../TrackingPlugin");
jest.dontMock("../../config/Config");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/ConfigActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/ConfigStore");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/DOMUtils");

var TrackingPlugin = require("../TrackingPlugin");

jest.setMock("../index", {
  tracking: TrackingPlugin
});

var _ = require("underscore");

var ConfigStore = require("../../stores/ConfigStore");
var DOMUtils = require("../../utils/DOMUtils");
var Plugins = require("../Plugins");

function processConfigState(isEnabled) {
  ConfigStore.processStateSuccess({
    uiConfiguration: {
      plugins: {
        tracking: {
          enabled: isEnabled
        }
      }
    }
  });
}

describe("TrackingPlugin", function () {

  describe("#initialize", function () {
    beforeEach(function () {
      this.Plugins = {
        addAction: jest.genMockFunction(),
        addFilter: jest.genMockFunction()
      };
      TrackingPlugin.initialize(this.Plugins);
    });

    it("should add one action and two addFilters", function () {
      expect(this.Plugins.addFilter.mock.calls.length).toEqual(2);
      expect(this.Plugins.addAction.mock.calls.length).toEqual(1);
    });

    it("should call it with an event name and a callback", function () {
      var calls = this.Plugins.addAction.mock.calls.concat(
        this.Plugins.addFilter.mock.calls
      );

      calls.forEach(function (call) {
        expect(typeof call[0]).toEqual("string");
        expect(typeof call[1]).toEqual("function");
      });
    });
  });

  describe("#configure", function () {
    beforeEach(function () {
      this.TrackingPlugin = _.clone(TrackingPlugin);
    });

    it("changes the plugin's configuration", function () {
      expect(this.TrackingPlugin.configuration.enabled).toBeFalsy();
      this.TrackingPlugin.configure({enabled: true});
      expect(this.TrackingPlugin.configuration.enabled).toBeTruthy();
    });
  });

  describe("Listeners", function () {
    beforeEach(function () {
      Plugins.initialize();
      DOMUtils.appendScript = jasmine.createSpy();
    });

    describe("#pluginsConfigured", function () {

      it("appends scripts to the document head if plugin enabled", function () {
        processConfigState(true);
        expect(DOMUtils.appendScript.callCount).toEqual(2);
      });

      it("does not append scripts if plugin disabled", function () {
        processConfigState(false);
        expect(DOMUtils.appendScript.callCount).toEqual(0);
      });
    });

    describe("#openLoginModal", function () {
      it("returns the value given to it if plugin enabled", function () {
        processConfigState(true);
        var result = Plugins.applyFilter("openLoginModal", "hello");
        expect(result).toEqual("hello");
      });

      it("returns false if plugin disabled", function () {
        processConfigState(false);
        var result = Plugins.applyFilter("openLoginModal", "hello");
        expect(result).toEqual(false);
      });
    });

    describe("#footerButtonSet", function () {
      it("returns the value given to it if plugin enabled", function () {
        processConfigState(true);
        var result = Plugins.applyFilter("footerButtonSet", "hello");
        expect(result).toEqual("hello");
      });

      it("returns an empty array if plugin disabled", function () {
        processConfigState(false);
        var result = Plugins.applyFilter("footerButtonSet", "hello");
        expect(result).toEqual([]);
      });
    });
  });
});
