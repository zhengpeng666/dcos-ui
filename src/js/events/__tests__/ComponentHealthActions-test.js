jest.dontMock('../AppDispatcher');
jest.dontMock('../UnitHealthActions');
jest.dontMock('../../config/Config');
jest.dontMock('../../constants/ActionTypes');

var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../AppDispatcher');
var UnitHealthActions = require('../UnitHealthActions');
var Config = require('../../config/Config');
var RequestUtil = require('../../utils/RequestUtil');

describe('UnitHealthActions', function () {

  describe('#fetchUnits', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      UnitHealthActions.fetchUnits();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_HEALTH_UNITS_SUCCESS);
      });

      this.configuration.success({bar: 'bar'});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_HEALTH_UNITS_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url).toEqual(Config.unitHealthAPIPrefix + '/units');
    });

  });

});
