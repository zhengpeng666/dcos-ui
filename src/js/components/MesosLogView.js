import mixin from 'reactjs-mixin';
import React from 'react/addons';
import {StoreMixin} from 'mesosphere-shared-reactjs';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

import DOMUtils from '../utils/DOMUtils';
import Highlight from './Highlight';
import MesosLogStore from '../stores/MesosLogStore';
import RequestErrorMsg from './RequestErrorMsg';
import Util from '../utils/Util';

const METHODS_TO_BIND = [
  'handleGoToBottom',
  'handleLogContainerScroll',
  'onMesosLogStoreError',
  'onMesosLogStoreSuccess'
];

export default class MesosLogView extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      fullLog: null,
      hasLoadingError: 0,
      isAtBottom: true
    };

    this.store_listeners = [{
      events: ['success', 'error'],
      name: 'mesosLog',
      suppressUpdate: true
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.handleLogContainerScroll = Util.throttleScroll(
      this.handleLogContainerScroll, 500
    );
  }

  componentDidMount() {
    super.componentDidMount(...arguments);
    let {props} = this;
    if (props.filePath) {
      MesosLogStore.startTailing(props.slaveID, props.filePath);
    }
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(...arguments);
    let {props} = this;
    if (props.filePath === nextProps.filePath) {
      return;
    }

    // Change to filePath has happened
    this.setState({fullLog: null});
    if (props.filePath) {
      MesosLogStore.stopTailing(props.filePath);
    }
    if (nextProps.filePath) {
      MesosLogStore.startTailing(nextProps.slaveID, nextProps.filePath);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(...arguments);

    let logContainerNode = this.getLogContainerNode();
    if (logContainerNode == null) {
      return;
    }

    if (!prevState.fullLog && this.state.fullLog) {
      logContainerNode.scrollTop = logContainerNode.scrollHeight;
      return;
    }

    this.checkIfAwayFromBottom(logContainerNode);
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
      (state.fullLog !== nextState.fullLog) ||
      // Check isAtBottom
      (state.isAtBottom !== nextState.isAtBottom)
    );
  }

  handleLogContainerScroll(e) {
    let container = e.target;
    if (!container) {
      return;
    }

    this.checkIfCloseToTop(container);
    this.checkIfAwayFromBottom(container);
  }

  handleGoToBottom() {
    let logContainerNode = this.getLogContainerNode();
    if (logContainerNode == null) {
      return;
    }

    let height = DOMUtils.getComputedDimensions(logContainerNode).height;
    DOMUtils.scrollTo(
      logContainerNode, 3000, logContainerNode.scrollHeight - height
    );
  }

  onMesosLogStoreError(path) {
    // Check the filePath before we reload
    if (path !== this.props.filePath) {
      // This event is not for our filePath
      return;
    }

    this.setState({hasLoadingError: this.state.hasLoadingError + 1});
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

  checkIfCloseToTop(container) {
    let distanceFromTop = DOMUtils.getDistanceFromTop(container);
    if (distanceFromTop < 2000) {
      let {props} = this;
      MesosLogStore.getPreviousLogs(props.slaveID, props.filePath);
    }
  }

  checkIfAwayFromBottom(container) {
    let distanceFromTop = DOMUtils.getDistanceFromTop(container);
    let containerHeight = DOMUtils.getComputedDimensions(container).height;
    let isAtBottom =
      container.scrollHeight - (containerHeight + distanceFromTop) < 50;

    if (isAtBottom !== this.state.isAtBottom) {
      this.setState({isAtBottom});
    }
  }

  getLogContainerNode() {
    let logContainer = this.refs.logContainer;
    if (!logContainer) {
      return null;
    }

    return React.findDOMNode(logContainer);
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
      <div className="container-pod text-align-center vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getGoToBottomButton() {
    let isAtBottom = this.state.isAtBottom;

    if (isAtBottom) {
      return null;
    }

    return (
      <button
        onClick={this.handleGoToBottom}
        className="button button-inverse go-to-bottom-button">
        Go to bottom
      </button>
    );
  }

  render() {
    if (this.state.hasLoadingError >= 3) {
      return this.getErrorScreen();
    }

    if (this.state.fullLog == null || !this.props.filePath) {
      return this.getLoadingScreen();
    }

    return (
      <div className="log-view flex-grow flex-container-col">
        {this.getLog()}
        <CSSTransitionGroup
          transitionAppear={true}
          transitionName="button"
          component="div">
          {this.getGoToBottomButton()}
        </CSSTransitionGroup>
      </div>
    );
  }
}

MesosLogView.defaultProps = {
  highlightText: ''
};

MesosLogView.propTypes = {
  filePath: React.PropTypes.string,
  highlightText: React.PropTypes.string,
  logName: React.PropTypes.string,
  slaveID: React.PropTypes.string.isRequired
};
