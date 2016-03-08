jest.dontMock('../NetworkPage');
jest.dontMock('../../components/VIPsTable');
jest.dontMock('../../stores/NetworkingVIPSummariesStore');
jest.dontMock('../../../../tests/_fixtures/networking/networking-vip-summaries.json');

var JestUtil = require('../../utils/JestUtil');

JestUtil.unMockStores(['NetworkingVIPSummariesStore']);
require('../../utils/StoreMixinConfig');

var React = require('react');
var ReactDOM = require('react-dom');

var NetworkingVIPSummariesStore =
  require('../../stores/NetworkingVIPSummariesStore');
var NetworkPage = require('../NetworkPage');
var VIPSummaryList = require('../../structs/VIPSummaryList');

const vipSummariesFixture =
  require('../../../../tests/_fixtures/networking/networking-vip-summaries.json');

describe('NetworkPage', function () {
  beforeEach(function () {
    this.getVIPSummaries = NetworkingVIPSummariesStore.getVIPSummaries;

    NetworkingVIPSummariesStore.getVIPSummaries = function () {
      return new VIPSummaryList({items: vipSummariesFixture.array});
    };

    this.container = document.createElement('div');
    this.instance = ReactDOM.render(<NetworkPage />, this.container);

    this.processedVIPSummaries = this.instance.getVIPSummaries();
  });

  afterEach(function () {
    NetworkingVIPSummariesStore.getVIPSummaries = this.getVIPSummaries;
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#getFilteredVIPSummaries', function () {
    it('should return an array of matched items', function () {
      var filteredSummaries = this.instance.getFilteredVIPSummaries(
        this.processedVIPSummaries, '1.2.3.4'
      );

      expect(filteredSummaries.length).toEqual(1);
    });
  });

  describe('#getVIPSummaries', function () {
    it('should return an object with the correct properties', function () {
      let vipSummaries = this.instance.getVIPSummaries();

      expect(Object.keys(vipSummaries[0])).toEqual([
        'fullVIP', 'vip', 'successLastMinute', 'failLastMinute',
        'failurePerecent', 'applicationReachabilityPercent',
        'machineReachabilityPercent', 'p99Latency'
      ]);
    });
  });

  describe('#handleSearchStringChange', function () {
    it('should set state with the new search string', function () {
      this.instance.handleSearchStringChange('foo');

      expect(this.instance.state.searchString).toEqual('foo');
    });
  });

  describe('#resetFilter', function () {
    it('should set state with an empty string', function () {
      this.instance.resetFilter();

      expect(this.instance.state.searchString).toEqual('');
    });
  });
});
