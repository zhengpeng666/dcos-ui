jest.dontMock('../../../../tests/_fixtures/networking/networking-backend-connections.json');

var _ = require('underscore');

import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('networking', {enabled: true});

require('../../SDK').setSDK(SDK);

let {RequestUtil, Config} = SDK.get(['RequestUtil', 'Config']);

var ActionTypes = require('../../constants/ActionTypes');
var backendConnectionsFixture = require('../../../../tests/_fixtures/networking/networking-backend-connections.json');
var EventTypes = require('../../constants/EventTypes');
var NetworkingBackendConnectionsStore = require('../NetworkingBackendConnectionsStore');
var NetworkingReducer = require('../../Reducer');

PluginTestUtils.addReducer('networking', NetworkingReducer);

describe('NetworkingBackendConnectionsStore', function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(backendConnectionsFixture);
    };
    this.backendConnections = _.clone(backendConnectionsFixture);
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  it('should return the data it was given', function () {
    this.useFixtures = Config.useFixtures;
    Config.useFixtures = true;

    NetworkingBackendConnectionsStore.fetchVIPBackendConnections('foo', 'bar', 'baz');
    var backendConnections = NetworkingBackendConnectionsStore.get('backendConnections');

    expect(backendConnections).toEqual(
      {'foo:bar:baz': this.backendConnections}
    );

    Config.useFixtures = this.useFixtures;
  });

  describe('processBackendConnections', function () {

    it('stores backend connection data in a hash with the VIP as the key',
      function () {
      SDK.dispatch({
        type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS,
        data: {qux: 'quux'},
        vip: 'foo:bar:baz'
      });

      var vipDetails = NetworkingBackendConnectionsStore.get('backendConnections');
      expect(vipDetails['foo:bar:baz']).not.toBeNull();
    });

    it('stores backend connection data when event is dispatched', function () {
      SDK.dispatch({
        type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS,
        data: {qux: 'quux', grault: 'garply', waldo: 'fred'},
        vip: 'foo:bar:baz'
      });

      var vipDetails =
        NetworkingBackendConnectionsStore.get('backendConnections');
      expect(vipDetails['foo:bar:baz']).toEqual({
        qux: 'quux',
        grault: 'garply',
        waldo: 'fred'
      });
    });

    it('dispatches the correct event upon request success', function () {
      var mockedFn = jasmine.createSpy();
      NetworkingBackendConnectionsStore.addChangeListener(
        EventTypes.NETWORKING_BACKEND_CONNECTIONS_CHANGE,
        mockedFn
      );
      SDK.dispatch({
        type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS,
        data: {qux: 'quux', grault: 'garply', waldo: 'fred'},
        vip: 'foo:bar:baz'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo:bar:baz']);
    });

  });

  describe('processBackendConnectionsError', function () {

    it('dispatches the correct event upon request error', function () {
      var mockedFn = jasmine.createSpy();
      NetworkingBackendConnectionsStore.addChangeListener(
        EventTypes.NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR,
        mockedFn
      );
      SDK.dispatch({
        type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_ERROR,
        data: 'foo',
        vip: 'foo:bar:baz'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo', 'foo:bar:baz']);
    });

  });

});
