import Item from './Item';
import UnitHealthStatus from '../constants/UnitHealthStatus';

class HealthUnit extends Item {
  getHealth() {
    let health = this.get('health');

    return Object.keys(UnitHealthStatus).reduce(function (prev, healthObj) {
      if (UnitHealthStatus[healthObj].value === health) {
        return UnitHealthStatus[healthObj];
      }
      return prev;
    }, null) || UnitHealthStatus.NA;
  }
}

module.exports = HealthUnit;
