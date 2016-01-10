import React from "react";

import EventTypes from "../constants/EventTypes";
import MesosLogStore from "../stores/MesosLogStore";
import RequestErrorMsg from "./RequestErrorMsg";

const METHODS_TO_BIND = [
  "onMesosLogStoreError",
  "onMesosLogStoreSuccess"
];

export default class MesosLogView extends React.Component {
  constructor() {
    super();

    this.state = {
      hasLoadingError: 0
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    let {props} = this;

    MesosLogStore.addChangeListener(
      EventTypes.MESOS_LOG_CHANGE,
      this.onMesosLogStoreSuccess
    );
    MesosLogStore.addChangeListener(
      EventTypes.MESOS_LOG_REQUEST_ERROR,
      this.onMesosLogStoreError
    );

    MesosLogStore.startTailing(props.slaveID, props.filePath);
  }

  componentWillReceiveProps(nextProps) {
    let {props} = this;
    if (props.filePath !== nextProps.filePath) {
      MesosLogStore.stopTailing(props.filePath);
      MesosLogStore.startTailing(nextProps.slaveID, nextProps.filePath);
    }
  }

  componentWillUnmount() {
    MesosLogStore.stopTailing(this.props.filePath);

    MesosLogStore.removeChangeListener(
      EventTypes.MESOS_LOG_CHANGE,
      this.onMesosLogStoreSuccess
    );
    MesosLogStore.removeChangeListener(
      EventTypes.MESOS_LOG_REQUEST_ERROR,
      this.onMesosLogStoreError
    );
  }

  onMesosLogStoreError(path) {
    // We cannot use StoreMixin, since we need to check
    // the filePath before we reload
    if (path !== this.props.filePath) {
      // This event is not for our filePath
      return;
    }

    this.setState({hasLoadingError: true});
  }

  onMesosLogStoreSuccess(path) {
    // We cannot use StoreMixin, since we need to check
    // the filePath before we reload
    let {filePath} = this.props;
    if (path !== filePath) {
      // This event is not for our filePath
      return;
    }

    let logBuffer = MesosLogStore.get(filePath);
    let fullLog = logBuffer.getFullLog();
    // Necessary to not make the view reload over and over again
    if (this.state.fullLog !== fullLog) {
      this.setState({fullLog});
    }
  }

  getLoadingScreen() {
    if (this.state.hasLoadingError) {
      return <RequestErrorMsg />;
    }

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
    let logBuffer = MesosLogStore.get(this.props.filePath);
    var showLoading = this.state.hasLoadingError || !logBuffer;

    if (showLoading) {
      return this.getLoadingScreen();
    }

    return (
      <div className="log-view">
        <pre>
          {this.state.fullLog}
        </pre>
      </div>
    );
  }
}

MesosLogView.propTypes = {
  filePath: React.PropTypes.string.isRequired,
  slaveID: React.PropTypes.string.isRequired
};
