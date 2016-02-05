import List from './List';
import UniversePackage from './UniversePackage';

class UniversePackagesList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of UniversePackage.
    this.list = this.list.map(function (item) {
      if (item instanceof UniversePackage) {
        return item;
      } else {
        return new UniversePackage(item);
      }
    });
  }
}

module.exports = UniversePackagesList;
