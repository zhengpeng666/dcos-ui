import _ from 'underscore';

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

  /**
   * Get UnitHealthStatus object representing the health of an Item
   * @param {Number} health - The health integer from Component Health API.
   * @return {Object}       - UnitHealthStatus object.
   */
  getHealth(health) {
    return Object.keys(UnitHealthStatus).reduce(function (prev, healthObj) {
      if (UnitHealthStatus[healthObj].value === health) {
        return UnitHealthStatus[healthObj];
      }
      return prev;
    }, null) || UnitHealthStatus.NA;
  },

  /**
   * Filter a List by UnitHealth.
   * @param {Array}  items  - Array of Nodes or HealthUnits to be filtered.
   * @param {String} health - Health title to filter by.
   * @return {Array}        - Array of filtered objects.
   */
  filterByHealth(items, health) {
    health = health.toLowerCase();

    if (health === 'all') {
      return items;
    }

    return _.filter(items, function (datum) {
      return datum.getHealth().title.toLowerCase() === health;
    });
  }

};

module.exports = UnitHealthUtil;
