import Item from './Item';
import ServiceImages from '../constants/ServiceImages';

class UniversePackage extends Item {
  getIcons() {
    let resources = this.get('resources');
    if (resources && resources.images) {
      return resources.images;
    }

    return ServiceImages.NA_IMAGES;
  }
}

module.exports = UniversePackage;
