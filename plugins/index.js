import Auth from './auth';
import Settings from './settings';
import Banner from './banner';
import Tracking from './tracking';

const pluginList = {
  'authentication': Auth,
  'settings': Settings,
  'banner': Banner,
  'tracking': Tracking
};

module.exports = {
  getAvailablePlugins: function () {
    return pluginList;
  }
};
