import Item from './Item';

module.exports = class Backend extends Item {
  getApplicationReachabilityPercent() {
    return Number(this.get('application_reachability_pct') || 0);
  }

  getFailLastMinute() {
    return Number(this.get('fail_last_minute') || 0);
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
    return Number(this.get('machine_reachability_pct') || 0);
  }

  getP99Latency() {
    return Number(Number(this.get('p99_latency_ms') || 0).toFixed(2));
  }

  getPort() {
    return Number(this.get('port') || 0);
  }

  getSuccessLastMinute() {
    return Number(this.get('success_last_minute') || 0);
  }

  getTaskID() {
    return this.get('task_id');
  }
};
