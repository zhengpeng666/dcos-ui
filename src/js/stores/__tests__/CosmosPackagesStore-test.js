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
var packageDescribeFixture =
  require('./fixtures/MockPackageDescribeResponse.json');
var packagesListFixture = require('./fixtures/MockPackagesListResponse.json');
var packagesSearchFixture =
  require('./fixtures/MockPackagesSearchResponse.json');
var RequestUtil = require('../../utils/RequestUtil');
var UniversePackage = require('../../structs/UniversePackage');
var UniversePackagesList = require('../../structs/UniversePackagesList');

describe('CosmosPackagesStore', function () {

  beforeEach(function () {
    this.configUseFixture = Config.useFixtures;
    Config.useFixtures = true;
  });

  afterEach(function () {
    Config.useFixtures = this.configUseFixture;
  });

  describe('#fetchDescription', function () {

    beforeEach(function () {
      this.requestFn = RequestUtil.json;
      RequestUtil.json = function (handlers) {
        handlers.success(_.clone(packageDescribeFixture));
      };
      this.packageDescribeFixture = _.clone(packageDescribeFixture);
    });

    afterEach(function () {
      RequestUtil.json = this.requestFn;
    });

    it('should return an instance of UniversePackage', function () {
      CosmosPackagesStore.fetchDescription('foo', 'bar');
      var description = CosmosPackagesStore.get('description');
      expect(description instanceof UniversePackage).toBeTruthy();
    });

    it('should return the description it was given', function () {
      CosmosPackagesStore.fetchDescription('foo', 'bar');
      var pkg = CosmosPackagesStore.get('description');
      expect(pkg.get('name'))
        .toEqual(this.packageDescribeFixture.package.name);
      expect(pkg.get('version'))
        .toEqual(this.packageDescribeFixture.package.version);
    });

    it('should pass though query parameters', function () {
      RequestUtil.json = jasmine.createSpy('RequestUtil#json');
      CosmosPackagesStore.fetchDescription('foo', 'bar');
      expect(RequestUtil.json.mostRecentCall.args[0].data)
        .toEqual({packageName: 'foo', packageVersion: 'bar'});
    });

    describe('dispatcher', function () {

      it('stores description when event is dispatched', function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS,
          data: {gid: 'foo', bar: 'baz'},
          packageName: 'foo',
          packageVersion: 'bar'
        });

        var pkg = CosmosPackagesStore.get('description');
        expect(pkg.get('gid')).toEqual('foo');
        expect(pkg.get('bar')).toEqual('baz');
      });

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        CosmosPackagesStore.addChangeListener(
          EventTypes.COSMOS_DESCRIBE_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS,
          data: {gid: 'foo', bar: 'baz'},
          packageName: 'foo',
          packageVersion: 'bar'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jasmine.createSpy('mockedFn');
        CosmosPackagesStore.addChangeListener(
          EventTypes.COSMOS_DESCRIBE_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR,
          data: 'error',
          packageName: 'foo',
          packageVersion: 'bar'
        });

        expect(mockedFn.calls.length).toEqual(1);
        expect(mockedFn.calls[0].args).toEqual(['error', 'foo', 'bar']);
      });

    });

  });

  describe('#fetchList', function () {

    beforeEach(function () {
      this.requestFn = RequestUtil.json;
      RequestUtil.json = function (handlers) {
        handlers.success(_.clone(packagesListFixture));
      };
      this.packagesListFixture = _.clone(packagesListFixture);
    });

    afterEach(function () {
      RequestUtil.json = this.requestFn;
    });

    it('should return an instance of UniversePackagesList', function () {
      CosmosPackagesStore.fetchList('foo', 'bar');
      var list = CosmosPackagesStore.get('list');
      expect(list instanceof UniversePackagesList).toBeTruthy();
    });

    it('should return all of the list it was given', function () {
      CosmosPackagesStore.fetchList('foo', 'bar');
      var list = CosmosPackagesStore.get('list').getItems();
      expect(list.length).toEqual(this.packagesListFixture.packages.length);
    });

    it('should pass though query parameters', function () {
      RequestUtil.json = jasmine.createSpy('RequestUtil#json');
      CosmosPackagesStore.fetchList('foo', 'bar');
      expect(RequestUtil.json.mostRecentCall.args[0].data)
        .toEqual({packageName: 'foo', appId: 'bar'});
    });

    describe('dispatcher', function () {

      it('stores list when event is dispatched', function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_SUCCESS,
          data: [{gid: 'foo', bar: 'baz'}],
          packageName: 'foo',
          appId: 'bar'
        });

        var list = CosmosPackagesStore.get('list').getItems();
        expect(list[0].get('gid')).toEqual('foo');
        expect(list[0].get('bar')).toEqual('baz');
      });

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        CosmosPackagesStore.addChangeListener(
          EventTypes.COSMOS_LIST_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_SUCCESS,
          data: [{gid: 'foo', bar: 'baz'}],
          packageName: 'foo',
          appId: 'bar'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jasmine.createSpy('mockedFn');
        CosmosPackagesStore.addChangeListener(
          EventTypes.COSMOS_LIST_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_ERROR,
          data: 'error',
          packageName: 'foo',
          appId: 'bar'
        });

        expect(mockedFn.calls.length).toEqual(1);
        expect(mockedFn.calls[0].args).toEqual(['error', 'foo', 'bar']);
      });

    });

  });

  describe('#search', function () {

    beforeEach(function () {
      this.requestFn = RequestUtil.json;
      RequestUtil.json = function (handlers) {
        handlers.success(_.clone(packagesSearchFixture));
      };
      this.packagesSearchFixture = _.clone(packagesSearchFixture);
    });

    afterEach(function () {
      RequestUtil.json = this.requestFn;
    });

    it('should return an instance of UniversePackagesList', function () {
      CosmosPackagesStore.search('foo');
      var search = CosmosPackagesStore.get('search');
      expect(search instanceof UniversePackagesList).toBeTruthy();
    });

    it('should return all of the search it was given', function () {
      CosmosPackagesStore.search('foo');
      var search = CosmosPackagesStore.get('search').getItems();
      expect(search.length).toEqual(this.packagesSearchFixture.packages.length);
    });

    it('should pass though query parameters', function () {
      RequestUtil.json = jasmine.createSpy('RequestUtil#json');
      CosmosPackagesStore.search('foo');
      expect(RequestUtil.json.mostRecentCall.args[0].data)
        .toEqual({query: 'foo'});
    });

    describe('dispatcher', function () {

      it('stores search when event is dispatched', function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
          data: [{gid: 'foo', bar: 'baz'}],
          query: 'foo'
        });

        var search = CosmosPackagesStore.get('search').getItems();
        expect(search[0].get('gid')).toEqual('foo');
        expect(search[0].get('bar')).toEqual('baz');
      });

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        CosmosPackagesStore.addChangeListener(
          EventTypes.COSMOS_SEARCH_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
          data: [{gid: 'foo', bar: 'baz'}],
          query: 'foo'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jasmine.createSpy('mockedFn');
        CosmosPackagesStore.addChangeListener(
          EventTypes.COSMOS_SEARCH_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_ERROR,
          data: 'error',
          query: 'foo'
        });

        expect(mockedFn.calls.length).toEqual(1);
        expect(mockedFn.calls[0].args).toEqual(['error', 'foo']);
      });

    });

  });

});
