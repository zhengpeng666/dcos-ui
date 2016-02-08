jest.dontMock('../CosmosPackagesStore');
jest.dontMock('../../config/Config');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/CosmosPackagesActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../structs/UniversePackage');
jest.dontMock('../../structs/UniversePackagesList');
jest.dontMock('../../structs/Item');
jest.dontMock('../../structs/List');
jest.dontMock('../../utils/RequestUtil');
jest.dontMock('../../utils/Util');
jest.dontMock('./fixtures/MockPackagesSearchResponse.json');

var _ = require('underscore');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../events/AppDispatcher');
var Config = require('../../config/Config');
var CosmosPackagesStore = require('../CosmosPackagesStore');
var EventTypes = require('../../constants/EventTypes');
var packagesFixture = require('./fixtures/MockPackagesSearchResponse.json');
var UniversePackagesList = require('../../structs/UniversePackagesList');
var RequestUtil = require('../../utils/RequestUtil');

describe('CosmosPackagesStore', function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(packagesFixture);
    };
    this.packagesFixture = _.clone(packagesFixture);
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  it('should return an instance of UniversePackagesList', function () {
    Config.useFixtures = true;
    CosmosPackagesStore.search();
    var packages = CosmosPackagesStore.get('packages');
    expect(packages instanceof UniversePackagesList).toBeTruthy();
  });

  it('should return all of the packages it was given', function () {
    Config.useFixtures = true;
    CosmosPackagesStore.search();
    var packages = CosmosPackagesStore.get('packages').getItems();
    expect(packages.length).toEqual(this.packagesFixture.packages.length);
  });

  describe('dispatcher', function () {

    it('stores packages when event is dispatched', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
        data: [{gid: 'foo', bar: 'baz'}]
      });

      var packages = CosmosPackagesStore.get('packages').getItems();
      expect(packages[0].gid).toEqual('foo');
      expect(packages[0].bar).toEqual('baz');
    });

    it('dispatches the correct event upon success', function () {
      var mockedFn = jest.genMockFunction();
      CosmosPackagesStore.addChangeListener(
        EventTypes.COSMOS_PACKAGES_CHANGE,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
        data: [{gid: 'foo', bar: 'baz'}]
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

    it('dispatches the correct event upon error', function () {
      var mockedFn = jasmine.createSpy('mockedFn');
      CosmosPackagesStore.addChangeListener(
        EventTypes.COSMOS_PACKAGES_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_ERROR,
        data: 'foo'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo']);
    });

  });

});
