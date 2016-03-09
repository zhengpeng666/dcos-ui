jest.dontMock('../AppDispatcher');
jest.dontMock('../NetworkingActions');
jest.dontMock('../../config/Config');

let ActionTypes = require('../../constants/ActionTypes');
let AppDispatcher = require('../AppDispatcher');
let Config = require('../../config/Config');
let NetworkingActions = require('../NetworkingActions');
let RequestUtil = require('../../utils/RequestUtil');

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

});
