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
    if (appImages) {
      imageTag = (
        <img className="icon icon-image icon-rounded"
          src={appImages["icon-large"]} />
      );
    }

    return (
      <div className="side-panel-content-header flex-box
          flex-box-align-vertical-center">
        <div className="side-panel-icon icon-inset-border
            icon-rounded">
          {imageTag}
        </div>
        <div className="container container-fluid">
          <h1 className="h2 side-panel-content-header-label inverse flush-top">
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
      <div className="container container-pod flush-top">
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
      <div className="container container-pod container-pod-short">
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
        <div className="container container-pod container-pod-divider-bottom
            container-pod-divider-inverse container-pod-short-top
            flush-bottom">
          {this.getBasicInfo()}
          <div className="container container-pod container-pod-short flush-left
              flush-bottom flush-right">
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
      <div className="container container-pod container-pod-short
          container-pod-super-short-top flush-left">
        <div className="row">
          <div className="column-4">
            <a className="button button-primary text-align-right"
              onClick={this.handleOpenServiceButtonClick}>
              Open Service
            </a>
          </div>
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
      marathonService.snapshot == null) {
      return null;
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
