import React from "react";

import EventTypes from "../constants/EventTypes";
import RequestErrorMsg from "./RequestErrorMsg";
import TaskDirectoryTable from "./TaskDirectoryTable";
import TaskDirectoryStore from "../stores/TaskDirectoryStore";

const METHODS_TO_BIND = ["onDirectoryChange", "onDirectoryError"];

export default class TaskDirectoryView extends React.Component {
  constructor() {
    super();

    this.state = {
      directory: null,
      taskDirectoryErrorCount: 0
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    TaskDirectoryStore.getDirectory(this.props.task);

    TaskDirectoryStore.addChangeListener(
      EventTypes.TASK_DIRECTORY_CHANGE,
      this.onDirectoryChange
    );

    TaskDirectoryStore.addChangeListener(
      EventTypes.TASK_DIRECTORY_ERROR,
      this.onDirectoryError
    );
  }

  componentWillUnmount() {
    TaskDirectoryStore.removeChangeListener(
      EventTypes.TASK_DIRECTORY_CHANGE,
      this.onDirectoryChange
    );

    TaskDirectoryStore.removeChangeListener(
      EventTypes.TASK_DIRECTORY_ERROR,
      this.onDirectoryError
    );
  }

  onDirectoryError() {
    this.setState({
      taskDirectoryErrorCount: this.state.taskDirectoryErrorCount + 1
    });
  }

  onDirectoryChange() {
    let directory = TaskDirectoryStore.get("directory");
    this.setState({directory});
  }

  handleFileClick(path) {
    TaskDirectoryStore.addPath(this.props.task, path);
  }

  handleBreadcrumbClick(path) {
    TaskDirectoryStore.setPath(this.props.task, path);
  }

  hasLoadingError() {
    return this.state.taskDirectoryErrorCount >= 3;
  }

  getLoadingScreen() {
    if (this.hasLoadingError()) {
      return <RequestErrorMsg />;
    }

    return (
      <div className="container container-pod text-align-center vertical-center
        inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getBreadcrumbs() {
    let innerPath = TaskDirectoryStore.get("innerPath").split("/");
    let onClickPath = "";

    let crumbs = innerPath.map((file, i) => {
      let textValue = file;
      if (i === 0) {
        textValue = "Working Directory";
      }

      if (i > 0) {
        onClickPath += ("/" + file);
      }

      if (i === innerPath.length - 1) {
        return (
          <span className="crumb" key={i}>{textValue}</span>
        );
      }

      return (
        <a
          className="crumb clickable"
          key={i}
          onClick={this.handleBreadcrumbClick.bind(this, onClickPath)}>
          {textValue}
        </a>
      );
    });

    return (
      <h4 className="breadcrumbs">{crumbs}</h4>
    );
  }

  render() {
    let directory = this.state.directory;

    if (directory == null || TaskDirectoryStore.get("directory") == null) {
      return this.getLoadingScreen();
    }

    return (
      <div>
        {this.getBreadcrumbs()}
        <TaskDirectoryTable
          files={directory}
          onFileClick={this.handleFileClick.bind(this)}
          nodeID={this.props.task.slave_id} />
      </div>
    );
  }
}

TaskDirectoryView.propTypes = {
  task: React.PropTypes.object
};

TaskDirectoryView.defaultProps = {
  task: {}
};
