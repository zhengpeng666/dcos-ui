jest.dontMock('../../../src/js/pluginBridge/PluginBridge');
jest.dontMock('../../../src/js/pluginBridge/Hooks');
jest.dontMock('../../../src/js/pluginBridge/TestUtils');
jest.dontMock('../index');
jest.dontMock('../pluginHooks');
jest.dontMock('../../../src/js/config/Config');
jest.dontMock('../../../src/js/mixins/GetSetMixin');

var plugin = require('../index');
var PluginTestUtils = require('../../../src/js/pluginBridge/TestUtils');
var SettingsHooks = require('../pluginHooks');

function processConfigState(isEnabled) {
  SettingsHooks.configure({enabled: isEnabled});
}

describe('SettingsHooks', function () {

  describe('#initialize', function () {

    beforeEach(function () {
      this.Hooks = {
        addFilter: jest.genMockFunction()
      };
      SettingsHooks.initialize(this.Hooks);
    });

    it('should add one action', function () {
      expect(this.Hooks.addFilter.mock.calls).toEqual([
        ['applicationRoutes', SettingsHooks.applicationRoutes],
        ['sidebarNavigation', SettingsHooks.sidebarNavigation]
      ]);
    });

  });

  describe('Setting configuration', function () {

    beforeEach(function () {
      SettingsHooks.configure({enabled: true});
    });

    describe('#isEnabled', function () {

      it('returns true if configured to be enabled', function () {
        expect(SettingsHooks.isEnabled()).toBeTruthy();
      });

    });
  });

  describe('Listeners', function () {

    beforeEach(function () {
      PluginTestUtils.loadPlugins({
        settings: {
          module: plugin,
          config: {
            enabled: true
          }
        }
      });
    });

    describe('#sidebarNavigation', function () {

      it('returns the value given to it if plugin is disabled', function () {
        processConfigState(false);
        var result = SettingsHooks.sidebarNavigation(['foo', 'bar']);
        expect(result).toEqual(['foo', 'bar']);
      });

      it('appends the settings item if the plugin is enabled', function () {
        processConfigState(true);
        var result = SettingsHooks.sidebarNavigation(['foo', 'bar']);
        expect(result).toEqual(['foo', 'bar', 'settings']);
      });

    });

    describe('#applicationRoutes', function () {

      beforeEach(function () {
        this.routes = [{children: [{id: 'index', children: []}]}];
        this.routesUnmodified = [{children: [{id: 'index', children: []}]}];
      });

      it('returns the original value when disabled', function () {
        processConfigState(false);
        var result = SettingsHooks.applicationRoutes(this.routes);
        expect(result).toEqual(this.routesUnmodified);
      });

      it('returns modified routes when enabled', function () {
        processConfigState(true);
        var result = SettingsHooks.applicationRoutes(this.routes);
        expect(result).not.toEqual(this.routesUnmodified);
      });

    });

  });

});
