jest.dontMock('../Plugins');
jest.dontMock('../TrackingPlugin');
jest.dontMock('../../config/Config');
jest.dontMock('../../constants/EventTypes');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/ConfigActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../stores/ConfigStore');
jest.dontMock('../../utils/DOMUtils');

var TrackingPlugin = require('../TrackingPlugin');

jest.setMock('../index', {
  tracking: TrackingPlugin
});

var _ = require('underscore');

var ConfigStore = require('../../stores/ConfigStore');
var DOMUtils = require('../../utils/DOMUtils');
var Plugins = require('../Plugins');

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

describe('TrackingPlugin', function () {

  describe('#initialize', function () {
    beforeEach(function () {
      this.Plugins = {
        addAction: jest.genMockFunction(),
        addFilter: jest.genMockFunction()
      };
      TrackingPlugin.initialize(this.Plugins);
    });

    it('should add two action and two filters', function () {
      expect(this.Plugins.addAction.mock.calls[0]).toEqual(
        ['pluginsConfigured', TrackingPlugin.pluginsConfigured]
      );
      expect(this.Plugins.addAction.mock.calls[1]).toEqual(
        ['receivedUserEmail', TrackingPlugin.pluginsConfigured]
      );
      expect(this.Plugins.addFilter.mock.calls[0]).toEqual(
        ['sidebarFooterButtonSet', TrackingPlugin.sidebarFooterButtonSet]
      );
      expect(this.Plugins.addFilter.mock.calls[1]).toEqual(
        ['openIdentifyModal', TrackingPlugin.openIdentifyModal]
      );
    });
  });

  describe('Setting and changing configuration', function () {
    beforeEach(function () {
      this.TrackingPlugin = _.clone(TrackingPlugin);
      this.TrackingPlugin.configuration = _.clone(TrackingPlugin.configuration);
    });

    describe('#isEnabled', function () {
      it('returns true if configured to be enabled', function () {
        this.TrackingPlugin.configure({enabled: true});
        expect(this.TrackingPlugin.isEnabled()).toBeTruthy();
      });

      it('defaults to false', function () {
        expect(this.TrackingPlugin.isEnabled()).toBeFalsy();
      });
    });

    describe('#configure', function () {
      it('changes the plugin\'s configuration', function () {
        expect(this.TrackingPlugin.isEnabled()).toBeFalsy();
        this.TrackingPlugin.configure({enabled: true});
        expect(this.TrackingPlugin.isEnabled()).toBeTruthy();
      });
    });
  });

  describe('Listeners', function () {
    beforeEach(function () {
      Plugins.initialize();
      DOMUtils.appendScript = jasmine.createSpy();
    });

    describe('#pluginsConfigured', function () {

      it('appends scripts to the document head if plugin enabled', function () {
        processConfigState(true);
        expect(DOMUtils.appendScript.callCount).toEqual(2);
      });

      it('does not append scripts if plugin disabled', function () {
        processConfigState(false);
        expect(DOMUtils.appendScript.callCount).toEqual(0);
      });
    });

    describe('#openIdentifyModal', function () {
      it('returns the value given to it if plugin enabled', function () {
        processConfigState(true);
        var result = Plugins.applyFilter('openIdentifyModal', 'hello');
        expect(result).toEqual('hello');
      });

      it('returns false if plugin disabled', function () {
        processConfigState(false);
        var result = Plugins.applyFilter('openIdentifyModal', 'hello');
        expect(result).toEqual(false);
      });
    });

    describe('#sidebarFooterButtonSet', function () {
      it('returns the value given to it if plugin enabled', function () {
        processConfigState(true);
        var result = Plugins.applyFilter('sidebarFooterButtonSet', 'hello');
        expect(result).toEqual('hello');
      });

      it('returns an empty array if plugin disabled', function () {
        processConfigState(false);
        var result = Plugins.applyFilter('sidebarFooterButtonSet', 'hello');
        expect(result).toEqual([]);
      });
    });
  });
});
