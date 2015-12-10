import {Modal} from "reactjs-components";
/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import StoreMixin from "../mixins/StoreMixin";
import StoreUtil from "../utils/StoreUtil";
import Util from "../utils/Util";

const METHODS_TO_BIND = ["handleModalClose"];

function handleServerError(id, errorMessage) {
  let errors = this.state.errors.concat([errorMessage]);

  this.setState({
    errors,
    isOpen: true
  });
}

function getEventsFromStoreListeners(storeListeners) {
  let events = [];

  storeListeners.forEach(function (store) {
    store.events.forEach(function (storeEvent) {
      events.push(StoreUtil.getChangeFunctionName(store.name, storeEvent));
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

    getEventsFromStoreListeners(this.store_listeners).forEach((event) => {
      this[event] = handleServerError.bind(this);
    });

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleModalClose() {
    this.setState({
      isOpen: false,
      errors: []
    });
  }

  getContent() {
    let errors = this.state.errors.map(function (error, i) {
      return (
        <p key={i}>
          {error}
        </p>
      );
    });

    return (
      <div className="container container-pod">
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
        titleClass="modal-header-title text-align-center flush-top"
        titleText="An error has occurred">
        {this.getContent()}
      </Modal>
    );
  }
}
