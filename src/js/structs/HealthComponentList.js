import List from './List';
import HealthComponent from './HealthComponent';

class HealthComponentList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of HealthComponent.
    this.list = this.list.map(function (item) {
      if (item instanceof HealthComponent) {
        return item;
      } else {
        return new HealthComponent(item);
      }
    });
  }
}

module.exports = HealthComponentList;
