import classNames from 'classnames';
import {Form} from 'reactjs-components';
import React from 'react';

const METHODS_TO_BIND = [
  'getTriggerSubmit'
];

class FormPanel extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getDefinition(definition) {
    let flattenedDefinition = [];
    flattenedDefinition.push({render: this.getHeader.bind(
      this,
      definition.title,
      definition.description
    )});

    return flattenedDefinition.concat(definition.definition);
  }

  getTriggerSubmit(trigger) {
    this.props.getTriggerSubmit(trigger);
  }

  getHeader(title, description) {
    let headerClassSet = classNames('column-12', {
      'hidden': title !== this.props.currentTab
    });

    return (
      <div key={title} className={headerClassSet}>
        <h3 className="form-header">{title}</h3>
        <p>{description}</p>
      </div>
    );
  }

  render() {
    let definition = this.getDefinition(this.props.definition);

    return (
      <div className="row form-panel">
        <Form
          className={this.props.className}
          definition={definition}
          triggerSubmit={this.getTriggerSubmit}
          onChange={this.props.onFormChange}
          onSubmit={this.props.onSubmit} />
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
