import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import AnimatedLogo from '../components/AnimatedLogo';
import EventTypes from '../constants/EventTypes';
import InternalStorageMixin from '../mixins/InternalStorageMixin';
import Plugins from '../plugins/Plugins';

const METHODS_TO_BIND = ['onPluginsLoaded'];

export default class ApplicationLoader extends
  mixin(StoreMixin, InternalStorageMixin) {

  constructor() {
    super();

    this.store_listeners = [
      {name: 'auth', events: ['logoutSuccess']}
    ];

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.state = {};
  }

  componentDidMount() {
    super.componentDidMount();

    Plugins.addChangeListener(
      EventTypes.PLUGINS_CONFIGURED, this.onPluginsLoaded
    );
    Plugins.initialize();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    Plugins.removeChangeListener(
      EventTypes.PLUGINS_CONFIGURED, this.onPluginsLoaded
    );
  }

  onPluginsLoaded() {
    this.props.onApplicationLoad();
  }

  onAuthStoreLogoutSuccess() {
    this.context.router.transitionTo('login');
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
