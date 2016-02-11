import React from 'react';

import AnimatedLogo from '../components/AnimatedLogo';
import EventTypes from '../constants/EventTypes';
import Plugins from '../plugins/Plugins';

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
    Plugins.addChangeListener(
      EventTypes.PLUGINS_CONFIGURED, this.onPluginsLoaded
    );
    Plugins.initialize();
  }

  componentWillUnmount() {
    Plugins.removeChangeListener(
      EventTypes.PLUGINS_CONFIGURED, this.onPluginsLoaded
    );
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
