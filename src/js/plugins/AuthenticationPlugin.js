/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

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
    // If plugin is disabled then always return false
    if (this.isEnabled() !== true) {
      return value;
    }

    // Else just pass the value along
    return false;
  },

  sidebarFooter: function (value) {
    if (this.isEnabled() !== true) {
      return value;
    }

    return (
      <div className="text-align-center">[Drop up placeholder]</div>
    );
  }

};

export default AuthenticationPlugin;
