import classNames from 'classnames';
import {Form} from 'reactjs-components';
import React from 'react';

const METHODS_TO_BIND = [
  'getFormRowClass', 'getTriggerSubmit', 'handleError'
];

class FormPanel extends React.Component {
  constructor() {
    super();
    this.triggerSubmit = function () {};

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleError() {
    console.log('error');
  }

  flattenDefinition(definition) {
    let flattenedDefinition = [];

    Object.keys(definition).forEach((title) => {
      let typeDefinition = definition[title];

      flattenedDefinition.push({render: this.getHeader.bind(
        this,
        typeDefinition.title,
        typeDefinition.description
      )});

      typeDefinition.definition.forEach((field) => {
        let nestedDefinition = field.definition;
        if (nestedDefinition) {
          flattenedDefinition.push({render: this.getSubHeader.bind(
            this,
            field.name
          )});
          flattenedDefinition = flattenedDefinition.concat(nestedDefinition);
        } else {
          flattenedDefinition.push(field);
        }
      });
    });

    return flattenedDefinition;
  }

  getTriggerSubmit(trigger) {
    this.triggerSubmit = trigger;
    this.forceUpdate();
  }

  getFormRowClass(definition) {
    let isSelectedForm = definition.formParent === this.props.currentTab;

    return classNames('row', {hidden: !isSelectedForm});
  }

  getHeader(title, description) {
    let headerClassSet = classNames('column-12', {
      'hidden': title !== this.props.currentTab
    });

    return (
      <div key={title} className={headerClassSet}>
        <h3 className="flush">{title}</h3>
        <p>{description}</p>
      </div>
    );
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
    let definition = this.flattenDefinition(this.props.definition);

    return (
      <div className="row form-panel">
        <Form
          className="form"
          definition={definition}
          formRowClass={this.getFormRowClass}
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

module.exports = FormPanel;
