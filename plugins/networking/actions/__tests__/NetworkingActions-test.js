import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('networking', {enabled: true});

require('../../SDK').setSDK(SDK);

let ActionTypes = require('../../constants/ActionTypes');
let NetworkingActions = require('../NetworkingActions');

let {RequestUtil, Config} = SDK.get(['RequestUtil', 'Config']);

describe('NetworkingActions', function () {

  beforeEach(function () {
    this.configuration = null;
    this.requestUtilJSON = RequestUtil.json;
    this.rootUrl = Config.rootUrl;
    this.useFixtures = Config.useFixtures;
    Config.useFixtures = false;
    Config.rootUrl = '';
    RequestUtil.json = function (configuration) {
      this.configuration = configuration;
    }.bind(this);
  });

  afterEach(function () {
    Config.rootUrl = this.rootUrl;
    Config.useFixtures = this.useFixtures;
    RequestUtil.json = this.requestUtilJSON;
  });

  describe('#fetchVIPs', function () {

    it('dispatches the correct action when successful', function () {
      NetworkingActions.fetchVIPs();
      let unsubscribe = SDK.onDispatch(function (action) {
        unsubscribe();
        expect(action).toEqual({
          __origin: 'networking',
          type: ActionTypes.REQUEST_NETWORKING_VIPS_SUCCESS,
          data: {bar: 'baz'}
        });
      });

      this.configuration.success({array: {bar: 'baz'}});
    });

    it('dispatches the correct action when unsuccessful', function () {
      NetworkingActions.fetchVIPs();
      var unsubscribe = SDK.onDispatch(function (action) {
        unsubscribe();
        expect(action).toEqual({
          __origin: 'networking',
          type: ActionTypes.REQUEST_NETWORKING_VIPS_ERROR,
          data: {bar: 'baz'}
        });
      });

      this.configuration.error({responseJSON: {description: {bar: 'baz'}}});
    });

    it('calls #json from the RequestUtil', function () {
      spyOn(RequestUtil, 'json');
      NetworkingActions.fetchVIPs();
      expect(RequestUtil.json).toHaveBeenCalled();
    });

  });

  describe('#fetchVIPDetail', function () {

    it('dispatches the correct action when successful', function () {
      NetworkingActions.fetchVIPDetail('foo', 'bar', 'baz');
      let unsubscribe = SDK.onDispatch(function (action) {
        unsubscribe();
        expect(action).toEqual({
          __origin: 'networking',
          type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_SUCCESS,
          data: {bar: 'baz'},
          vip: 'foo:bar:baz'
        });
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches the correct action when unsuccessful', function () {
      NetworkingActions.fetchVIPDetail('foo', 'bar', 'baz');
      var unsubscribe = SDK.onDispatch(function (action) {
        unsubscribe();
        expect(action).toEqual({
          __origin: 'networking',
          type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_ERROR,
          data: {bar: 'baz'},
          vip: 'foo:bar:baz'
        });
      });

      this.configuration.error({responseJSON: {description: {bar: 'baz'}}});
    });

    it('calls #json from the RequestUtil', function () {
      spyOn(RequestUtil, 'json');
      NetworkingActions.fetchVIPDetail('foo', 'bar', 'baz');
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      NetworkingActions.fetchVIPDetail('foo', 'bar', 'baz');
      expect(this.configuration.url).toEqual(
        Config.networkingAPIPrefix + '/bar/foo/baz'
      );
    });

  });

  describe('#fetchVIPBackendConnections', function () {

    it('dispatches the correct action when successful', function () {
      NetworkingActions.fetchVIPBackendConnections('foo', 'bar', 'baz');
      let unsubscribe = SDK.onDispatch(function (action) {
        unsubscribe();
        expect(action).toEqual({
          __origin: 'networking',
          type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS,
          data: {bar: 'baz'},
          vip: 'foo:bar:baz'
        });
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches the correct action when unsuccessful', function () {
      NetworkingActions.fetchVIPBackendConnections('foo', 'bar', 'baz');
      var unsubscribe = SDK.onDispatch(function (action) {
        unsubscribe();
        expect(action).toEqual({
          __origin: 'networking',
          type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_ERROR,
          data: {bar: 'baz'},
          vip: 'foo:bar:baz'
        });
      });

      this.configuration.error({responseJSON: {description: {bar: 'baz'}}});
    });

    it('calls #json from the RequestUtil', function () {
      spyOn(RequestUtil, 'json');
      NetworkingActions.fetchVIPBackendConnections('foo', 'bar', 'baz');
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      NetworkingActions.fetchVIPBackendConnections('foo', 'bar', 'baz');
      expect(this.configuration.url).toEqual(
        Config.networkingAPIPrefix + '/backend-connections/bar/foo/baz'
      );
    });

  });

  describe('#fetchNodeMemberships', function () {

    it('dispatches the correct action when successful', function () {
      NetworkingActions.fetchNodeMemberships();
      let unsubscribe = SDK.onDispatch(function (action) {
        unsubscribe();
        expect(action).toEqual({
          __origin: 'networking',
          type: ActionTypes.REQUEST_NETWORKING_NODE_MEMBERSHIPS_SUCCESS,
          data: {bar: 'baz'}
        });
      });

      this.configuration.success({array: {bar: 'baz'}});
    });

    it('dispatches the correct action when unsuccessful', function () {
      NetworkingActions.fetchNodeMemberships();
      var unsubscribe = SDK.onDispatch(function (action) {
        unsubscribe();
        expect(action).toEqual({
          __origin: 'networking',
          type: ActionTypes.REQUEST_NETWORKING_NODE_MEMBERSHIPS_ERROR,
          data: {bar: 'baz'}
        });
      });

      this.configuration.error({responseJSON: {description: {bar: 'baz'}}});
    });

    it('calls #json from the RequestUtil', function () {
      spyOn(RequestUtil, 'json');
      NetworkingActions.fetchNodeMemberships();
      expect(RequestUtil.json).toHaveBeenCalled();
    });

  });

});
