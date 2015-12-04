import React from "react";

import SidePanels from "../../components/SidePanels";
import UserFormModal from "../../components/UserFormModal";

const METHODS_TO_BIND = ["handleNewUserClick", "handleNewUserClose"];

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

  handleNewUserClose() {
    this.setState({openNewUserModal: false});
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
        <UserFormModal
          open={this.state.openNewUserModal}
          onClose={this.handleNewUserClose}/>
      </div>
    );
  }
}
