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

  getActiveNodesByState() {
    return this.getItems().map(function (state) {
      return {
        date: state.getSnapshotDate(),
        slavesCount: state.getActiveSlaves().length
      };
    });
  }

  getActiveServices() {
    // finds last StateSummary with successful snapshot
    let stateResources = this.getItems();
    for (let i = stateResources.length - 1; i >= 0; i--) {
      if (stateResources[i].isSnapshotSuccessful()) {
        return stateResources[i].getServiceList();
      }
    }
    return null;
  }

  getResourceStatesForServiceIDs(ids) {
    let stateResources = this.getItems().map(function (state) {
      return {
        date: state.getSnapshotDate(),
        resources: state.getServiceList().filter({ids}).sumUsedResources(),
        totalResources: state.getSlaveTotalResources()
      };
    });

    return MesosSummaryUtil.stateResourcesToResourceStates(stateResources);
  }

  getResourceStatesForNodeIDs(ids) {
    let stateResources = this.getItems().map(function (state) {
      return {
        date: state.getSnapshotDate(),
        resources: state.getNodesList().filter({ids}).sumUsedResources(),
        totalResources: state.getNodesList().filter({ids}).sumResources()
      };
    });

    return MesosSummaryUtil.stateResourcesToResourceStates(stateResources);
  }

}
