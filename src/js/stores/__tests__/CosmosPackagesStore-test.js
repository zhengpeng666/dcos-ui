jest.dontMock('../CosmosPackagesStore');
jest.dontMock('../../config/Config');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/CosmosPackagesActions');
jest.dontMock('../../mixins/GetSetMixin');
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
      handlers.success(_.clone(packagesFixture));
    };
    this.packagesFixture = _.clone(packagesFixture);
    this.configUseFixture = Config.useFixtures;
    Config.useFixtures = true;
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
    Config.useFixtures = this.configUseFixture;
  });

  it('should return an instance of UniversePackagesList', function () {
    CosmosPackagesStore.search();
    var packages = CosmosPackagesStore.get('packages');
    expect(packages instanceof UniversePackagesList).toBeTruthy();
  });

  it('should return all of the packages it was given', function () {
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
