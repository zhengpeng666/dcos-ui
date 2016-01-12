import mixin from "reactjs-mixin";
import React from "react";
import {StoreMixin} from "mesosphere-shared-reactjs";

import MesosLogStore from "../stores/MesosLogStore";
import RequestErrorMsg from "./RequestErrorMsg";

const METHODS_TO_BIND = [
  "onMesosLogStoreError",
  "onMesosLogStoreSuccess"
];

export default class MesosLogView extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      hasLoadingError: 0
    };

    this.store_listeners = [{
      name: "mesosLog",
      events: ["success", "error"]
    }];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
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

  componentWillUnmount() {
    super.componentWillUnmount(...arguments);
    MesosLogStore.stopTailing(this.props.filePath);
  }

  onMesosLogStoreError(path) {
    // Check the filePath before we reload
    if (path !== this.props.filePath) {
      // This event is not for our filePath
      return;
    }

    this.setState({hasLoadingError: true});
  }

  onMesosLogStoreSuccess(path) {
    // Check the filePath before we reload
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
      <div className="log-view flex-grow flex-container-col">
        <pre className="flex-grow flush-bottom">
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
