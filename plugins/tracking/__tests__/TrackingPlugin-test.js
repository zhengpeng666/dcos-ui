jest.dontMock('../index');
jest.dontMock('../hooks');
jest.dontMock('../stores/IntercomStore');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('tracking', {enabled: true});
require('../SDK').setSDK(SDK);

var _ = require('underscore');

var TrackingHooks = require('../hooks');
var TrackingReducer = require('../Reducer');
var DOMUtils = SDK.get('DOMUtils');

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
        TrackingHooks.initialize();
        TrackingHooks.configure({enabled: true});
        SDK.Hooks.doAction('pluginsConfigured');
        expect(DOMUtils.appendScript.callCount).toEqual(2);
      });

      it('does not append scripts if plugin disabled', function () {
        TrackingHooks.initialize();
        TrackingHooks.configure({enabled: false});
        SDK.Hooks.doAction('pluginsConfigured');
        expect(DOMUtils.appendScript.callCount).toEqual(0);
      });
    });

    describe('#sidebarFooterButtonSet', function () {
      it('returns the value given to it if plugin enabled', function () {
        TrackingHooks.initialize();
        PluginTestUtils.addReducer(SDK.pluginID, TrackingReducer);
        var result = SDK.Hooks.applyFilter('sidebarFooterButtonSet', ['foo']);
        expect(result).not.toEqual(['foo']);
      });

      it('returns an empty array if plugin disabled', function () {
        TrackingHooks.initialize();
        TrackingHooks.configure({enabled: false});
        var result = SDK.Hooks.applyFilter('sidebarFooterButtonSet', []);
        expect(result).toEqual([]);
      });
    });
  });
});
