jest.dontMock('../NetworkingBackendConnectionsStore');
jest.dontMock('../../config/Config');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/NetworkingActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../utils/RequestUtil');
jest.dontMock('../../utils/Util');
jest.dontMock('../../../../tests/_fixtures/networking/networking-backend-connections.json');

var _ = require('underscore');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../events/AppDispatcher');
var Config = require('../../config/Config');
var EventTypes = require('../../constants/EventTypes');
var NetworkingBackendConnectionsStore = require('../NetworkingBackendConnectionsStore');
var RequestUtil = require('../../utils/RequestUtil');
var backendConnections = require('../../../../tests/_fixtures/networking/networking-backend-connections.json');

describe('NetworkingBackendConnectionsStore', function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(backendConnections);
    };
    this.backendConnections = _.clone(backendConnections);
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  it('should return the data it was given', function () {
    Config.useFixtures = true;
    NetworkingBackendConnectionsStore.fetchVIPBackendConnections('foo', 'bar', 'baz');
    var backendConnections = NetworkingBackendConnectionsStore.get('backendConnections');

    expect(backendConnections).toEqual(
      {'foo:bar:baz': this.backendConnections}
    );
  });

  describe('processBackendConnections', function () {

    it('stores backend connection data in a hash with the VIP as the key',
      function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS,
        data: {qux: 'quux'},
        vip: 'foo:bar:baz'
      });

      var vipDetails = NetworkingBackendConnectionsStore.get('backendConnections');
      expect(vipDetails['foo:bar:baz']).not.toBeNull();
    });

    it('stores backend connection data when event is dispatched', function () {
      AppDispatcher.handleServerAction({
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
      AppDispatcher.handleServerAction({
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
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_ERROR,
        data: 'foo',
        vip: 'foo:bar:baz'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo', 'foo:bar:baz']);
    });

  });

});
