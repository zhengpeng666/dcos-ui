import Auth from './auth';
import Settings from './settings';
import Banner from './banner';

const pluginList = {
  'authentication': Auth,
  'settings': Settings,
  'banner': Banner
};

module.exports = {
  getAvailablePlugins: function () {
    return pluginList;
  }
};
