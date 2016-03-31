import _ from 'underscore';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import UserStore from '../../stores/UserStore';

import ActionsModal from './ActionsModal';

class UsersActionsModal extends ActionsModal {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'user',
        events: ['deleteError', 'deleteSuccess']
      }
    ];

  }

  onUserStoreDeleteError(validationError) {
    this.setState({validationError, pendingRequest: false});
  }

  onUserStoreDeleteSuccess() {
    this.setState({validationError: null, pendingRequest: false});
  }

  handleButtonConfirm() {
    let {itemID, selectedItems} = this.props;
    let itemsByID = _.pluck(selectedItems, itemID);

    itemsByID.forEach(function (userID) {
      UserStore.deleteUser(userID);
    });

    this.setState({pendingRequest: true});
  }
}

UsersActionsModal.propTypes = {
  action: React.PropTypes.string.isRequired,
  actionText: React.PropTypes.object.isRequired,
  itemID: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired,
  selectedItems: React.PropTypes.array.isRequired
};

module.exports = UsersActionsModal;
