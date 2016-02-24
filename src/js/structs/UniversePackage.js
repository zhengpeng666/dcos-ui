import Item from './Item';
import ServiceUtil from '../utils/ServiceUtil';

class UniversePackage extends Item {
  getIcons() {
    let images;
    let resources = this.get('resources');
    if (resources && resources.images) {
      images = resources.images;
    }

    return ServiceUtil.getServiceImages(images);
  }
}

module.exports = UniversePackage;
