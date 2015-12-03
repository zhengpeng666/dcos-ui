import React from "react";

import EventTypes from "../constants/EventTypes";
import FormModal from "./FormModal";
import ACLUserStore from "../stores/ACLUserStore";

const METHODS_TO_BIND = [
  "handleNewUserSubmit",
  "handleUserCreation"
];

export default class UserFormModal extends React.Component {
  constructor() {
    super();

    this.state = {
      disableNewUser: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleUserCreation() {
    ACLUserStore.removeChangeListener(
      EventTypes.ACL_USER_CREATE_SUCCESS,
      this.handleUserCreation
    );

    this.setState({disableNewUser: false});
    this.props.onClose();
  }

  handleNewUserSubmit(model) {
    this.setState({disableNewUser: true});

    ACLUserStore.addChangeListener(
      EventTypes.ACL_USER_CREATE_SUCCESS,
      this.handleUserCreation
    );

    ACLUserStore.addUser(model);
  }

  getNewUserFormDefinition() {
    return [
      {
        name: "description",
        value: "",
        validation: function () { return true; },
        placeholder: "Full name",
        fieldType: "text",
        required: true,
        showLabel: false,
        showError: false,
        writeType: "input"
      },
      {
        name: "username",
        value: "",
        validation: function () { return true; },
        placeholder: "Username",
        fieldType: "text",
        required: true,
        showLabel: false,
        showError: false,
        writeType: "input"
      },
      {
        name: "password",
        value: "",
        validation: function () { return true; },
        placeholder: "Password",
        fieldType: "password",
        required: true,
        showLabel: false,
        writeType: "input"
      }
    ];
  }

  render() {
    return (
      <FormModal
        disabled={this.state.disableNewUser}
        onClose={this.props.onClose}
        onSubmit={this.handleNewUserSubmit}
        open={this.props.open}
        definition={this.getNewUserFormDefinition()}
        titleText="Create New Local User" />
    );
  }
}
