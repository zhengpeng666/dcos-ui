import {Confirm} from 'reactjs-components';
import React from 'react';

import MultipleForm from './MultipleForm';
import ReviewConfig from './ReviewConfig';

const METHODS_TO_BIND = [
  'changeReviewState',
  'handleInstallClick'
];

class AdvancedConfigModal extends React.Component {
  constructor() {
    super();

    this.state = {
      reviewingConfig: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open && !this.props.open) {
      this.setState({reviewingConfig: false});
    }
  }

  changeReviewState(reviewing) {
    this.setState({reviewingConfig: reviewing});
  }

  handleInstallClick() {
    console.log('Installing!');
  }

  isReviewing() {
    return this.state.reviewingConfig;
  }

  getLeftButtonText() {
    if (this.isReviewing()) {
      return 'Back';
    }

    return 'Cancel';
  }

  getLeftButtonCallback() {
    if (this.isReviewing()) {
      return this.changeReviewState.bind(this, false);
    }

    return this.props.onClose;
  }

  getRightButtonText() {
    if (this.isReviewing()) {
      return 'Install Package';
    }

    return 'Review and Install';
  }

  getRightButtonCallback() {
    if (this.isReviewing()) {
      return this.handleInstallClick;
    }

    return this.changeReviewState.bind(this, true);
  }

  getModalContents() {
    if (this.isReviewing()) {
      return <ReviewConfig multipleDefinition={this.props.multipleDefinition}/>;
    }

    return <MultipleForm multipleDefinition={this.props.multipleDefinition}/>;
  }

  render() {
    return (
      <Confirm
        innerBodyClass=""
        leftButtonCallback={this.getLeftButtonCallback()}
        leftButtonClassName="button button-large"
        leftButtonText={this.getLeftButtonText()}
        modalClass="modal modal-large"
        modalWrapperClass="multiple-form-modal"
        onClose={this.props.onClose}
        open={this.props.open}
        rightButtonCallback={this.getRightButtonCallback()}
        rightButtonClassName="button button-success button-large"
        rightButtonText={this.getRightButtonText()}
        titleClass="modal-header-title text-align-center flush">
        {this.getModalContents()}
      </Confirm>
    );
  }
}

AdvancedConfigModal.defaultProps = {
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
      title: 'JVM Configuration',
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
        }
      ]
    },
    'Command Line Flags': {
      title: 'Command Line Flags',
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
        }
      ]
    },
    'Environment & Executor': {
      title: 'Environment & Executor',
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
        }
      ]
    },
    'Framework & Host': {
      title: 'Framework & Host',
      description: 'Lorem ipsum dolor sit amet',
      definition: [
        {
          name: 'Subdivider',
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
          name: 'Subdivider 2',
          definition: [
            {
              fieldType: 'text',
              name: 'Hostname',
              placeholder: 'i.e. http_callback',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            },
            {
              fieldType: 'text',
              name: 'HTTP Address',
              placeholder: 'Placeholder Text',
              required: false,
              showError: false,
              showLabel: true,
              writeType: 'input',
              validation: function () { return true; },
              value: ''
            },
            {
              fieldType: 'text',
              name: 'HTTP Credentials',
              placeholder: 'Placeholder Text',
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
      title: 'Launch Tokens',
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
        }
      ]
    },
    'Mesos Master': {
      title: 'Mesos Master',
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
        }
      ]
    },
    'Mesos Configuration': {
      title: 'Mesos Configuration',
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
        }
      ]
    },
    'Plugins': {
      title: 'Plugins',
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
        }
      ]
    },
    'SSL': {
      title: 'SSL',
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
        }
      ]
    },
    'Zookeeper': {
      title: 'Zookeeper',
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
        }
      ]
    }
  },
  onClose: function () {},
  open: false
};

AdvancedConfigModal.propTypes = {
  multipleDefinition: React.PropTypes.object,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = AdvancedConfigModal;
