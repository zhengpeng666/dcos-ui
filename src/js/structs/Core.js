import CompositeState from './CompositeState';
import Config from '../config/Config';
import SummaryList from './SummaryList';

let Core = {

  summary: new SummaryList({maxLength: Config.historyLength}),

  addState(data) {
    CompositeState.addState(data);
  },

  addMarathon(data) {
    CompositeState.addMarathon(data);
  },

  addSummary(data) {
    CompositeState.addSummary(data);
    this.summary.addSnapshot(data);
  },

  getLatest() {
    return CompositeState;
  }
};

module.exports = Core;
