import overrides from './overrides';
overrides.override();
import PluginSDK from 'PluginSDK';

PluginSDK.Hooks.addAction('pluginsConfigured', function () {
  PluginSDK.Hooks.doAction('log', {eventID: 'Stint started.'});
});
global.addEventListener('beforeunload', function () {
  PluginSDK.Hooks.doAction('log', {eventID: 'Stint ended.'});
});

// Register our own Intercom and Auth store for cases where tracking is disabled.
// TEMP FIX
import StoreMixinConfig from './utils/StoreMixinConfig';
import {Store} from 'mesosphere-shared-reactjs';
let IntercomStore = Store.createStore({
  storeID: 'intercom',
  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },
  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  }
});
let AuthStore = Store.createStore({
  storeID: 'auth',
  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },
  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  }
});
StoreMixinConfig.add('intercom', {
  store: IntercomStore,
  events: ['change']
});
StoreMixinConfig.add('auth', {
  store: AuthStore,
  events: {
    success: 'ACL_AUTH_USER_LOGIN_CHANGED',
    error: 'ACL_AUTH_USER_LOGIN_ERROR',
    logoutSuccess: 'ACL_AUTH_USER_LOGOUT_SUCCESS',
    logoutError: 'ACL_AUTH_USER_LOGOUT_ERROR',
    roleChange: 'ACL_AUTH_USER_ROLE_CHANGED'
  }
});
// END FIX
import _ from 'underscore';
import {Provider} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';

require('./utils/MomentJSConfig');
require('./utils/ReactSVG');
require('./utils/StoreMixinConfig');

import ApplicationLoader from './pages/ApplicationLoader';
import appRoutes from './routes/index';
var Config = require('./config/Config');
import ConfigStore from './stores/ConfigStore';
import RequestUtil from './utils/RequestUtil';

let domElement = document.getElementById('application');

// Load configuration
ConfigStore.fetchConfig();

// Patch json
let oldJSON = RequestUtil.json;
RequestUtil.json = function (options = {}) {
  // Proxy error function so that we can trigger a plugin event
  let oldHandler = options.error;
  options.error = function () {
    if (typeof oldHandler === 'function') {
      oldHandler.apply(null, arguments);
    }
    PluginSDK.Hooks.doAction('AJAXRequestError', ...arguments);
  };

  oldJSON(options);
};

function createRoutes(routes) {
  return routes.map(function (route) {
    let args = [route.type, _.omit(route, 'type', 'children')];

    if (route.children) {
      let children = createRoutes(route.children);
      args = args.concat(children);
    }

    return React.createElement(...args);
  });
}

function onApplicationLoad() {
  // Allow overriding of application contents
  let contents = PluginSDK.Hooks.applyFilter('applicationContents', null);
  if (contents) {
    ReactDOM.render(
      (<Provider store={PluginSDK.Store}>
        contents
      </Provider>),
      domElement);
  } else {
    setTimeout(function () {
      let builtRoutes = createRoutes(
        appRoutes.getRoutes()
      );

      Router.run(builtRoutes[0], function (Handler, state) {
        Config.setOverrides(state.query);
        ReactDOM.render(
          (<Provider store={PluginSDK.Store}>
            <Handler state={state} />
          </Provider>),
          domElement);
      });
    });
  }

  PluginSDK.Hooks.doAction('applicationRendered');
}

ReactDOM.render(
  (<Provider store={PluginSDK.Store}>
    <ApplicationLoader onApplicationLoad={onApplicationLoad} />
  </Provider>),
  domElement
);
