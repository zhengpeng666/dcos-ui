import React from 'react';
import PodDetail from '../../components/PodDetail';

const METHODS_TO_BIND = [
];

class ServicesPod extends React.Component {

  constructor() {
    super(...arguments);

    this.displayName = 'ServicesPod';

    this.state = {
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

  }

  getContents(pod) {
    return (
        <PodDetail pod={pod} />
      );
  }

  render() {
    let {id} = this.props.params;

    // TODO: Populate pod struct
    let podStruct = {
      id: unescape(id)
    };

    return (
      <div>
        {this.getContents(podStruct)}
      </div>
    );
  }

};

module.exports = ServicesPod;
