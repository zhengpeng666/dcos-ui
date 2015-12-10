import _ from "underscore";

const SettingsPlugin = {

  configuration: {
    enabled: false
  },

  /**
   * @param  {Object} Plugins The Plugins API
   */
  initialize: function (Plugins) {
    Plugins.addFilter(
      "sidebarNavigation", this.sidebarNavigationItems.bind(this)
    );
  },

  configure: function (configuration) {
    this.configuration = _.extend(this.configuration, configuration);
  },

  isEnabled() {
    return this.configuration.enabled;
  },

  sidebarNavigationItems: function (value = []) {
    if (this.isEnabled() !== true) {
      return value;
    }

    return value.concat(["settings"]);
  }

};

export default SettingsPlugin;
