import {Dropdown} from 'reactjs-components';
import React from 'react';

import UnitHealthStatus from '../constants/UnitHealthStatus';

class UnitHealthDropdown extends React.Component {

  constructor() {
    super();

    this.onItemSelection = this.onItemSelection.bind(this);
  }

  onItemSelection(selected) {
    this.props.onHealthSelection(selected);
  }

  getDropdownItems() {
    let defaultItem = {
      id: 'all',
      html: 'All Health Checks',
      selectedHtml: 'All Health Checks'
    };

    let items = Object.keys(UnitHealthStatus).map(function (health) {
      return {
        id: health,
        html: UnitHealthStatus[health].title,
        selectedHtml: UnitHealthStatus[health].title
      };
    });

    items.unshift(defaultItem);

    return items;
  }

  render() {
    return (
      <Dropdown
        buttonClassName="button dropdown-toggle"
        dropdownMenuClassName="dropdown-menu"
        dropdownMenuListClassName="dropdown-menu-list"
        initialID={this.props.initialID}
        items={this.getDropdownItems()}
        onItemSelection={this.onItemSelection}
        transition={true}
        wrapperClassName="dropdown" />
    );
  }
}

UnitHealthDropdown.propTypes = {
  initialID: React.PropTypes.string,
  onHealthSelection: React.PropTypes.func
};

module.exports = UnitHealthDropdown;
