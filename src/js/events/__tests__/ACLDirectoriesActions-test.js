jest.dontMock('../ACLDirectoriesActions');
jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../AppDispatcher');
jest.dontMock('../../config/Config');
jest.dontMock('../../utils/RequestUtil');

let ACLDirectoriesActions = require('../ACLDirectoriesActions');
let ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../AppDispatcher');
let Config = require('../../config/Config');
let RequestUtil = require('../../utils/RequestUtil');

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
          data: {foo: 'bar'}
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

});
