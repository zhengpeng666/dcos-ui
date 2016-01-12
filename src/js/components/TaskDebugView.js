import classNames from "classnames";
import mixin from "reactjs-mixin";
import React from "react";
import {StoreMixin} from "mesosphere-shared-reactjs";

import IconDownload from "./icons/IconDownload";
import MesosLogView from "./MesosLogView";
import RequestErrorMsg from "./RequestErrorMsg";
import TaskDirectoryActions from "../events/TaskDirectoryActions";
import TaskDirectoryStore from "../stores/TaskDirectoryStore";

const LOG_VIEWS = [
  {name: "stdout", displayName: "Output"},
  {name: "stderr", displayName: "Error"}
];

const METHODS_TO_BIND = [
  "onTaskDirectoryStoreError"
];

export default class TaskDebugView extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      taskDirectoryErrorCount: 0,
      currentView: 0
    };

    this.store_listeners = [{
      name: "taskDirectory",
      events: ["success", "error"],
      unmountWhen: function (store, event) {
        if (event === "success") {
          return TaskDirectoryStore.getDirectory(this.props.task) !== undefined;
        }
      }
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

  }

  componentDidMount() {
    TaskDirectoryStore.getDirectory(this.props.task);
  }

  onTaskDirectoryStoreError() {
    this.setState({
      taskDirectoryErrorCount: this.state.taskDirectoryErrorCount + 1
    });
  }

  handleViewChange(index) {
    this.setState({currentView: index});
  }

  hasLoadingError() {
    return this.state.taskDirectoryErrorCount >= 3;
  }

  getLoadingScreen() {
    if (this.hasLoadingError()) {
      return <RequestErrorMsg />;
    }

    return (
      <div className="container container-fluid container-pod text-align-center vertical-center
        inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getSelectionButtons() {
    let currentView = this.state.currentView;

    return LOG_VIEWS.map((view, index) => {
      let classes = classNames({
        "button button-stroke": true,
        "active": index === currentView
      });

      return (
        <button
          className={classes}
          key={index}
          onClick={this.handleViewChange.bind(this, index)}>
          {view.displayName}
        </button>
      );
    });
  }

  render() {
    let {props, state} = this;
    let directory = TaskDirectoryStore.get("directory");
    if (directory == null) {
      return this.getLoadingScreen();
    }

    let nodeID = props.task.slave_id;
    let directoryItem = directory.findFile(LOG_VIEWS[state.currentView].name);
    let filePath = directoryItem.get("path");

    return (
      <div className="side-panel-section flex-container-col flex-grow no-overflow">
        <div className="control-group flex-align-right">
          <div className="button-group form-group">
            {this.getSelectionButtons()}
          </div>
          <a
            className="button button-stroke"
            href={TaskDirectoryActions.getDownloadURL(nodeID, filePath)}>
            <IconDownload />
          </a>
        </div>
        <MesosLogView
          filePath={filePath}
          slaveID={nodeID} />
      </div>
    );
  }
}

TaskDebugView.propTypes = {
  task: React.PropTypes.object
};

TaskDebugView.defaultProps = {
  task: {}
};
