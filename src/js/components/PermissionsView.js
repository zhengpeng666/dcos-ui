/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLStore from "../stores/ACLStore";
import {Dropdown} from "reactjs-components";
import RequestErrorMsg from "./RequestErrorMsg";
import Item from "../structs/Item";
import StoreMixin from "../mixins/StoreMixin";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleServiceSelection",
  "onAclStoreSuccess",
  "onAclStoreError"
];

const DEFAULT_ID = "DEFAULT";

export default class PermissionsView extends Util.mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [{name: "acl", events: ["success", "error"]}];

    this.state = {
      hasError: null,
      selectedACL: null,
      serviceACLs: []
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();
    ACLStore.fetchACLsForResource("services");
  }

  onAclStoreSuccess() {
    let serviceACLs = ACLStore.get("services").getItems();
    let totalServiceACLs = serviceACLs.length;
    this.setState({
      hasError: false,
      serviceACLs,
      totalServiceACLs
    });
  }

  onAclStoreError() {
    this.setState({hasError: true});
  }

  handleServiceSelection(selectedACL) {
    this.setState({selectedACL: selectedACL.id});
  }

  getPermissionTable() {
    return null;
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
    let defaultItem = new Item({
      rid: DEFAULT_ID,
      description: "Add Service"
    });

    let items = [defaultItem].concat(this.state.serviceACLs);

    return items.map((serviceACL) => {
      let selectedHtml = this.getItemHtml(serviceACL);
      let html = (<a>{selectedHtml}</a>);

      let item = {
        id: serviceACL.get("rid"),
        description: serviceACL.get("description"),
        html,
        selectedHtml
      };

      return item;
    });
  }

  getSelectedId(id) {
    if (id == null) {
      return DEFAULT_ID;
    }

    return id;
  }

  getItemHtml(serviceACL) {
    return (
      <span>{serviceACL.get("description")}</span>
    );
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
      <div className="flex-container-col flex-grow no-overflow">
        <div className="flex-box control-group">
        </div>
          <Dropdown
            buttonClassName="button dropdown-toggle"
            dropdownMenuClassName="dropdown-menu"
            dropdownMenuListClassName="dropdown-menu-list"
            dropdownMenuListItemClassName="clickable"
            wrapperClassName="dropdown"
            items={this.getDropdownItems()}
            onItemSelection={this.handleServiceSelection}
            selectedID={this.getSelectedId(this.state.selectedACL)}
            transition={true}
            transitionName="dropdown-menu" />
        {this.getPermissionTable()}
      </div>
    );
  }
}

PermissionsView.propTypes = {
  permissions: React.PropTypes.array
};
