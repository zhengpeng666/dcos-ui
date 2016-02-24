import HealthSorting from '../constants/HealthSorting';
import UnitHealthStatus from '../constants/UnitHealthStatus';

const UnitHealthUtil = {

  // Accepts Items of type Node or HealthUnit and sorts by health
  getHealthSortFunction() {
    return function (tieBreakKey) {
      return function (a, b) {
        let aValue = HealthSorting[a.getHealth().title.toUpperCase()];
        let bValue = HealthSorting[b.getHealth().title.toUpperCase()];

        if (aValue === bValue) {
          let aTieBreak = a.get(tieBreakKey);
          let bTieBreak = b.get(tieBreakKey);

          if (aTieBreak > bTieBreak) {
            return 1;
          } else if (aTieBreak < bTieBreak) {
            return -1;
          } else {
            return 0;
          }
        }

        return aValue - bValue;
      };
    };
  },

  getHealth(health) {
    return Object.keys(UnitHealthStatus).reduce(function (prev, healthObj) {
      if (UnitHealthStatus[healthObj].value === health) {
        return UnitHealthStatus[healthObj];
      }
      return prev;
    }, null) || UnitHealthStatus.NA;
  }

};

module.exports = UnitHealthUtil;
