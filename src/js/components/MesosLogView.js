import _ from 'underscore';
import mixin from 'reactjs-mixin';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import Highlight from './Highlight';
import MesosLogStore from '../stores/MesosLogStore';
import RequestErrorMsg from './RequestErrorMsg';

const METHODS_TO_BIND = [
  'onMesosLogStoreError',
  'onMesosLogStoreSuccess',
  'handleLogContainerScroll'
];

export default class MesosLogView extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      hasLoadingError: 0,
      fullLog: null
    };

    this.store_listeners = [{
      events: ['success', 'error'],
      name: 'mesosLog',
      suppressUpdate: true
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.handleLogContainerScroll = _.throttle(
      this.handleLogContainerScroll, 500
    );
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    let {props} = this;
    MesosLogStore.startTailing(props.slaveID, props.filePath);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(...arguments);
    let {props} = this;
    if (props.filePath !== nextProps.filePath) {
      MesosLogStore.stopTailing(props.filePath);
      MesosLogStore.startTailing(nextProps.slaveID, nextProps.filePath);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.fullLog == null &&
      this.state.fullLog && this.state.fullLog.length) {
      let container = React.findDOMNode(this.refs.logContainer);
      container.scrollTop = container.scrollHeight;
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount(...arguments);
    MesosLogStore.stopTailing(this.props.filePath);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let {props, state} = this;
    return !!(
      // Check highlightText
      (props.highlightText !== nextProps.highlightText) ||
      // Check filePath
      (props.filePath !== nextProps.filePath) ||
      // Check slaveID
      (props.slaveID !== nextProps.slaveID) ||
      // Check hasLoadingError
      (state.hasLoadingError !== nextState.hasLoadingError) ||
      // Check fullLog
      (state.fullLog !== nextState.fullLog)
    );
  }

  handleLogContainerScroll(e) {
    let container = e.target;
    if (!container) {
      return;
    }

    let distanceFromTop = container.pageYOffset || container.scrollTop || 0;
    if (distanceFromTop < 2000) {
      let {props} = this;
      MesosLogStore.getPreviousLogs(props.slaveID, props.filePath);
    }
  }

  onMesosLogStoreError(path) {
    // Check the filePath before we reload
    if (path !== this.props.filePath) {
      // This event is not for our filePath
      return;
    }

    this.setState({hasLoadingError: true});
  }

  onMesosLogStoreSuccess(path, direction) {
    // Check the filePath before we reload
    let {filePath} = this.props;
    if (path !== filePath) {
      // This event is not for our filePath
      return;
    }

    let logContainer = React.findDOMNode(this.refs.logContainer);
    let previousScrollTop;
    let previousScrollHeight;

    if (logContainer) {
      previousScrollTop = logContainer.scrollTop;
      previousScrollHeight = logContainer.scrollHeight;
    }

    let logBuffer = MesosLogStore.get(filePath);
    this.setState({fullLog: logBuffer.getFullLog()}, () => {
      // This allows the user to stay at the place of the log they were at
      // before the prepend.
      if (direction === 'prepend' && previousScrollHeight) {
        let currentScrollHeight = logContainer.scrollHeight;
        let heightDifference = currentScrollHeight - previousScrollHeight;
        this.setScrollTop(previousScrollTop + heightDifference);
      }
    });
  }

  setScrollTop(scrollTop) {
    React.findDOMNode(this.refs.logContainer).scrollTop = scrollTop;
  }

  getErrorScreen() {
    return <RequestErrorMsg />;
  }

  getLog() {
    let {props, state} = this;
    let fullLog = state.fullLog;
    if (fullLog === '') {
      // Append space if logName is defined
      let logName = props.logName && (props.logName + ' ');

      return (
        <div className="flex-grow vertical-center">
          <h3 className="text-align-center flush-top">
            {`${logName} Log is Currently Empty`}
          </h3>
          <p className="text-align-center flush-bottom">
            Please try again later.
          </p>
        </div>
      );
    }

    return (
      <pre
        className="flex-grow flush-bottom"
        ref="logContainer"
        onScroll={this.handleLogContainerScroll}>
        <Highlight
          matchClass="highlight"
          matchElement="span"
          search={props.highlightText}>
          {fullLog}
        </Highlight>
      </pre>
    );
  }

  getLoadingScreen() {
    return (
      <div className="
        container
        container-pod
        text-align-center
        vertical-center
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
    if (this.state.hasLoadingError) {
      return this.getErrorScreen();
    }

    let logBuffer = MesosLogStore.get(this.props.filePath);

    if (!logBuffer) {
      return this.getLoadingScreen();
    }

    return (
      <div className="log-view flex-grow flex-container-col">
        {this.getLog()}
      </div>
    );
  }
}

MesosLogView.defaultProps = {
  highlightText: ''
};

MesosLogView.propTypes = {
  filePath: React.PropTypes.string.isRequired,
  highlightText: React.PropTypes.string,
  logName: React.PropTypes.string,
  slaveID: React.PropTypes.string.isRequired
};
