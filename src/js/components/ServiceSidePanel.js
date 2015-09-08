import classNames from "classnames";
import React from "react/addons";
import {SidePanel} from "reactjs-components";

import DateUtil from "../utils/DateUtil";
import EventTypes from "../constants/EventTypes";
import HealthLabels from "../constants/HealthLabels";
import HealthStatus from "../constants/HealthStatus";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";

const ServiceSidePanel = React.createClass({

  displayName: "ServiceSidePanel",

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      currentTab: "tasks"
    };
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    let props = this.props;
    let currentService = props.serviceName;
    let nextService = nextProps.serviceName;

    let currentTab = this.state.currentTab;
    let nextTab = nextState.currentTab;

    return nextService && currentService !== nextService ||
      currentTab !== nextTab || props.open !== nextProps.open;
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
    );

    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );

    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_CHANGE, this.onMarathonStoreChange
    );

    this.forceUpdate();
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
    );

    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );

    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE, this.onMarathonStoreChange
    );
  },

  onMesosSummaryChange: function () {
    if (MesosSummaryStore.get("statesProcessed")) {
      // Once we have the data we need (frameworks), stop listening for changes.
      MesosSummaryStore.removeChangeListener(
        EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
      );

      this.forceUpdate();
    }
  },

  onMarathonStoreChange: function () {
    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE, this.onMarathonStoreChange
    );

    this.forceUpdate();
  },

  onMesosStateChange: function () {
    if (MesosStateStore.get("lastMesosState")) {
      MesosStateStore.removeChangeListener(
        EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
      );
      this.forceUpdate();
    }
  },

  handlePanelClose: function () {
    this.props.onClose();
    this.forceUpdate();
  },

  handleOpenServiceButtonClick: function () {
    this.context.router.transitionTo(
      "service-ui",
      {serviceName: this.props.serviceName}
    );
  },

  handleTabClick: function (nextTab) {
    this.setState({currentTab: nextTab});
  },

  getBasicInfo: function () {
    let service = MesosSummaryStore.getServiceFromName(this.props.serviceName);
    if (service == null) {
      return null;
    }

    let appImages = MarathonStore.getServiceImages(service.name);
    let appHealth = MarathonStore.getServiceHealth(service.name);
    let healthClass = HealthStatus[appHealth.key].classNames;
    let healthLabel = HealthLabels[HealthStatus[appHealth.key].key];
    let imageTag = null;

    if (appImages) {
      imageTag = (
        <img className="icon icon-image icon-service"
          src={appImages["icon-large"]} />
      );
    }

    return (
      <div className="flex-box flex-box-align-vertical-center">
        {imageTag}
        <div className="container container-fluid">
          <div className="h2 inverse flush-top flush-bottom">
            {service.name}
          </div>
          <div className={healthClass}>
            {healthLabel}
          </div>
        </div>
      </div>
    );
  },

  getHeader: function () {
    return (
      <div>
        <span className="button button-link button-inverse"
          onClick={this.handlePanelClose}>
          <i className="service-detail-close"></i>
          Close
        </span>
      </div>
    );
  },

  getTabs: function () {
    let currentTab = this.state.currentTab;
    let tasksClassSet = classNames({
      "button button-link": true,
      "button-primary": currentTab === "tasks"
    });
    let detailsClassSet = classNames({
      "button button-link": true,
      "button-primary": currentTab === "details"
    });

    return (
      <div className="side-panel-tabs">
        <div
          className={tasksClassSet}
          onClick={this.handleTabClick.bind(this, "tasks")}>
          Tasks
        </div>
        <div
          className={detailsClassSet}
          onClick={this.handleTabClick.bind(this, "details")}>
          Details
        </div>
      </div>
    );
  },

  getTasksView: function () {
    // Going to leave table here.
    return null;
  },

  getTabView: function () {
    let currentTab = this.state.currentTab;
    if (currentTab === "tasks") {
      return this.getTasksView();
    }

    return this.getInfo();
  },

  getServiceDetails: function () {
    let service = MesosSummaryStore.getServiceFromName(this.props.serviceName);
    if (service == null) {
      return "loading...";
    }

    return (
      <div>
        <div
          className="container container-pod container-pod-divider-bottom container-pod-divider-inverse flush-bottom">
          {this.getBasicInfo()}
          <div className="container container-pod container-pod-short flush-left">
            <div className="row">
              <div className="column-4">
                {this.getOpenServiceButton()}
              </div>
              <div className="column-4">
              </div>
            </div>
          </div>
          {this.getTabs()}
        </div>
        {this.getTabView()}
      </div>
    );
  },

  getOpenServiceButton: function () {
    if (!MesosSummaryStore.hasServiceUrl(this.props.serviceName)) {
      return null;
    }

    // We are not using react-router's Link tag due to reactjs-component's
    // Portal going outside of React's render tree.
    return (
      <a className="button button-primary text-align-right"
        onClick={this.handleOpenServiceButtonClick}>
        Open service
      </a>
    );
  },

  getInfoRow: function (header, value) {
    return (
      <p className="row flex-box">
        <span className="column-4 emphasize">
          {header}
        </span>
        <span className="column-12">
          {value}
        </span>
      </p>
    );
  },

  getInfo: function () {
    let serviceName = this.props.serviceName;
    let service = MesosStateStore.getServiceFromName(serviceName);
    let marathonService = MarathonStore.getServiceFromName(serviceName);

    if (service == null ||
      marathonService == null ||
      marathonService.snapshot == null) {
      return (
        <div className="container container-pod container-pod-short">
          <h3 className="inverse">No info</h3>
        </div>
      );
    }

    let registeredTime = service.registered_time.toFixed(3) * 1000;
    let date = DateUtil.msToDateStr(registeredTime);
    let hostName = service.hostname;
    let instances = marathonService.snapshot.instances;
    let command = marathonService.snapshot.cmd;
    let ports = marathonService.snapshot.ports;
    let version = marathonService.snapshot.version;

    return (
      <div className="container container-pod container-pod-short">
        {this.getInfoRow("Host Name", hostName)}
        {this.getInfoRow("Tasks", service.tasks.length)}
        {this.getInfoRow("Registered", date)}
        {this.getInfoRow("Instances", instances)}
        {this.getInfoRow("Command", command)}
        {this.getInfoRow("Ports", ports)}
        {this.getInfoRow("Version", version)}
      </div>
    );
  },

  render: function () {
    // TODO(ml): rename to className
    return (
      <SidePanel classNames="service-detail"
        header={this.getHeader()}
        open={this.props.open}
        onClose={this.handlePanelClose}>
        {this.getServiceDetails()}
      </SidePanel>
    );
  }
});

module.exports = ServiceSidePanel;
