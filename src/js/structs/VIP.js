import Item from './Item';

export default class VIP extends Item {
  getConnectionInfo() {
    let ip = this.get('ip');
    let port = this.get('port');
    let protocol = this.get('protocol');

    return {ip, port, protocol};
  }

  getBackends() {
    let backends = this.get('backends');
    let backendsCount = this.get('backendsCount');
    let applicationsReachable = this.get('applicationsReachable');
    let machinesReachable = this.get('machinesReachable');

    return {backends, backendsCount, applicationsReachable, machinesReachable};
  }
}
