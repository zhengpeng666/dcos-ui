import _ from "underscore";

import CompositeState from "./CompositeState";
import SummaryList from "./SummaryList";

var Core = {

  compositeState: new CompositeState(),

  summary: new SummaryList(),

  addState(data) {
    this.compositeState.addState(data);
  },

  addMarathon(data) {
    this.compositeState.addMarathon(data);
  },

  addSummary(data) {
    this.summary.addSnapshot(data);
  },

  getLatest() {
    return _.extend(
      {},
      this.compositeState.data.state,
      this.compositeState.data.marathon
    );
  }

};

export default Core;
