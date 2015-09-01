var _ = require("underscore");

var MesosSummaryUtil = require("../utils/MesosSummaryUtil");

export default class StateSummary {
  constructor(options = {}) {
    this.snapshot = {
      frameworks: [],
      slaves: []
    };

    this.metadata = {
      date: undefined,
      used_resources: {cpus: 0, mem: 0, disk: 0},
      total_resources: {cpus: 0, mem: 0, disk: 0}
    };

    var snapshot = options.snapshot || this.snapshot;
    // Only place where we normalize server data
    // we may be able to remove this, but it needs testing
    snapshot.slaves = snapshot.slaves || [];
    this.snapshot = snapshot;

    this.metadata.date = options.date || Date.now();
    // Store computed data – this is something we may not need to store
    this.metadata.totalResources = MesosSummaryUtil.sumResources(
      // We may only want to get the active slaves...
      _.pluck(this.snapshot.slaves, "resources")
    );
    this.metadata.usedResources = MesosSummaryUtil.sumResources(
      _.pluck(this.snapshot.frameworks, "used_resources")
    );
  }

  getActiveSlaves() {
    return _.where(this.snapshot.slaves, {active: true}).length;
  }

  getSnapshotDate() {
    return this.metadata.date;
  }

  getTotalSlaveResources() {
    return this.metadata.totalResources;
  }

  getFrameworkUsedResources() {
    return this.metadata.usedResources;
  }
}
