jest.dontMock('../ACLAuthActions');

import PluginTestUtils from 'PluginTestUtils';
import ActionTypes from '../../constants/ActionTypes';
import PluginSDK from '../../SDK';

let SDK = PluginTestUtils.getSDK('authentication', {enabled: true});
PluginSDK.setSDK(SDK);
let {RequestUtil, Config} = SDK.get(['RequestUtil', 'Config']);
let ACLAuthActions = require('../ACLAuthActions');

describe('ACLAuthActions', function () {

  describe('#fetchRole', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLAuthActions.fetchRole('foo');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(Config.acsAPIPrefix + '/users/foo');
    });

    it('dispatches the correct action when successful', function () {
      let unsubscribe = SDK.onDispatch(function (action) {
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_ROLE_SUCCESS);
        unsubscribe();
      });

      this.configuration.success();
    });

    it('dispatches the correct action when unsuccessful', function () {
      let unsubscribe = SDK.onDispatch(function (action) {
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_ROLE_ERROR);
        unsubscribe();

      });

      this.configuration.error({});
    });

  });

  describe('#login', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLAuthActions.login();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(Config.acsAPIPrefix + '/auth/login');
    });

    it('dispatches the correct action when successful', function () {
      let unsubscribe = SDK.onDispatch(function (action) {
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGIN_SUCCESS);
        unsubscribe();
      });

      this.configuration.success();
    });

    it('dispatches the correct action when unsuccessful', function () {
      let unsubscribe = SDK.onDispatch(function (action) {
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGIN_ERROR);
        unsubscribe();
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the correct error when unsuccessful', function () {
      let unsubscribe = SDK.onDispatch(function (action) {
        expect(action.data).toEqual('bar');
        unsubscribe();
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#logout', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLAuthActions.logout();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(Config.acsAPIPrefix + '/auth/logout');
    });

    it('dispatches the correct action when successful', function () {
      let unsubscribe = SDK.onDispatch(function (action) {
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGOUT_SUCCESS);
        unsubscribe();
      });

      this.configuration.success();
    });

    it('dispatches the correct action when unsuccessful', function () {
      let unsubscribe = SDK.onDispatch(function (action) {
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGOUT_ERROR);
        unsubscribe();
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the correct error when unsuccessful', function () {
      let unsubscribe = SDK.onDispatch(function (action) {
        expect(action.data).toEqual('bar');
        unsubscribe();
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

});
