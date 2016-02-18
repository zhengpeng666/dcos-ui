import React from 'react';

class DescriptionList extends React.Component {
  getHeadline() {
    let {headline} = this.props;
    if (!headline) {
      return null;
    }

    // Wrap in headline element and classes
    return (
      <h6 className="flush-top">
        {headline}
      </h6>
    );
  }

  getItems() {
    let {hash} = this.props;

    return Object.keys(hash).map(function (key, index) {
      return (
        <dl key={index} className="flex-box row">
          <dt className="column-3 emphasize">{key}</dt>
          <dd className="column-9">{hash[key]}</dd>
        </dl>
      );
    });
  }

  render() {
    let {hash, className} = this.props;
    if (!hash || Object.keys(hash).length === 0) {
      return null;
    }

    return (
      <div className={className}>
        {this.getHeadline()}
        {this.getItems()}
      </div>
    );
  }
}

DescriptionList.defaultProps = {
  className: ''
};

DescriptionList.propTypes = {
  className: React.PropTypes.string,
  headline: React.PropTypes.node,
  hash: React.PropTypes.object
};

module.exports = DescriptionList;
