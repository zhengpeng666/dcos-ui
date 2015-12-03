import React from "react";

import ACLUserStore from "../stores/ACLUserStore";
import EventTypes from "../constants/EventTypes";
import FormModal from "./FormModal";

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
