import React from 'react';

import SideTabs from './SideTabs';

const METHODS_TO_BIND = ['handleFormChange', 'handleTabClick'];

export default class MultipleForm extends React.Component {
  constructor() {
    super();

    this.state = {
      currentTab: '',
      model: {}
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    this.setState({
      currentTab: this.props.multipleDefinition[0].name
    });
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

  render() {
    let multipleDefinition = this.props.multipleDefinition;
    let selectedTabDefinition = multipleDefinition[this.state.currentTab];
    if (!selectedTabDefinition) {
      selectedTabDefinition = {};
    }

    return (
      <div className="flex-row">
        <div className="column-4">
          {this.getServiceHeader()}
          <SideTabs
            onTabClick={this.handleTabClick}
            selectedTab={this.state.currentTab}
            tabs={multipleDefinition} />
        </div>
        <div className="column-8">
        </div>
      </div>
    );
  }
}

MultipleForm.defaultProps = {
  multipleDefinition: [
    {
      name: 'Application'
    },
    {
      name: 'JVM Configuration'
    },
    {
      name: 'Command Line Flags'
    },
    {
      name: 'Environment & Executor'
    },
    {
      name: 'Framework & Host'
    },
    {
      name: 'Launch Tokens'
    },
    {
      name: 'Mesos Master'
    },
    {
      name: 'Mesos Configuration'
    },
    {
      name: 'Plugins'
    },
    {
      name: 'SSL'
    },
    {
      name: 'Zookeeper'
    }
  ],
  serviceImage: './img/services/icon-service-marathon-large@2x.png',
  serviceName: 'Marathon',
  serviceVersion: '0.23.2'
};

MultipleForm.propTypes = {
  multipleDefinition: React.PropTypes.array,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};
