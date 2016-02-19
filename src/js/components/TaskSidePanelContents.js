import _ from 'underscore';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/

import DescriptionList from '../components/DescriptionList';
import MesosStateStore from '../stores/MesosStateStore';
import MesosSummaryStore from '../stores/MesosSummaryStore';
import ResourceTypes from '../constants/ResourceTypes';
import SidePanelContents from './SidePanelContents';
import TaskDebugView from '../components/TaskDebugView';
import TaskDirectoryView from './TaskDirectoryView';
import TaskStates from '../constants/TaskStates';
import TaskUtil from '../utils/TaskUtil';
import Units from '../utils/Units';

const TABS = {
  files: 'Files',
  details: 'Details',
  debug: 'Log Viewer'
};

module.exports = class TaskSidePanelContents extends SidePanelContents {
  constructor() {
    super(...arguments);

    this.tabs_tabs = _.clone(TABS);

    this.state = {
      currentTab: Object.keys(this.tabs_tabs).shift(),
      expandClass: 'large',
      showExpandButton: false
    };

    this.store_listeners = [
      {name: 'state', events: ['success']},
      {name: 'summary', events: ['success']}
    ];
  }

  componentWillMount() {
    // If the task is 'completed', we do not show the 'Files' tab.
    if (this.props.itemID) {
      let task = MesosStateStore.getTaskFromTaskID(this.props.itemID);

      if (task == null) {
        return;
      }

      this.tabs_tabs = _.clone(TABS);
    }
  }

  getResources(task) {
    if (task.resources == null) {
      return null;
    }

    let resources = Object.keys(task.resources);

    return resources.map(function (resource) {
      if (resource === 'ports') {
        return null;
      }

      let colorIndex = ResourceTypes[resource].colorIndex;
      let resourceLabel = ResourceTypes[resource].label;
      let resourceIconClasses = `icon icon-sprite icon-sprite-medium
        icon-sprite-medium-color icon-resources-${resourceLabel.toLowerCase()}`;
      let resourceValue = Units.formatResource(
        resource, task.resources[resource]
      );
      return (
        <div key={resource} className="
          side-panel-resource-container
          flex-box-align-vertical-center
          container-pod
          container-pod-super-short
          flush-top">
          <div className="media-object media-object-spacing media-object-align-middle">
            <div className="media-object-item">
              <i className={resourceIconClasses}></i>
            </div>
            <div className="media-object-item">
              <h4 className="flush-top flush-bottom text-color-neutral">
                {resourceValue}
              </h4>
              <span className={`side-panel-resource-label
                  text-color-${colorIndex}`}>
                {resourceLabel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      );
    });
  }

  getBasicInfo(task, node) {
    // Hide when no task or when we are viewing debug tab
    if (task == null || this.state.currentTab === 'debug') {
      return null;
    }

    let statusIcon = TaskUtil.getTaskStatusIcon(task);
    let statusClassName = `${TaskUtil.getTaskStatusClassName(task)} side-panel-subheader`;

    return (
      <div>
        <div className="side-panel-content-header container-fluid container-pod flush-top container-pod-short-bottom">
          <h1 className="side-panel-content-header-label flush">
            {task.name}
          </h1>

          <div className="media-object media-object-spacing media-object-spacing-narrow media-object-align-middle media-object-inline">
            <div className="media-object-item">
              {statusIcon}
            </div>
            <div className="media-object-item">
              <span className={statusClassName}>
                {TaskStates[task.state].displayName}
              </span>
            </div>
          </div>

          <span className="side-panel-subheader side-panel-subheader-emphasize">
            {node.hostname}
          </span>
        </div>
        <div className="container container-pod container-pod-short container-fluid flush">
          {this.getResources(task)}
        </div>
      </div>
    );
  }

  renderDetailsTabView() {
    let task = MesosStateStore.getTaskFromTaskID(this.props.itemID);

    if (task == null || !MesosSummaryStore.get('statesProcessed')) {
      return null;
    }

    let node = MesosStateStore.getNodeFromID(task.slave_id);
    let services = MesosSummaryStore.get('states')
      .lastSuccessful()
      .getServiceList();
    let service = services.filter({ids: [task.framework_id]}).last();

    let headerValueMapping = {
      ID: task.id,
      Service: `${service.name} (${service.id})`,
      Node: `${node.hostname} (${node.id})`
    };

    let labelMapping = {};

    if (task.labels) {
      task.labels.forEach(function (label) {
        labelMapping[label.key] = label.value;
      });
    }

    return (
      <div className="container-fluid container-pod container-pod-short flush-top">
        <DescriptionList
          className="container container-fluid container-pod container-pod-short flush-bottom"
          hash={headerValueMapping}
          headline="Configuration" />
        <DescriptionList
          className="container container-fluid container-pod container-pod-short flush-bottom"
          hash={labelMapping}
          headline="Labels" />
      </div>
    );
  }

  renderFilesTabView() {
    let task = MesosStateStore.getTaskFromTaskID(this.props.itemID);

    return (
      <div className="container container-fluid container-pod container-pod-short flex-container-col flex-grow no-overflow">
        <TaskDirectoryView task={task} />
      </div>
    );
  }

  renderLogViewerTabView() {
    let task = MesosStateStore.getTaskFromTaskID(this.props.itemID);

    return (
      <div className="container container-fluid container-pod container-pod-short flex-container-col flex-grow no-overflow">
        <TaskDebugView
          showExpandButton={this.showExpandButton}
          task={task} />
      </div>
    );
  }

  tabs_handleTabClick(nextTab) {
    let {currentTab} = this.state;

    // Removing unnecessary listeners from debug tab
    if (currentTab !== 'debug' && nextTab === 'debug') {
      this.store_removeListeners();
    }

    // Re-adding listeners when navigating away from debug tab
    if (currentTab === 'debug' && nextTab !== 'debug') {
      this.store_addListeners();
    }

    // Only call super after we are done removing/adding listeners
    super.tabs_handleTabClick(...arguments);
  }

  render() {
    if (MesosStateStore.get('lastMesosState').slaves == null) {
      return null;
    }

    let task = MesosStateStore.getTaskFromTaskID(this.props.itemID);

    if (task == null) {
      return this.getNotFound('task');
    }

    let node = MesosStateStore.getNodeFromID(task.slave_id);

    return (
      <div className="flex-container-col no-overflow">
        {this.getExpandButton()}
        <div className="side-panel-content-header container container-pod
          container-fluid container-pod-divider-bottom
          container-pod-divider-bottom-align-right flush-bottom flex-no-shrink">
          {this.getBasicInfo(task, node)}
          <ul className="tabs list-inline container container-fluid container-pod
            flush flush-bottom flush-top">
            {this.tabs_getUnroutedTabs()}
          </ul>
        </div>
        {this.tabs_getTabView()}
      </div>
    );
  }
};
