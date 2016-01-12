import CompositeState from './CompositeState';
import Config from '../config/Config';
import SummaryList from './SummaryList';

let Core = {
  compositeState: new CompositeState(),

  summary: new SummaryList({maxLength: Config.historyLength}),

  addState(data) {
    this.compositeState.addState(data);
  },

  addMarathon(data) {
    this.compositeState.addMarathon(data);
  },

  addSummary(data) {
    this.compositeState.addSummary(data);
    this.summary.addSnapshot(data);
  },

  getLatest() {
    return this.compositeState;
  }
};

module.exports = Core;
