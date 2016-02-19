import Item from './Item';
import ServiceUtil from '../utils/ServiceUtil';

function getNestedPropertyInObject(obj = {}, propList = []) {
  return propList.reduce(function (current, nextProp) {
    if (!current) {
      return current;
    }

    return current[nextProp];
  }, obj);
}

class UniversePackage extends Item {
  getIcons() {
    return ServiceUtil.getServiceImages(
      getNestedPropertyInObject(this.get('resource'), ['images'])
    );
  }

  getScreenshots() {
    return getNestedPropertyInObject(
      this.get('resource'),
      ['images', 'screenshots']
    );
  }
}

module.exports = UniversePackage;
