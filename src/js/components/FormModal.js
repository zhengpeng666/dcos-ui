import classNames from "classnames";
import {Modal} from "reactjs-components";
import React from "react";

import Form from "./Form";

const METHODS_TO_BIND = ["getTriggerSubmit", "handleTriggerSubmit"];

export default class FormModal extends React.Component {
  constructor() {
    super();
    this.triggerSubmit = function () {};

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleTriggerSubmit() {
    this.triggerSubmit();
  }

  getTriggerSubmit(trigger) {
    this.triggerSubmit = trigger;
    this.forceUpdate();
  }

  handleNewButtonClick() {
    this.triggerSubmit();
  }

  getButtons() {
    return this.props.buttonDefinition.map((buttonDefinition, i) => {
      let buttonClassSet = {
        "disabled": this.props.disabled
      };
      buttonClassSet[buttonDefinition.className] = true;
      buttonClassSet = classNames(buttonClassSet);

      let handleOnClick = function () {};
      if (buttonDefinition.isClose) {
        handleOnClick = this.props.onClose;
      }

      if (buttonDefinition.isSubmit) {
        handleOnClick = this.handleTriggerSubmit;
      }

      if (buttonDefinition.onClick) {
        handleOnClick = buttonDefinition.onClick;
      }

      return (
        <a
          className={buttonClassSet}
          key={i}
          onClick={handleOnClick}>
          {buttonDefinition.text}
        </a>
      );
    });
  }

  getFooter() {
    return (
      <div className="container container-pod container-pod-short">
        {this.getLoadingScreen()}
        <div className="button-collection text-align-center">
          {this.getButtons()}
        </div>
      </div>
    );
  }

  getLoadingScreen() {
    if (!this.props.disabled) {
      return null;
    }

    return (
      <div className="
        container
        container-pod
        container-pod-short
        text-align-center
        vertical-center
        inverse
        flush-top">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getContent() {
    return (
      <div className="container container-pod flush-top flush-bottom">
        <Form
          definition={this.props.definition}
          triggerSubmit={this.getTriggerSubmit}
          onSubmit={this.props.onSubmit} />
      </div>
    );
  }

  render() {
    return (
      <Modal
        closeByBackdropClick={!this.props.disabled}
        headerContainerClass="container container-pod container-pod-short"
        headerClass="modal-header modal-header-white"
        modalClass="modal"
        onClose={this.props.onClose}
        open={this.props.open}
        showCloseButton={false}
        showHeader={true}
        showFooter={true}
        footer={this.getFooter()}
        titleClass="modal-header-title text-align-center flush-top
          flush-bottom"
        titleText={this.props.titleText}
        {...this.props.modalProps}>
        {this.getContent()}
      </Modal>
    );
  }
}

FormModal.defaultProps = {
  buttonDefinition: [
    {
      text: "Close",
      className: "button button-large",
      isClose: true
    },
    {
      text: "Create",
      className: "button button-success button-large",
      isSubmit: true
    }
  ],
  disabled: false,
  onClose: function () {},
  open: false,
  submitText: "Create",
  cancelText: "Cancel",
  modalProps: {}
};

FormModal.propTypes = {
  buttonDefinition: React.PropTypes.array,
  disabled: React.PropTypes.bool,
  modalProps: React.PropTypes.object,
  onClose: React.PropTypes.func.isRequired,
  open: React.PropTypes.bool,
  titleText: React.PropTypes.string
};
