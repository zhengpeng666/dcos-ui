jest.dontMock("../Plugins");
jest.dontMock("../TrackingPlugin");
jest.dontMock("../../config/Config");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/ConfigActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/ConfigStore");
jest.dontMock("../../utils/Store");

var _ = require("underscore");

var TrackingPlugin = require("../TrackingPlugin");

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
});
