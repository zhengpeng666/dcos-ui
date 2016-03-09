/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Link, Route} from 'react-router';

import NetworkSidePanel from './components/NetworkSidePanel';
let SDK = require('./SDK').getSDK();

module.exports = {

  filters: [
    'NetworkingPageContent',
    'NetworkingChildRoutes',
    'NetworkingVIPTableLabel'
  ],

  initialize() {
    this.filters.forEach(filter => {
      SDK.Hooks.addFilter(filter, this[filter].bind(this));
    });
  },

  NetworkingPageContent(content, props, openedPage) {
    return (
      <div>
        {content}
        <NetworkSidePanel vip={props.vip} port={props.port}
          protocol={props.protocol} openedPage={openedPage} />
      </div>
    );
  },

  NetworkingChildRoutes(route) {
    route.children = [{
      type: Route,
      name: 'vip-detail-panel',
      path: 'vip-detail/:vip/:protocol/:port'
    },
    {
      type: Route,
      name: 'backend-detail-panel',
      path: 'backend-detail/:vip/:protocol/:port'
    }];
    return route;
  },

  NetworkingVIPTableLabel(label, fullVIP) {
    return (
      <Link to="vip-detail-panel" params={{
          protocol: fullVIP.protocol,
          vip: fullVIP.ip,
          port: fullVIP.port
        }}>
        {label}
      </Link>
    );
  }
};
