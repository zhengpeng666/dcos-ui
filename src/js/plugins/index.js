import AuthenticationPlugin from './authentication-plugin/AuthenticationPlugin';
import BannerPlugin from './BannerPlugin';
import SettingsPlugin from './settings-plugin/SettingsPlugin';
//import TrackingPlugin from './TrackingPlugin';

const pluginList = {
  'authentication': AuthenticationPlugin,
  'banner': BannerPlugin,
  'settings': SettingsPlugin
  //'tracking': TrackingPlugin
};

module.exports = pluginList;
