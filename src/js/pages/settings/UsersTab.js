import React from "react";

import SidePanels from "../../components/SidePanels";

const METHODS_TO_BIND = ["handleNewUserClick"];

export default class UsersTab extends React.Component {

  constructor() {
    super();

    this.state = {
      openNewUserModal: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleNewUserClick() {
    this.setState({openNewUserModal: true});
  }

  render() {
    return (
      <div>
        <div className="button-collection">
          <a
            className="button button-success"
            onClick={this.handleNewUserClick}>
            + New User
          </a>
        </div>
        <SidePanels
          params={this.props.params}
          openedPage="settings-organization-users" />
      </div>
    );
  }
}
