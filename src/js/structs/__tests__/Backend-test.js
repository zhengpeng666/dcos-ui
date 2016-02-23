var Backend = require('../Backend');

describe('Backend', function () {

  beforeEach(function () {
    this.backendFixture = {
      ip: '10.10.11.12',
      port: 52342,
      machine_reachability_pct: 98,
      application_reachability_pct: 95,
      framework_id: 'afe04867ec7a3845145579a95f72eca7',
      task_id: 'b4b9b02e6f09a9bd760f388b67351e2b',
      p99_latency_ms: 30,
      success_last_minute: 481,
      fail_last_minute: 3
    };

    this.backend = new Backend(this.backendFixture);
  });

  describe('#getApplicationReachabilityPercent', function () {

    it('returns a value of type number', function () {
      expect(typeof this.backend.getApplicationReachabilityPercent())
        .toEqual('number');
    });

    it('returns the value it was given', function () {
      expect(this.backend.getApplicationReachabilityPercent())
        .toEqual(this.backendFixture.application_reachability_pct);
    });

  });

  describe('#getFailLastMinute', function () {

    it('returns a value of type number', function () {
      expect(typeof this.backend.getFailLastMinute()).toEqual('number');
    });

    it('returns the value it was given', function () {
      expect(this.backend.getFailLastMinute())
        .toEqual(this.backendFixture.fail_last_minute);
    });

  });

  describe('#getFailPercent', function () {

    it('returns a value of type number', function () {
      expect(typeof this.backend.getFailPercent()).toEqual('number');
    });

    it('returns an integer of the failures in the last minute', function () {
      expect(this.backend.getFailPercent()).toEqual(
        Math.floor(this.backendFixture.fail_last_minute /
          this.backendFixture.success_last_minute * 100)
      );
    });

  });

  describe('#getFrameworkID', function () {

    it('returns the value it was given', function () {
      expect(this.backend.getFrameworkID())
        .toEqual(this.backendFixture.framework_id);
    });

  });

  describe('#getIP', function () {

    it('returns the value it was given', function () {
      expect(this.backend.getIP()).toEqual(this.backendFixture.ip);
    });

  });

  describe('#getMachineReachabilityPercent', function () {

    it('returns a value of type number', function () {
      expect(typeof this.backend.getMachineReachabilityPercent())
        .toEqual('number');
    });

    it('returns the value it was given', function () {
      expect(this.backend.getMachineReachabilityPercent())
        .toEqual(this.backendFixture.machine_reachability_pct);
    });

  });

  describe('#getP99Latency', function () {

    it('returns a value of type number', function () {
      expect(typeof this.backend.getP99Latency()).toEqual('number');
    });

    it('returns the value it was given', function () {
      expect(this.backend.getP99Latency())
        .toEqual(this.backendFixture.p99_latency_ms);
    });

  });

  describe('#getPort', function () {

    it('returns a value of type number', function () {
      expect(typeof this.backend.getPort()).toEqual('number');
    });

    it('returns the value it was given', function () {
      expect(this.backend.getPort()).toEqual(this.backendFixture.port);
    });

  });

  describe('#getSuccessLastMinute', function () {

    it('returns a value of type number', function () {
      expect(typeof this.backend.getSuccessLastMinute()).toEqual('number');
    });

    it('returns the value it was given', function () {
      expect(this.backend.getSuccessLastMinute())
        .toEqual(this.backendFixture.success_last_minute);
    });

  });

  describe('#getTaskID', function () {

    it('returns the value it was given', function () {
      expect(this.backend.getTaskID())
        .toEqual(this.backendFixture.task_id);
    });

  });

});
