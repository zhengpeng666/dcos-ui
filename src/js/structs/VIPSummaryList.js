import List from './List';
import VIPSummary from './VIPSummary';

module.exports = class VIPSummaryList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of VIPSummary.
    this.list = this.list.map(function (item) {
      if (item instanceof VIPSummary) {
        return item;
      } else {
        return new VIPSummary(item);
      }
    });
  }
};
