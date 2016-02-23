import Auth from './auth';
import Settings from './settings';

const pluginList = {
  'authentication': Auth,
  'settings': Settings
};

module.exports = {
  getAvailablePlugins: function () {
    return pluginList;
  }
};
