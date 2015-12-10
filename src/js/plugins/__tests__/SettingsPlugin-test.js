jest.dontMock("../Plugins");
jest.dontMock("../SettingsPlugin");
jest.dontMock("../../config/Config");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../events/AppDispatcher");
jest.dontMock("../../events/ConfigActions");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../stores/ConfigStore");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/DOMUtils");

var SettingsPlugin = require("../SettingsPlugin");

jest.setMock("../index", {
  settings: SettingsPlugin
});

var _ = require("underscore");

var ConfigStore = require("../../stores/ConfigStore");
var Plugins = require("../Plugins");

function processConfigState(isEnabled) {
  ConfigStore.processStateSuccess({
    uiConfiguration: {
      plugins: {
        settings: {
          enabled: isEnabled
        }
      }
    }
  });
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
      expect(this.Plugins.addFilter.mock.calls[0]).toEqual(
        ["sidebarNavigation", SettingsPlugin.sidebarNavigation]
      );
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

    describe("#sidebarNavigationItems", function () {
      it("returns the value given to it if plugin is disabled", function () {
        processConfigState(false);
        var result = SettingsPlugin.sidebarNavigationItems(["foo", "bar"]);
        expect(result).toEqual(["foo", "bar"]);
      });

      it("appends the settings item if the plugin is enabled", function () {
        processConfigState(true);
        var result = SettingsPlugin.sidebarNavigationItems(["foo", "bar"]);
        expect(result).toEqual(["foo", "bar", "settings"]);
      });
    });
  });
});
