import React from 'react';

import DescriptionList from '../../../src/js/components/DescriptionList';

class NetworkItemDetails extends React.Component {
  render() {
    let details = this.props.details.map(function (detail, index) {
      return (
        <DescriptionList headline={detail.name} hash={detail.labels}
          key={index} />
      );
    });

    return (
      <div className="side-panel-tab-content side-panel-section container
        container-fluid container-pod container-pod-short flex-container-col
        flex-grow network-item-details">
        {details}
      </div>
    );
  }
}

module.exports = NetworkItemDetails;
