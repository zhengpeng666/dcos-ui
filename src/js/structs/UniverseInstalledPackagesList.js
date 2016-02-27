import List from './List';
import StringUtil from '../utils/StringUtil';
import UniversePackage from './UniversePackage';

class UniverseInstalledPackagesList extends List {
  constructor() {
    super(...arguments);

    // Replace list items instances of UniversePackage.
    this.list = this.list.map(function (item) {
      if (item instanceof UniversePackage) {
        return item;
      } else {
        let installedPackage = item.packageInformation;
        installedPackage.appId = item.appId;

        return new UniversePackage(installedPackage);
      }
    });
  }

  filterItems(filterText) {
    let packages = this.getItems();

    if (filterText) {
      packages = StringUtil.filterByString(packages, function (cosmosPackage) {
        let {description, name, tags} = cosmosPackage.get('packageDefinition');
        description = description || '';
        name = name || '';
        tags = tags || [];

        return `${name} ${description} ${tags.join(' ')}`;
      }, filterText);
    }

    return new UniverseInstalledPackagesList({items: packages});
  }
}

module.exports = UniverseInstalledPackagesList;
