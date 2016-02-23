import HealthSorting from '../constants/HealthSorting';

const UnitHealthUtil = {

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
  }

};

module.exports = UnitHealthUtil;
