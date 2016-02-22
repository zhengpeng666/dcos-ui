import List from './List';
import HealthUnit from './HealthUnit';

class HealthUnitsList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of HealthUnit.
    this.list = this.list.map(function (item) {
      if (item instanceof HealthUnit) {
        return item;
      } else {
        return new HealthUnit(item);
      }
    });
  }
}

module.exports = HealthUnitsList;
