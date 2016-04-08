jest.dontMock('../Actions');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('tracking', {enabled: true});
require('../../SDK').setSDK(SDK);

PluginTestUtils.dontMock([
  'Util'
]);

var _ = require('underscore');
var Actions = require('../Actions');

global.analytics = {
  initialized: true,
  page: _.noop,
  track: _.noop
};

var DCOS_METADATA = {
  'CLUSTER_ID': 'cluster',
  'dcos-image-commit': 'commit',
  'bootstrap-id': 'bootstrap'
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
      Actions.setDcosMetadata(DCOS_METADATA);
      Actions.log({eventID: 'foo'});
      expect(global.analytics.track.calls.length).toEqual(1);
    });

    it('calls analytics#track with correct eventID', function () {
      Actions.setDcosMetadata(DCOS_METADATA);
      Actions.log({});
      expect(global.analytics.track.calls[0].args[0]).toEqual('dcos-ui');
    });

    it('calls analytics#track with correct log', function () {
      Actions.setDcosMetadata(DCOS_METADATA);
      Actions.log({eventID: 'foo'});

      var args = global.analytics.track.calls[0].args[1];
      expect(args.appVersion).toBeDefined();
      expect(args.date).toBeDefined();
      expect(args.eventID).toEqual('foo');
      expect(args.duration).toBeDefined();
      expect(args.page).toBeDefined();
      expect(args.stintID).toBeDefined();
      expect(args.version).toBeDefined();
      expect(args.CLUSTER_ID).toBeDefined();
      expect(args['dcos-image-commit']).toBeDefined();
      expect(args['bootstrap-id']).toBeDefined();
    });

  });

  describe('#setDcosMetadata', function () {

    beforeEach(function () {
      Actions.dcosMetadata = null;
      spyOn(global.analytics, 'track');
    });

    it('doesn\'t track any logs when there\'s no metadata', function () {
      Actions.log('Test');
      expect(global.analytics.track).not.toHaveBeenCalled();
    });

    it('sets the dcosMetadata', function () {
      Actions.setDcosMetadata(DCOS_METADATA);
      expect(Actions.dcosMetadata).toEqual(DCOS_METADATA);
    });

    it('runs queued logs when metadata is set', function () {
      Actions.log('foo');
      Actions.log('bar');
      Actions.log('baz');
      spyOn(Actions, 'log');
      Actions.setDcosMetadata(DCOS_METADATA);
      expect(Actions.log.calls.length).toEqual(3);
      ['foo', 'bar', 'baz'].forEach(function (log, i) {
        expect(Actions.log.calls[i].args[0]).toEqual(log);
      });
    });

  });

});
