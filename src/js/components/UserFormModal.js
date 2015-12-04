/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import ACLUserStore from "../stores/ACLUserStore";
import FormModal from "./FormModal";
import StoreMixin from "../mixins/StoreMixin";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleNewUserSubmit",
  "onUserStoreCreateSuccess"
];

export default class UserFormModal extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disableNewUser: false,
      errorMsg: false
    };

    this.store_listeners = [
      {
        name: "user",
        events: ["createSuccess", "createError"]
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onUserStoreCreateSuccess() {
    this.setState({disableNewUser: false});
    this.props.onClose();
  }

  onUserStoreCreateError(errorMsg) {
    this.setState({
      disableNewUser: false,
      errorMsg
    });
  }

  handleNewUserSubmit(model) {
    this.setState({disableNewUser: true});
    ACLUserStore.addUser(model);
  }

  getNewUserFormDefinition() {
    return [
      {
        fieldType: "text",
        name: "description",
        placeholder: "Full name",
        required: true,
        showError: false,
        showLabel: false,
        writeType: "input",
        validation: function () { return true; },
        value: ""
      },
      {
        fieldType: "text",
        name: "username",
        placeholder: "Username",
        required: true,
        showError: false,
        showLabel: false,
        writeType: "input",
        validation: function () { return true; },
        value: ""
      },
      {
        fieldType: "password",
        name: "password",
        placeholder: "Password",
        required: true,
        showError: this.state.errorMsg,
        showLabel: false,
        writeType: "input",
        validation: function () { return true; },
        value: ""
      }
    ];
  }

  render() {
    return (
      <FormModal
        definition={this.getNewUserFormDefinition()}
        disabled={this.state.disableNewUser}
        onClose={this.props.onClose}
        onSubmit={this.handleNewUserSubmit}
        open={this.props.open}
        titleText="Create New Local User" />
    );
  }
}
