/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLUserStore from "../stores/ACLUserStore";
import Form from "./Form";
import StoreMixin from "../mixins/StoreMixin";
import Util from "../utils/Util";

const METHODS_TO_BIND = [
  "handlePasswordSubmit"
];

export default class UserGroupTable extends Util.mixin(StoreMixin) {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handlePasswordSubmit(formData) {
    ACLUserStore.updateUser(this.props.userID, {
      uid: this.props.userID,
      password: formData.password
    });
  }

  render() {
    let userDetails = ACLUserStore.getUser(this.props.userID);
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

    return (
      <div className="container container-fluid container-pod
        container-pod-short-top">
        <div className="flex-container-col">
          <dl className="row flex-box">
            <dt className="column-3 emphasize">
              Username
            </dt>
            <dt className="column-9">
              {userDetails.uid}
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
