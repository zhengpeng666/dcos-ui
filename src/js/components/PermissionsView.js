/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLStore from "../stores/ACLStore";
import {Dropdown} from "reactjs-components";
import RequestErrorMsg from "./RequestErrorMsg";
import Service from "../structs/Service";
import StoreMixin from "../mixins/StoreMixin";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handleServiceSelection",
  "onAclStoreSuccess",
  "onAclStoreError",
  // "getItemHtml",
  // "getSelectedId",
  "getDropdownItems"
];

const DEFAULT_ID = "DEFAULT";

export default class PermissionsView extends Util.mixin(StoreMixin) {
  constructor() {
    super(...arguments);

    this.store_listeners = [{name: "acl", events: ["success", "error"]}];

    this.state = {
      hasError: null,
      selectedService: null,
      services: []
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
    let services = ACLStore.get("services").getItems();
    let totalServices = services.length;
    this.setState({
      hasError: false,
      services,
      totalServices
    });
  }

  onAclStoreError() {
    this.setState({hasError: true});
  }

  handleServiceSelection(selectedService) {
    this.setState({selectedService});
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
    let defaultItem = new Service({
      rid: DEFAULT_ID,
      name: "Add Service"
    });

    let items = [defaultItem].concat(this.state.services);

    return items.map((service) => {
      let selectedHtml = this.getItemHtml(service);
      let html = (<a>{selectedHtml}</a>);

      let item = {
        id: service.get("rid"),
        name: service.get("description"),
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

  getItemHtml(service) {
    return (
      <span>{service.get("name")}</span>
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
            selectedID={this.getSelectedId(this.state.selectedService)}
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
