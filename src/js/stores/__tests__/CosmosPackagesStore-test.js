jest.dontMock('../CosmosPackagesStore');
jest.dontMock('../../config/Config');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/CosmosPackagesActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('./fixtures/MockPackagesSearchResponse.json');

var _ = require('underscore');

var AppDispatcher = require('../../events/AppDispatcher');
var Config = require('../../config/Config');
import {
  COSMOS_DESCRIBE_CHANGE,
  COSMOS_DESCRIBE_ERROR,
  COSMOS_INSTALL_ERROR,
  COSMOS_INSTALL_SUCCESS,
  COSMOS_LIST_CHANGE,
  COSMOS_LIST_ERROR,
  COSMOS_SEARCH_CHANGE,
  COSMOS_SEARCH_ERROR,
  COSMOS_UNINSTALL_ERROR,
  COSMOS_UNINSTALL_SUCCESS
} from '../../constants/EventTypes';
var CosmosPackagesStore = require('../CosmosPackagesStore');
var packageDescribeFixture =
  require('./fixtures/MockPackageDescribeResponse.json');
var packagesListFixture = require('./fixtures/MockPackagesListResponse.json');
var packagesSearchFixture =
  require('./fixtures/MockPackagesSearchResponse.json');
var RequestUtil = require('../../utils/RequestUtil');
import {
  REQUEST_COSMOS_PACKAGES_LIST_ERROR,
  REQUEST_COSMOS_PACKAGES_LIST_SUCCESS,
  REQUEST_COSMOS_PACKAGES_SEARCH_ERROR,
  REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
  REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR,
  REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS,
  REQUEST_COSMOS_PACKAGE_INSTALL_ERROR,
  REQUEST_COSMOS_PACKAGE_INSTALL_SUCCESS,
  REQUEST_COSMOS_PACKAGE_UNINSTALL_ERROR,
  REQUEST_COSMOS_PACKAGE_UNINSTALL_SUCCESS
} from '../../constants/ActionTypes';
var UniversePackage = require('../../structs/UniversePackage');
var UniverseInstalledPackagesList =
  require('../../structs/UniverseInstalledPackagesList');
var UniversePackagesList = require('../../structs/UniversePackagesList');

describe('CosmosPackagesStore', function () {

  beforeEach(function () {
    this.configUseFixture = Config.useFixtures;
    Config.useFixtures = true;
  });

  afterEach(function () {
    Config.useFixtures = this.configUseFixture;
  });

  describe('#fetchAvailablePackages', function () {

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
      CosmosPackagesStore.fetchAvailablePackages('foo');
      var availablePackages = CosmosPackagesStore.getAvailablePackages();
      expect(availablePackages instanceof UniversePackagesList).toBeTruthy();
    });

    it('should return all of the availablePackages it was given', function () {
      CosmosPackagesStore.fetchAvailablePackages('foo');
      var availablePackages =
        CosmosPackagesStore.getAvailablePackages().getItems();
      expect(availablePackages.length)
        .toEqual(this.packagesSearchFixture.packages.length);
    });

    it('should pass though query parameters', function () {
      RequestUtil.json = jasmine.createSpy('RequestUtil#json');
      CosmosPackagesStore.fetchAvailablePackages('foo');
      expect(JSON.parse(RequestUtil.json.mostRecentCall.args[0].data))
        .toEqual({query: 'foo'});
    });

    describe('dispatcher', function () {

      it('stores availablePackages when event is dispatched', function () {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
          data: [{gid: 'foo', bar: 'baz'}],
          query: 'foo'
        });

        var availablePackages =
          CosmosPackagesStore.getAvailablePackages().getItems();
        expect(availablePackages[0].get('gid')).toEqual('foo');
        expect(availablePackages[0].get('bar')).toEqual('baz');
      });

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        CosmosPackagesStore.addChangeListener(
          COSMOS_SEARCH_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
          data: [{gid: 'foo', bar: 'baz'}],
          query: 'foo'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jasmine.createSpy('mockedFn');
        CosmosPackagesStore.addChangeListener(
          COSMOS_SEARCH_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_SEARCH_ERROR,
          data: 'error',
          query: 'foo'
        });

        expect(mockedFn.calls.length).toEqual(1);
        expect(mockedFn.calls[0].args).toEqual(['error', 'foo']);
      });

    });

  });

  describe('#fetchPackageDescription', function () {

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
      CosmosPackagesStore.fetchPackageDescription('foo', 'bar');
      var packageDetails = CosmosPackagesStore.getPackageDetails();
      expect(packageDetails instanceof UniversePackage).toBeTruthy();
    });

    it('should return the packageDetails it was given', function () {
      CosmosPackagesStore.fetchPackageDescription('foo', 'bar');
      var pkg = CosmosPackagesStore.getPackageDetails();
      expect(pkg.get('package').name)
        .toEqual(this.packageDescribeFixture.package.name);
      expect(pkg.get('package').version)
        .toEqual(this.packageDescribeFixture.package.version);
    });

    it('should pass though query parameters', function () {
      RequestUtil.json = jasmine.createSpy('RequestUtil#json');
      CosmosPackagesStore.fetchPackageDescription('foo', 'bar');
      expect(JSON.parse(RequestUtil.json.mostRecentCall.args[0].data))
        .toEqual({packageName: 'foo', packageVersion: 'bar'});
    });

    describe('dispatcher', function () {

      it('stores packageDetails when event is dispatched', function () {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS,
          data: {gid: 'foo', bar: 'baz'},
          packageName: 'foo',
          packageVersion: 'bar'
        });

        var pkg = CosmosPackagesStore.getPackageDetails();
        expect(pkg.get('gid')).toEqual('foo');
        expect(pkg.get('bar')).toEqual('baz');
      });

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        CosmosPackagesStore.addChangeListener(
          COSMOS_DESCRIBE_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS,
          data: {gid: 'foo', bar: 'baz'},
          packageName: 'foo',
          packageVersion: 'bar'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jasmine.createSpy('mockedFn');
        CosmosPackagesStore.addChangeListener(
          COSMOS_DESCRIBE_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR,
          data: 'error',
          packageName: 'foo',
          packageVersion: 'bar'
        });

        expect(mockedFn.calls.length).toEqual(1);
        expect(mockedFn.calls[0].args).toEqual(['error', 'foo', 'bar']);
      });

    });

  });

  describe('#fetchInstalledPackages', function () {

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

    it('should return an instance of UniverseInstalledPackagesList', function () {
      CosmosPackagesStore.fetchInstalledPackages('foo', 'bar');
      var installedPackages = CosmosPackagesStore.getInstalledPackages();
      expect(installedPackages instanceof UniverseInstalledPackagesList)
        .toBeTruthy();
    });

    it('should return all of the installedPackages it was given', function () {
      CosmosPackagesStore.fetchInstalledPackages('foo', 'bar');
      var installedPackages =
        CosmosPackagesStore.getInstalledPackages().getItems();
      expect(installedPackages.length)
        .toEqual(this.packagesListFixture.packages.length);
    });

    it('should pass though query parameters', function () {
      RequestUtil.json = jasmine.createSpy('RequestUtil#json');
      CosmosPackagesStore.fetchInstalledPackages('foo', 'bar');
      expect(JSON.parse(RequestUtil.json.mostRecentCall.args[0].data))
        .toEqual({packageName: 'foo', appId: 'bar'});
    });

    describe('dispatcher', function () {

      it('stores installedPackages when event is dispatched', function () {
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_LIST_SUCCESS,
          data: [{packageInformation: {gid: 'foo', bar: 'baz'}}],
          packageName: 'foo',
          appId: 'bar'
        });

        var installedPackages =
          CosmosPackagesStore.getInstalledPackages().getItems();
        expect(installedPackages[0].get('gid')).toEqual('foo');
        expect(installedPackages[0].get('bar')).toEqual('baz');
      });

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        CosmosPackagesStore.addChangeListener(
          COSMOS_LIST_CHANGE,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_LIST_SUCCESS,
          data: [{packageInformation: {gid: 'foo', bar: 'baz'}}],
          packageName: 'foo',
          appId: 'bar'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jasmine.createSpy('mockedFn');
        CosmosPackagesStore.addChangeListener(
          COSMOS_LIST_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGES_LIST_ERROR,
          data: 'error',
          packageName: 'foo',
          appId: 'bar'
        });

        expect(mockedFn.calls.length).toEqual(1);
        expect(mockedFn.calls[0].args).toEqual(['error', 'foo', 'bar']);
      });

    });

  });

  describe('#installPackage', function () {

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

    describe('dispatcher', function () {

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        CosmosPackagesStore.addChangeListener(
          COSMOS_INSTALL_SUCCESS,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_INSTALL_SUCCESS,
          data: [{foo: 'bar'}],
          packageName: 'foo',
          packageVersion: 'bar'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jasmine.createSpy('mockedFn');
        CosmosPackagesStore.addChangeListener(
          COSMOS_INSTALL_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_INSTALL_ERROR,
          data: 'error',
          packageName: 'foo',
          packageVersion: 'bar'
        });

        expect(mockedFn.calls.length).toEqual(1);
        expect(mockedFn.calls[0].args).toEqual(['error', 'foo', 'bar']);
      });

    });

  });

  describe('#uninstallPackage', function () {

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

    describe('dispatcher', function () {

      it('dispatches the correct event upon success', function () {
        var mockedFn = jest.genMockFunction();
        CosmosPackagesStore.addChangeListener(
          COSMOS_UNINSTALL_SUCCESS,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_UNINSTALL_SUCCESS,
          data: [{foo: 'bar'}],
          packageName: 'foo',
          packageVersion: 'bar'
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jasmine.createSpy('mockedFn');
        CosmosPackagesStore.addChangeListener(
          COSMOS_UNINSTALL_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: REQUEST_COSMOS_PACKAGE_UNINSTALL_ERROR,
          data: 'error',
          packageName: 'foo',
          packageVersion: 'bar'
        });

        expect(mockedFn.calls.length).toEqual(1);
        expect(mockedFn.calls[0].args).toEqual(['error', 'foo', 'bar']);
      });

    });

  });

});
