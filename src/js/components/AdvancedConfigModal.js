import {Confirm} from 'reactjs-components';
import React from 'react';

import MultipleForm from './MultipleForm';
// Not implemented yet.
// import ReviewConfig from './ReviewConfig';

const METHODS_TO_BIND = [
  'changeReviewState',
  'handleInstallClick'
];

export default class AdvancedConfigModal extends React.Component {
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
      return 'Install';
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
      // Not implemented yet.
      // return <ReviewConfig multipleDefinition={this.props.multipleDefinition}/>;
      return null;
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
  onClose: function () {},
  open: false
};

AdvancedConfigModal.propTypes = {
  multipleDefinition: React.PropTypes.object,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool
};
