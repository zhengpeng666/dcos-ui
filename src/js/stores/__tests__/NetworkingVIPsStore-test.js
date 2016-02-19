jest.dontMock('../NetworkingVIPsStore');
jest.dontMock('../../config/Config');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/NetworkingActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../../../tests/_fixtures/networking/networking-vips.json');

var _ = require('underscore');

var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../events/AppDispatcher');
var Config = require('../../config/Config');
var EventTypes = require('../../constants/EventTypes');
var NetworkingVIPsStore = require('../NetworkingVIPsStore');
var RequestUtil = require('../../utils/RequestUtil');
var vipsFixture = require('../../../../tests/_fixtures/networking/networking-vips.json');

describe('NetworkingVIPsStore', function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(vipsFixture);
    };
    this.vipsFixture = _.clone(vipsFixture);
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  it('should return all of the VIPs it was given', function () {
    Config.useFixtures = true;
    NetworkingVIPsStore.fetchVIPs();
    var vips = NetworkingVIPsStore.get('vips');

    expect(vips.length).toEqual(this.vipsFixture.array.length);
  });

  describe('processVIPs', function () {

    it('stores VIPs when event is dispatched', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIPS_SUCCESS,
        data: [{ip: 'foo', port: 'bar', protocol: 'baz'}]
      });

      var vips = NetworkingVIPsStore.get('vips');
      expect(vips[0].ip).toEqual('foo');
      expect(vips[0].port).toEqual('bar');
      expect(vips[0].protocol).toEqual('baz');
    });

    it('dispatches the correct event upon VIP request success', function () {
      var mockedFn = jest.genMockFunction();
      NetworkingVIPsStore.addChangeListener(EventTypes.NETWORKING_VIPS_CHANGE, mockedFn);
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIPS_SUCCESS,
        data: [{ip: 'foo', port: 'bar', protocol: 'baz'}]
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

  });

  describe('processVIPsError', function () {

    it('dispatches the correct event upon VIP request error', function () {
      var mockedFn = jasmine.createSpy();
      NetworkingVIPsStore.addChangeListener(
        EventTypes.NETWORKING_VIPS_REQUEST_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIPS_ERROR,
        data: 'foo'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo']);
    });

  });

  describe('processVIPDetail', function () {

    it('stores VIP detail in a hash with the VIP as the key', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_SUCCESS,
        data: {qux: 'quux'},
        vip: 'foo:bar:baz'
      });

      var vipDetails = NetworkingVIPsStore.get('vipDetail');
      expect(vipDetails['foo:bar:baz']).not.toBeNull();
    });

    it('stores VIP detail when event is dispatched', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_SUCCESS,
        data: {qux: 'quux', grault: 'garply', waldo: 'fred'},
        vip: 'foo:bar:baz'
      });

      var vipDetails = NetworkingVIPsStore.get('vipDetail');
      expect(vipDetails['foo:bar:baz']).toEqual({
        qux: 'quux',
        grault: 'garply',
        waldo: 'fred'
      });
    });

    it('dispatches the correct event upon VIP detail request success',
      function () {
      var mockedFn = jasmine.createSpy();
      NetworkingVIPsStore.addChangeListener(
        EventTypes.NETWORKING_VIP_DETAIL_CHANGE,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_SUCCESS,
        data: {qux: 'quux', grault: 'garply', waldo: 'fred'},
        vip: 'foo:bar:baz'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo:bar:baz']);
    });

  });

  describe('processVIPDetailError', function () {

    it('dispatches the correct event upon VIP detail request error', function () {
      var mockedFn = jasmine.createSpy();
      NetworkingVIPsStore.addChangeListener(
        EventTypes.NETWORKING_VIP_DETAIL_REQUEST_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_ERROR,
        data: 'foo',
        vip: 'foo:bar:baz'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo:bar:baz', 'foo']);
    });

  });

});
