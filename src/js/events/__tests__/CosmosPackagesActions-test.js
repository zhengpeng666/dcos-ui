jest.dontMock('../CosmosPackagesActions');
jest.dontMock('../AppDispatcher');
jest.dontMock('../../config/Config');
jest.dontMock('../../constants/ActionTypes');

var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../AppDispatcher');
var CosmosPackagesActions = require('../CosmosPackagesActions');
var Config = require('../../config/Config');
var RequestUtil = require('../../utils/RequestUtil');

describe('CosmosPackagesActions', function () {

  describe('#describe', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      CosmosPackagesActions.describe('foo', 'bar');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(
          ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS
        );
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
        expect(action.type).toEqual(
          ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR
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

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(Config.cosmosAPIPrefix + '/describe');
    });

    it('sends query in request body', function () {
      expect(this.configuration.data)
        .toEqual({packageName: 'foo', packageVersion: 'bar'});
    });

    it('sends query in request body, even if it is undefined', function () {
      CosmosPackagesActions.describe();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
      expect(this.configuration.data)
        .toEqual({packageName: undefined, packageVersion: undefined});
    });

    it('sends a POST request', function () {
      expect(this.configuration.method).toEqual('POST');
    });

  });

  describe('#list', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      CosmosPackagesActions.list('foo', 'bar');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(
          ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_SUCCESS
        );
      });

      this.configuration.success({packages: [{bar: 'baz'}]});
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
          ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_ERROR
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

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(Config.cosmosAPIPrefix + '/list');
    });

    it('sends query in request body', function () {
      expect(this.configuration.data)
        .toEqual({packageName: 'foo', appId: 'bar'});
    });

    it('sends query in request body, even if it is undefined', function () {
      CosmosPackagesActions.list();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
      expect(this.configuration.data)
        .toEqual({packageName: undefined, appId: undefined});
    });

    it('sends a POST request', function () {
      expect(this.configuration.method).toEqual('POST');
    });

  });

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

      this.configuration.success({packages: [{bar: 'baz'}]});
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

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(Config.cosmosAPIPrefix + '/search');
    });

    it('sends query in request body', function () {
      expect(this.configuration.data).toEqual({query: 'foo'});
    });

    it('sends query in request body, even if it is undefined', function () {
      CosmosPackagesActions.search();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
      expect(this.configuration.data).toEqual({query: undefined});
    });

    it('sends a POST request', function () {
      expect(this.configuration.method).toEqual('POST');
    });

  });

});
