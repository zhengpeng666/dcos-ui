import {Dropdown} from 'reactjs-components';
import React from 'react';

import UnitHealthStatus from '../constants/UnitHealthStatus';

const DEFAULT_ITEM = {
  id: 'all',
  html: 'All Health Checks',
  selectedHtml: 'All Health Checks'
};

class UnitHealthDropdown extends React.Component {

  getDropdownItems() {

    let items = Object.keys(UnitHealthStatus).map(function (health) {
      return {
        id: health,
        html: UnitHealthStatus[health].title,
        selectedHtml: UnitHealthStatus[health].title
      };
    });

    items.unshift(DEFAULT_ITEM);

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
        onItemSelection={this.props.onHealthSelection}
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
