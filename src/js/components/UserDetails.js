/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLUserStore from "../stores/ACLUserStore";
import Form from "./Form";
import RequestErrorMsg from "./RequestErrorMsg";
import StoreMixin from "../mixins/StoreMixin";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handlePasswordSubmit",
  "handleUsernameSubmit"
];

export default class UserGroupTable extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      userDetailsRequestSuccess: false,
      userDetailsRequestError: false
    };

    this.store_listeners = [
      {
        name: "user",
        events: [
          "fetchedDetailsSuccess",
          "fetchedDetailsError"
        ]
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    super.componentDidMount();

    ACLUserStore.fetchUserWithDetails(this.props.userID);
  }

  onUserStoreFetchedDetailsError() {
    this.setState({
      userDetailsRequestSuccess: false,
      userDetailsRequestError: true
    });
  }

  onUserStoreFetchedDetailsSuccess() {
    this.setState({
      userDetailsRequestSuccess: true,
      userDetailsRequestError: false
    });
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

  handlePasswordSubmit(formData) {
    ACLUserStore.updateUser(this.props.userID, {
      uid: this.props.userID,
      newuid: formData.uid
    });
  }

  handleUsernameSubmit(formData) {
    ACLUserStore.updateUser(this.props.userID, {
      uid: this.props.userID,
      password: formData.password
    });
  }

  render() {
    let userDetails = ACLUserStore.getUser(this.props.userID);

    let usernameDefinition = [
      {
        fieldType: "text",
        name: "uid",
        placeholder: "Username",
        required: true,
        showError: false,
        showLabel: false,
        writeType: "edit",
        validation: function () { return true; },
        value: userDetails.uid
      }
    ];

    let passwordDefinition = [
      {
        fieldType: "password",
        name: "password",
        placeholder: "Password",
        required: true,
        showError: false,
        showLabel: false,
        writeType: "edit",
        validation: function () { return true; },
        value: ""
      }
    ];

    if (!this.state.userDetailsRequestSuccess &&
      !this.state.userDetailsRequestError) {
      return this.getLoadingScreen();
    } else if (this.state.userDetailsRequestError) {
      return (
        <div className="container container-fluid container-pod flush-bottom">
          <RequestErrorMsg />
        </div>
      );
    }

    return (
      <div className="container container-fluid container-pod">
        <div className="flex-container-col">
          <dl className="row flex-box">
            <dt className="column-3 emphasize">
              Username
            </dt>
            <dt className="column-9">
              <Form definition={usernameDefinition}
                onSubmit={this.handleUsernameSubmit} />
            </dt>
          </dl>
          <dl className="row flex-box">
            <dt className="column-3 emphasize">
              Password
            </dt>
            <dt className="column-9">
              <Form definition={passwordDefinition}
                onSubmit={this.handlePasswordSubmit} />
            </dt>
          </dl>
        </div>
      </div>
    );
  }
}
