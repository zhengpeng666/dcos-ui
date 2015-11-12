import _ from "underscore";
import DOMUtils from "../utils/DOMUtils";

var segmentScript = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.0.1";analytics.load("@@ANALYTICS_KEY");}}();`;

const TrackingPlugin = {

  configuration: {
    enabled: false
  },

  /**
   * @param  {Object} Plugins The Plugins API
   */
  initialize: function (Plugins) {
    Plugins.addFilter("pluginsConfigured", this.pluginsConfigured.bind(this));
    Plugins.addAction("openLoginModal", this.openLoginModal.bind(this));
  },

  configure: function (configuration) {
    this.configuration = _.extend(this.configuration, configuration);
  },

  isEnabled() {
    return this.configuration.enabled;
  },

  pluginsConfigured: function () {
    if (this.isEnabled()) {
      DOMUtils.appendScript(document.head, segmentScript);
    }
  },

  openLoginModal: function (value) {
    // If plugin is disabled then always return false
    if (this.isEnabled() !== true) {
      return false;
    }

    // Else just pass the value along
    return value;
  }

};

export default TrackingPlugin;
