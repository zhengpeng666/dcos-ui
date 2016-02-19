import {Route, Redirect} from 'react-router';

import NetworkPage from '../pages/NetworkPage';

let universeRoutes = {
  type: Route,
  name: 'network',
  path: 'network/?',
  handler: NetworkPage,
  children: []
};

module.exports = universeRoutes;
