import React from 'react';
import {RouteHandler} from 'react-router';

import AlertPanel from '../components/AlertPanel';
import FilterHeadline from '../components/FilterHeadline';
import FilterInputText from '../components/FilterInputText';
import Page from '../components/Page';
import VIPsTable from '../components/VIPsTable';

class NetworkPage extends React.Component {
  constructor() {
    super();

    this.state = {
      searchString: ''
    };
  }

  getContents(isEmpty) {
    if (isEmpty) {
      return this.getEmptyNetworkPageContent();
    } else {
      return this.getNetworkPageContent();
    }
  }

  // TODO: Clean up this panel.
  getEmptyNetworkPageContent() {
    return (
      <AlertPanel
        title="No Network Information"
        iconClassName="icon icon-sprite icon-sprite-jumbo
          icon-sprite-jumbo-white icon-datacenter flush-top">
        <p className="flush">
          No network information to display.
        </p>
      </AlertPanel>
    );
  }

  getNetworkPageContent() {
    let {state} = this;

    return ('table');

    return (
      <div>
        <FilterHeadline
          onReset={this.resetFilter}
          name="Services"
          currentLength={data.services.length}
          totalLength={data.totalServices} />
        <ul className="list list-unstyled list-inline flush-bottom">
          <li>
            <FilterInputText
              searchString={state.searchString}
              handleFilterChange={this.handleSearchStringChange}
              inverseStyle={true} />
          </li>
        </ul>
        <VIPsTable
          services={data.services}
          healthProcessed={appsProcessed} />
      </div>
    );
  }

  handleSearchStringChange(searchString) {
    console.log(searchString);
  }

  render() {
    // TODO: Calculate whether or not we have data.
    return (
      <Page title="Network">
        {this.getContents(false)}
        <RouteHandler />
      </Page>
    );
  }
}

NetworkPage.contextTypes = {
  router: React.PropTypes.func
};

NetworkPage.routeConfig = {
  label: 'Network',
  icon: 'network',
  matches: /^\/network/
};

module.exports = NetworkPage;
