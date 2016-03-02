/* eslint-disable new-cap */
import _ from 'underscore';
import classNames from 'classnames';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import _Actions from './actions/Actions';
import _IntercomActions from './actions/IntercomActions';
import _IntercomStore from './stores/IntercomStore';

let interval = null;
let tourHasBeenSetup = false;

module.exports = (PluginSDK) => {

  let SidebarActions = PluginSDK.getActions('SidebarActions');

  let {Config, DOMUtils, LocalStorageUtil} = PluginSDK.get([
    'Config',
    'DOMUtils',
    'LocalStorageUtil'
    ]);

  let {Hooks} = PluginSDK;

  let segmentScript = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error('Segment snippet included twice.');else{analytics.invoked=!0;analytics.methods=['trackSubmit','trackClick','trackLink','trackForm','pageview','identify','group','track','ready','alias','page','once','off','on'];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement('script');e.type="text/javascript";e.async=!0;e.src=('https:'===document.location.protocol?'https://':'http://')+'cdn.segment.com/analytics.js/v1/'+t+'/analytics.min.js';var n=document.getElementsByTagName('script')[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.0.1";analytics.load("${Config.analyticsKey}");}}();`;
  let chameleonScript = `(function(d,w,o){w.chmln=w.docent=o;var s=d.createElement('script');s.async=true;s.src='https://cdn.trychameleon.com/east/'+chmln.token+'/'+chmln.host+'.min.js.gz';d.head.appendChild(s);var n='setup alias track set'.split(' ');for(var i=0;i<n.length;i++){(function(){var t=o[n[i]+'_a']=[];o[n[i]]=function(){t.push(arguments);};})()}})(document,window,{token:'AygXvQUlEVrijBUcM-gzCNB7tISfDWWmHYplrY',host:'mesosphere.com'});`;

  let Actions = _Actions(PluginSDK);
  let IntercomStore = _IntercomStore(PluginSDK);

  const TrackingPluginHooks = {
    configuration: {
      enabled: false
    },

    initialize: function () {
      Hooks.addFilter(
        'sidebarFooterButtonSet', this.sidebarFooterButtonSet.bind(this)
      );
      Hooks.addFilter(
        'installCLIModalAppendInstructions',
        this.installCLIModalAppendInstructions.bind(this)
      );
      Hooks.addFilter(
        'installCLIModalFooter', this.installCLIModalFooter.bind(this)
      );
      Hooks.addFilter('openIdentifyModal', this.openIdentifyModal.bind(this));
      Hooks.addAction('pluginsConfigured', this.pluginsConfigured.bind(this));
      Hooks.addAction('receivedUserEmail', this.receivedUserEmail.bind(this));
      Hooks.addFilter(
        'applicationHasIdentity', this.applicationHasIdentity.bind(this)
      );

      this.configure(PluginSDK.config);
    },

    configure: function (configuration) {
      this.configuration = _.extend(this.configuration, configuration);
    },

    isEnabled() {
      return this.configuration.enabled;
    },

    handleToggleIntercom: function () {
      if (IntercomStore.get('isOpen')) {
        Actions.closeIntercom();
      } else {
        Actions.openIntercom();
        SidebarActions.close();
      }
    },

    pluginsConfigured: function () {
      if (this.isEnabled()) {
        DOMUtils.appendScript(document.head, segmentScript);
        DOMUtils.appendScript(document.head, chameleonScript);

        // Continue to check if analytics script (Segment) is initialized and only
        // identify user by email after it is ready.
        interval = setInterval(function () {
          if (Actions.canLog()) {
            var email = LocalStorageUtil.get('email');
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
      LocalStorageUtil.set('email', email);
    },

    openIdentifyModal: function (value) {
      // If plugin is disabled then always return false
      if (this.isEnabled() !== true) {
        return false;
      }

      // Else just pass the value along
      return value;
    },

    applicationHasIdentity: function () {
      return !!LocalStorageUtil.get('email');
    },

    sidebarFooterButtonSet: function (value) {
      if (this.isEnabled() !== true) {
        return value;
      }

      var chatIconClassSet = classNames({
        'clickable': true,
        'icon': true,
        'icon-sprite': true,
        'icon-chat': true,
        'icon-sprite-medium': true,
        'icon-sprite-medium-color': IntercomStore.get('isOpen')
      });

      let intercomButton = (
        <a key="button-intercom" className="button button-link"
          data-behavior="show-tip"
          data-tip-content="Talk with us"
          onClick={this.handleToggleIntercom}>
          <i className={chatIconClassSet}></i>
        </a>
      );

      value.splice(1, 0, intercomButton);

      return value;
    },

    installCLIModalAppendInstructions: function (value) {
      if (this.isEnabled() !== true) {
        return value;
      }

      return 'You can also take our tour, which will introduce you to the DCOS web-based user interface.';
    },

    installCLIModalFooter: function (value, closeModalHandler) {
      if (this.isEnabled() !== true) {
        return value;
      }

      let handleBeginTour = function () {
        closeModalHandler();

        Actions.logFakePageView({
          title: 'Tour start',
          path: '/v/tour-start',
          referrer: 'https://mesosphere.com/'
        });

        if (tourHasBeenSetup === false) {
          // Setup with user info for their tracking
          if (global.chmln && global.chmln.setup) {
            global.chmln.setup({
              uid: Actions.getStintID(),
              version: Config.version
            });
          }

          tourHasBeenSetup = true;
        } else {
          // Awful hack.
          document.getElementById('start-tour').click();
        }
      };

      return (
        <div className="tour-start-modal-footer">
          <div className="row text-align-center">
            <button className="button button-primary button-large" onClick={handleBeginTour}>
              Start The Tour
            </button>
          </div>
          <div className="row text-align-center">
            <a onClick={closeModalHandler} className="clickable skip-tour">
              {'No thanks, I\'ll skip the tour.'}
            </a>
          </div>
        </div>
      );
    }
  };

  return TrackingPluginHooks;
};
