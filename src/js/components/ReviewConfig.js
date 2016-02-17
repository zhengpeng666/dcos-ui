import React from 'react';

// TODO: remove this. This is a fixture for development purposes.
// import {jsonDocument as boomski} from './marathonConfigFixture';

class ReviewConfig extends React.Component {
  getFieldTitle(title) {
    return <h3 key={`${title}-header`}>{title}</h3>;
  }

  getServiceHeader() {
    let {props} = this;
    return (
      <div className="media-object media-object-align-middle">
        <div className="media-object-icon media-object-icon-medium">
          <img
            className="icon icon-sprite icon-sprite-medium
              icon-sprite-medium-color"
            src={props.serviceImage} />
        </div>
        <div className="media-object-content">
          <h4 className="flush-top flush-bottom text-color-neutral">
            {props.serviceName}
          </h4>
          <span className="side-panel-resource-label">
            {props.serviceVersion}
          </span>
        </div>
      </div>
    );
  }

  getFieldSubheader(title) {
    return (<h5 key={`${title}-subheader`}>{title}</h5>);
  }

  renderField(key, value) {
    return (
      <dl key={`${key}${value}`} className="flex-box row">
        <dt className="column-3 emphasize">
          {key}
        </dt>
        <dd className="column-9">
          {value}
        </dd>
      </dl>
    );
  }

  getDefinitionReview() {
    var elementsToRender = [];
    let jsonDocument = this.props.jsonDocument;
    let fields = Object.keys(jsonDocument);

    fields.forEach((field) => {
      var fieldObj = jsonDocument[field];
      elementsToRender.push(this.getFieldTitle(field));

      Object.keys(fieldObj).forEach((fieldKey) => {
        let fieldValue = fieldObj[fieldKey];

        if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
          elementsToRender.push(this.getFieldSubheader(fieldKey));
          elementsToRender = elementsToRender.concat(
            this.renderFields(fieldValue)
          );
          return;
        }

        if (Array.isArray(fieldValue)) {
          fieldValue = fieldValue.join(' ');
        }

        elementsToRender.push(this.renderField(fieldKey, fieldValue));
      });
    });

    return elementsToRender;
  }

  renderFields(obj) {
    var elementsToRender = [];

    Object.keys(obj).forEach((key) => {
      elementsToRender.push(this.renderField(key, obj[key]));
    });

    return elementsToRender;
  }

  render() {
    return (
      <div className="modal-body review-config">
        <div className="row">
          <div className="column-4">
            {this.getServiceHeader()}
          </div>
          <div className="column-8 text-align-right">
            <button className="button button-stroke button-rounded">
              Download config.json
            </button>
          </div>
        </div>
        {this.getDefinitionReview()}
      </div>
    );
  }
}

ReviewConfig.defaultProps = {
  jsonDocument: {},
  serviceImage: './img/services/icon-service-marathon-large@2x.png',
  serviceName: 'Marathon',
  serviceVersion: '0.23.2'
};

ReviewConfig.propTypes = {
  jsonDocument: React.PropTypes.object,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = ReviewConfig;
