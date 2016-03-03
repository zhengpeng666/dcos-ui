jest.dontMock('../Actions');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('tracking', {enabled: true});
require('../../SDK').setSDK(SDK);

var _ = require('underscore');
var Actions = require('../Actions');

global.analytics = {
  initialized: true,
  page: _.noop,
  track: _.noop
};

describe('Actions', function () {

  Actions.initialize();

  describe('#log', function () {

    beforeEach(function () {
      spyOn(global.analytics, 'track');
    });

    afterEach(function () {
      global.analytics.track = _.noop;
    });

    it('calls analytics#track', function () {
      Actions.setClusterID('a');
      Actions.log({eventID: 'foo'});
      expect(global.analytics.track.calls.length).toEqual(1);
    });

    it('calls analytics#track with correct eventID', function () {
      Actions.setClusterID('a');
      Actions.log({});
      expect(global.analytics.track.calls[0].args[0]).toEqual('dcos-ui');
    });

    it('calls analytics#track with correct log', function () {
      Actions.setClusterID('a');
      Actions.log({eventID: 'foo'});

      var args = global.analytics.track.calls[0].args[1];
      expect(args.appVersion).toBeDefined();
      expect(args.date).toBeDefined();
      expect(args.eventID).toEqual('foo');
      expect(args.duration).toBeDefined();
      expect(args.page).toBeDefined();
      expect(args.stintID).toBeDefined();
      expect(args.version).toBeDefined();
    });

  });

  describe('#setClusterID', function () {

    beforeEach(function () {
      Actions.setClusterID(null);
      spyOn(global.analytics, 'track');
    });

    it('doesn\'t track any logs when there\'s no cluster ID', function () {
      Actions.log('Test');
      expect(global.analytics.track).not.toHaveBeenCalled();
    });

    it('sets the clusterID', function () {
      Actions.setClusterID('foo');
      expect(Actions.clusterID).toEqual('foo');
    });

    it('runs queued logs when clusterID is set', function () {
      Actions.log('foo');
      Actions.log('bar');
      Actions.log('baz');
      spyOn(Actions, 'log');
      Actions.setClusterID('qux');
      expect(Actions.log.calls.length).toEqual(3);
      ['foo', 'bar', 'baz'].forEach(function (log, i) {
        expect(Actions.log.calls[i].args[0]).toEqual(log);
      });
    });

  });

  describe('#prepareLog', function () {

    beforeEach(function () {
      Actions.activePage = '/services';

      this.log = {
        date: Date.now()
      };
    });

    it('does not create unique event id', function () {
      var log = Actions.prepareLog(this.log);

      expect(log.uniqueEventID).not.toBeDefined();
    });

    it('creates a unique event id', function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        data: {foo: 'bar'},
        componentID: 'Baz'
      }));

      expect(log.uniqueEventID).toBeDefined();
    });

    it('flattens a eventID of type array', function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        eventID: ['foo', 'bar']
      }));

      expect(_.isArray(log.eventID)).toBe(false);
    });

    it('adds page to eventID when eventID is array', function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        eventID: ['foo', 'bar']
      }));

      expect(log.eventID).toBe('services.foo.bar');
    });

    it('does not add a page to non Array eventIDs', function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        eventID: 'foo'
      }));

      expect(log.eventID).toBe('foo');
    });

    it('sets the duration since last log', function () {
      var delta = 123456;

      Actions.lastLogDate = this.log.date;
      this.log.date += delta;

      var log = Actions.prepareLog(this.log);

      expect(log.duration).toBe(delta);
    });

  });

});
