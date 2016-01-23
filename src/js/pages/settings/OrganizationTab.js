import _ from 'underscore';
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

export default class OrganizationTab extends mixin(InternalStorageMixin) {
  constructor() {
    super(arguments);

    this.state = {
      checkedCount: 0,
      showActionDropdown: false,
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
    let searchString = this.state.searchString.toLowerCase();

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

  resetFilter() {
    this.setState({searchString: ''});
  }

  render() {
    let {items, itemID, itemName, handleNewItemClick} = this.props;
    let state = this.state;
    let action = state.selectedAction;
    let capitalizedItemName = StringUtil.capitalize(itemName);
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
            <li>
              <FilterInputText
                searchString={state.searchString}
                handleFilterChange={this.handleSearchStringChange}
                inverseStyle={true} />
            </li>
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
            columns={this.getColumns()}
            colGroup={this.getColGroup()}
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
