jest.dontMock('../CosmosPackagesActions');
jest.dontMock('../AppDispatcher');
jest.dontMock('../../config/Config');
jest.dontMock('../../constants/ActionTypes');
jest.dontMock('../../utils/RequestUtil');

var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../AppDispatcher');
var CosmosPackagesActions = require('../CosmosPackagesActions');
var RequestUtil = require('../../utils/RequestUtil');

describe('CosmosPackagesActions', function () {

  describe('#search', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      CosmosPackagesActions.search('foo');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(
          ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS
        );
      });

      this.configuration.success({bar: 'baz'});
    });

    it('dispatches with the correct data when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual([{bar: 'baz'}]);
      });

      this.configuration.success({packages: [{bar: 'baz'}]});
    });

    it('dispatches the correct action when unsucessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(
          ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_ERROR
        );
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

  });

});
