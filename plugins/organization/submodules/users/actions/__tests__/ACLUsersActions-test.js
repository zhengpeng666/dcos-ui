jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../ACLUsersActions');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock([
  'RequestUtil'
]);

let SDK = PluginTestUtils.getSDK('Organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

let ActionTypes = require('../../constants/ActionTypes');
let ACLUsersActions = require('../ACLUsersActions');

let {RequestUtil, Config} = SDK.get(['RequestUtil', 'Config']);

let AppDispatcher = require('../../../../../../src/js/events/AppDispatcher');

describe('ACLUsersActions', function () {

  describe('#fetch', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLUsersActions.fetch();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USERS_SUCCESS);
      });

      this.configuration.success({foo: 'bar'});
    });

    it('dispatches the correct action when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USERS_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url).toEqual(Config.acsAPIPrefix + '/users');
    });

  });

  describe('#fetchUser', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLUsersActions.fetchUser('foo');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USER_SUCCESS);
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches with the correct data when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual({bar: 'baz'});
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USER_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches with the correct data when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual('bar');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches with the userID when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#fetchUserGroups', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLUsersActions.fetchUserGroups('foo');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS);
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches with the correct data when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual({bar: 'baz'});
      });

      this.configuration.success({array: {bar: 'baz'}});
    });

    it('dispatches with the userID successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_USER_GROUPS_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches with the correct data when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches with the userID when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual('bar');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#fetchUserPermissions', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLUsersActions.fetchUserPermissions('foo');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS);
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches with the correct data when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual({bar: 'baz'});
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches with the userID successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_PERMISSIONS_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches with the correct data when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches with the userID when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual('bar');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#addUser', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLUsersActions.addUser({uid: 'foo'});
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url).toEqual(Config.acsAPIPrefix + '/users/foo');
    });

    it('uses PUT for the request method', function () {
      expect(this.configuration.method).toEqual('PUT');
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_CREATE_SUCCESS);
      });

      this.configuration.success({foo: 'bar'});
    });

    it('dispatches the userID when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.success({description: 'bar'});
    });

    it('dispatches the correct action when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_CREATE_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the correct message when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual('bar');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the userID when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#updateUser', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLUsersActions.updateUser('foo');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url).toEqual(Config.acsAPIPrefix + '/users/foo');
    });

    it('uses PATCH for the request method', function () {
      expect(this.configuration.method).toEqual('PATCH');
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_UPDATE_SUCCESS);
      });

      this.configuration.success({foo: 'bar'});
    });

    it('dispatches the userID when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the correct action when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_UPDATE_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the correct message when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual('bar');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the userID when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#deleteUser', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLUsersActions.deleteUser('foo');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url).toEqual(Config.acsAPIPrefix + '/users/foo');
    });

    it('uses DELETE for the request method', function () {
      expect(this.configuration.method).toEqual('DELETE');
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_DELETE_SUCCESS);
      });

      this.configuration.success({foo: 'bar'});
    });

    it('dispatches the userID when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the correct action when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type)
          .toEqual(ActionTypes.REQUEST_ACL_USER_DELETE_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the correct message when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual('bar');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the userID when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.userID).toEqual('foo');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

});
