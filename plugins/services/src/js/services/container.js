import {RouteHandler} from 'react-router';
import React from 'react';

import Icon from '../components/Icon';
import Page from '../components/Page';

class ServicesContainer extends React.Component {
  render() {
    if (this.props.params.serviceName) {
      return <RouteHandler />;
    }

    return
  }
}

ServicesContainer.routeConfig = {
  label: 'Services',
  icon: <Icon id="services-inverse" size="small" family="small" />,
  matches: /^\/services/
};

module.exports = ServicesContainer;
