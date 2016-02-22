const UnitHealthUtil = {

  getHealthSortFunction() {
    return function () {
      return function (a, b) {
        let aValue = a.getHealth().value * -1;
        let bValue = b.getHealth().value * -1;

        if (aValue === bValue) {
          let aTieBreak = a.get('id');
          let bTieBreak = b.get('id');

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
