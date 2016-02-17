import {Route, Redirect} from 'react-router';

import UniversePage from '../pages/UniversePage';
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
      path: 'packages',
      handler: PackagesTab
    },
    {
      type: Redirect,
      from: '/universe/?',
      to: 'universe-packages'
    }
  ]
};

module.exports = universeRoutes;
