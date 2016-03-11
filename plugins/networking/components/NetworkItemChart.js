import React from 'react';

class NetworkItemChart extends React.Component {
  render() {
    let details = this.props.details.map(function (detail, index) {
      return (
        <DescriptionList headline={detail.name} hash={detail.labels}
          key={index} />
      );
    });

    return (
      <div>hi</div>
    );
  }
}

module.exports = NetworkItemChart;
