import ACL from './acl';
import Auth from './auth';
import Banner from './banner';
import Directories from './directories';
import Groups from './groups';
import Organization from './organization';
import Overview from './overview';
import Tracking from './tracking';
import Users from './users';

const pluginList = {
  ACL,
  Auth,
  Banner,
  Directories,
  Groups,
  Organization,
  Overview,
  Tracking,
  Users
};

module.exports = {
  getAvailablePlugins: function () {
    return pluginList;
  }
};
