import _ from 'underscore';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';

import FormPanel from './FormPanel';
import SideTabs from './SideTabs';

const METHODS_TO_BIND = ['handleFormChange', 'handleTabClick'];

export default class MultipleForm extends React.Component {
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
          {this.getServiceHeader()}
          {tabs}
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
        <GeminiScrollbar autoshow={true} className="column-8">
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
  multipleDefinition: {
    Application: {
      title: 'Application',
      description: 'Lorem ipsum dolor sit amet',
      definition: [
        {
          fieldType: 'text',
          name: 'Name',
          placeholder: 'Name',
          required: false,
          showError: false,
          showLabel: true,
          writeType: 'input',
          validation: function () { return true; },
          value: ''
        },
        {
          fieldType: 'text',
          name: 'CPU',
          placeholder: 'CPU',
          required: false,
          showError: false,
          showLabel: true,
          writeType: 'input',
          validation: function () { return true; },
          value: ''
        }
      ]
    },
    'JVM Configuration': {
      title: 'JVM Configuration'
    },
    'Command Line Flags': {
      title: 'Command Line Flags'
    },
    'Environment & Executor': {
      title: 'Environment & Executor'
    },
    'Framework & Host': {
      title: 'Framework & Host',
      description: 'Lorem ipsum dolor sit amet',
      definition: [
        {
          name: 'Subheader',
          definition: [
            {
              fieldType: 'text',
              name: 'Framework Name',
              placeholder: 'Framework Name',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            }
          ]
        },

        {
          name: 'Subheader 2',
          definition: [
            {
              fieldType: 'text',
              name: 'Hostname',
              placeholder: 'Hostname',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            },
            {
              fieldType: 'text',
              name: 'CPU',
              placeholder: 'CPU',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            },
            {
              fieldType: 'text',
              name: 'Memory',
              placeholder: 'Memory',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            },
            {
              fieldType: 'text',
              name: 'CPU',
              placeholder: 'CPU',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            },
            {
              fieldType: 'text',
              name: 'Memory',
              placeholder: 'Memory',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            },
            {
              fieldType: 'text',
              name: 'CPU',
              placeholder: 'CPU',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            },
            {
              fieldType: 'text',
              name: 'Memory',
              placeholder: 'Memory',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            }
          ]
        }
      ]
    },
    'Launch Tokens': {
      title: 'Launch Tokens'
    },
    'Mesos Master': {
      title: 'Mesos Master'
    },
    'Mesos Configuration': {
      title: 'Mesos Configuration'
    },
    'Plugins': {
      title: 'Plugins'
    },
    'SSL': {
      title: 'SSL'
    },
    'Zookeeper': {
      title: 'Zookeeper'
    }
  },
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
