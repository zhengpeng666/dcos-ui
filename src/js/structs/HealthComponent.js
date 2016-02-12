import Item from './Item';
import ComponentHealthStatus from '../constants/ComponentHealthStatus';

class HealthComponent extends Item {

  getHealth() {
    let health = this.get('health');

    return Object.keys(ComponentHealthStatus).reduce(function (prev, healthObj) {
      if (ComponentHealthStatus[healthObj].value === health) {
        return ComponentHealthStatus[healthObj];
      }
      return prev;
    }, null) || ComponentHealthStatus.NA;
  }
}

module.exports = HealthComponent;
