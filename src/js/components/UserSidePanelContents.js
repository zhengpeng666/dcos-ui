/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/

import ACLUserStore from "../stores/ACLUserStore";
import EventTypes from "../constants/EventTypes";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import SidePanelContents from "./SidePanelContents";

const METHODS_TO_BIND = [
  "handleUserDetails",
  "onMesosStateChange"
];

export default class UserSidePanelContents extends SidePanelContents {

    constructor() {
      super();

      this.state = {
        user: null
      };

      METHODS_TO_BIND.forEach(function (method) {
        this[method] = this[method].bind(this);
      }, this);
    }

    componentDidMount() {
      ACLUserStore.addChangeListener(
        EventTypes.ACL_USER_DETAILS_FETCHED_SUCCESS,
        this.handleUserDetails
      );

      ACLUserStore.fetchUserWithDetails(this.props.itemID);

      MesosSummaryStore.addChangeListener(
        EventTypes.MESOS_SUMMARY_CHANGE,
        this.onMesosStateChange
      );
    }

    componentWillUnmount() {
      ACLUserStore.removeChangeListener(
        EventTypes.ACL_USER_DETAILS_FETCHED_SUCCESS,
        this.handleUserDetails
      );

      this.removeMesosSummaryListener();
    }

    handleUserDetails() {
      this.setState({
        user: ACLUserStore.getUser(this.props.itemID)
      });
    }

    onMesosStateChange() {
      this.removeMesosSummaryListener();
      this.forceUpdate();
    }

    removeMesosSummaryListener() {
      MesosSummaryStore.removeChangeListener(
        EventTypes.MESOS_SUMMARY_CHANGE,
        this.onMesosStateChange
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

    getUserInfo() {
      let user = this.state.user;
      let imageTag = (
        <div className="side-panel-icon icon icon-large icon-image-container icon-user-container">
          <img src="./img/layout/icon-user-default-64x64@2x.png" />
        </div>
      );

      return (
        <div className="side-panel-content-header-details flex-box
          flex-box-align-vertical-center">
          {imageTag}
          <div>
            <h1 className="side-panel-content-header-label flush">
              {user.uid}
            </h1>
            <div>
              {this.getSubHeader(user)}
            </div>
          </div>
        </div>
      );
    }

    getSubHeader(user) {
      let groupCount = user.getGroupCount();
      let serviceCount = user.getPermissionCount();
      let groupLabel = "group" + (groupCount === 1 ? "" : "s");
      let serviceLabel = "Service" + (serviceCount === 1 ? "" : "s");

      return (
        <div>
          {serviceCount} {serviceLabel}, Member of {groupCount} {groupLabel}
        </div>
      );
    }

    render() {
      if (this.state.user == null || !MesosSummaryStore.get("statesProcessed")) {
        return this.getLoadingScreen();
      }

      return (
        <div className="flex-container-col">
          <div className="container container-fluid container-pod
            container-pod-divider-bottom container-pod-divider-bottom-align-right
            container-pod-divider-inverse container-pod-short-top flush-bottom
            side-panel-content-header side-panel-section">
            {this.getUserInfo()}
          </div>
        </div>
      );
    }
}
