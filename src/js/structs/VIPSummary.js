import Item from './Item';

module.exports = class VIPSummary extends Item {
  getApplicationReachabilityPercent() {
    return Number(this.get('application_reachability_pct'));
  }

  getFailLastMinute() {
    return Number(this.get('fail_last_minute'));
  }

  getFailPercent() {
    return Math.floor(this.getFailLastMinute() /
      this.getSuccessLastMinute() * 100);
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

  getVIP() {
    return this.get('vip');
  }

  getVIPString() {
    let {ip, port} = this.getVIP();

    return `${ip}:${port}`;
  }
};
