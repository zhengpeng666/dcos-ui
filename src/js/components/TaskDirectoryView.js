import React from "react";

import EventTypes from "../constants/EventTypes";
import TaskDirectoryTable from "./TaskDirectoryTable";
import TaskDirectoryStore from "../stores/TaskDirectoryStore";

const METHODS_TO_BIND = ["handleDirectoryChange"];

export default class TaskDirectoryView extends React.Component {
  constructor() {
    super();

    this.state = {
      directory: null
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    TaskDirectoryStore.getDirectory(this.props.task);
    TaskDirectoryStore.addChangeListener(
      EventTypes.TASK_DIRECTORY_CHANGE,
      this.handleDirectoryChange
    );
  }

  componentWillUnmount() {
    TaskDirectoryStore.removeChangeListener(
      EventTypes.TASK_DIRECTORY_CHANGE,
      this.handleDirectoryChange
    );
  }

  handleDirectoryChange() {
    let directory = TaskDirectoryStore.get("directory");
    this.setState({directory});
  }

  handleFileClick(path) {
    TaskDirectoryStore.addPath(this.props.task, path);
  }

  getLoadingScreen() {
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

  render() {
    let directory = this.state.directory;

    if (directory == null) {
      return this.getLoadingScreen();
    }

    return (
      <div className="container container-pod container-pod-short">
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
