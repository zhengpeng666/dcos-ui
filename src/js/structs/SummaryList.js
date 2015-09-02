import StateSummary from "./StateSummary";
import List from "./List";

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
}
