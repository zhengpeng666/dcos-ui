import React from 'react';
import {RouteHandler} from 'react-router';

import Page from '../components/Page';

export default class UniversePage extends React.Component {
  render() {
    return (
      <Page title="DCOS Universe">
        <RouteHandler />
      </Page>
    );
  }
}

UniversePage.contextTypes = {
  router: React.PropTypes.func
};

UniversePage.routeConfig = {
  label: 'Universe',
  icon: 'universe',
  matches: /^\/universe/
};
