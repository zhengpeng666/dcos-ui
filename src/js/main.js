var overrides = require('./overrides');
overrides.override();

import Actions from './actions/Actions';
Actions.initialize();

Actions.log({eventID: 'Stint started.', date: Actions.createdAt});
global.addEventListener('beforeunload', function () {
  Actions.log({eventID: 'Stint ended.'});
});

import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';

require('./utils/MomentJSConfig');
require('./utils/ReactSVG');
require('./utils/StoreMixinConfig');

import ApplicationLoader from './pages/ApplicationLoader';
import appRoutes from './routes/index';
var Config = require('./config/Config');
import Plugins from './plugins/Plugins';

let domElement = document.getElementById('application');

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
    ReactDOM.render(contents, domElement);
  } else {
    setTimeout(function () {
      let builtRoutes = createRoutes(
        Plugins.applyFilter('applicationRoutes', appRoutes)
      );

      Router.run(builtRoutes[0], function (Handler, state) {
        Config.setOverrides(state.query);
        ReactDOM.render(
          <Handler state={state} />, domElement);
      });
    });
  }

  Plugins.doAction('applicationRendered');
}

ReactDOM.render(
  <ApplicationLoader onApplicationLoad={onApplicationLoad} />,
  domElement
);
