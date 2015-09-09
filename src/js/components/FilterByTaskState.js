import _ from "underscore";
import React from "react/addons";

import {Dropdown} from "reactjs-components";

const defaultId = "default";

export default class FilterByTaskState extends React.Component {

  constructor() {
    super();

    this.handleItemSelection = this.handleItemSelection.bind(this);
  }

  handleItemSelection(obj) {
    if (obj.id === defaultId) {
      this.props.handleFilterChange(null);
    } else {
      this.props.handleFilterChange(obj.name);
    }
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
    var items = [{
      id: defaultId,
      name: "All States",
      count: this.props.totalTasksCount
    }].concat(this.props.states);

    return _.map(items, function (state) {
      var selectedHtml = this.getItemHtml(state);
      var dropdownHtml = (<a>{selectedHtml}</a>);

      var item = {
        id: state.id,
        name: state.name,
        html: dropdownHtml,
        selectedHtml
      };

      if (state.id === defaultId) {
        item.selectedHtml = (
          <span className="badge-container">
            <span>All States</span>
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
        selectedID={this.props.byServiceFilter}
        transition={true}
        transitionName="dropdown-menu" />
    );
  }
}

FilterByTaskState.propTypes = {
  byServiceFilter: React.PropTypes.string,
  states: React.PropTypes.array.isRequired,
  totalTasksCount: React.PropTypes.number.isRequired,
  handleFilterChange: React.PropTypes.func
};

FilterByTaskState.defaultProps = {
  byServiceFilter: defaultId,
  states: [],
  totalHostsCount: 0,
  handleFilterChange: _.noop
};
