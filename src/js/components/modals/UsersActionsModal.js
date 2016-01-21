import _ from 'underscore';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import ACLUserStore from '../../stores/ACLUserStore';
import ACLGroupStore from '../../stores/ACLGroupStore';
import ACLGroupsStore from '../../stores/ACLGroupsStore';
import ActionsModal from './ActionsModal';
import Util from '../../utils/Util';

export default class UsersActionsModal extends ActionsModal {
  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'groups',
        events: ['success', 'error']
      },
      {
        name: 'group',
        events: [
          'addUserError',
          'addUserSuccess',
          'deleteUserError',
          'deleteUserSuccess'
        ]
      },
      {
        name: 'user',
        events: ['deleteError', 'deleteSuccess']
      }
    ];

  }

  componentWillMount() {
    super.componentWillMount();

    ACLGroupsStore.fetchGroups();
  }

  onGroupStoreAddUserError(groupId, userId, errorMessage) {
    this.onActionError(errorMessage);
  }

  onGroupStoreDeleteUserError(groupId, userId, errorMessage) {
    this.onActionError(errorMessage);
  }

  onUserStoreDeleteError(userID, errorMessage) {
    this.onActionError(errorMessage);
  }

  onGroupStoreAddUserSuccess() {
    this.onActionSuccess();
  }

  onGroupStoreDeleteUserSuccess() {
    this.onActionSuccess();
  }

  onUserStoreDeleteSuccess() {
    this.onActionSuccess();
  }

  handleButtonConfirm() {
    let {action, itemID, selectedItems} = this.props;
    let selectedItem = this.state.selectedItem;

    if (selectedItem === null && action !== 'delete') {
      this.setState({validationError: 'Select from dropdown.'});
    } else {
      let itemsByID = _.pluck(selectedItems, itemID);

      if (action === 'add') {
        itemsByID.forEach(function (userId) {
          ACLGroupStore.addUser(selectedItem.id, userId);
        });
      } else if (action === 'remove') {
        itemsByID.forEach(function (userId) {
          ACLGroupStore.deleteUser(selectedItem.id, userId);
        });
      } else if (action === 'delete') {
        itemsByID.forEach(function (userId) {
          ACLUserStore.deleteUser(userId);
        });
      }

      this.setState({pendingRequest: true});
    }
  }

  getDropdownItems() {
    let itemID = 'gid';
    let items = ACLGroupsStore.get('groups').getItems().sort(
      Util.getLocaleCompareSortFn('description')
    );

    let dropdownItems = items.map(function (itemInfo) {
      return {
        html: itemInfo.description,
        id: itemInfo[itemID],
        selectedHtml: itemInfo.description
      };
    });

    dropdownItems.unshift({
      html: 'Choose a group',
      id: 'DEFAULT',
      selectable: false
    });

    return dropdownItems;
  }

}

UsersActionsModal.propTypes = {
  action: React.PropTypes.string.isRequired,
  actionText: React.PropTypes.object.isRequired,
  itemID: React.PropTypes.string.isRequired,
  itemType: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired,
  selectedItems: React.PropTypes.array.isRequired
};
