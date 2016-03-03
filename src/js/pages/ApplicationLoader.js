var overrides = require('../overrides');
import React from 'react';

import AnimatedLogo from '../components/AnimatedLogo';
import {PLUGINS_CONFIGURED} from '../constants/EventTypes';
import PluginSDK, {Hooks} from 'PluginSDK';

const METHODS_TO_BIND = ['onPluginsLoaded'];

function startTrackingIfAvailable() {
  let Actions = PluginSDK.getActions('Tracking', false);
  if (Actions) {
    Actions.initialize();

    Actions.log({eventID: 'Stint started.', date: Actions.createdAt});
    global.addEventListener('beforeunload', function () {
      Actions.log({eventID: 'Stint ended.'});
    });
  }
}

export default class ApplicationLoader extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.state = {};
  }

  componentDidMount() {
    Hooks.addChangeListener(PLUGINS_CONFIGURED, this.onPluginsLoaded);
  }

  componentWillUnmount() {
    Hooks.removeChangeListener(PLUGINS_CONFIGURED, this.onPluginsLoaded);
  }

  onPluginsLoaded() {
    overrides.override();
    startTrackingIfAvailable();
    this.props.onApplicationLoad();
  }

  render() {
    return (
      <div id="canvas">
        <div className="container container-pod vertical-center">
          <AnimatedLogo speed={500} scale={0.16} />
        </div>
      </div>
    );
  }
}

ApplicationLoader.propTypes = {
  onApplicationLoad: React.PropTypes.func.isRequired
};

ApplicationLoader.contextTypes = {
  router: React.PropTypes.func
};

module.exports = ApplicationLoader;
