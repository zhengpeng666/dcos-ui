import _ from 'underscore';
import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';

import FormPanel from './FormPanel';
import SideTabs from './SideTabs';
import SchemaFormUtil from '../utils/SchemaFormUtil';
import SchemaUtil from '../utils/SchemaUtil';

const METHODS_TO_BIND = [
  'getTriggerSubmit', 'validateForm', 'handleFormChange', 'handleTabClick',
  'handleExternalSubmit'
];

class SchemaForm extends React.Component {
  constructor() {
    super();

    this.state = {
      currentTab: ''
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.triggerSubmit = function () {};
    this.errors = 0;
  }

  componentWillMount() {
    if (this.props.definition) {
      this.multipleDefinition = this.props.definition;
    } else {
      this.multipleDefinition = SchemaUtil.schemaToMultipleDefinition(
        this.props.schema, this.getSubHeader
      );
    }

    if (this.props.model) {
      this.model = this.props.model;
      SchemaFormUtil.mergeModelIntoDefinition(this.model, this.multipleDefinition);
    } else {
      this.model = {};
    }

    this.submitMap = {};
    this.setState({
      currentTab: Object.keys(this.multipleDefinition)[0]
    });

    this.props.getTriggerSubmit(this.handleExternalSubmit);
  }

  handleTabClick(tab) {
    this.setState({currentTab: tab});
  }

  handleFormChange(formData, eventObj) {
    let isCheckboxChange = eventObj.eventType === 'change'
      && typeof eventObj.fieldValue === 'boolean';

    if (eventObj.eventType !== 'blur' && !isCheckboxChange) {
      return;
    }

    let validated = this.validateForm(eventObj.fieldName);
    this.props.onChange(validated);
  }

  handleFormSubmit(formKey, formModel) {
    this.model[formKey] = formModel;
  }

  handleExternalSubmit() {
    this.validateForm();
    return {
      errors: this.errors,
      model: this.model,
      definition: this.multipleDefinition
    };
  }

  validateForm(fieldName) {
    let schema = this.props.schema;
    let isValidated = true;

    Object.keys(this.multipleDefinition).forEach((formKey) => {
      this.submitMap[formKey]();
    });

    let prevDefinition = this.multipleDefinition;
    // Reset the definition in order to reset all errors.
    this.multipleDefinition = SchemaUtil.schemaToMultipleDefinition(
      schema, this.getSubHeader
    );

    let model = SchemaFormUtil.processFormModel(
      this.model, this.multipleDefinition
    );
    let result = SchemaFormUtil.tv4Validate(model, schema);

    let errors = result.errors.map(function (error) {
      return SchemaFormUtil.parseTV4Error(error);
    });

    errors.forEach((error) => {
      let path = error.path;
      let prevObj = prevDefinition[path[0]];
      prevObj = SchemaFormUtil.getDefinitionFromPath(prevObj, path.slice(1));
      if (path[path.length - 1] !== fieldName && !prevObj.showError) {
        return;
      }
      isValidated = false;
      let obj = this.multipleDefinition[path[0]];
      obj = SchemaFormUtil.getDefinitionFromPath(obj, path.slice(1));

      if (obj == null) {
        return;
      }

      obj.showError = error.message;
      obj.validationErrorText = error.message;
    });

    this.forceUpdate();

    this.errors = isValidated;
    return isValidated;
  }

  getTriggerSubmit(formKey, triggerSubmit) {
    this.submitMap[formKey] = triggerSubmit;
  }

  getSubHeader(name) {
    return (
      <div key={name} className="row">
        <div className="h5 column-12">
          {name}
        </div>
      </div>
    );
  }

  getServiceHeader() {
    return (
      <div className="media-object-spacing-wrapper media-object-spacing-narrow flush">
        <div className="media-object media-object-align-middle">
          <div className="media-object-item">
            <img
              className="icon icon-sprite icon-sprite-medium
                icon-sprite-medium-color"
              src={this.props.serviceImage} />
          </div>
          <div className="media-object-item">
            <h4 className="flush-top flush-bottom text-color-neutral">
              {this.props.serviceName}
            </h4>
            <span className="side-panel-resource-label">
              {this.props.serviceVersion}
            </span>
          </div>
        </div>
      </div>
    );
  }

  getSideContent(multipleDefinition) {
    let currentTab = this.state.currentTab;
    let {handleTabClick} = this;
    let isMobileWidth = this.props.isMobileWidth;
    let tabValues = _.values(multipleDefinition);

    let content = (
      <SideTabs
        isMobileWidth={isMobileWidth}
        onTabClick={handleTabClick}
        selectedTab={currentTab}
        tabs={tabValues} />
    );

    let classSet = classNames({
      'column-4': !isMobileWidth,
      'column-12 mobile-column': isMobileWidth
    });

    return (
      <GeminiScrollbar autoshow={true} className={classSet}>
        <div className="multiple-form-left-column">
          {this.getServiceHeader()}
          {content}
        </div>
      </GeminiScrollbar>
    );
  }

  getFormPanels() {
    let currentTab = this.state.currentTab;
    let multipleDefinition = this.multipleDefinition;
    let formKeys = Object.keys(multipleDefinition);

    let panels = formKeys.map((formKey, i) => {
      let panelClassSet = classNames('form', {
        'hidden': currentTab !== formKey
      });

      return (
        <FormPanel
          className={panelClassSet}
          currentTab={this.state.currentTab}
          definition={multipleDefinition[formKey]}
          getTriggerSubmit={this.getTriggerSubmit.bind(this, formKey)}
          key={i}
          onSubmit={this.handleFormSubmit.bind(this, formKey)}
          onFormChange={this.handleFormChange} />
      );
    });

    let isMobileWidth = this.props.isMobileWidth;
    let classSet = classNames({
      'column-8 multiple-form-right-column': !isMobileWidth,
      'column-12': isMobileWidth
    });

    return (
      <GeminiScrollbar autoshow={true} className={classSet}>
        {panels}
      </GeminiScrollbar>
    );
  }

  render() {
    let multipleDefinition = this.multipleDefinition;
    let isMobileWidth = this.props.isMobileWidth;

    let classSet = classNames(
      'row row-flex multiple-form',
      this.props.className,
      {
       'mobile-width': isMobileWidth
      }
    );

    return (
      <div className={classSet}>
        {this.getSideContent(multipleDefinition)}
        {this.getFormPanels()}
      </div>
    );
  }
}

SchemaForm.defaultProps = {
  className: '',
  getTriggerSubmit: function () {},
  schema: {}
};

SchemaForm.propTypes = {
  isMobileWidth: React.PropTypes.bool,
  getTriggerSubmit: React.PropTypes.func,
  schema: React.PropTypes.object,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = SchemaForm;
