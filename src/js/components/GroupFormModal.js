import React from "react";

import EventTypes from "../constants/EventTypes";
import FormModal from "./FormModal";
import ACLGroupStore from "../stores/ACLGroupStore";

const METHODS_TO_BIND = [
  "handleNewGroupSubmit",
  "handleGroupCreation"
];

export default class GroupFormModal extends React.Component {
  constructor() {
    super();

    this.state = {
      disableNewGroup: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleGroupCreation() {
    ACLGroupStore.removeChangeListener(
      EventTypes.ACL_GROUP_CREATE_SUCCESS,
      this.handleGroupCreation
    );

    this.setState({disableNewGroup: false});
    this.props.onClose();
  }

  handleNewGroupSubmit(model) {
    this.setState({disableNewGroup: true});

    ACLGroupStore.addChangeListener(
      EventTypes.ACL_GROUP_CREATE_SUCCESS,
      this.handleGroupCreation
    );

    ACLGroupStore.addGroup(model);
  }

  getNewGroupFormDefinition() {
    return [
      {
        name: "description",
        value: "",
        validation: function () { return true; },
        placeholder: "Group name",
        fieldType: "text",
        required: true,
        showLabel: false,
        showError: false,
        writeType: "input"
      }
    ];
  }

  render() {
    return (
      <FormModal
        disabled={this.state.disableNewGroup}
        onClose={this.props.onClose}
        onSubmit={this.handleNewGroupSubmit}
        open={this.props.open}
        definition={this.getNewGroupFormDefinition()}
        titleText="Create New Local Group" />
    );
  }
}
