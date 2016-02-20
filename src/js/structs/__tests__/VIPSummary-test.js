var VIPSummary = require('../VIPSummary');

describe('VIPSummary', function () {

  beforeEach(function () {
    this.vipSummaryFixture = {
      vip: {
        port: 'foo',
        ip: 'bar',
        protocol: 'baz'
      },
      success_last_minute: '500',
      fail_last_minute: '400',
      application_reachability_pct: '300',
      machine_reachability_pct: '200',
      p99_latency_ms: '100'
    };

    this.vipSummary = new VIPSummary(this.vipSummaryFixture);
  });

  describe('#getApplicationReachabilityPercent', function () {

    it('returns a value of type number', function () {
      expect(typeof this.vipSummary.getApplicationReachabilityPercent())
        .toEqual('number');
    });

    it('returns an integer of the application reachability percentage in the ' +
      'last minute',
      function () {
      expect(this.vipSummary.getApplicationReachabilityPercent()).toEqual(
        Number(this.vipSummaryFixture.application_reachability_pct)
      );
    });

  });

  describe('#getFailLastMinute', function () {

    it('returns a value of type number', function () {
      expect(typeof this.vipSummary.getFailLastMinute()).toEqual('number');
    });

    it('returns an integer of the failures in the last minute', function () {
      expect(this.vipSummary.getFailLastMinute()).toEqual(
        Number(this.vipSummaryFixture.fail_last_minute)
      );
    });

  });

  describe('#getFailPercent', function () {

    it('returns a value of type number', function () {
      expect(typeof this.vipSummary.getFailPercent()).toEqual('number');
    });

    it('returns an integer of the failures in the last minute', function () {
      expect(this.vipSummary.getFailPercent()).toEqual(
        this.vipSummaryFixture.fail_last_minute /
          this.vipSummaryFixture.success_last_minute * 100
      );
    });

  });

  describe('#getMachineReachabilityPercent', function () {

    it('returns a value of type number', function () {
      expect(typeof this.vipSummary.getMachineReachabilityPercent())
        .toEqual('number');
    });

    it('returns an integer of the application reachability percentage in ' +
      'the last minute',
      function () {
      expect(this.vipSummary.getMachineReachabilityPercent()).toEqual(
        Number(this.vipSummaryFixture.machine_reachability_pct)
      );
    });

  });

  describe('#getP99Latency', function () {

    it('returns a value of type number', function () {
      expect(typeof this.vipSummary.getP99Latency())
        .toEqual('number');
    });

    it('returns an integer of the application reachability percentage in the ' +
      'last minute',
      function () {
      expect(this.vipSummary.getP99Latency()).toEqual(
        Number(this.vipSummaryFixture.p99_latency_ms)
      );
    });

  });

  describe('#getSuccessLastMinute', function () {

    it('returns a value of type number', function () {
      expect(typeof this.vipSummary.getSuccessLastMinute()).toEqual('number');
    });

    it('returns an integer of the successes in the last minute', function () {
      expect(this.vipSummary.getSuccessLastMinute()).toEqual(
        Number(this.vipSummaryFixture.success_last_minute)
      );
    });

  });

  describe('#getVIPString', function () {

    it('returns a concatenated string with IP and port', function () {
      expect(this.vipSummary.getVIPString()).toEqual(
        this.vipSummaryFixture.vip.ip + ':' + this.vipSummaryFixture.vip.port
      );
    });

  });

});
