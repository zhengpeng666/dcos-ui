import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLUserStore from '../stores/ACLUserStore';
import FormModal from '../../../../../src/js/components/FormModal';

const METHODS_TO_BIND = [
  'handleNewUserSubmit',
  'onUserStoreCreateSuccess'
];

module.exports = class UserFormModal extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disableNewUser: false,
      errorMsg: false
    };

    this.store_listeners = [
      {
        name: 'user',
        events: ['createSuccess', 'createError']
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onUserStoreCreateSuccess() {
    this.setState({
      disableNewUser: false,
      errorMsg: false
    });
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
        fieldType: 'text',
        name: 'description',
        placeholder: 'Full Name',
        required: true,
        showError: false,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      },
      {
        fieldType: 'text',
        name: 'uid',
        placeholder: 'Username',
        required: true,
        showError: false,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
      },
      {
        fieldType: 'password',
        name: 'password',
        placeholder: 'Password',
        required: true,
        showError: this.state.errorMsg,
        showLabel: false,
        writeType: 'input',
        validation: function () { return true; },
        value: ''
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
        titleText="Create New User">
        <h2 className="modal-header-title text-align-center flush-top">
          Create New User
        </h2>
      </FormModal>
    );
  }
};
