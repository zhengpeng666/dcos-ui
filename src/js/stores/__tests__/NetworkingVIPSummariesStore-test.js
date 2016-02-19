jest.dontMock('../NetworkingVIPSummariesStore');
jest.dontMock('../../config/Config');
jest.dontMock('../../events/AppDispatcher');
jest.dontMock('../../events/NetworkingActions');
jest.dontMock('../../mixins/GetSetMixin');
jest.dontMock('../../../../tests/_fixtures/networking/networking-vip-summaries.json');

var _ = require('underscore');

var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../events/AppDispatcher');
var Config = require('../../config/Config');
var EventTypes = require('../../constants/EventTypes');
var NetworkingVIPSummariesStore = require('../NetworkingVIPSummariesStore');
var RequestUtil = require('../../utils/RequestUtil');
var vipSummariesFixture = require('../../../../tests/_fixtures/networking/networking-vip-summaries.json');

describe('NetworkingVIPSummariesStore', function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(vipSummariesFixture);
    };
    this.vipSummaries = _.clone(vipSummariesFixture);
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  it('should return all of the VIP summaries it was given', function () {
    Config.useFixtures = true;
    NetworkingVIPSummariesStore.fetchVIPSummaries();
    var vipSummaries = NetworkingVIPSummariesStore.get('vipSummaries');

    expect(vipSummaries.length).toEqual(this.vipSummaries.array.length);
  });

  describe('processVIPSummaries', function () {

    it('stores VIPs when event is dispatched', function () {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_SUCCESS,
        data: [{vip: {ip: 'foo', port: 'bar', protocol: 'baz'}}]
      });

      var vipSummaries = NetworkingVIPSummariesStore.get('vipSummaries');

      expect(vipSummaries[0].vip.ip).toEqual('foo');
      expect(vipSummaries[0].vip.port).toEqual('bar');
      expect(vipSummaries[0].vip.protocol).toEqual('baz');
    });

    it('dispatches the correct event upon VIP request success', function () {
      var mockedFn = jest.genMockFunction();
      NetworkingVIPSummariesStore.addChangeListener(
        EventTypes.NETWORKING_VIP_SUMMARIES_CHANGE,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_SUCCESS,
        data: [{vip: {ip: 'foo', port: 'bar', protocol: 'baz'}}]
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

  });

  describe('processVIPSummariesError', function () {

    it('dispatches the correct event upon VIP request error', function () {
      var mockedFn = jasmine.createSpy();
      NetworkingVIPSummariesStore.addChangeListener(
        EventTypes.NETWORKING_VIP_SUMMARIES_ERROR,
        mockedFn
      );
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_ERROR,
        data: 'foo'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo']);
    });

  });

});
