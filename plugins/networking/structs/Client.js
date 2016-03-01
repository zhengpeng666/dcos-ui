import Item from '../../../src/js/structs/Item';

module.exports = class Client extends Item {
  getApplicationReachability() {
    return this.get('application_reachability');
  }

  getFailLastMinute() {
    return Number(this.get('fail_last_minute'));
  }

  getFailPercent() {
    return Math.floor(this.getFailLastMinute() / this.getSuccessLastMinute()
      * 100);
  }

  getMachineReachability() {
    return this.get('machine_reachability');
  }

  getP99Latency() {
    return Number(this.get('p99_latency_ms'));
  }

  getSuccessLastMinute() {
    return Number(this.get('success_last_minute'));
  }
};
