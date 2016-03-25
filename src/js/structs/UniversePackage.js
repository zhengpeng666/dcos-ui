import Item from './Item';
import ServiceUtil from '../utils/ServiceUtil';
import Util from '../utils/Util';

class UniversePackage extends Item {
  getIcons() {
    return ServiceUtil.getServiceImages(
      this.get('images') ||
      Util.findNestedPropertyInObject(
        this.get('resourceDefinition'), 'images'
      ) ||
      Util.findNestedPropertyInObject(this.get('resource'), 'images')
    );
  }

  getScreenshots() {
    return Util.findNestedPropertyInObject(
      this.get('resource'),
      'images.screenshots'
    );
  }

  isPromoted() {
    return this.get('promoted');
  }
}

module.exports = UniversePackage;
