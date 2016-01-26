import _ from 'underscore';
import classNames from 'classnames';
import {Dropdown, Form, Table} from 'reactjs-components';
import {Link} from 'react-router';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

import GroupsActionsModal from '../../components/modals/GroupsActionsModal';
import UsersActionsModal from '../../components/modals/UsersActionsModal';
import FilterHeadline from '../../components/FilterHeadline';
import FilterInputText from '../../components/FilterInputText';
import FormUtil from '../../utils/FormUtil';
import InternalStorageMixin from '../../mixins/InternalStorageMixin';
import BulkOptions from '../../constants/BulkOptions';
import ResourceTableUtil from '../../utils/ResourceTableUtil';
import StringUtil from '../../utils/StringUtil';
import TableUtil from '../../utils/TableUtil';
import TooltipMixin from '../../mixins/TooltipMixin';

const METHODS_TO_BIND = [
  'handleActionSelection',
  'handleActionSelectionClose',
  'handleCheckboxChange',
  'handleHeadingCheckboxChange',
  'handleSearchStringChange',
  'renderCheckbox',
  'renderHeadingCheckbox',
  'renderHeadline',
  'renderUsername',
  'resetFilter',
  // Must bind these due to TooltipMixin legacy code
  'tip_handleContainerMouseMove',
  'tip_handleMouseLeave'
];

const FILTERS = ['all', 'local', 'external'];

export default class OrganizationTab extends mixin(InternalStorageMixin, TooltipMixin) {
  constructor() {
    super(arguments);

    this.state = {
      checkableCount: 0,
      checkedCount: 0,
      showActionDropdown: false,
      searchFilter: 'all',
      searchString: '',
      selectedAction: null
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.internalStorage_update({selectedIDSet: {}});
  }

  componentWillMount() {
    super.componentWillMount();
    let selectedIDSet = {};
    let remoteIDSet = {};
    let {items, itemID} = this.props;
    let checkableCount = 0;

    // Initializing hash of items' IDs and corresponding checkbox state.
    items.forEach(function (item) {
      let id = item.get(itemID);

      if (typeof item.isRemote === 'function' && item.isRemote()) {
        remoteIDSet[id] = true;
      } else {
        checkableCount += 1;
        selectedIDSet[id] = false;
      }
    });

    this.internalStorage_update({selectedIDSet, remoteIDSet});
    this.setState({checkableCount});
  }

  handleActionSelection(dropdownItem) {
    this.setState({
      selectedAction: dropdownItem.id
    });
  }

  handleActionSelectionClose() {
    this.setState({
      selectedAction: null
    });
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

    Object.keys(selectedIDSet).forEach(function (id) {
      selectedIDSet[id] = isChecked;
    });
    this.internalStorage_update({selectedIDSet});

    if (isChecked) {
      this.setState({
        checkedCount: this.state.checkableCount,
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
    let badge = null;

    if (typeof subject.isRemote === 'function' && subject.isRemote()) {
      badge = (
        <div className="grid-item column-small-3 column-large-3 column-x-large-2">
          <span
            className="badge text-align-right"
            data-behavior="show-tip"
            data-tip-place="top"
            data-tip-content="This user is managed by an external LDAP directory." >
            LDAP
          </span>
        </div>
      );
    }

    return (
      <div className="grid">
        <div className="grid-item column-small-9 column-large-9 column-x-large-10">
          <Link to={`settings-organization-${itemName}s-${itemName}-panel`}
          params={{[`${itemName}ID`]: subject.get(this.props.itemID)}}
          className="">
          {subject.get('description')}
          </Link>
        </div>
        {badge}
      </div>
    );
  }

  renderUsername(prop, subject) {
    let itemName = this.props.itemName;

    return (
      <div>
        <Link to={`settings-organization-${itemName}s-${itemName}-panel`}
          params={{[`${itemName}ID`]: subject.get(this.props.itemID)}}>
          {subject.get('uid')}
        </Link>
      </div>
    );
  }

  renderCheckbox(prop, row) {
    let rowID = row[this.props.itemID];
    let remoteIDSet = this.internalStorage_get().remoteIDSet;
    let {checkableCount, checkedCount} = this.state;
    let checked = null;

    if (remoteIDSet[rowID] === true) {
      return (
        <input
          ref="checkbox"
          type="checkbox"
          disabled={true} />
        );
    } else {
      if (checkedCount === checkableCount) {
        checked = true;
      } else if (checkedCount === 0) {
        checked = false;
      }
    }

    return (
      <Form
        formGroupClass="form-group flush-bottom"
        definition={[
          {
            fieldType: 'checkbox',
            name: rowID,
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
      case this.state.checkableCount:
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

  getColGroup(itemName) {
    if (itemName === 'user') {
      return (
        <colgroup>
        <col style={{width: '40px'}} />
        <col style={{width: '45%'}}/>
        <col />
        </colgroup>
      );
    } else if (itemName === 'group') {
      return (
        <colgroup>
        <col style={{width: '40px'}} />
        <col />
        </colgroup>
      );
    }

    return null;
  }

  getColumns(itemName) {
    let className = ResourceTableUtil.getClassName;
    let nameHeading = ResourceTableUtil.renderHeading({
      description: 'NAME'
    });
    let propSortFunction = ResourceTableUtil.getPropSortFunction('description');

    let columns = [
      {
        className,
        headerClassName: className,
        prop: 'selected',
        render: this.renderCheckbox,
        sortable: false,
        heading: this.renderHeadingCheckbox
      },
      {
        cacheCell: true,
        className,
        headerClassName: className,
        prop: 'description',
        render: this.renderHeadline,
        sortable: true,
        sortFunction: propSortFunction,
        heading: nameHeading
      }
    ];

    if (itemName === 'user') {
      let usernameHeading = ResourceTableUtil.renderHeading({
        uid: 'USERNAME'
      });
      let usernameSort = ResourceTableUtil.getPropSortFunction('uid');

      columns.push({
        cacheCell: true,
        className,
        headerClassName: className,
        prop: 'uid',
        render: this.renderUsername,
        sortable: true,
        sortFunction: usernameSort,
        heading: usernameHeading
      });
    }

    return columns;
  }

  getActionDropdown(itemName) {
    if (!this.state.showActionDropdown) {
      return null;
    }

    let actionPhrases = BulkOptions[itemName];
    let initialID = null;

    // Get first Action to set as initially selected option in dropdown.
    initialID = Object.keys(actionPhrases)[0] || null;

    return (
      <li>
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
      </li>
    );
  }

  getActionsDropdownItems(actionPhrases) {
    return Object.keys(actionPhrases).map(function (action) {
      return {
        html: actionPhrases[action].dropdownOption,
        id: action,
        selectedHtml: 'Actions'
      };
    });
  }

  getCheckedItemObjects(items, itemIDName) {
    if (this.state.selectedAction) {
      let checkboxStates = this.internalStorage_get().selectedIDSet;
      let selectedItems = {};

      Object.keys(checkboxStates).forEach(function (id) {
        if (checkboxStates[id] === true) {
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
    let {searchFilter, searchString} = this.state;
    searchString = searchString.toLowerCase();

    switch (searchFilter) {
      case 'all':
        break;
      case 'local':
        items = _.filter(items, function (item) {
          return !item.isRemote();
        });
        break;
      case 'external':
        items = _.filter(items, function (item) {
          return item.isRemote();
        });
        break;
    }

    if (searchString !== '') {
      return _.filter(items, function (item) {
        let description = item.get('description').toLowerCase();
        return description.indexOf(searchString) > -1;
      });
    }

    return items;
  }

  getActionsModal(action, items, itemID, itemName) {
    if (action === null) {
      return null;
    }

    let checkedItemObjects = this.getCheckedItemObjects(items, itemID) || [];

    if (itemName === 'user') {
      return (
        <UsersActionsModal
          action={action}
          actionText={BulkOptions[itemName][action]}
          itemID={itemID}
          itemType={itemName}
          onClose={this.handleActionSelectionClose}
          selectedItems={checkedItemObjects} />
      );
    } else if (itemName === 'group') {
      return (
        <GroupsActionsModal
          action={action}
          actionText={BulkOptions[itemName][action]}
          itemID={itemID}
          itemType={itemName}
          onClose={this.handleActionSelectionClose}
          selectedItems={checkedItemObjects} />
      );
    }

    return null;
  }

  getSearchFilterChangeHandler(searchFilter) {
    return () => {
      this.setState({searchFilter});
    };
  }

  getStringFilter(searchString, changeHandler) {
    return (
      <li>
        <FilterInputText
          searchString={searchString}
          handleFilterChange={changeHandler}
          inverseStyle={true} />
      </li>
    );
  }

  getFilterButtons() {
    let currentFilter = this.state.searchFilter;

    let buttons = FILTERS.map((filter) => {
      let classSet = classNames({
        'button button-stroke button-inverse': true,
        'active': filter === currentFilter
      });

      return (
        <button
            key={filter}
            className={classSet}
            onClick={this.getSearchFilterChangeHandler(filter)}>
          {StringUtil.capitalize(filter)}
        </button>
      );
    });

    return (
      <li>
        <div className="panel-options-left button-group">
          {buttons}
        </div>
      </li>
    );
  }

  resetFilter() {
    this.setState({
      searchString: '',
      searchFilter: 'all'
    });
  }

  render() {
    let {items, itemID, itemName, handleNewItemClick} = this.props;
    let state = this.state;
    let action = state.selectedAction;
    let capitalizedItemName = StringUtil.capitalize(itemName);
    let filterButtons = this.getFilterButtons();
    let filterInputText =
      this.getStringFilter(state.searchString, this.handleSearchStringChange);
    let actionDropdown = this.getActionDropdown(itemName);
    let actionsModal = this.getActionsModal(action, items, itemID, itemName);

    return (
      <div className="flex-container-col">
        <div className={`${itemName}s-table-header`}>
          <FilterHeadline
            onReset={this.resetFilter}
            name={`${StringUtil.pluralize(capitalizedItemName)}`}
            currentLength={this.getVisibleItems(items).length}
            totalLength={items.length} />
          <ul className="list list-unstyled list-inline flush-bottom">
            {filterButtons}
            {filterInputText}
            {actionDropdown}
            {actionsModal}
            <li className="button-collection list-item-aligned-right">
              <a
                className="button button-success"
                onClick={handleNewItemClick}>
                {`+ New ${capitalizedItemName}`}
              </a>
            </li>
          </ul>
        </div>
        <div className="page-content-fill flex-grow flex-container-col">
          <Table
            className="table inverse table-borderless-outer
              table-borderless-inner-columns flush-bottom"
            columns={this.getColumns(itemName)}
            colGroup={this.getColGroup(itemName)}
            containerSelector=".gm-scroll-view"
            data={this.getVisibleItems(items)}
            idAttribute={itemID}
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
