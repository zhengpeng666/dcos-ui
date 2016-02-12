import React from 'react';

const METHODS_TO_BIND = [
];

export default class ReviewConfig extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getFieldTitle(title) {
    return <h3>{title}</h3>;
  }

  getDefinitionReview() {
    var elementsToRender = [];
    let multipleDefinition = this.props.multipleDefinition;
    let fields = Object.keys(multipleDefinition);

    fields.forEach((field) => {
      var fieldObj = multipleDefinition[field];

      if (fieldObj.definition) {
        elementsToRender.push(this.getFieldTitle(fieldObj.title));
        this.renderFields(fieldObj.definition, elementsToRender);
      } else {
        elementsToRender.push(this.getFieldTitle(fieldObj.title));
        elementsToRender.push(this.renderField(fieldObj));
      }
    });

    return elementsToRender;
  }

  getServiceHeader() {
    return (
      <div className="media-object media-object-align-middle">
        <div className="media-object-icon media-object-icon-medium">
          <img
            className="icon icon-sprite icon-sprite-medium
              icon-sprite-medium-color"
            src={this.props.serviceImage} />
        </div>
        <div className="media-object-content">
          <h4 className="flush-top flush-bottom text-color-neutral">
            {this.props.serviceName}
          </h4>
          <span className="side-panel-resource-label">
            {this.props.serviceVersion}
          </span>
        </div>
      </div>
    );
  }

  getFieldSubheader(title) {
    return (<h5>{title}</h5>);
  }

  renderField(definition) {
    return (
      <dl className="flex-box row">
        <dt className="column-3 emphasize">
          {definition.name}
        </dt>
        <dd className="column-9">
          {definition.value || 'default value'}
        </dd>
      </dl>
    );
  }

  renderFields(definition, elementsToRender) {
    definition.forEach((fieldDefinition) => {
      if (fieldDefinition.definition) {
        elementsToRender.push(this.getFieldSubheader(fieldDefinition.name));
        this.renderFields(fieldDefinition.definition, elementsToRender);
        return;
      }

      elementsToRender.push(this.renderField(fieldDefinition));
    });
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
  multipleDefinition: {},
  serviceImage: './img/services/icon-service-marathon-large@2x.png',
  serviceName: 'Marathon',
  serviceVersion: '0.23.2'
};

ReviewConfig.propTypes = {
  multipleDefinition: React.PropTypes.object
};
