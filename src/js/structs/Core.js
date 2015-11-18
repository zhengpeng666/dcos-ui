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
    return Object.assign(
      {},
      this.compositeStore.data.state,
      this.compositeStore.data.marathon
    );
  }

};

export default Core;
