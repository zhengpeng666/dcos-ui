import {Confirm} from 'reactjs-components';
import React from 'react';

import MultipleForm from './MultipleForm';
import ReviewConfig from './ReviewConfig';
import {schema as boomski} from './__tests__/fixtures/MarathonConfigFixture';
import SchemaUtil from '../utils/SchemaUtil';

const METHODS_TO_BIND = [
  'changeReviewState',
  'handleInstallClick',
  'onResize'
];
const MOBILE_WIDTH = 480;

class AdvancedConfigModal extends React.Component {
  constructor() {
    super();

    this.state = {
      isMobileWidth: false,
      reviewingConfig: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    this.setState({isMobileWidth: this.isMobileWidth(global.window)});
    global.window.addEventListener('resize', this.onResize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open && !this.props.open) {
      this.setState({reviewingConfig: false});
    }
  }

  componentWillUnmount() {
    global.window.removeEventListener('resize', this.onResize);
  }

  changeReviewState(reviewing) {
    this.setState({reviewingConfig: reviewing});
  }

  onResize(e) {
    if (!this.props.open) {
      return;
    }

    let isMobileWidth = this.isMobileWidth(e.target);
    if (isMobileWidth) {
      this.setState({isMobileWidth: true});
    } else if (this.state.isMobileWidth) {
      this.setState({isMobileWidth: false});
    }
  }

  handleInstallClick() {
    console.log('Installing!');
  }

  isMobileWidth(element) {
    return element.innerWidth <= MOBILE_WIDTH;
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
      let jsonDocument = SchemaUtil.definitionToJSONDocument(
        this.props.multipleDefinition
      );

      return (
        <ReviewConfig
          jsonDocument={jsonDocument}/>
      );
    }

    return (
      <MultipleForm
        multipleDefinition={this.props.multipleDefinition}
        isMobileWidth={this.state.isMobileWidth}/>
    );
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
  multipleDefinition: SchemaUtil.schemaToMultipleDefinition(boomski),
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
