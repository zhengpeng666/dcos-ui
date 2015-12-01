/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

// import ACLUserStore from "../stores/ACLUserStore";
import SidePanelContents from "./SidePanelContents";

export default class UserSidePanelContents extends SidePanelContents {

    render() {
      let userID = this.props.itemID;
      // let userDetails = ACLUserStore.fetchUserWithDetails(userID);
      console.log(userID);

      return (
        <div className="flex-container-col">
          <div className="container container-pod container-pod-divider-bottom
              container-pod-divider-inverse side-panel-section
              container-pod-short-top flush-bottom
              side-panel-content-header container container-pod
              container-fluid container-pod-divider-bottom
              container-pod-divider-bottom-align-right flush-bottom">
            {"basic info"}
            <ul className="tabs list-inline flush-bottom">
              {"tabs"}
            </ul>
          </div>
          {"tab view"}
        </div>
      );
    }
}
