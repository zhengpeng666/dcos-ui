import React from "react";
import {Modal} from "reactjs-components";

import ACLAuthStore from "../../stores/ACLAuthStore";

const METHODS_TO_BIND = [
  "handleDropdownClose",
  "handleDropdownClick",
  "handleSignOut"
];

const MENU_ITEMS = {
  "button-docs": "Documentation",
  "button-intercom": "Talk with us",
  "button-tour": "Walkthrough",
  "button-sign-out": "Sign Out"
};

export default class UserDropup extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "UserDropup";

    this.state = {
      open: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleDropdownClose() {
    this.setState({open: false});
  }

  handleDropdownClick() {
    this.setState({open: true});
  }

  handleSignOut() {
    ACLAuthStore.logout();
    this.context.router.transitionTo("login");
  }

  handleMenuItemClick(onClick, e) {
    this.handleDropdownClose();
    if (onClick) {
      // Wait until dropdown transition is done before starting the next
      setTimeout(function () {
        onClick(e);
      }, 250);
    }
  }

  getDropdownItems() {
    let items = this.props.items.concat([
      <a onClick={this.handleSignOut} key="button-sign-out" />
    ]);

    return items.map((item) => {
      let props = {
        className: "",
        "data-behavior": "",
        "data-tip-content": "",
        "data-tip-place": "",
        onClick: this.handleMenuItemClick.bind(this, item.props.onClick)
      };

      return (
        <li key={item.key}>
          {React.cloneElement(item, props, MENU_ITEMS[item.key])}
        </li>
      );
    });
  }

  getUserButton(user) {
    return (
      <div className="icon-buttons">
        <a
          className="user-dropdown button dropdown-toggle"
          onClick={this.handleDropdownClick}>
          <span
            className="icon icon-medium icon-image-container
            icon-user-container">
            <img
              className="clickable"
              src="./img/layout/icon-user-default-64x64@2x.png" />
          </span>
          <span className="user-description">
          {user.get("description")}
          </span>
        </a>
      </div>
    );
  }

  render() {
    let user = ACLAuthStore.getUser();
    if (!user) {
      return null;
    }

    let modalClasses = {
      bodyClass: "",
      containerClass: "user-dropdown-menu dropdown up",
      innerBodyClass: "",
      modalClass: "dropdown-menu"
    };

    return (
      <div>
        <div className="open">
          {this.getUserButton(user)}
        </div>
        <Modal
          onClose={this.handleDropdownClose}
          open={this.state.open}
          showCloseButton={false}
          showHeader={false}
          showFooter={false}
          transitionName="dropdown-menu-up"
          {...modalClasses}>
          {this.getUserButton(user)}
          <ul className="dropdown-menu-list">
            {this.getDropdownItems()}
          </ul>
        </Modal>
      </div>
    );
  }
}

UserDropup.contextTypes = {
  router: React.PropTypes.func
};

UserDropup.defaultProps = {
};

UserDropup.propTypes = {
};
