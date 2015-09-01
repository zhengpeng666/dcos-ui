import classNames from "classnames";
import React from "react/addons";
import {SidePanel} from "reactjs-components";

import DateUtil from "../utils/DateUtil";
import EventTypes from "../constants/EventTypes";
import HealthLabels from "../constants/HealthLabels";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";

const STATES = {
  UNHEALTHY: {key: "UNHEALTHY", classes: {"text-danger": true}},
  HEALTHY: {key: "HEALTHY", classes: {"text-success": true}},
  IDLE: {key: "IDLE", classes: {"text-warning": true}},
  NA: {key: "NA", classes: {"text-mute": true}}
};

const ServiceSidePanel = React.createClass({

  displayName: "ServiceSidePanel",

  contextTypes: {
    router: React.PropTypes.func
  },

  shouldComponentUpdate: function (nextProps) {
    let props = this.props;

    return props.serviceName !== nextProps.serviceName ||
      props.open !== nextProps.open;
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
    );

    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_CHANGE, this.onMarathonStoreChange
    );

    this.forceUpdate();
  },

  componentWillUnmount: function () {
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
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

  getServiceDetails: function () {
    let service = MesosSummaryStore.getServiceFromName(this.props.serviceName);
    if (service == null) {
      return "loading...";
    }

    return (
      <div>
        <div
          className="container container-pod container-pod-divider-bottom container-pod-divider-inverse">
          <div className="row flex-box flex-box-align-vertical-center">
            <div className="column-8">
              {this.getBasicInfo()}
            </div>
            <div className="column-4 text-align-right">
              {this.getOpenServiceButton()}
            </div>
          </div>
          <div className="container container-pod container-pod-short flush-left">
            <div className="row">
              <div className="column-8">
                {this.getInfo()}
              </div>
              <div className="column-4">
              </div>
            </div>
          </div>
        </div>
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
      <a className="button button-success text-align-right"
        onClick={this.handleOpenServiceButtonClick}>
        Open service
      </a>
    );
  },

  getBasicInfo: function () {
    let service = MesosSummaryStore.getServiceFromName(this.props.serviceName);
    if (!service) {
      return null;
    }

    let appImages = MarathonStore.getServiceImages(this.props.serviceName);
    let appHealth = MarathonStore.getServiceHealth(this.props.serviceName);
    let healthClass = classNames(STATES[appHealth.key].classes);
    let healthLabel = HealthLabels[STATES[appHealth.key].key];
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
        <div className="container container-fluid container-fluid-narrow">
          <div className="h2 inverse flush-top flush-bottom">
            {this.props.serviceName}
          </div>
          <div className={healthClass}>
            {healthLabel}
          </div>
        </div>
      </div>
    );
  },

  getInfo: function () {
    let service = MesosStateStore.getServiceFromName(this.props.serviceName);
    if (!service) {
      return null;
    }
    console.log(service);
    var registeredTime = service.registered_time.toFixed(3) * 1000;
    var date = DateUtil.msToDateStr(registeredTime);

    return (
      <div>
        <p className="p row flex-box">
          <span className="column-4 emphasize">
            Service
          </span>
          <span className="column-12">
            {service.name}
          </span>
        </p>
        <p className="row flex-box">
          <span className="column-4 emphasize">
            Tasks
          </span>
          <span className="column-12">
            {service.tasks.length}
          </span>
        </p>
        <p className="row flex-box">
          <span className="column-4 emphasize">
            Registered
          </span>
          <span className="column-12">
            {date}
          </span>
        </p>
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
