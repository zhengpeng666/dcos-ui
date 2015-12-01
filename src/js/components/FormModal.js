import classNames from "classnames";
import {Modal} from "reactjs-components";
import React from "react";

import Form from "./Form";

export default class FormModal extends React.Component {
  getFooter() {
    let closeButtonClassSet = classNames({
      "button button-large": true,
      "disabled": this.props.disabled
    });

    let createButtonClassSet = classNames({
      "button button-success button-large": true,
      "disabled": this.props.disabled
    });

    console.log(this.props.disabled);

    return (
      <div className="container container-pod container-pod-short">
        {this.getLoadingScreen()}
        <div className="button-collection text-align-center">
          <a
            className={closeButtonClassSet}
            onClick={this.props.onClose}>
            Cancel
          </a>
          <a
            className={createButtonClassSet}
            onClick={this.props.onSubmit}>Create</a>
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
          triggerSubmit={function () {}}
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
        showFooter={true}
        footer={this.getFooter()}
        titleClass="modal-header-title text-align-center flush-top
          flush-bottom"
        titleText="Create New Local User">
        {this.getContent()}
      </Modal>
    );
  }
}

FormModal.propTypes = {
  onClose: React.PropTypes.func.isRequired
};
