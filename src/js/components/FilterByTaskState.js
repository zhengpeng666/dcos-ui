import _ from "underscore";
import React from "react/addons";

import {Dropdown} from "reactjs-components";

const defaultId = "all";

export default class FilterByTaskState extends React.Component {

  constructor() {
    super();

    this.handleItemSelection = this.handleItemSelection.bind(this);
  }

  handleItemSelection(obj) {
    this.props.handleFilterChange(obj.value);
  }

  getItemHtml(item) {
    return (
      <span className="badge-container inverse">
        <span>{item.name}</span>
        <span className="badge">{item.count}</span>
      </span>
    );
  }

  getDropdownItems() {
    let items = [{
      id: defaultId,
      name: "All Tasks",
      value: "all",
      count: this.props.totalTasksCount
    }].concat(this.props.statuses);

    return _.map(items, function (status) {
      let selectedHtml = this.getItemHtml(status);
      let dropdownHtml = (<a>{selectedHtml}</a>);

      let item = {
        id: status.value,
        name: status.name,
        html: dropdownHtml,
        value: status.value,
        selectedHtml
      };

      if (status.id === defaultId) {
        item.selectedHtml = (
          <span className="badge-container">
            <span>All Tasks</span>
          </span>
        );
      }

      return item;
    }, this);
  }

  render() {
    return (
      <Dropdown
        buttonClassName="button button-small dropdown-toggle"
        dropdownMenuClassName="dropdown-menu"
        dropdownMenuListClassName="dropdown-menu-list"
        dropdownMenuListItemClassName="clickable"
        wrapperClassName="dropdown"
        items={this.getDropdownItems()}
        onItemSelection={this.handleItemSelection}
        selectedID={this.props.currentStatus}
        transition={true}
        transitionName="dropdown-menu" />
    );
  }
}

FilterByTaskState.propTypes = {
  currentStatus: React.PropTypes.string,
  statuses: React.PropTypes.array.isRequired,
  totalTasksCount: React.PropTypes.number.isRequired,
  handleFilterChange: React.PropTypes.func
};

FilterByTaskState.defaultProps = {
  currentStatus: defaultId,
  statuses: [],
  totalHostsCount: 0,
  handleFilterChange: _.noop
};
