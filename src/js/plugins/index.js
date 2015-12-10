import AuthenticationPlugin from "./AuthenticationPlugin";
import BannerPlugin from "./BannerPlugin";
import SettingsPlugin from "./SettingsPlugin";
import TrackingPlugin from "./TrackingPlugin";

const pluginList = {
  "authentication": AuthenticationPlugin,
  "banner": BannerPlugin,
  "settings": SettingsPlugin,
  "tracking": TrackingPlugin
};

export default pluginList;
