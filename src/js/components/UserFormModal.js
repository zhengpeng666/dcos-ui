/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import ACLUserStore from "../stores/ACLUserStore";
import FormModal from "./FormModal";
import Util from "../utils/Util";
import StoreMixin from "../mixins/StoreMixin";

const METHODS_TO_BIND = [
  "handleNewUserSubmit",
  "onUserStoreCreateSuccess"
];

export default class UserFormModal extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disableNewUser: false
    };

    this.store_listeners = [
      {name: "user", events: ["createSuccess"], listenAlways: false}
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onUserStoreCreateSuccess() {
    this.setState({disableNewUser: false});
    this.props.onClose();
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
