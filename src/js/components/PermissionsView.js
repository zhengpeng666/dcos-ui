import {Dropdown} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';

import ACLStore from '../stores/ACLStore';
import MesosSummaryStore from '../stores/MesosSummaryStore';
import Item from '../structs/Item';
import PermissionsTable from './PermissionsTable';
import RequestErrorMsg from './RequestErrorMsg';
import StringUtil from '../utils/StringUtil';
import Util from '../utils/Util';

const METHODS_TO_BIND = [
  'handleResourceSelection',
  'onAclStoreFetchResourceError',
  'onAclStoreFetchResourceSuccess'
];

const DEFAULT_ID = 'DEFAULT';

export default class PermissionsView extends mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.state = {
      hasError: null,
      resourceErrorMessage: null
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    let itemType = this.props.itemType;

    this.store_listeners = [{
      name: 'acl',
      events: [
        'fetchResourceSuccess',
        'fetchResourceError',
        `${itemType}GrantSuccess`
      ]
    }];

    itemType = StringUtil.capitalize(itemType);
    this[`onAclStore${itemType}GrantSuccess`] =
      this.onAclStoreItemTypeGrantSuccess;

    super.componentWillMount();
  }

  componentDidMount() {
    super.componentDidMount();
    ACLStore.fetchACLsForResource('service');
  }

  onAclStoreFetchResourceSuccess() {
    this.setState({
      hasError: false
    });
  }

  onAclStoreFetchResourceError() {
    this.setState({hasError: true});
  }

  onAclStoreItemTypeGrantSuccess(triple) {
    let props = this.props;
    let itemType = props.itemType;
    if (triple[`${itemType}ID`] === props.itemID) {
      this.forceUpdate();
    }
  }

  handleResourceSelection(resource) {
    if (resource.id === DEFAULT_ID) {
      return;
    }

    let itemType = StringUtil.capitalize(this.props.itemType);

    // Fire request for item type
    ACLStore[`grant${itemType}ActionToResource`](
      this.props.itemID,
      'access',
      resource.id
    );
  }

  getPermissionTable() {
    return (
      <PermissionsTable
        permissions={this.props.permissions}
        itemID={this.props.itemID}
        itemType={this.props.itemType} />
    );
  }

  getLoadingScreen() {
    return (
      <div className="container container-fluid container-pod text-align-center
        vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getDropdownItems() {
    let permissions = this.props.permissions;
    let services = MesosSummaryStore.getServiceList().sort(
      Util.getLocaleCompareSortFn('description')
    );
    let filteredResources = services.filter(function (resource) {
        // Filter out any resource which is in permissions
        let rid = resource.get('rid');
        return !permissions.some(function (permission) {
          return permission.rid === rid;
        });
      });

    let items = [new Item({
      rid: DEFAULT_ID,
      name: 'Add Service'
    })].concat(filteredResources);

    return items.map(function (resource) {
      let description = resource.get('name');

      return {
        id: resource.get('rid'),
        description,
        html: description
      };
    });
  }

  render() {
    let state = this.state;

    if (state.hasError === true) {
      return <RequestErrorMsg />;
    }

    if (state.hasError !== false) {
      return this.getLoadingScreen();
    }

    return (
      <div className="flex-container-col flex-grow">
        <div className="flex-box control-group">
          <Dropdown
            buttonClassName="button dropdown-toggle"
            dropdownMenuClassName="dropdown-menu"
            dropdownMenuListClassName="dropdown-menu-list"
            dropdownMenuListItemClassName="clickable"
            wrapperClassName="dropdown"
            items={this.getDropdownItems()}
            onItemSelection={this.handleResourceSelection}
            persistentID={DEFAULT_ID}
            transition={true}
            transitionName="dropdown-menu" />
        </div>
        {this.getPermissionTable()}
      </div>
    );
  }
}

PermissionsView.defaultPropTypes = {
  permissions: []
};

PermissionsView.propTypes = {
  itemID: React.PropTypes.string.isRequired,
  itemType: React.PropTypes.string,
  permissions: React.PropTypes.array
};
