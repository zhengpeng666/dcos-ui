jest.dontMock('../ACLDirectoriesActions');
jest.dontMock('../../../../../../src/js/utils/RequestUtil');

var ACLDirectoriesActions = require('../ACLDirectoriesActions');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../../../../../src/js/events/AppDispatcher');
var Config = require('../../../../../../src/js/config/Config');
var RequestUtil = require('../../../../../../src/js/utils/RequestUtil');

describe('ACLDirectoriesActions', function () {

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

  describe('#fetchDirectories', function () {

    it('calls #json from the RequestUtil', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.fetchDirectories();
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.fetchDirectories();
      expect(RequestUtil.json.mostRecentCall.args[0].url)
        .toEqual(Config.acsAPIPrefix + '/ldap/config');
    });

    it('dispatches the correct action when successful', function () {
      ACLDirectoriesActions.fetchDirectories();

      var id = AppDispatcher.register(function (payload) {
        AppDispatcher.unregister(id);

        expect(payload.action).toEqual({
          type: ActionTypes.REQUEST_ACL_DIRECTORIES_SUCCESS,
          data: [{foo: 'bar'}]
        });
      });

      this.configuration.success({foo: 'bar'});
    });

    it('dispatches the correct action when unsuccessful', function () {
      ACLDirectoriesActions.fetchDirectories();

      var id = AppDispatcher.register(function (payload) {
        AppDispatcher.unregister(id);

        expect(payload.action).toEqual({
          type: ActionTypes.REQUEST_ACL_DIRECTORIES_ERROR,
          data: 'No LDAP configuration stored yet.'
        });
      });

      this.configuration.error({responseJSON: {
          title: 'Bad Request',
          description: 'No LDAP configuration stored yet.',
          code: 'ERR_LDAP_CONFIG_NOT_AVAILABLE'
      }});
    });

  });

  describe('#addDirectory', function () {

    it('calls #json from the RequestUtil', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.addDirectory({port: 1});
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('uses PUT method', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.addDirectory({port: 1});
      expect(RequestUtil.json.mostRecentCall.args[0].method).toEqual('PUT');
    });

    it('puts data to correct URL', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.addDirectory({port: 1});
      expect(RequestUtil.json.mostRecentCall.args[0].url)
        .toEqual(Config.acsAPIPrefix + '/ldap/config');
    });

    it('dispatches the correct action when successful', function () {
      ACLDirectoriesActions.addDirectory({port: 1});

      var id = AppDispatcher.register(function (payload) {
        AppDispatcher.unregister(id);

        expect(payload.action).toEqual({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_ADD_SUCCESS
        });
      });

      this.configuration.success();
    });

    it('dispatches the correct action when unsuccessful', function () {
      ACLDirectoriesActions.addDirectory({port: 1});

      var id = AppDispatcher.register(function (payload) {
        AppDispatcher.unregister(id);

        expect(payload.action).toEqual({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_ADD_ERROR,
          data: 'Foo'
        });
      });

      this.configuration.error({responseJSON: {
          description: 'Foo'
      }});
    });

  });

  describe('#deleteDirectory', function () {

    it('calls #json from the RequestUtil', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.deleteDirectory();
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('uses DELETE method', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.deleteDirectory();
      expect(RequestUtil.json.mostRecentCall.args[0].method).toEqual('DELETE');
    });

    it('puts data to correct URL', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.deleteDirectory();
      expect(RequestUtil.json.mostRecentCall.args[0].url)
        .toEqual(Config.acsAPIPrefix + '/ldap/config');
    });

    it('dispatches the correct action when successful', function () {
      ACLDirectoriesActions.deleteDirectory();

      var id = AppDispatcher.register(function (payload) {
        AppDispatcher.unregister(id);

        expect(payload.action).toEqual({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_DELETE_SUCCESS
        });
      });

      this.configuration.success();
    });

    it('dispatches the correct action when unsuccessful', function () {
      ACLDirectoriesActions.deleteDirectory();

      var id = AppDispatcher.register(function (payload) {
        AppDispatcher.unregister(id);

        expect(payload.action).toEqual({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_DELETE_ERROR,
          data: 'Foo'
        });
      });

      this.configuration.error({responseJSON: {
          description: 'Foo'
      }});
    });

  });

  describe('#testDirectoryConnection', function () {

    it('calls #json from the RequestUtil', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.testDirectoryConnection();
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('uses POST method', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.testDirectoryConnection();
      expect(RequestUtil.json.mostRecentCall.args[0].method).toEqual('POST');
    });

    it('passses in credentials', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.testDirectoryConnection({
        uid: 'foo',
        password: 'bar'
      });
      expect(RequestUtil.json.mostRecentCall.args[0].data).toEqual({
        uid: 'foo',
        password: 'bar'
      });
    });

    it('puts data to correct URL', function () {
      spyOn(RequestUtil, 'json');
      ACLDirectoriesActions.testDirectoryConnection();
      expect(RequestUtil.json.mostRecentCall.args[0].url)
        .toEqual(Config.acsAPIPrefix + '/ldap/config/test');
    });

    it('dispatches the correct action when successful', function () {
      ACLDirectoriesActions.testDirectoryConnection();

      var id = AppDispatcher.register(function (payload) {
        AppDispatcher.unregister(id);

        expect(payload.action).toEqual({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_TEST_SUCCESS,
          data: 'foo'
        });
      });

      this.configuration.success({description: 'foo'});
    });

    it('dispatches the correct action when unsuccessful', function () {
      ACLDirectoriesActions.testDirectoryConnection();

      var id = AppDispatcher.register(function (payload) {
        AppDispatcher.unregister(id);

        expect(payload.action).toEqual({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_TEST_ERROR,
          data: 'Foo'
        });
      });

      this.configuration.error({responseJSON: {
          description: 'Foo'
      }});
    });

  });

});
