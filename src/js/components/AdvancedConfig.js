import React from 'react';

import SchemaForm from './SchemaForm';

const METHODS_TO_BIND = [
  'getTriggerSubmit',
  'handleSchemaFormChange',
  'triggerSubmit',
  'onResize'
];
const MOBILE_WIDTH = 1500;

class AdvancedConfig extends React.Component {
  constructor() {
    super();

    this.state = {
      isMobileWidth: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    this.setState({isMobileWidth: this.isMobileWidth(global.window)});
    global.window.addEventListener('resize', this.onResize);
    this.props.getTriggerSubmit(this.triggerSubmit);
  }

  componentWillUnmount() {
    global.window.removeEventListener('resize', this.onResize);
  }

  onResize(e) {
    let isMobileWidth = this.isMobileWidth(e.target);
    if (isMobileWidth !== this.state.isMobileWidth) {
      this.setState({isMobileWidth});
    }
  }

  handleSchemaFormChange(hasNoErrors) {
    let hasFormErrors = !hasNoErrors;
    this.props.onChange(hasFormErrors);
  }

  triggerSubmit() {
    return this.triggerSchemaSubmit();
  }

  isMobileWidth(element) {
    return element.innerWidth <= MOBILE_WIDTH;
  }

  getTriggerSubmit(triggerSubmit) {
    this.triggerSchemaSubmit = triggerSubmit;
  }

  render() {
    return (
      <div className={this.props.className}>
        <SchemaForm
          getTriggerSubmit={this.getTriggerSubmit}
          isMobileWidth={this.state.isMobileWidth}
          onChange={this.handleSchemaFormChange}
          schema={this.props.schema}
          serviceName={this.props.serviceName}
          serviceImage={this.props.serviceImage}
          serviceVersion={this.props.serviceVersion} />
      </div>
    );
  }
}

AdvancedConfig.defaultProps = {
  getTriggerSubmit: function () {},
  onChange: function () {},
  schema: {},
  serviceImage: './img/services/icon-service-marathon-large@2x.png',
  serviceName: 'Marathon',
  serviceVersion: '0.23.2'
};

AdvancedConfig.propTypes = {
  getTriggerSubmit: React.PropTypes.func,
  onChange: React.PropTypes.func,
  schema: React.PropTypes.object,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = AdvancedConfig;
