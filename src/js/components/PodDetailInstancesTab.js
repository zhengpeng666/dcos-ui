import React from 'react';

import PodTableFilters from './PodTableFilters';
import PodTable from './PodTable';

const METHODS_TO_BIND = [
];

class PodDetailInstancesTab extends React.Component {

  constructor() {
    super(...arguments);

    this.state = {
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

  }

  render() {
    let rules = {};
    return (
      <div>
        <PodTableFilters filters={rules} />
        <PodTable pod={this.props.pod} filters={rules} />
      </div>
    );
  }

}

PodDetailInstancesTab.contextTypes = {
};

PodDetailInstancesTab.propTypes = {
};

module.exports = PodDetailInstancesTab;
