import _ from "underscore";
import {Form, Table} from "reactjs-components";
import {Link} from "react-router";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import FilterHeadline from "../../components/FilterHeadline";
import FilterInputText from "../../components/FilterInputText";
import FormUtil from "../../utils/FormUtil";
import ResourceTableUtil from "../../utils/ResourceTableUtil";
import StringUtil from "../../utils/StringUtil";
import TableUtil from "../../utils/TableUtil";

const METHODS_TO_BIND = [
  "handleSearchStringChange",
  "handleCheckboxChange",
  "handleHeadingCheckboxChange",
  "renderCheckbox",
  "renderHeadingCheckbox",
  "renderHeadline",
  "resetFilter"
];

export default class OrganizationTab extends React.Component {
  constructor() {
    super(arguments);

    this.state = {
      checkedCount: 0,
      openNewItemModal: false,
      searchString: ""
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  renderHeadline(prop, subject) {
    let itemName = this.props.itemName;

    return (
      <div>
        <Link to={`settings-organization-${itemName}s-${itemName}-panel`}
          params={{[`${itemName}ID`]: subject.get(this.props.itemID)}}>
          {subject.get("description")}
        </Link>
      </div>
    );
  }

  renderCheckbox(prop, row) {
    let checked = null;
    switch (this.state.checkedCount) {
      case this.props.items.length:
        checked = true;
        break;
      case 0:
        checked = false;
        break;
    }

    return (
      <Form
        formGroupClass="form-group flush-bottom"
        definition={[
          {
            fieldType: "checkbox",
            name: row[this.props.itemID],
            value: [{
              name: "select",
              checked,
              labelClass: "inverse"
            }],
            labelClass: "inverse"
          }
        ]}
        onChange={this.handleCheckboxChange} />
    );
  }

  renderHeadingCheckbox() {
    let checked = false;
    let indeterminate = false;

    switch (this.state.checkedCount) {
      case this.props.items.length:
        checked = true;
        break;
      case 0:
        checked = false;
        break;
      default:
        indeterminate = true;
        break;
    }

    return (
      <Form
        formGroupClass="form-group flush-bottom"
        definition={[
          {
            fieldType: "checkbox",
            name: "headingCheckbox",
            value: [{
              name: "selectBulk",
              label: "",
              checked,
              indeterminate,
              labelClass: "inverse"
            }],
            labelClass: "inverse"
          }
        ]}
        onChange={this.handleHeadingCheckboxChange} />
    );
  }

  handleCheckboxChange(checkboxState) {
    let isChecked = FormUtil.getCheckboxInfo(checkboxState).checked;
    this.setState({checkedCount: this.state.checkedCount + (isChecked || -1)});
  }

  handleHeadingCheckboxChange(checkboxState) {
    let isChecked = FormUtil.getCheckboxInfo(checkboxState).checked;

    if (isChecked) {
      this.setState({checkedCount: this.props.items.length});
    } else if (isChecked === false) {
      this.setState({checkedCount: 0});
    }
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: "40px"}} />
        <col />
      </colgroup>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading({
      description: "Description"
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction("description");

    return [
      {
        className,
        headerClassName: className,
        prop: "selected",
        render: this.renderCheckbox,
        sortable: false,
        heading: this.renderHeadingCheckbox,
        dontCache: true
      },
      {
        className,
        headerClassName: className,
        prop: "description",
        render: this.renderHeadline,
        sortable: true,
        sortFunction: propSortFunction,
        heading
      }
    ];
  }

  getVisibleItems(items) {
    let searchString = this.state.searchString.toLowerCase();

    if (searchString !== "") {
      return _.filter(items, function (item) {
        let description = item.get("description").toLowerCase();
        return description.indexOf(searchString) > -1;
      });
    }

    return items;
  }

  resetFilter() {
    this.setState({searchString: ""});
  }

  render() {
    let props = this.props;
    let itemName = props.itemName;
    let capitalizedItemName = StringUtil.capitalize(itemName);
    let items = props.items;

    return (
      <div className="flex-container-col">
        <div className={`${itemName}s-table-header`}>
          <FilterHeadline
            onReset={this.resetFilter}
            name={`${StringUtil.pluralize(capitalizedItemName)}`}
            currentLength={this.getVisibleItems(items).length}
            totalLength={items.length} />
          <ul className="list list-unstyled list-inline flush-bottom">
            <li>
              <FilterInputText
                searchString={this.state.searchString}
                handleFilterChange={this.handleSearchStringChange}
                inverseStyle={true} />
            </li>
            <li className="button-collection list-item-aligned-right">
              <a
                className="button button-success"
                onClick={props.handleNewItemClick}>
                {`+ New ${capitalizedItemName}`}
              </a>
            </li>
          </ul>
        </div>
        <div className="page-content-fill flex-grow flex-container-col">
          <Table
            className="table inverse table-borderless-outer
              table-borderless-inner-columns flush-bottom"
            columns={this.getColumns()}
            colGroup={this.getColGroup()}
            containerSelector=".gm-scroll-view"
            data={this.getVisibleItems(items)}
            idAttribute={props.itemID}
            itemHeight={TableUtil.getRowHeight()}
            sortBy={{prop: "description", order: "asc"}}
            useFlex={true}
            transition={false}
            useScrollTable={false} />
        </div>
      </div>
    );
  }
}

OrganizationTab.propTypes = {
  items: React.PropTypes.array.isRequired,
  itemID: React.PropTypes.string.isRequired,
  itemName: React.PropTypes.string.isRequired,
  handleNewItemClick: React.PropTypes.func.isRequired
};
