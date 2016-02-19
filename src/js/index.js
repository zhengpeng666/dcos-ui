var overrides = require('./overrides');
overrides.override();

import Actions from './actions/Actions';
Actions.initialize();

Actions.log({eventID: 'Stint started.', date: Actions.createdAt});
global.addEventListener('beforeunload', function () {
  Actions.log({eventID: 'Stint ended.'});
});

import _ from 'underscore';
import {Provider} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import PluginBridge from './pluginBridge/PluginBridge';

require('./utils/MomentJSConfig');
require('./utils/ReactSVG');
require('./utils/StoreMixinConfig');

import ApplicationLoader from './pages/ApplicationLoader';
import appRoutes from './routes/index';
var Config = require('./config/Config');
import Plugins from './plugins/Plugins';
import RequestUtil from './utils/RequestUtil';

let domElement = document.getElementById('application');
PluginBridge.init();
// Patch json
let oldJSON = RequestUtil.json;
RequestUtil.json = function (options = {}) {
  // Proxy error function so that we can trigger a plugin event
  let oldHandler = options.error;
  options.error = function () {
    if (typeof oldHandler === 'function') {
      oldHandler.apply(null, arguments);
    }
    Plugins.doAction('AJAXRequestError', ...arguments);
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
  let contents = Plugins.applyFilter('applicationContents', null);
  if (contents) {
    ReactDOM.render(
      (<Provider store={PluginBridge.Store}>
        contents
      </Provider>),
      domElement);
  } else {
    setTimeout(function () {
      let builtRoutes = createRoutes(
        Plugins.applyFilter('applicationRoutes', appRoutes)
      );

      Router.run(builtRoutes[0], function (Handler, state) {
        Config.setOverrides(state.query);
        ReactDOM.render(
          (<Provider store={PluginBridge.Store}>
            <Handler state={state} />
          </Provider>),
          domElement);
      });
    });
  }

  Plugins.doAction('applicationRendered');
}

ReactDOM.render(
  (<Provider store={PluginBridge.Store}>
    <ApplicationLoader onApplicationLoad={onApplicationLoad} />
  </Provider>),
  domElement
);
