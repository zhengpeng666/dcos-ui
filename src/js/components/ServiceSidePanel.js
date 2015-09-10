import _ from "underscore";
import classNames from "classnames";
import React from "react/addons";

import DateUtil from "../utils/DateUtil";
import DetailSidePanel from "./DetailSidePanel";
import EventTypes from "../constants/EventTypes";
import HealthLabels from "../constants/HealthLabels";
import HealthStatus from "../constants/HealthStatus";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import StringUtil from "../utils/StringUtil";

const METHODS_TO_BIND = [
  "handleOpenServiceButtonClick",
  "handleTabClick",
  "onMesosStateChange",
  "onMarathonStoreChange"
];

export default class ServiceSidePanel extends DetailSidePanel {
  constructor() {
    super(...arguments);

    this.state = {
      currentTab: "tasks"
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props;
    let currentService = props.serviceName;
    let nextService = nextProps.serviceName;

    let currentTab = this.state.currentTab;
    let nextTab = nextState.currentTab;

    return nextService && currentService !== nextService ||
      currentTab !== nextTab || props.open !== nextProps.open;
  }

  componentDidMount() {
    super.componentDidMount(...arguments);

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
    );

    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_CHANGE, this.onMarathonStoreChange
    );

    this.forceUpdate();
  }

  componentWillUnmount() {
    super.componentWillUnmount(...arguments);

    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
    );

    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE, this.onMarathonStoreChange
    );
  }

  onMarathonStoreChange() {
    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE, this.onMarathonStoreChange
    );
    this.forceUpdate();
  }

  onMesosStateChange() {
    if (MesosStateStore.get("lastMesosState")) {
      MesosStateStore.removeChangeListener(
        EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
      );
      this.forceUpdate();
    }
  }

  handleOpenServiceButtonClick() {
    this.context.router.transitionTo(
      "service-ui",
      {serviceName: this.props.serviceName}
    );
  }

  handleTabClick(nextTab) {
    this.setState({currentTab: nextTab});
  }

  getBasicInfo() {
    let service = MesosSummaryStore.getServiceFromName(this.props.serviceName);

    if (service == null) {
      return null;
    }

    let appImages = MarathonStore.getServiceImages(service.name);
    let appHealth = MarathonStore.getServiceHealth(service.name);
    let healthClass = classNames(
      HealthStatus[appHealth.key].classNames,
      "side-panel-subheader"
    );
    let activeTasksCount = service.TASK_RUNNING + service.TASK_STARTING +
      service.TASK_STAGING;
    let activeTasksSubHeader = StringUtil.pluralize("Task", activeTasksCount);
    let imageTag = null;

    if (appImages) {
      imageTag = (
        <img className="icon icon-image icon-rounded"
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
          <div>
            <span className={healthClass}>
              {HealthLabels[HealthStatus[appHealth.key].key]}
            </span>
            <span>
              {`${activeTasksCount} Active ${activeTasksSubHeader}`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  getHeader() {
    return (
      <div>
        <span className="button button-link button-inverse"
          onClick={this.handlePanelClose}>
          <i className="side-panel-detail-close"></i>
          Close
        </span>
      </div>
    );
  }

  getTabs() {
    let currentTab = this.state.currentTab;

    // key is the name, value is the display name
    const TABS = {
      tasks: "Tasks",
      details: "Details"
    };

    return Object.keys(TABS).map(function (tab, i) {
      let classSet = classNames({
        "button button-link": true,
        "button-primary": currentTab === tab
      });

      return (
        <div
          key={i}
          className={classSet}
          onClick={this.handleTabClick.bind(this, tab)}>
          {TABS[tab]}
        </div>
      );
    }, this);
  }

  getTasksView() {
    // Coming soon: table view.
    return null;
  }

  getTabView() {
    let currentTab = this.state.currentTab;
    if (currentTab === "tasks") {
      return this.getTasksView();
    }

    return (
      <div className="container container-pod container-pod-short">
        {this.getInfo()}
      </div>
    );
  }

  getContents() {
    let service = MesosSummaryStore.getServiceFromName(this.props.serviceName);
    if (service == null) {
      return (
        <div>
          <h2 className="text-align-center inverse overlay-header">
            Error finding service
          </h2>
          <div className="container container-pod text-align-center flush-top text-danger">
            {`Did not find a service by the name "${this.props.serviceName}"`}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div
          className="container container-pod container-pod-divider-bottom
            container-pod-divider-inverse flush-bottom">
          {this.getBasicInfo()}
          <div className="container container-pod container-pod-short flush-left">
            <div className="row">
              <div className="column-4">
                {this.getOpenServiceButton()}
              </div>
            </div>
          </div>
          <div className="side-panel-tabs">
            {this.getTabs()}
          </div>
        </div>
        {this.getTabView()}
      </div>
    );
  }

  getOpenServiceButton() {
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
  }

  getInfo() {
    let serviceName = this.props.serviceName;
    let service = MesosStateStore.getServiceFromName(serviceName);
    let marathonService = MarathonStore.getServiceFromName(serviceName);

    if (service == null ||
      marathonService == null ||
      marathonService.snapshot == null) {
      return null;
    }

    let installTime = marathonService.snapshot.version;
    let headerValueMapping = {
      "Host Name": service.hostname,
      Tasks: service.tasks.length,
      Installed: DateUtil.msToDateStr(installTime),
      Instances: marathonService.snapshot.instances,
      Command: marathonService.snapshot.cmd,
      Ports: marathonService.snapshot.ports.join(", "),
      Version: marathonService.snapshot.version
    };

    return Object.keys(headerValueMapping).map(function (header, i) {
      return (
        <p key={i} className="row flex-box">
          <span className="column-4 emphasize">
            {header}
          </span>
          <span className="column-12">
            {headerValueMapping[header]}
          </span>
        </p>
      );
    });
  }

  render() {
    return super.render(...arguments);
  }
}

ServiceSidePanel.propTypes = _.extend({}, DetailSidePanel.propTypes, {
  serviceName: React.PropTypes.string
});
