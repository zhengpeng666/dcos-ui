import _ from "underscore";

import ServicesList from "./ServicesList";

export default class CompositeState {

  constructor(data = {}) {
    this.data = data;
  }

  addState(data) {
    this.data.state = _.extend({}, this.data.state, data);
  }

  addMarathon(data) {
    this.data.marathon = _.extend({}, this.data.marathon, data);
  }

  getServiceList() {
    return new ServicesList(this.data);
  }

}
