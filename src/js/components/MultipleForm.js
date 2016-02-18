import _ from 'underscore';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';

import FormPanel from './FormPanel';
import SideTabs from './SideTabs';

const METHODS_TO_BIND = ['handleFormChange', 'handleTabClick'];

class MultipleForm extends React.Component {
  constructor() {
    super();

    this.state = {
      currentTab: '',
      useGemini: false,
      model: {}
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    this.setState({
      currentTab: Object.keys(this.props.multipleDefinition)[0]
    });
  }

  componentDidMount() {
    this.setState({useGemini: true});
  }

  handleTabClick(tab) {
    this.setState({currentTab: tab});
  }

  handleFormChange(formData) {
    this.validateWithSchema(formData);
  }

  validateWithSchema() {
    // Nothing to do for now.
  }

  getServiceHeader() {
    return (
      <div className="media-object media-object-align-middle">
        <div className="media-object-item media-object-item-spacing">
          <img
            className="icon icon-sprite icon-sprite-medium
              icon-sprite-medium-color"
            src={this.props.serviceImage} />
        </div>
        <div className="media-object-item media-object-item-spacing">
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

  getSideTabs(multipleDefinition) {
    var tabs = (
      <SideTabs
        onTabClick={this.handleTabClick}
        selectedTab={this.state.currentTab}
        tabs={_.values(multipleDefinition)} />
    );

    if (this.state.useGemini) {
      return (
        <GeminiScrollbar autoshow={true} className="column-4">
          <div className="multiple-form-left-column">
            {this.getServiceHeader()}
            {tabs}
          </div>
        </GeminiScrollbar>
      );
    }

    return (
      <div className="column-4">
        {this.getServiceHeader()}
        {tabs}
      </div>
    );
  }

  getFormPanel(selectedTabDefinition) {
    var panel = (
      <FormPanel
        definition={selectedTabDefinition.definition}
        description={selectedTabDefinition.description}
        title={selectedTabDefinition.title} />
    );

    if (this.state.useGemini) {
      return (
        <GeminiScrollbar autoshow={true} className="column-8 multiple-form-right-column">
          {panel}
        </GeminiScrollbar>
      );
    }

    return (
      <div className="column-8">
        {panel}
      </div>
    );
  }

  render() {
    let multipleDefinition = this.props.multipleDefinition;
    let selectedTabDefinition = multipleDefinition[this.state.currentTab];
    if (!selectedTabDefinition) {
      selectedTabDefinition = {};
    }

    return (
      <div className="row row-flex multiple-form">
        {this.getSideTabs(multipleDefinition)}
        {this.getFormPanel(selectedTabDefinition)}
      </div>
    );
  }
}

MultipleForm.defaultProps = {
  multipleDefinition: {},
  serviceImage: './img/services/icon-service-marathon-large@2x.png',
  serviceName: 'Marathon',
  serviceVersion: '0.23.2'
};

MultipleForm.propTypes = {
  multipleDefinition: React.PropTypes.object,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = MultipleForm;
