import Item from './Item';
import UnitHealthUtil from '../utils/UnitHealthUtil';

class HealthUnit extends Item {

  getHealth() {
    return UnitHealthUtil.getHealth(this.get('unit_health'));
  }

}

module.exports = HealthUnit;
