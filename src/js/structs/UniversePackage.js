import Item from './Item';
import ServiceUtil from '../utils/ServiceUtil';
import Util from '../utils/Util';

class UniversePackage extends Item {
  getIcons() {
    return ServiceUtil.getServiceImages(
      Util.findNestedPropertyInObject(this.get('resource'), 'images')
    );
  }

  getScreenshots() {
    return Util.findNestedPropertyInObject(
      this.get('resource'),
      'images.screenshots'
    );
  }
}

module.exports = UniversePackage;
