import _ from "underscore";
import classNames from "classnames";
/*eslint-disable no-unused-vars*/
const React = require("react/addons");
/*eslint-enable no-unused-vars*/

import BarChart from "./charts/BarChart";
import Chart from "./charts/Chart";
import Config from "../config/Config";
import DateUtil from "../utils/DateUtil";
import DetailSidePanel from "./DetailSidePanel";
import HealthLabels from "../constants/HealthLabels";
import HealthStatus from "../constants/HealthStatus";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import ResourceTypes from "../constants/ResourceTypes";
import StringUtil from "../utils/StringUtil";
import TaskView from "./TaskView";
import Units from "../utils/Units";

// number to fit design of width vs. height ratio
const WIDTH_HEIGHT_RATIO = 4.5;

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

  handleOpenServiceButtonClick() {
    this.context.router.transitionTo(
      "service-ui",
      {serviceName: this.props.itemID}
    );
  }

  handleTabClick(nextTab) {
    this.setState({currentTab: nextTab});
  }

  getBasicInfo() {
    let service = MesosSummaryStore.getServiceFromName(this.props.itemID);

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
          <h1 className="inverse flush-top flush-bottom">
            {service.name}
          </h1>
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
        <TaskView tasks={tasks} />
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
        <div
          className="container container-pod container-pod-divider-bottom
            container-pod-divider-inverse flush-bottom">
          {this.getBasicInfo()}
          <div className="container container-pod container-pod-short flush-left flush-bottom flush-right">
            <div className="row chart">
              {this.getCharts()}
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
      <div className="container container-pod container-pod-short flush-left">
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

    let serviceVersion = MarathonStore.getServiceVersion(serviceName);
    let headerValueMapping = {
      "Host Name": service.hostname,
      Tasks: service.tasks.length,
      Installed: DateUtil.msToDateStr(serviceVersion),
      Instances: marathonService.snapshot.instances,
      Command: marathonService.snapshot.cmd,
      Ports: marathonService.snapshot.ports.join(", ")
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

  getResourceChart(resource, totalResources) {
    let colorIndex = ResourceTypes[resource].colorIndex;
    let resourceLabel = ResourceTypes[resource].label;
    let resourceData = [{
      name: "Alloc",
      colorIndex: colorIndex,
      values: totalResources[resource]
    }];
    let resourceValue = Units.formatResource(
      resource, _.last(totalResources[resource]).value
    );

    let axisConfiguration = {
      x: {hideMatch: /^0$/},
      y: {hideMatch: /^50$/}
    };

    return (
      <div key={resource} className="column-4
        flex-box-align-vertical-center
        container-pod
        container-pod-super-short
        flush-top">
        <div>
          <h3 className="flush-top flush-bottom text-color-neutral">
            {resourceValue}
          </h3>
          <span className={`text-color-${colorIndex}`}>
            {resourceLabel.toUpperCase()}
          </span>
        </div>

        <Chart calcHeight={function (w) { return w / WIDTH_HEIGHT_RATIO; }}
          delayRender={true}>
          <BarChart
            axisConfiguration={axisConfiguration}
            data={resourceData}
            inverseStyle={true}
            margin={{top: 0, left: 43, right: 10, bottom: 40}}
            maxY={100}
            refreshRate={Config.getRefreshRate()}
            ticksY={2}
            xGridLines={0}
            y="percentage" />
        </Chart>
      </div>
    );
  }

  getCharts() {
    let service = MesosStateStore.getServiceFromName(this.props.itemID);

    if (!service) {
      return null;
    }

    let states = MesosSummaryStore.get("states");
    let resources = states.getResourceStatesForServiceIDs([service.id]);

    return [
      this.getResourceChart("cpus", resources),
      this.getResourceChart("mem", resources),
      this.getResourceChart("disk", resources)
    ];
  }

  render() {
    return super.render(...arguments);
  }
}
