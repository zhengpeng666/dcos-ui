import Router from 'react-router';
let Route = Router.Route;

import UniversePage from '../pages/UniversePage';

let universeRoutes = {
  type: Route,
  name: 'universe',
  path: 'universe/?',
  handler: UniversePage,
  children: []
};

export default universeRoutes;
