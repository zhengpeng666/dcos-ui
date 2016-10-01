import React from 'react';
// import {RouteHandler} from 'react-router';

import Icon from '../../../../../src/js/components/Icon';
// import ServiceDetailContainer from './ServiceDetailContainer';
import ServiceTreeContainer from './ServiceTreeContainer';

class ServicesContainer extends React.Component {

  render() {
    let id = decodeURIComponent(this.props.params.id);
    // Default /services route
    if (!id) {
      id = '/';
    }

    if (id.slice(-1) === '/') {
      return (
        <ServiceTreeContainer
          groupId={`/${id.slice(0, -1)}`}
          params={this.props.params}
          query={this.props.query} />
      );

    }

    return null;

    // return (
    //   <ServiceDetailContainer serviceId={id}>
    //     <RouteHandler serviceId={id} />
    //   </ServiceDetailContainer>
    // );
  }
}

ServicesContainer.contextTypes = {
  router: React.PropTypes.func
};

ServicesContainer.routeConfig = {
  label: 'Services',
  icon: <Icon id="services-inverse" size="small" family="small" />,
  matches: /^\/services/
};

module.exports = ServicesContainer;
