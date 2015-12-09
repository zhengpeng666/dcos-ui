import _ from "underscore";
import DOMUtils from "../utils/DOMUtils";

import Actions from "../actions/Actions";
import Config from "../config/Config";
import IntercomStore from "../stores/IntercomStore";
import LocalStorageUtil from "../utils/LocalStorageUtil";

let segmentScript = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.0.1";analytics.load("${Config.analyticsKey}");}}();`;

let chameleonScript = `(function(d,w,o){w.chmln=w.docent=o;var s=d.createElement('script');s.async=true;s.src='https://cdn.trychameleon.com/east/'+chmln.token+'/'+chmln.host+'.min.js.gz';d.head.appendChild(s);var n='setup alias track set'.split(' ');for(var i=0;i<n.length;i++){(function(){var t=o[n[i]+'_a']=[];o[n[i]]=function(){t.push(arguments);};})()}})(document,window,{token:'AygXvQUlEVrijBUcM-gzCNB7tISfDWWmHYplrY',host:"mesosphere.com"});`;

let interval = null;

const TrackingPlugin = {

  configuration: {
    enabled: false
  },

  /**
   * @param  {Object} Plugins The Plugins API
   */
  initialize: function (Plugins) {
    Plugins.addFilter(
      "sidebarFooterButtonSet", this.sidebarFooterButtonSet.bind(this)
    );
    Plugins.addFilter("openIdentifyModal", this.openIdentifyModal.bind(this));
    Plugins.addAction("pluginsConfigured", this.pluginsConfigured.bind(this));
    Plugins.addAction("receivedUserEmail", this.receivedUserEmail.bind(this));
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
      DOMUtils.appendScript(document.head, chameleonScript);

      // Continue to check if analytics script (Segment) is initialized and only
      // identify user by email after it is ready.
      interval = setInterval(function () {
        if (Actions.canLog()) {
          var email = LocalStorageUtil.get("email");
          if (email != null) {
            Actions.identify(email, function () {
              IntercomStore.init();
            });

            clearInterval(interval);
            interval = null;
          }
        }
      }, 500);
    }
  },

  receivedUserEmail: function (email) {
    LocalStorageUtil.set("email", email);
  },

  openIdentifyModal: function (value) {
    // If plugin is disabled then always return false
    if (this.isEnabled() !== true) {
      return false;
    }

    // Else just pass the value along
    return value;
  },

  sidebarFooterButtonSet: function (value) {
    if (this.isEnabled() !== true) {
      return [];
    }

    return value;
  }

};

export default TrackingPlugin;
