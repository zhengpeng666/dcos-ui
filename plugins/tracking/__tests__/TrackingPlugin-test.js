jest.dontMock('../../../src/js/pluginBridge/PluginBridge');
jest.dontMock('../../../src/js/pluginBridge/Hooks');
jest.dontMock('../../../src/js/pluginBridge/TestUtils');
jest.dontMock('../index');
jest.dontMock('../hooks');
jest.dontMock('../../../src/js/config/Config');
jest.dontMock('../../../src/js/mixins/GetSetMixin');

var _ = require('underscore');

var PluginTestUtils = require('../../../src/js/pluginBridge/TestUtils');
var TrackingHooks = require('../hooks');
var DOMUtils = require('../../../src/js/utils/DOMUtils');

describe('TrackingHooks', function () {

  describe('Setting and changing configuration', function () {
    beforeEach(function () {
      this.TrackingHooks = _.clone(TrackingHooks);
      this.TrackingHooks.configuration = _.clone(TrackingHooks.configuration);
    });

    describe('#isEnabled', function () {
      it('returns true if configured to be enabled', function () {
        this.TrackingHooks.configure({enabled: true});
        expect(this.TrackingHooks.isEnabled()).toBeTruthy();
      });

      it('defaults to false', function () {
        expect(this.TrackingHooks.isEnabled()).toBeFalsy();
      });
    });

    describe('#configure', function () {
      it('changes the plugin\'s configuration', function () {
        expect(this.TrackingHooks.isEnabled()).toBeFalsy();
        this.TrackingHooks.configure({enabled: true});
        expect(this.TrackingHooks.isEnabled()).toBeTruthy();
      });
    });
  });

  describe('Listeners', function () {
    beforeEach(function () {
      DOMUtils.appendScript = jasmine.createSpy();
    });

    describe('#pluginsConfigured', function () {

      it('appends scripts to the document head if plugin enabled', function () {
        TrackingHooks.initialize(PluginTestUtils.Hooks);
        TrackingHooks.configure({enabled: true});
        PluginTestUtils.Hooks.doAction('pluginsConfigured');
        expect(DOMUtils.appendScript.callCount).toEqual(2);
      });

      it('does not append scripts if plugin disabled', function () {
        TrackingHooks.initialize(PluginTestUtils.Hooks);
        TrackingHooks.configure({enabled: false});
        PluginTestUtils.Hooks.doAction('pluginsConfigured');
        expect(DOMUtils.appendScript.callCount).toEqual(0);
      });
    });

    describe('#openIdentifyModal', function () {
      it('returns the value given to it if plugin enabled', function () {
        TrackingHooks.initialize(PluginTestUtils.Hooks);
        TrackingHooks.configure({enabled: true});
        var result = PluginTestUtils.Hooks.applyFilter('openIdentifyModal', 'hello');
        expect(result).toEqual('hello');
      });

      it('returns false if plugin disabled', function () {
        TrackingHooks.initialize(PluginTestUtils.Hooks);
        TrackingHooks.configure({enabled: false});
        var result = PluginTestUtils.Hooks.applyFilter('openIdentifyModal', 'hello');
        expect(result).toEqual(false);
      });
    });

    describe('#sidebarFooterButtonSet', function () {
      it('returns the value given to it if plugin enabled', function () {
        TrackingHooks.initialize(PluginTestUtils.Hooks);
        TrackingHooks.configure({enabled: true});
        var result = PluginTestUtils.Hooks.applyFilter('sidebarFooterButtonSet', ['foo']);
        expect(result).not.toEqual(['foo']);
      });

      it('returns an empty array if plugin disabled', function () {
        TrackingHooks.initialize(PluginTestUtils.Hooks);
        TrackingHooks.configure({enabled: false});
        var result = PluginTestUtils.Hooks.applyFilter('sidebarFooterButtonSet', []);
        expect(result).toEqual([]);
      });
    });
  });
});
