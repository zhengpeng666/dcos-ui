import {Route, Redirect} from 'react-router';

import UniversePage from '../pages/UniversePage';
import PackageDetailTab from '../pages/universe/PackageDetailTab';
import PackagesTab from '../pages/universe/PackagesTab';

let universeRoutes = {
  type: Route,
  name: 'universe',
  path: 'universe/?',
  handler: UniversePage,
  children: [
    {
      type: Route,
      name: 'universe-packages',
      path: 'packages/?',
      handler: PackagesTab
    },
    {
      type: Route,
      name: 'universe-package-detail',
      path: 'packages/:packageName?:packageVersion?',
      handler: PackageDetailTab
    },
    {
      type: Redirect,
      from: '/universe/?',
      to: 'universe-packages'
    }
  ]
};

module.exports = universeRoutes;
