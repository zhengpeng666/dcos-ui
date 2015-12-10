/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
import {Route} from "react-router";

import AccessDeniedPage from "../pages/AccessDeniedPage";

const AuthenticationPlugin = {

  configuration: {
    enabled: false
  },

  /**
   * @param  {Object} Plugins The Plugins API
   */
  initialize: function (Plugins) {
    Plugins.addFilter("sidebarFooter", this.sidebarFooter.bind(this));
    Plugins.addFilter("openIdentifyModal", this.openIdentifyModal.bind(this));
    Plugins.addFilter("applicationRoutes", this.applicationRoutes.bind(this));
  },

  configure: function (configuration) {
    // Only merge keys that have a non-null value
    Object.keys(configuration).forEach((key) => {
      if (configuration[key] != null) {
        this.configuration[key] = configuration[key];
      }
    });
  },

  isEnabled: function () {
    return this.configuration.enabled;
  },

  openIdentifyModal: function (value) {
    if (this.isEnabled() !== true) {
      return value;
    }

    return false;
  },

  sidebarFooter: function (value) {
    if (this.isEnabled() !== true) {
      return value;
    }

    return (
      <div className="text-align-center">[Drop up placeholder]</div>
    );
  },

  applicationRoutes: function (routes) {
    if (this.isEnabled() === true) {
      routes[0].children.unshift(
        {
          type: Route,
          name: "access-denied",
          path: "access-denied",
          handler: AccessDeniedPage
        }
      );
    }
    return routes;
  }

};

export default AuthenticationPlugin;
