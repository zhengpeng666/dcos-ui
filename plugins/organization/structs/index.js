let SDK = require('../SDK').getSDK();

let {StateSummary, SummaryList} = SDK.get(['StateSummary', 'SummaryList']);
let {APPLICATION} = SDK.constants;

module.exports = {
  /**
   * Creates Mesos SummaryList from state
   * @return {SummaryList} Struct containing list of Mesos snapshots
   */
  getLatestSummaryList() {
    let summaryStates = this.getState('states');

    let items = summaryStates.map(function (snapshot) {
      snapshot = snapshot.snapshot;
      let date = snapshot.date;
      return new StateSummary({snapshot, date});
    });
    return new SummaryList({items});
  },

  getActiveServices() {
    return this.getLatestSummaryList()
      .lastSuccessful()
      .getServiceList()
      .getItems();
  },
  /**
   * Returns current state for prop in State tree
   * @param  {String} prop - Key for state in State tree
   * @return {any}      result from Store
   */
  getState(prop) {
    return SDK.Store
      .getState()[APPLICATION]
      .summary[prop];
  }
};
