import {DefaultRoute, Redirect, Route} from 'react-router';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

// import DeploymentsTab from '../pages/services/DeploymentsTab';
// import ServicesPage from '../pages/ServicesPage';
import ServicesContainer from '../services/ServicesContainer';
// import ServicesTab from '../pages/services/ServicesTab';
// import TaskDetail from '../pages/task-details/TaskDetail';
// import TaskDetailsTab from '../pages/task-details/TaskDetailsTab';
// import TaskFilesTab from '../pages/task-details/TaskFilesTab';
// import TaskLogsTab from '../pages/task-details/TaskLogsTab';
// import TaskDetailBreadcrumb from '../pages/nodes/breadcrumbs/TaskDetailBreadcrumb';
// import VolumeDetail from '../components/VolumeDetail';
// import VolumeTable from '../components/VolumeTable';

function buildServiceCrumbs(router) {
  let {id} = router.getCurrentParams();
  id = decodeURIComponent(id).replace(/^\//, '');
  let ids = id.split('/');
  let aggregateIDs = '';

  return ids.map(function (id) {
    aggregateIDs += encodeURIComponent(`/${id}`);

    return {
      label: id,
      route: {to: 'services-detail', params: {id: aggregateIDs}}
    };
  });
}

let serviceRoutes = {
  type: Route,
  name: 'services-page',
  handler: ServicesContainer,
  path: '/services/:id?',
  category: 'root',
  isInSidebar: true,
  buildBreadCrumb() {
    return {
      getCrumbs() {
        return [
          {
            label: 'Services',
            route: {to: 'services-page'}
          }
        ];
      }
    };
  },
  children: [
  ]
};

module.exports = serviceRoutes;
