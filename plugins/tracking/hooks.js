import _ from 'underscore';
import classNames from 'classnames';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {
  REQUEST_INTERCOM_OPEN,
  REQUEST_INTERCOM_CLOSE
} from './constants/ActionTypes';

import Actions from './actions/Actions';
var AppDispatcher = require('../../src/js/events/AppDispatcher');
import IntercomStore from './stores/IntercomStore';

let SDK = require('./SDK').getSDK();
let {Config, DOMUtils, LocalStorageUtil} = SDK.get([
  'Config',
  'DOMUtils',
  'LocalStorageUtil'
]);

let segmentScript = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error('Segment snippet included twice.');else{analytics.invoked=!0;analytics.methods=['trackSubmit','trackClick','trackLink','trackForm','pageview','identify','group','track','ready','alias','page','once','off','on'];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement('script');e.type="text/javascript";e.async=!0;e.src=('https:'===document.location.protocol?'https://':'http://')+'cdn.segment.com/analytics.js/v1/'+t+'/analytics.min.js';var n=document.getElementsByTagName('script')[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.0.1";analytics.load("${Config.analyticsKey}");}}();`;
let chameleonScript = `(function(d,w,o){w.chmln=w.docent=o;var s=d.createElement('script');s.async=true;s.src='https://cdn.trychameleon.com/east/'+chmln.token+'/'+chmln.host+'.min.js.gz';d.head.appendChild(s);var n='setup alias track set'.split(' ');for(var i=0;i<n.length;i++){(function(){var t=o[n[i]+'_a']=[];o[n[i]]=function(){t.push(arguments);};})()}})(document,window,{token:'AygXvQUlEVrijBUcM-gzCNB7tISfDWWmHYplrY',host:'mesosphere.com'});`;

let interval = null;
let tourHasBeenSetup = false;

module.exports = {
  configuration: {
    enabled: false
  },

  filters: [
    'sidebarFooterButtonSet',
    'installCLIModalAppendInstructions',
    'installCLIModalCLIInstallURL',
    'installCLIModalCLIInstallScript',
    'installCLIModalFooter',
    'openIdentifyModal',
    'applicationHasIdentity',
    'isIntercomOpen'
  ],

  actions: [
    'pluginsConfigured',
    'receivedUserEmail',
    'openIntercom',
    'closeIntercom'
  ],

  initialize: function () {
    this.filters.forEach(filter => {
      SDK.Hooks.addFilter(filter, this[filter].bind(this));
    });
    this.actions.forEach(action => {
      SDK.Hooks.addAction(action, this[action].bind(this));
    });
    this.configure(SDK.config);
  },

  configure: function (configuration) {
    this.configuration = _.extend(this.configuration, configuration);
  },

  isEnabled() {
    return this.configuration.enabled;
  },

  isIntercomOpen: function () {
    return IntercomStore.get('isOpen');
  },

  openIntercom: function () {
    AppDispatcher.handleIntercomAction({
      type: REQUEST_INTERCOM_OPEN,
      data: true
    });
  },

  closeIntercom: function () {
    AppDispatcher.handleIntercomAction({
      type: REQUEST_INTERCOM_CLOSE,
      data: false
    });
  },

  handleToggleIntercom: function () {
    if (IntercomStore.get('isOpen')) {
      this.closeIntercom();
    } else {
      this.openIntercom();
      SDK.Hooks.doAction('closeSidebar');
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
        onClick={this.handleToggleIntercom.bind(this)}>
        <i className={chatIconClassSet}></i>
      </a>
    );

    value.splice(1, 0, intercomButton);

    return value;
  },

  installCLIModalCLIInstallURL: function (value) {
    if (this.isEnabled() !== true) {
      return 'https://downloads.mesosphere.com/dcos-cli/install-optout.sh';
    }

    return value;
  },

  installCLIModalCLIInstallScript: function (value) {
    if (this.isEnabled() !== true) {
      return './install-optout.sh';
    }

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
