import React from 'react';

import AnimatedLogo from '../components/AnimatedLogo';
import {PLUGINS_CONFIGURED} from '../constants/EventTypes';
import {Hooks} from 'PluginSDK';

const METHODS_TO_BIND = ['onPluginsLoaded'];

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
