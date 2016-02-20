import UsersList from './UsersList';
import Item from './Item';

module.exports = class VIPSummary extends Item {
  getVIPString() {
    let vip = this.get('vip');

    return `${vip.ip}:${vip.port}`;
  }

  getSuccessLastMinute() {
    return Number(this.get('success_last_minute'));
  }

  getFailLastMinute() {
    return Number(this.get('fail_last_minute'));
  }

  getFailPercent() {
    return (this.getFailLastMinute() / this.getSuccessLastMinute() * 100)
      .toFixed(0);
  }

  getApplicationReachabilityPercent() {
    return this.get('application_reachability_pct');
  }

  getMachineReachabilityPercent() {
    return this.get('machine_reachability_pct');
  }

  getP99Latency() {
    return this.get('p99_latency_ms');
  }
};
