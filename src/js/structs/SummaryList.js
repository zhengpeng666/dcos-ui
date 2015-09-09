import List from "./List";
import MesosSummaryUtil from "../utils/MesosSummaryUtil";
import StateSummary from "./StateSummary";

export default class SummaryList extends List {
  constructor(options = {}) {
    super(...arguments);
    this.maxLength = options.maxLength || null;
  }

  add() {
    super.add(...arguments);

    if (this.maxLength && this.list.length > this.maxLength) {
      this.list.shift();
    }
  }

  addSnapshot(snapshot, date) {
    this.add(new StateSummary({snapshot, date}));
  }

  getResourceStatesForServiceIDs(ids) {
    let stateResources = this.getItems().map(function (state) {
      return {
        date: state.getSnapshotDate(),
        resources: state.getServiceList().filter({ids}).sumUsedResources(),
        totalResources: state.getTotalSlaveResources()
      };
    });

    return MesosSummaryUtil.stateResourcesToResourceStates(stateResources);
  }

  getResourceStatesForNodeIDs(ids) {
    let stateResources = this.getItems().map(function (state) {
      return {
        date: state.getSnapshotDate(),
        resources: state.getNodesList().filter({ids}).sumUsedResources(),
        totalResources: state.getTotalSlaveResources()
      };
    });

    return MesosSummaryUtil.stateResourcesToResourceStates(stateResources);
  }

}
