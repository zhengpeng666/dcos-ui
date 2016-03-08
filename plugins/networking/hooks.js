/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Link, Route} from 'react-router';

import NetworkSidePanel from './components/NetworkSidePanel';
let SDK = require('./SDK').getSDK();

module.exports = {
  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    SDK.Hooks.addFilter('getNetworkingPageContent', this.addPageContent.bind(this));
    SDK.Hooks.addFilter('getNetworkingChildRoutes', this.addSubRoutes.bind(this));
    SDK.Hooks.addFilter('networkingVIPTableLabel', this.addVIPDetailLink.bind(this));
  },

  routes: {
    route: {
      children: [
        {
          type: Route,
          name: 'network-panel',
          path: 'vip-detail/:vip/:protocol/:port'
        }
      ]
    }
  },

  addPageContent(content, props, openedPage) {
    return (
      <div>
        {content}
        <NetworkSidePanel vip={props.vip} port={props.port}
          protocol={props.protocol} openedPage={openedPage} />
      </div>
    );
  },

  addSubRoutes(route) {
    route.children = this.routes.route.children;
    return route;
  },

  addVIPDetailLink(label, fullVIP) {
    return (
      <Link to="network-panel" params={{
          protocol: fullVIP.protocol,
          vip: fullVIP.ip,
          port: fullVIP.port
        }}>
        {label}
      </Link>
    );
  }
};
