import Item from './Item';

module.exports = class Backend extends Item {
  getApplicationReachabilityPercent() {
    return Number(this.get('application_reachability_pct'));
  }

  getFailLastMinute() {
    return Number(this.get('fail_last_minute'));
  }

  getFailPercent() {
    return Math.floor(this.getFailLastMinute() / this.getSuccessLastMinute()
      * 100);
  }

  getFrameworkID() {
    return this.get('framework_id');
  }

  getIP() {
    return this.get('ip');
  }

  getMachineReachabilityPercent() {
    return Number(this.get('machine_reachability_pct'));
  }

  getP99Latency() {
    return Number(this.get('p99_latency_ms'));
  }

  getPort() {
    return Number(this.get('port'));
  }

  getSuccessLastMinute() {
    return Number(this.get('success_last_minute'));
  }

  getTaskID() {
    return this.get('task_id');
  }
};
