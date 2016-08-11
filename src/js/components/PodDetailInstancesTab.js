import React from 'react';

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
    return (
      <div>
        Here are some tab contents for pod <strong>{this.props.pod.id}</strong>
      </div>
    );
  }

}

PodDetailInstancesTab.contextTypes = {
};

PodDetailInstancesTab.propTypes = {
};

module.exports = PodDetailInstancesTab;
