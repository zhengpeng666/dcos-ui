import Item from './Item';

module.exports = class VIPSummary extends Item {
  getApplicationReachabilityPercent() {
    return Number(this.get('application_reachability_pct'));
  }

  getFailLastMinute() {
    return Number(this.get('fail_last_minute'));
  }

  getFailPercent() {
    return Number((this.getFailLastMinute() / this.getSuccessLastMinute() * 100)
      .toFixed(0));
  }

  getMachineReachabilityPercent() {
    return Number(this.get('machine_reachability_pct'));
  }

  getP99Latency() {
    return Number(this.get('p99_latency_ms'));
  }

  getSuccessLastMinute() {
    return Number(this.get('success_last_minute'));
  }

  getVIPString() {
    let vip = this.get('vip');

    return `${vip.ip}:${vip.port}`;
  }
};
