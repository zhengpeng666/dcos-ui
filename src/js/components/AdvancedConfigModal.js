import {Confirm} from 'reactjs-components';
import React from 'react';

import MultipleForm from './MultipleForm';

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
      return <h1>I'm reviewing the config</h1>;
    }

    return <MultipleForm />;
  }

  render() {
    return (
      <Confirm
        modalWrapperClass="modal-generic-error"
        modalClass="modal modal-large"
        onClose={this.props.onClose}
        open={this.props.open}
        leftButtonText={this.getLeftButtonText()}
        leftButtonCallback={this.getLeftButtonCallback()}
        rightButtonClassName="button button-success"
        rightButtonText={this.getRightButtonText()}
        rightButtonCallback={this.getRightButtonCallback()}
        titleClass="modal-header-title text-align-center flush">
        {this.getModalContents()}
      </Confirm>
    );
  }
}

AdvancedConfigModal.defaultProps = {
  onClose: function () {},
  open: false
};

AdvancedConfigModal.propTypes = {
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool
};
