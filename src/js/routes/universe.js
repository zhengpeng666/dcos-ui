import {Route, Redirect} from 'react-router';

import InstalledPackagesTab from '../pages/universe/InstalledPackagesTab';
import PackageDetailTab from '../pages/universe/PackageDetailTab';
import PackagesTab from '../pages/universe/PackagesTab';
import UniversePage from '../pages/UniversePage';

let universeRoutes = {
  type: Route,
  name: 'packages',
  path: 'packages/?',
  handler: UniversePage,
  children: [
    {
      type: Route,
      name: 'packages-packages',
      path: '?',
      handler: PackagesTab
    },
    {
      type: Route,
      name: 'packages-installed-packages',
      path: 'installed-packages?',
      handler: InstalledPackagesTab
    },
    {
      type: Route,
      name: 'packages-packages-detail',
      path: ':packageName?:packageVersion?',
      handler: PackageDetailTab
    },
    {
      type: Redirect,
      from: '/packages/?',
      to: 'packages-packages'
    }
  ]
};

module.exports = universeRoutes;
