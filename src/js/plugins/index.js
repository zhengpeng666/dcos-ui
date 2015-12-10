import AuthenticationPlugin from "./AuthenticationPlugin";
import BannerPlugin from "./BannerPlugin";
import TrackingPlugin from "./TrackingPlugin";

const pluginList = {
  "authentication": AuthenticationPlugin,
  "banner": BannerPlugin,
  "tracking": TrackingPlugin
};

export default pluginList;
