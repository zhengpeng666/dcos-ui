import {Modal} from "reactjs-components";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import StoreMixin from "../mixins/StoreMixin";
import Util from "../utils/Util";

const METHODS_TO_BIND = ["handleModalClose", "handleServerError"];

function getEventsFromStoreListeners(storeListeners) {
  let events = [];

  storeListeners.forEach((store) => {
    store.events.forEach((storeEvent) => {
      events.push(this.store_getChangeFunctionName(store.name, storeEvent));
    });
  });

  return events;
}

export default class ServerErrorModal extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      isOpen: false,
      errors: []
    };

    this.store_listeners = [
      {name: "user", events: ["updateError", "deleteError"]},
      {name: "group", events: ["updateError", "deleteError"]}
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    let events = getEventsFromStoreListeners.call(this, this.store_listeners);
    events.forEach((event) => {
      this[event] = this.handleServerError;
    });
  }

  handleModalClose() {
    this.setState({
      isOpen: false,
      errors: []
    });
  }

  handleServerError(id, errorMessage) {
    let errors = this.state.errors.concat([errorMessage]);

    this.setState({
      errors,
      isOpen: true
    });
  }

  getContent() {
    let errors = this.state.errors.map(function (error, i) {
      return (
        <p className="text-align-center" key={i}>
          {error}
        </p>
      );
    });

    return (
      <div className="container container-pod container-pod-short">
        {errors}
      </div>
    );
  }

  render() {
    return (
      <Modal
        headerContainerClass="container container-pod container-pod-short"
        maxHeightPercentage={0.9}
        modalClass="modal"
        onClose={this.handleModalClose}
        open={this.state.isOpen}
        showCloseButton={false}
        showHeader={true}
        showFooter={false}
        titleClass="modal-header-title text-align-center flush"
        titleText="An error has occurred">
        {this.getContent()}
      </Modal>
    );
  }
}
