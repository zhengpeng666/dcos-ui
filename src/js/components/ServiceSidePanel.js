import classNames from "classnames";
/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import DateUtil from "../utils/DateUtil";
import DetailSidePanel from "./DetailSidePanel";
import HealthLabels from "../constants/HealthLabels";
import HealthStatus from "../constants/HealthStatus";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import StringUtil from "../utils/StringUtil";
import TaskView from "./TaskView";

const METHODS_TO_BIND = [
  "handleOpenServiceButtonClick",
  "handleTabClick"
];

// key is the name, value is the display name
const TABS = {
  tasks: "Tasks",
  details: "Details"
};

export default class ServiceSidePanel extends DetailSidePanel {
  constructor() {
    super(...arguments);

    this.state = {
      currentTab: Object.keys(TABS).shift()
    };

    this.storesListeners = [
      {name: "marathon", listenAlways: true},
      {name: "summary", listenAlways: true},
      {name: "state", listenAlways: true}
    ];

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      let defaultTab = Object.keys(TABS).shift();
      if (this.state.currentTab !== defaultTab) {
        this.setState({currentTab: defaultTab});
      }
    }

    return super.shouldComponentUpdate(...arguments);
  }

  handleOpenServiceButtonClick() {
    this.context.router.transitionTo(
      "service-ui",
      {serviceName: this.props.itemID}
    );
  }

  handleTabClick(nextTab) {
    this.setState({currentTab: nextTab});
  }

  getSubHeader(service) {
    let appHealth = MarathonStore.getServiceHealth(service.name);
    let appVersion = MarathonStore.getServiceVersion(service.name);
    let activeTasksCount = service.sumTaskTypesByState("active");
    let activeTasksSubHeader = StringUtil.pluralize("Task", activeTasksCount);
    let subHeaderItems = [
      {
        classes:
          `side-panel-subheader ${HealthStatus[appHealth.key].classNames}`,
        label: HealthLabels[HealthStatus[appHealth.key].key],
        shouldShow: appHealth.key != null
      },
      {
        classes: "side-panel-subheader",
        label: `Version ${appVersion}`,
        shouldShow: appVersion != null
      },
      {
        classes: "side-panel-subheader",
        label: `${activeTasksCount} Active ${activeTasksSubHeader}`,
        shouldShow: activeTasksCount != null && activeTasksSubHeader != null
      }
    ];

    return subHeaderItems.map(function (item, index) {
      if (!item.shouldShow) {
        return null;
      }

      return (
        <span className={item.classes} key={index}>
          {item.label}
        </span>
      );
    });
  }

  getBasicInfo() {
    let service = MesosSummaryStore.getServiceFromName(this.props.itemID);

    if (service == null) {
      return null;
    }

    let imageTag = null;
    let appImages = MarathonStore.getServiceImages(service.name);
    if (appImages && appImages["icon-large"]) {
      imageTag = (
        <div className="side-panel-icon icon icon-large icon-image-container icon-app-container">
          <img src={appImages["icon-large"]} />
        </div>
      );
    }

    let containerClassSet = classNames({
      "": imageTag != null
    });

    return (
      <div className="side-panel-content-header-details flex-box
        flex-box-align-vertical-center">
        {imageTag}
        <div className={containerClassSet}>
          <h1 className="side-panel-content-header-label flush">
            {service.name}
          </h1>
          <div>
            {this.getSubHeader(service)}
          </div>
        </div>
      </div>
    );
  }

  getTabs() {
    let currentTab = this.state.currentTab;

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

  getTaskView() {
    let serviceName = this.props.itemID;
    let tasks = MesosStateStore.getTasksFromServiceName(serviceName);

    return (

      <div className="container container-fluid container-pod container-pod-short-top">
        <TaskView tasks={tasks} parentRouter={this.context.router} />
      </div>
    );
  }

  getTabView() {
    let currentTab = this.state.currentTab;
    if (currentTab === "tasks") {
      return this.getTaskView();
    }

    return (
      <div className="container container-fluid container-pod container-pod-short-top">
        {this.getInfo()}
      </div>
    );
  }

  getContents() {
    let service = MesosSummaryStore.getServiceFromName(this.props.itemID);

    if (service == null) {
      return this.getNotFound("service");
    }

    return (
      <div>
        <div className="side-panel-content-header container container-pod container-fluid container-pod-divider-bottom container-pod-divider-bottom-align-right flush-bottom">
          {this.getBasicInfo()}
          <div className="side-panel-content-header-charts container-pod container-pod-short-top flush-bottom">
            <div className="row">
              {this.getCharts("Service", service)}
            </div>
          </div>
          {this.getOpenServiceButton()}
          <div className="side-panel-tabs">
            {this.getTabs()}
          </div>
        </div>
        {this.getTabView()}
      </div>
    );
  }

  getOpenServiceButton() {
    if (!MesosSummaryStore.hasServiceUrl(this.props.itemID)) {
      return null;
    }

    // We are not using react-router's Link tag due to reactjs-component's
    // Portal going outside of React's render tree.
    return (
      <div className="side-panel-content-header-actions container-pod container-pod-short">
        <div className="button-collection flush-bottom">
          <a className="button button-large button-primary"
            onClick={this.handleOpenServiceButtonClick}>
            Open Service
          </a>
        </div>
      </div>
    );
  }

  getInfo() {
    let serviceName = this.props.itemID;
    let service = MesosStateStore.getServiceFromName(serviceName);
    let marathonService = MarathonStore.getServiceFromName(serviceName);

    if (service == null ||
      marathonService == null ||
      marathonService.snapshot == null ||
      service != null && service.name === "marathon") {
      return <h2 className="inverse flush-top">No information available.</h2>;
    }

    let installedTime = MarathonStore.getServiceInstalledTime(serviceName);
    let portTitle = StringUtil.pluralize(
      "Port", marathonService.snapshot.ports.length
    );
    let headerValueMapping = {
      "Host Name": service.hostname,
      Tasks: service.tasks.length,
      Installed: DateUtil.msToDateStr(installedTime),
      Instances: marathonService.snapshot.instances,
      Command: marathonService.snapshot.cmd,
      [portTitle]: marathonService.snapshot.ports.join(", ")
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
