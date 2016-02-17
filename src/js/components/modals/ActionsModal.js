import _ from 'underscore';
import {Confirm, Dropdown} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import StringUtil from '../../utils/StringUtil';

const METHODS_TO_BIND = [
  'handleButtonCancel',
  'handleButtonConfirm',
  'handleItemSelection',
  'onActionError',
  'onActionSuccess'
];

const DEFAULT_ID = 'DEFAULT';
const ITEMS_DISPLAYED = 3;

class ActionsModal extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.state = {
      pendingRequest: false,
      requestErrorCount: null,
      requestsRemaining: null,
      selectedItem: null,
      validationError: null
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    super.componentWillMount();

    this.setState({
      requestsRemaining: this.props.selectedItems.length
    });
  }

  componentWillUpdate(nextProps, nextState) {
    super.componentWillUpdate(...arguments);

    if (nextState.requestsRemaining === 0) {
      this.handleButtonCancel();
    }
  }

  componentDidUpdate() {
    super.componentDidUpdate(...arguments);
    let state = this.state;

    // We've accounted for all our errors/successes, no longer pending.
    if ((state.requestErrorCount > 0) &&
    (state.requestsRemaining === state.requestErrorCount)) {
      this.setState({
        pendingRequest: false,
        requestErrorCount: null,
        requestsRemaining: this.props.selectedItems.length
      });
    }
  }

  handleButtonCancel() {
    this.setState({
      pendingRequest: false,
      requestErrorCount: null,
      requestsRemaining: null,
      selectedItem: null,
      validationError: null
    });
    this.props.onClose();
  }

  handleItemSelection(item) {
    this.setState({
      validationError: null,
      selectedItem: item
    });
  }

  onActionError() {
    this.setState({
      requestErrorCount: this.state.requestErrorCount + 1
    });
  }

  onActionSuccess() {
    this.setState({
      requestsRemaining: this.state.requestsRemaining - 1
    });
  }

  getActionsModalContents() {
    let {actionText, itemType, selectedItems} = this.props;
    let selectedItemsString = '';

    if (selectedItems.length === 1) {
      selectedItemsString = selectedItems[0].description;
    } else {
      // Truncate list of selected user/groups for ease of reading
      let selectedItemsShown = _.first(selectedItems, ITEMS_DISPLAYED + 1);

      // Create a string concatenating n-1 items
      let selectedItemsShownMinusOne = _.initial(selectedItemsShown);
      let descriptionArray = _.pluck(selectedItemsShownMinusOne, 'description');
      descriptionArray.forEach(function (itemDescription) {
        selectedItemsString += `${itemDescription}, `;
      });

      // Handle grammar for nth element and concatenate to list
      if (selectedItems.length <= ITEMS_DISPLAYED) {
        selectedItemsString += `and ${_.last(selectedItems).description} `;
      } else if (selectedItems.length === ITEMS_DISPLAYED + 1) {
        selectedItemsString += `and 1 other `;
      } else {
        let overflow = selectedItems.length - ITEMS_DISPLAYED;
        selectedItemsString += `and ${overflow} others `;
      }
    }

    return (
      <div className="container-pod container-pod-short text-align-center">
        <h3 className="flush-top">{actionText.title}</h3>
        <p>{`${selectedItemsString} ${actionText.actionPhrase}.`}</p>
        {this.getDropdown(itemType)}
        {this.getErrorMessage(this.state.validationError)}
      </div>
    );
  }

  getDropdown(itemType) {
    if (this.props.action === 'delete') {
      return null;
    }

    return (
      <div className="container container-pod container-pod-super-short">
        <Dropdown
          buttonClassName="button dropdown-toggle"
          dropdownMenuClassName="dropdown-menu"
          dropdownMenuListClassName="dropdown-menu-list"
          dropdownMenuListItemClassName="clickable"
          initialID={DEFAULT_ID}
          items={this.getDropdownItems(itemType)}
          onItemSelection={this.handleItemSelection}
          transition={true}
          transitionName="dropdown-menu"
          wrapperClassName="dropdown text-align-left" />
      </div>
    );
  }

  getErrorMessage(error) {
    if (error != null) {
      return (
        <p className="text-error-state">{error}</p>
      );
    }
  }

  getRequestErrorMessage(errors) {
    if (errors.length > 0) {
      let errorMessages = errors.map(function (error, index) {
        return (
          <p className="text-error-state" key={index}>{error}</p>
        );
      });

      return (
        <div>
          {errorMessages}
        </div>
      );
    }
  }

  render() {
    let action = this.props.action;
    if (action === null) {
      return null;
    }

    return (
      <Confirm
        disabled={this.state.pendingRequest}
        dynamicHeight={false}
        footerContainerClass="container container-pod container-pod-short
          container-pod-fluid flush-top flush-bottom"
        open={!!action}
        onClose={this.handleButtonCancel}
        leftButtonCallback={this.handleButtonCancel}
        rightButtonCallback={this.handleButtonConfirm}
        rightButtonText={StringUtil.capitalize(action)}
        useGemini={false}>
        {this.getActionsModalContents()}
      </Confirm>
    );
  }
}

ActionsModal.propTypes = {
  action: React.PropTypes.string.isRequired,
  actionText: React.PropTypes.object.isRequired,
  itemID: React.PropTypes.string.isRequired,
  itemType: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired,
  selectedItems: React.PropTypes.array.isRequired
};

module.exports = ActionsModal;
