/* eslint-disable no-unused-vars */
import React from "react";
/* eslint-enable no-unused-vars */

import ACLGroupStore from "../stores/ACLGroupStore";
import FormModal from "./FormModal";
import StoreMixin from "../mixins/StoreMixin";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleNewGroupSubmit",
  "onGroupStoreCreate"
];

export default class GroupFormModal extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disableNewGroup: false
    };

    this.store_listeners = [
      {name: "group", events: ["create"], listenAlways: false}
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onGroupStoreCreate() {
    this.setState({disableNewGroup: false});
    this.props.onClose();
  }

  handleNewGroupSubmit(model) {
    this.setState({disableNewGroup: true});
    ACLGroupStore.addGroup(model);
  }

  getNewGroupFormDefinition() {
    return [
      {
        fieldType: "text",
        name: "description",
        placeholder: "Group name",
        required: true,
        showError: false,
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
        disabled={this.state.disableNewGroup}
        onClose={this.props.onClose}
        onSubmit={this.handleNewGroupSubmit}
        open={this.props.open}
        definition={this.getNewGroupFormDefinition()}
        titleText="Create New Local Group" />
    );
  }
}
