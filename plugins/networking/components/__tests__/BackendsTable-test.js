jest.dontMock('../BackendsTable');
jest.dontMock('../../stores/NetworkingVIPsStore');
jest.dontMock('../../../../tests/_fixtures/networking/networking-vip-detail.json');

var JestUtil = require('../../../../src/js/utils/JestUtil');

JestUtil.unMockStores(['NetworkingVIPsStore']);
require('../../../../src/js/utils/StoreMixinConfig');

var React = require('react');
var ReactDOM = require('react-dom');

var BackendsTable = require('../BackendsTable');
var NetworkingVIPsStore =
require('../../stores/NetworkingVIPsStore');
var VIPDetail = require('../../structs/VIPDetail');

const vipDetailFixture =
  require('../../../../tests/_fixtures/networking/networking-vip-detail.json');

describe('BackendsTable', function () {
  beforeEach(function () {
    this.backends = new VIPDetail(vipDetailFixture).getBackends();

    this.container = document.createElement('div');
    this.instance = ReactDOM.render(<BackendsTable backends={this.backends} />,
      this.container);

    this.processedBackends = this.instance.processBackends(this.backends);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#alignTableCellRight', function () {
    it('should return true for the specified column props', function () {
      var rightAlignedProps = ['successLastMinute', 'failLastMinute',
        'p99Latency'];

      let alignTableCellRight = this.instance.alignTableCellRight;
      rightAlignedProps.forEach(function (prop) {
        expect(alignTableCellRight(prop)).toEqual(true);
      });
    });

    it('should return false for the unspecified props', function () {
      expect(this.instance.alignTableCellRight('foo')).toEqual(false);
    });
  });

  describe('#handleSearchStringChange', function () {
    it('should set state with the new search string', function () {
      this.instance.handleSearchStringChange('foo');

      expect(this.instance.state.searchString).toEqual('foo');
    });
  });

  describe('#hideColumnAtMini', function () {
    it('should return true for the specified column props', function () {
      var hiddenColumnsAtMini = ['failurePerecent',
        'applicationReachabilityPercent', 'machineReachabilityPercent'];

      let hideColumnAtMini = this.instance.hideColumnAtMini;
      hiddenColumnsAtMini.forEach(function (prop) {
        expect(hideColumnAtMini(prop)).toEqual(true);
      });
    });

    it('should return false for the unspecified props', function () {
      expect(this.instance.hideColumnAtMini('foo')).toEqual(false);
    });
  });

  describe('#processBackends', function () {
    it('should return an array of objects with the correct properties',
      function () {

      expect(Object.keys(this.processedBackends[0])).toEqual([
        'ip', 'port', 'successLastMinute', 'failLastMinute', 'p99Latency',
        'taskID', 'frameworkID'
      ]);
    });
  });

  describe('#renderPercentage', function () {
    it('should return the specified key\'s value from an object with the ' +
      'percent symbol appended', function () {
      let percentage = this.instance.renderPercentage('foo', {foo: 'bar'});
      expect(percentage).toEqual('bar%');
    });
  });
});
