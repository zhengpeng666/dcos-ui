jest.dontMock('../index');
jest.dontMock('../hooks');
jest.dontMock('../stores/IntercomStore');

import PluginTestUtils from 'PluginTestUtils';

let PluginSDK = PluginTestUtils.getSDK('Tracking', {enabled: true});

var _ = require('underscore');

var TrackingHooks = require('../hooks')(PluginSDK);
var DOMUtils = PluginSDK.get('DOMUtils');
var {Hooks} = PluginSDK;

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
        Hooks.doAction('pluginsConfigured');
        expect(DOMUtils.appendScript.callCount).toEqual(2);
      });

      it('does not append scripts if plugin disabled', function () {
        TrackingHooks.initialize();
        TrackingHooks.configure({enabled: false});
        Hooks.doAction('pluginsConfigured');
        expect(DOMUtils.appendScript.callCount).toEqual(0);
      });
    });

    describe('#openIdentifyModal', function () {
      it('returns the value given to it if plugin enabled', function () {
        TrackingHooks.initialize();
        TrackingHooks.configure({enabled: true});
        var result = Hooks.applyFilter('openIdentifyModal', 'hello');
        expect(result).toEqual('hello');
      });

      it('returns false if plugin disabled', function () {
        TrackingHooks.initialize();
        TrackingHooks.configure({enabled: false});
        var result = Hooks.applyFilter('openIdentifyModal', 'hello');
        expect(result).toEqual(false);
      });
    });

    describe('#sidebarFooterButtonSet', function () {
      it('returns the value given to it if plugin enabled', function () {
        TrackingHooks.initialize();
        TrackingHooks.configure({enabled: true});
        var result = Hooks.applyFilter('sidebarFooterButtonSet', ['foo']);
        expect(result).not.toEqual(['foo']);
      });

      it('returns an empty array if plugin disabled', function () {
        TrackingHooks.initialize();
        TrackingHooks.configure({enabled: false});
        var result = Hooks.applyFilter('sidebarFooterButtonSet', []);
        expect(result).toEqual([]);
      });
    });
  });
});
