import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../SDK').setSDK(SDK);

var Client = require('../Client');

describe('Client', function () {

  beforeEach(function () {
    this.clientFixture = {
      machine_reachability: true,
      application_reachability: true,
      ip: '10.10.11.13',
      p99_latency_ms: 30,
      success_last_minute: 481,
      fail_last_minute: 3
    };

    this.client = new Client(this.clientFixture);
  });

  describe('#getApplicationReachability', function () {

    it('returns a value of type boolean', function () {
      expect(typeof this.client.getApplicationReachability())
        .toEqual('boolean');
    });

    it('returns the value it was given', function () {
      expect(this.client.getApplicationReachability())
        .toEqual(this.clientFixture.application_reachability);
    });

  });

  describe('#getFailLastMinute', function () {

    it('returns a value of type number', function () {
      expect(typeof this.client.getFailLastMinute()).toEqual('number');
    });

    it('returns the value it was given', function () {
      expect(this.client.getFailLastMinute())
        .toEqual(this.clientFixture.fail_last_minute);
    });

  });

  describe('#getFailPercent', function () {

    it('returns a value of type number', function () {
      expect(typeof this.client.getFailPercent()).toEqual('number');
    });

    it('returns an integer of the failures in the last minute', function () {
      expect(this.client.getFailPercent()).toEqual(
        Math.floor(this.clientFixture.fail_last_minute /
          this.clientFixture.success_last_minute * 100)
      );
    });

  });

  describe('#getIP', function () {

    it('returns the value it was given', function () {
      expect(this.client.getIP()).toEqual(this.clientFixture.ip);
    });

  });

  describe('#getMachineReachability', function () {

    it('returns a value of type boolean', function () {
      expect(typeof this.client.getMachineReachability())
        .toEqual('boolean');
    });

    it('returns the value it was given', function () {
      expect(this.client.getMachineReachability())
        .toEqual(this.clientFixture.machine_reachability);
    });

  });

  describe('#getP99Latency', function () {

    it('returns a value of type number', function () {
      expect(typeof this.client.getP99Latency()).toEqual('number');
    });

    it('returns the value it was given', function () {
      expect(this.client.getP99Latency())
        .toEqual(this.clientFixture.p99_latency_ms);
    });

  });

  describe('#getSuccessLastMinute', function () {

    it('returns a value of type number', function () {
      expect(typeof this.client.getSuccessLastMinute()).toEqual('number');
    });

    it('returns the value it was given', function () {
      expect(this.client.getSuccessLastMinute())
        .toEqual(this.clientFixture.success_last_minute);
    });

  });

});
