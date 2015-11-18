import ServicesList from "./ServicesList";

export default class CompositeState {

  constructor(data = {}) {
    this.data = data;
  }

  addState(data) {
    this.data.state = Object.assign({}, this.data.state, data);
  }

  addMarathon(data) {
    this.data.marathon = Object.assign({}, this.data.marathon, data);
  }

  getServiceList() {
    return new ServicesList(this.data);
  }

}
