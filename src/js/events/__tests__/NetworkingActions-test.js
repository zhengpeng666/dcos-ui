jest.dontMock('../AppDispatcher');
jest.dontMock('../NetworkingActions');
jest.dontMock('../../config/Config');
jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../../utils/RequestUtil');

let ActionTypes = require('../../constants/ActionTypes');
let AppDispatcher = require('../AppDispatcher');
let Config = require('../../config/Config');
let NetworkingActions = require('../NetworkingActions');
let RequestUtil = require('../../utils/RequestUtil');

describe('NetworkingActions', function () {

  beforeEach(function () {
    this.configuration = null;
    this.requestUtilJSON = RequestUtil.json;
    RequestUtil.json = function (configuration) {
      this.configuration = configuration;
    }.bind(this);
    Config.rootUrl = '';
    Config.useFixtures = false;
  });

  afterEach(function () {
    RequestUtil.json = this.requestUtilJSON;
  });

  describe('#fetchVIPs', function () {

    it('dispatches the correct action when successful', function () {
      NetworkingActions.fetchVIPs();
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_NETWORKING_VIPS_SUCCESS,
          data: {bar: 'baz'}
        });
      });

      this.configuration.success({array: {bar: 'baz'}});
    });

    it('dispatches the correct action when unsuccessful', function () {
      NetworkingActions.fetchVIPs();
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
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

  describe('#fetchVIPSummaries', function () {

    it('dispatches the correct action when successful', function () {
      NetworkingActions.fetchVIPSummaries();
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_SUCCESS,
          data: {bar: 'baz'}
        });
      });

      this.configuration.success({array: {bar: 'baz'}});
    });

    it('dispatches the correct action when unsuccessful', function () {
      NetworkingActions.fetchVIPSummaries();
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_ERROR,
          data: {bar: 'baz'}
        });
      });

      this.configuration.error({responseJSON: {description: {bar: 'baz'}}});
    });

    it('calls #json from the RequestUtil', function () {
      spyOn(RequestUtil, 'json');
      NetworkingActions.fetchVIPSummaries();
      expect(RequestUtil.json).toHaveBeenCalled();
    });

  });

  describe('#fetchVIPDetail', function () {

    it('dispatches the correct action when successful', function () {
      NetworkingActions.fetchVIPDetail('foo', 'bar', 'baz');
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_SUCCESS,
          data: {bar: 'baz'},
          vip: 'bar:foo:baz'
        });
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches the correct action when unsuccessful', function () {
      NetworkingActions.fetchVIPDetail('foo', 'bar', 'baz');
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_ERROR,
          data: {bar: 'baz'},
          vip: 'bar:foo:baz'
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
        Config.networkingAPIPrefix + '/foo/bar/baz'
      );
    });

  });

  describe('#fetchVIPBackendConnections', function () {

    it('dispatches the correct action when successful', function () {
      NetworkingActions.fetchVIPBackendConnections('foo', 'bar', 'baz');
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS,
          data: {bar: 'baz'},
          vip: 'bar:foo:baz'
        });
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches the correct action when unsuccessful', function () {
      NetworkingActions.fetchVIPBackendConnections('foo', 'bar', 'baz');
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_ERROR,
          data: {bar: 'baz'},
          vip: 'bar:foo:baz'
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
        Config.networkingAPIPrefix + '/backend-connections/foo/bar/baz'
      );
    });

  });

  describe('#fetchNodeMemberships', function () {

    it('dispatches the correct action when successful', function () {
      NetworkingActions.fetchNodeMemberships();
      let id = AppDispatcher.register(function (payload) {
        let action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
          type: ActionTypes.REQUEST_NETWORKING_NODE_MEMBERSHIPS_SUCCESS,
          data: {bar: 'baz'}
        });
      });

      this.configuration.success({array: {bar: 'baz'}});
    });

    it('dispatches the correct action when unsuccessful', function () {
      NetworkingActions.fetchNodeMemberships();
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action).toEqual({
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
