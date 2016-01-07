jest.dontMock("../../Plugins");
jest.dontMock("../SettingsPlugin");
jest.dontMock("../../../config/Config");
jest.dontMock("../../../constants/EventTypes");
jest.dontMock("../../../events/AppDispatcher");
jest.dontMock("../../../events/ConfigActions");
jest.dontMock("../../../mixins/GetSetMixin");
jest.dontMock("../../../utils/Store");
jest.dontMock("../../../utils/DOMUtils");
jest.dontMock("../../../utils/Util");

var _ = require("underscore");

var Plugins = require("../../Plugins");
var SettingsPlugin = require("../SettingsPlugin");

jest.setMock("../../index", {
  settings: SettingsPlugin
});

function processConfigState(isEnabled) {
  SettingsPlugin.configure({enabled: isEnabled});
}

describe("SettingsPlugin", function () {

  describe("#initialize", function () {

    beforeEach(function () {
      this.Plugins = {
        addFilter: jest.genMockFunction()
      };
      SettingsPlugin.initialize(this.Plugins);
    });

    it("should add one action", function () {
      expect(this.Plugins.addFilter.mock.calls).toEqual([
        ["applicationRoutes", SettingsPlugin.applicationRoutes],
        ["sidebarNavigation", SettingsPlugin.sidebarNavigation]
      ]);
    });

  });

  describe("Setting and changing configuration", function () {

    beforeEach(function () {
      this.SettingsPlugin = _.clone(SettingsPlugin);
      this.SettingsPlugin.configuration = _.clone(SettingsPlugin.configuration);
    });

    describe("#isEnabled", function () {

      it("returns true if configured to be enabled", function () {
        this.SettingsPlugin.configure({enabled: true});
        expect(this.SettingsPlugin.isEnabled()).toBeTruthy();
      });

      it("defaults to false", function () {
        expect(this.SettingsPlugin.isEnabled()).toBeFalsy();
      });

    });

    describe("#configure", function () {

      it("changes the plugin's configuration", function () {
        expect(this.SettingsPlugin.isEnabled()).toBeFalsy();
        this.SettingsPlugin.configure({enabled: true});
        expect(this.SettingsPlugin.isEnabled()).toBeTruthy();
      });

    });

  });

  describe("Listeners", function () {

    beforeEach(function () {
      Plugins.initialize();
    });

    describe("#sidebarNavigation", function () {

      it("returns the value given to it if plugin is disabled", function () {
        processConfigState(false);
        var result = SettingsPlugin.sidebarNavigation(["foo", "bar"]);
        expect(result).toEqual(["foo", "bar"]);
      });

      it("appends the settings item if the plugin is enabled", function () {
        processConfigState(true);
        var result = SettingsPlugin.sidebarNavigation(["foo", "bar"]);
        expect(result).toEqual(["foo", "bar", "settings"]);
      });

    });

    describe("#applicationRoutes", function () {

      beforeEach(function () {
        this.routes = [{children: [{id: "index", children: []}]}];
        this.routesUnmodified = [{children: [{id: "index", children: []}]}];
      });

      it("returns the original value when disabled", function () {
        processConfigState(false);
        var result = SettingsPlugin.applicationRoutes(this.routes);
        expect(result).toEqual(this.routesUnmodified);
      });

      it("returns modified routes when enabled", function () {
        processConfigState(true);
        var result = SettingsPlugin.applicationRoutes(this.routes);
        expect(result).not.toEqual(this.routesUnmodified);
      });

    });

  });

});
