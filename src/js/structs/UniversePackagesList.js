import List from './List';
import StringUtil from '../utils/StringUtil';
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

  filterItems(filterText) {
    let packages = this.getItems();

    if (filterText) {
      packages = StringUtil.filterByString(packages, function (cosmosPackage) {
        let description = cosmosPackage.get('description') || '';
        let packageName = cosmosPackage.get('packageName') || '';
        let tags = cosmosPackage.get('tags') || [];

        return `${packageName} ${description} ${tags.join(' ')}`;
      }, filterText);
    }

    return new UniversePackagesList({items: packages});
  }
}

module.exports = UniversePackagesList;
