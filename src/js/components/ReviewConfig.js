import React from 'react';

import DescriptionList from './DescriptionList';

class ReviewConfig extends React.Component {

  getFieldTitle(title) {
    return <h3 key={`${title}-header`}>{title}</h3>;
  }

  getFieldSubheader(title) {
    return (<h5 key={`${title}-subheader`}>{title}</h5>);
  }

  getDefinitionReview() {
    var elementsToRender = [];
    let jsonDocument = this.props.jsonDocument;
    let fields = Object.keys(jsonDocument);

    fields.forEach((field, i) => {
      var fieldObj = jsonDocument[field];
      elementsToRender.push(this.getFieldTitle(field));

      Object.keys(fieldObj).forEach((fieldKey) => {
        let fieldValue = fieldObj[fieldKey];
        let uniqueKey = `${i}${fieldKey}`;

        if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
          elementsToRender.push(this.getFieldSubheader(fieldKey));
          elementsToRender = elementsToRender.push(
            this.renderDescriptionList(fieldValue, uniqueKey)
          );
          return;
        }

        if (Array.isArray(fieldValue)) {
          fieldValue = fieldValue.join(' ');
        }

        elementsToRender.push(
          this.renderDescriptionList({[fieldKey]: fieldValue}, uniqueKey)
        );
      });
    });

    return elementsToRender;
  }

  renderDescriptionList(hash, key) {
    return (
      <DescriptionList hash={hash} key={key} />
    );
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.getDefinitionReview()}
      </div>
    );
  }
}

ReviewConfig.defaultProps = {
  className: 'multiple-form',
  jsonDocument: {},
  serviceImage: './img/services/icon-service-marathon-large@2x.png',
  serviceName: 'Marathon',
  serviceVersion: '0.23.2'
};

ReviewConfig.propTypes = {
  className: React.PropTypes.string,
  jsonDocument: React.PropTypes.object,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = ReviewConfig;
