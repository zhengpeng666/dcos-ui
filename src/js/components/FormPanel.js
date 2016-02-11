import {Form} from 'reactjs-components';
import React from 'react';

const METHODS_TO_BIND = [
  'getTriggerSubmit', 'handleError'
];

export default class FormPanel extends React.Component {
  constructor() {
    super();
    this.triggerSubmit = function () {};

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getTriggerSubmit(trigger) {
    this.triggerSubmit = trigger;
    this.forceUpdate();
  }

  handleError() {
    console.log('error');
  }

  flattenDefinition(definition) {
    var flattenedDefinition = [];

    definition.forEach((field) => {
      let nestedDefinition = field.definition;
      if (nestedDefinition) {
        flattenedDefinition.push(this.getSubHeader(field.name));
        flattenedDefinition = flattenedDefinition.concat(nestedDefinition);
      } else {
        flattenedDefinition.push(field);
      }
    });

    return flattenedDefinition;
  }

  getSubHeader(name) {
    return (
      <div className="row">
        <div className="h5 column-12">
          {name}
        </div>
      </div>
    );
  }

  render() {
    var definition = this.flattenDefinition(this.props.definition);

    return (
      <div className="row">
        <div className="column-12">
          <h3 className="flush">{this.props.title}</h3>
          <p>{this.props.description}</p>
        </div>
        <Form
          definition={definition}
          triggerSubmit={this.getTriggerSubmit}
          onSubmit={this.props.onSubmit}
          onError={this.handleError} />
      </div>
    );
  }
}

FormPanel.defaultProps = {
  definition: []
};

FormPanel.propTypes = {
  definition: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object
  ])
};
