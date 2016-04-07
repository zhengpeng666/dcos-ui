import _ from 'underscore';
import classNames from 'classnames';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {Tooltip} from 'reactjs-components';

import Actions from './actions/Actions';
import IntercomStore from './stores/IntercomStore';

let SDK = require('./SDK').getSDK();
let {Config, DOMUtils} = SDK.get(['Config', 'DOMUtils']);

let segmentScript = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error('Segment snippet included twice.');else{analytics.invoked=!0;analytics.methods=['trackSubmit','trackClick','trackLink','trackForm','pageview','identify','group','track','ready','alias','page','once','off','on'];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement('script');e.type="text/javascript";e.async=!0;e.src=('https:'===document.location.protocol?'https://':'http://')+'cdn.segment.com/analytics.js/v1/'+t+'/analytics.min.js';var n=document.getElementsByTagName('script')[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.0.1";analytics.load("${Config.analyticsKey}");}}();`;

let interval = null;

module.exports = {
  configuration: {
    enabled: false
  },

  filters: [
    'sidebarFooterButtonSet',
    'installCLIModalCLIInstallURL',
    'installCLIModalCLIInstallScript',
    'isIntercomOpen'
  ],

  actions: [
    'pluginsConfigured',
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

    Actions.initialize();
  },

  configure: function (configuration) {
    this.configuration = _.extend(this.configuration, configuration);
  },

  isIntercomOpen: function () {
    return IntercomStore.isOpen();
  },

  openIntercom: function () {
    IntercomStore.openIntercom();
  },

  closeIntercom: function () {
    IntercomStore.closeIntercom();
  },

  handleToggleIntercom: function () {
    if (IntercomStore.isOpen()) {
      this.closeIntercom();
    } else {
      this.openIntercom();
      SDK.Hooks.doAction('closeSidebar');
    }
  },

  pluginsConfigured: function () {
    DOMUtils.appendScript(document.head, segmentScript);
  },

  sidebarFooterButtonSet: function (value) {
    var chatIconClassSet = classNames({
      'clickable': true,
      'icon': true,
      'icon-sprite': true,
      'icon-chat': true,
      'icon-sprite-medium': true,
      'icon-sprite-medium-color': IntercomStore.isOpen()
    });

    let intercomButton = (
      <Tooltip content="Talk with us" key="button-intercom" elementTag="a"
        onClick={this.handleToggleIntercom.bind(this)}
        wrapperClassName="button button-link tooltip-wrapper">
        <i className={chatIconClassSet}></i>
      </Tooltip>
    );

    value.splice(1, 0, intercomButton);

    return value;
  },

  installCLIModalCLIInstallURL: function (value) {
    return 'https://downloads.mesosphere.com/dcos-cli/install.sh';
  },

  installCLIModalCLIInstallScript: function (value) {
    return './install.sh';
  }

};
