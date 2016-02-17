jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../AppDispatcher');
jest.dontMock('../ComponentHealthActions');
jest.dontMock('../../config/Config');
jest.dontMock('../../utils/RequestUtil');

var ActionTypes = require('../../constants/ActionTypes');
var ComponentHealthActions = require('../ComponentHealthActions');
var AppDispatcher = require('../AppDispatcher');
var Config = require('../../config/Config');
var RequestUtil = require('../../utils/RequestUtil');

describe('ComponentHealthActions', function () {

  describe('#fetchComponents', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ComponentHealthActions.fetchComponents();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_HEALTH_COMPONENTS_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_HEALTH_COMPONENTS_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url).toEqual(Config.componentHealthAPIPrefix + '/components');
    });

  });

  describe('#fetchReport', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ComponentHealthActions.fetchReport();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_HEALTH_REPORT_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_HEALTH_REPORT_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url).toEqual(Config.componentHealthAPIPrefix + '/report');
    });

  });
});
