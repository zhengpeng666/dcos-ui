import classNames from 'classnames';
import {Confirm} from 'reactjs-components';
import React from 'react';

import ReviewConfig from './ReviewConfig';
import {schema as boomski} from './__tests__/fixtures/MarathonConfigFixture';
import SchemaForm from './SchemaForm';

const METHODS_TO_BIND = [
  'changeReviewState',
  'getTriggerSubmit',
  'handleInstallClick',
  'handleSchemaFormChange',
  'handleReviewClick',
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

  handleSchemaFormChange(hasNoErrors) {
    let hasFormErrors = !hasNoErrors;
    if (hasFormErrors !== this.state.hasFormErrors) {
      this.setState({hasFormErrors});
    }
  }

  handleInstallClick() {
    console.log('Installing!');
  }

  handleReviewClick() {
    let submitInfo = this.triggerSubmit();

    if (submitInfo.errors === 0) {
      this.model = submitInfo.model;
      this.definition = submitInfo.definition;
      this.changeReviewState(true);
    }

  }

  isMobileWidth(element) {
    return element.innerWidth <= MOBILE_WIDTH;
  }

  isReviewing() {
    return this.state.reviewingConfig;
  }

  getTriggerSubmit(triggerSubmit) {
    this.triggerSubmit = triggerSubmit;
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

    return this.handleReviewClick;
  }

  getModalContents() {
    let isReviewing = this.isReviewing();
    let reviewClassSet = classNames({
      hidden: !isReviewing
    });

    let schemaFormClassSet = classNames({
      hidden: isReviewing
    });

    return [
      <SchemaForm
        className={schemaFormClassSet}
        definition={this.definition}
        getTriggerSubmit={this.getTriggerSubmit}
        isMobileWidth={this.state.isMobileWidth}
        key="schemaForm"
        model={this.model}
        onChange={this.handleSchemaFormChange}
        schema={this.props.schema} />,
      <ReviewConfig
        className={reviewClassSet}
        jsonDocument={this.model}
        key="reviewConfig" />
    ];
  }

  render() {
    let rightButtonClassName = classNames(
      'button button-success button-large',
      {
        disabled: this.state.hasFormErrors
      }
    );

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
        rightButtonClassName={rightButtonClassName}
        rightButtonText={this.getRightButtonText()}
        titleClass="modal-header-title text-align-center flush">
        {this.getModalContents()}
      </Confirm>
    );
  }
}

AdvancedConfigModal.defaultProps = {
  schema: boomski,
  onClose: function () {},
  open: false
};

AdvancedConfigModal.propTypes = {
  schema: React.PropTypes.object,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = AdvancedConfigModal;
