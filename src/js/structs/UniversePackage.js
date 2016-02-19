import Item from './Item';
import ServiceUtil from '../utils/ServiceUtil';

function getPropertyInObject(obj = {}, propList = []) {
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
      getPropertyInObject(this.get('resource'), ['images'])
    );
  }

  getScreenshots() {
    return getPropertyInObject(this.get('resource'), ['images', 'screenshots']);
  }
}

module.exports = UniversePackage;
