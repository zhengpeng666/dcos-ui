import classNames from 'classnames';
import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import FilterInputText from './FilterInputText';
import IconDownload from './icons/IconDownload';
import MesosLogView from './MesosLogView';
import RequestErrorMsg from './RequestErrorMsg';
import TaskDirectoryActions from '../events/TaskDirectoryActions';
import TaskDirectoryStore from '../stores/TaskDirectoryStore';

const LOG_VIEWS = [
  {name: 'stdout', displayName: 'Output'},
  {name: 'stderr', displayName: 'Error'}
];

const METHODS_TO_BIND = [
  'handleSearchStringChange',
  'onTaskDirectoryStoreError',
  'onTaskDirectoryStoreSuccess'
];

class TaskDebugView extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      currentView: 0,
      taskDirectoryErrorCount: 0
    };

    this.store_listeners = [{
      events: ['success', 'error'],
      name: 'taskDirectory',
      suppressUpdate: true,
      unmountWhen: () => {
        return this.state.directory != null;
      },
      listenAlways: false
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

  }

  componentWillMount() {
    super.componentWillMount(...arguments);

    this.props.showExpandButton(true);
    TaskDirectoryStore.getDirectory(this.props.task);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let {props, state} = this;
    let directory = state.directory;
    let nextDirectory = nextState.directory;
    let task = state.task;
    let nextTask = nextState.task;

    return !!(
      // Check task
      (props.task !== nextProps.task) ||
      (task && nextTask && task.slave_id !== nextTask.slave_id) ||
      // Check current view
      (state.currentView !== nextState.currentView) ||
      // Check taskDirectoryErrorCount
      (state.taskDirectoryErrorCount !== nextState.taskDirectoryErrorCount) ||
      // Check searchString
      (state.searchString !== nextState.searchString) ||
      // Check directory
      (directory !== nextDirectory) || (directory && nextDirectory &&
        directory.getItems().length !== nextDirectory.getItems().length)
    );
  }

  onTaskDirectoryStoreError() {
    this.setState({
      taskDirectoryErrorCount: this.state.taskDirectoryErrorCount + 1
    });
  }

  onTaskDirectoryStoreSuccess() {
    if (this.state.directory == null) {
      this.setState({
        directory: TaskDirectoryStore.get('directory'),
        taskDirectoryErrorCount: 0
      });
    }
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  handleViewChange(index) {
    this.setState({currentView: index});
  }

  hasLoadingError() {
    return this.state.taskDirectoryErrorCount >= 3;
  }

  getErrorScreen() {
    return <RequestErrorMsg />;
  }

  getLogView(logName, filePath, nodeID) {
    let {state} = this;

    return (
      <MesosLogView
        filePath={filePath}
        highlightText={state.searchString}
        slaveID={nodeID}
        logName={logName} />
    );
  }

  getSelectionButtons() {
    let currentView = this.state.currentView;

    return LOG_VIEWS.map((view, index) => {
      let classes = classNames({
        'button button-stroke': true,
        'active': index === currentView
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
    if (this.hasLoadingError()) {
      return this.getErrorScreen();
    }

    let {props, state} = this;
    let currentView = LOG_VIEWS[state.currentView];
    let directory = state.directory;
    let nodeID = props.task.slave_id;

    // Only try to find file if directory exists
    let directoryItem = directory && directory.findFile(currentView.name);
    // Only try to get path if file exists
    let filePath = directoryItem && directoryItem.get('path');

    return (
      <div className="flex-container-col flex-grow no-overflow">
        <div className="control-group form-group flex-no-shrink flex-align-right flush-bottom">
          <FilterInputText
            className="flex-grow"
            placeholder="Search"
            searchString={state.searchString}
            handleFilterChange={this.handleSearchStringChange}
            inverseStyle={false} />
          <div className="button-group">
            {this.getSelectionButtons()}
          </div>
          <a
            className="button button-stroke"
            disabled={!filePath}
            href={TaskDirectoryActions.getDownloadURL(nodeID, filePath)}>
            <IconDownload />
          </a>
        </div>
        {this.getLogView(currentView.displayName, filePath, nodeID)}
      </div>
    );
  }
}

TaskDebugView.propTypes = {
  showExpandButton: React.PropTypes.func,
  task: React.PropTypes.object
};

TaskDebugView.defaultProps = {
  showExpandButton: function () {},
  task: {}
};

module.exports = TaskDebugView;
