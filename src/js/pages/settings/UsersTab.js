import React from "react";

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
        <h3 className="flush">No access.</h3>
        <div className="button-collection">
          <a
            className="button button-success"
            onClick={this.handleNewUserClick}>
            + New User
          </a>
        </div>
      </div>
    );
  }
}
