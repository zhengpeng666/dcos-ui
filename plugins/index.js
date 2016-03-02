import Auth from './auth';
import Banner from './banner';
import Organization from './organization';
import Overview from './overview';
import Tracking from './tracking';

const pluginList = {
  Auth,
  Banner,
  Organization,
  Overview,
  Tracking
};

module.exports = {
  getAvailablePlugins: function () {
    return pluginList;
  }
};
