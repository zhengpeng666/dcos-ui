import _ from "underscore";
import {Dropdown, Form, Table} from "reactjs-components";
import {Link} from "react-router";
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

import ActionsModal from "../../components/modals/ActionsModal";
import FilterHeadline from "../../components/FilterHeadline";
import FilterInputText from "../../components/FilterInputText";
import FormUtil from "../../utils/FormUtil";
import InternalStorageMixin from "../../mixins/InternalStorageMixin";
import OrganizationActions from "../../constants/OrganizationActions";
import ResourceTableUtil from "../../utils/ResourceTableUtil";
import StringUtil from "../../utils/StringUtil";
import TableUtil from "../../utils/TableUtil";

const METHODS_TO_BIND = [
  'handleActionSelection',
  'handleActionSelectionClose',
  'handleCheckboxChange',
  'handleHeadingCheckboxChange',
  'handleSearchStringChange',
  'renderCheckbox',
  'renderHeadingCheckbox',
  'renderHeadline',
  'resetFilter'
];

export default class OrganizationTab extends React.Component {
  constructor() {
    super(arguments);

    this.state = {
      checkedCount: 0,
      showActionDropdown: false,
      searchString: ''
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.internalStorage_update({selectedIDSet: {}});
  }

  componentWillMount() {
    let selectedIDSet = {};
    let props = this.props;

    // Initializing hash of items' IDs and corresponding checkbox state.
    let itemIDs = _.pluck(props.items, props.itemID);
    itemIDs.forEach(function (id) {
      selectedIDSet[id] = false;
    });

    this.internalStorage_update({selectedIDSet});
  }

  handleActionSelection(dropdownItem) {
    this.setState({
      selectedAction: dropdownItem.id
    });
  }

  handleActionSelection(action) {
    console.log(action);
  }

  handleCheckboxChange(checkboxState) {
    let isChecked = FormUtil.getCheckboxInfo(checkboxState).checked;
    let checkedCount = this.state.checkedCount + (isChecked || -1);
    let selectedIDSet = this.internalStorage_get().selectedIDSet;

    selectedIDSet[FormUtil.getRowName(checkboxState)] = isChecked;
    this.internalStorage_update({selectedIDSet});

    this.setState({
      checkedCount,
      showActionDropdown: (checkedCount > 0)
    });
  }

  handleHeadingCheckboxChange(checkboxState) {
    let isChecked = FormUtil.getCheckboxInfo(checkboxState).checked;
    let selectedIDSet = this.internalStorage_get().selectedIDSet;

    selectedIDSet.forEach(function (checked, id) {
      selectedIDSet[id] = isChecked;
    });
    this.internalStorage_update({selectedIDSet});

    if (isChecked) {
      this.setState({
        checkedCount: this.props.items.length,
        showActionDropdown: isChecked
      });
    } else if (isChecked === false) {
      this.setState({
        checkedCount: 0,
        showActionDropdown: isChecked
      });
    }
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
          {subject.get('description')}
        </Link>
      </div>
    );
  }

  renderCheckbox(prop, row) {
    let checked = null;
    let checkedCount = this.state.checkedCount;

    if (checkedCount === this.props.items.length) {
      checked = true;
    } else if (checkedCount === 0) {
      checked = false;
    }

    return (
      <Form
        formGroupClass="form-group flush-bottom"
        definition={[
          {
            fieldType: 'checkbox',
            name: row[this.props.itemID],
            value: [{
              name: 'select',
              checked,
              labelClass: 'inverse'
            }],
            labelClass: 'inverse'
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
            fieldType: 'checkbox',
            name: 'headingCheckbox',
            value: [{
              name: 'selectBulk',
              label: '',
              checked,
              indeterminate,
              labelClass: 'inverse'
            }],
            labelClass: 'inverse'
          }
        ]}
        onChange={this.handleHeadingCheckboxChange} />
    );
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '40px'}} />
        <col />
      </colgroup>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading({
      description: 'Description'
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction('description');

    return [
      {
        className,
        headerClassName: className,
        prop: 'selected',
        render: this.renderCheckbox,
        sortable: false,
        heading: this.renderHeadingCheckbox,
        dontCache: true
      },
      {
        className,
        headerClassName: className,
        prop: 'description',
        render: this.renderHeadline,
        sortable: true,
        sortFunction: propSortFunction,
        heading
      }
    ];
  }

  getActionDropdown(itemName) {
    if (!this.state.showActionDropdown) {
      return null;
    }

    let actionPhrases = {};
    let initialID = null;

    if (itemName === "user") {
      actionPhrases = {
        add: "to Group",
        remove: "from Group"
      };
    } else if (itemName === "group") {
      actionPhrases = {
        add: "User",
        remove: "User"
      };
    }

    // Get first Action to set as initially selected option in dropdown.
    initialID = _.reduce(actionPhrases, function (initial, value, key) {
      return initial || key;
    }, null);

    return (
      <Dropdown
        buttonClassName="button button-inverse dropdown-toggle"
        dropdownMenuClassName="dropdown-menu inverse"
        dropdownMenuListClassName="dropdown-menu-list"
        dropdownMenuListItemClassName="clickable"
        initialID={initialID}
        items={this.getActionsDropdownItems(actionPhrases)}
        onItemSelection={this.handleActionSelection}
        transition={true}
        transitionName="dropdown-menu"
        wrapperClassName="dropdown" />
    );
  }

  getActionsDropdownItems(actionPhrases) {
    return _.map(actionPhrases, function (phrase, action) {
      return {
        html: `${StringUtil.capitalize(action)} ${phrase}`,
        id: action,
        selectedHtml: "Actions"
      };
    });
  }

  getCheckedItemObjects(items, itemIDName) {
    if (this.state.selectedAction) {
      let checkboxStates = this.internalStorage_get().selectedIDSet;
      let selectedItems = {};

      _.each(checkboxStates, function (isChecked, id) {
        if (isChecked) {
          selectedItems[id] = true;
        }
      });

      return _.filter(items, function (item) {
        let itemID = item[itemIDName];
        return selectedItems[itemID] || false;
      });
    } else {
      return null;
    }
  }

  getVisibleItems(items) {
    let searchString = this.state.searchString.toLowerCase();

    if (searchString !== '') {
      return _.filter(items, function (item) {
        let description = item.get('description').toLowerCase();
        return description.indexOf(searchString) > -1;
      });
    }

    return items;
  }

  resetFilter() {
    this.setState({searchString: ''});
  }

  render() {
    let props = this.props;
    let itemName = props.itemName;
    let capitalizedItemName = StringUtil.capitalize(itemName);
    let items = props.items;
    let actionDropdown = this.getActionDropdown(props.itemName);
    if (actionDropdown) {
      actionDropdown = (<li>{actionDropdown}</li>);
    }

    return (
      <div className="flex-containe`r-col">
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
            {actionDropdown}
            <ActionsModal
              action={state.selectedAction}
              actionText={OrganizationActions[itemName][state.selectedAction]}
              itemID={props.itemID}
              itemType={props.itemName}
              onClose={this.handleActionSelectionClose}
              selectedItems={checkedItemObjects} />
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
            sortBy={{prop: 'description', order: 'asc'}}
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
