import React from "react/addons";
import {SidePanel} from "reactjs-components";

import EventTypes from "../constants/EventTypes";
import MesosSummaryStore from "../stores/MesosSummaryStore";

const METHODS_TO_BIND = [
  "onMesosSummaryChange",
  "getNodeDetails",
  "handlePanelClose"
];

export default class NodeSidePanel extends React.Component {

  constructor(...args) {
    super(...args);

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  shouldComponentUpdate(nextProps) {
    let props = this.props;

    return props.nodeID !== nextProps.nodeID ||
      props.open !== nextProps.open;
  }

  componentDidMount() {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );

    this.forceUpdate();
  }

  componentWillUnmount() {
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
  }

  onMesosSummaryChange() {
    if (MesosSummaryStore.get("statesProcessed")) {
      // Once we have the data we need (nodes), stop listening for changes.
      MesosSummaryStore.removeChangeListener(
        EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
      );

      this.forceUpdate();
    }
  }

  handlePanelClose() {
    this.props.onClose();
    this.forceUpdate();
  }

  getHeader() {
    return (
      <div>
        <span className="button button-link button-inverse"
          onClick={this.handlePanelClose}>
          <i className="side-panel-detail-close"></i>
          Close
        </span>
      </div>
    );
  }

  getNodeDetails() {
    let node = MesosSummaryStore.getNodeFromID(this.props.nodeID);

    if (node == null) {
      return (
        <div>
          <h2 className="text-align-center inverse overlay-header">
            Error finding node
          </h2>
          <div className="container container-pod text-align-center flush-top text-danger">
            {`Did not find a node with the id "${this.props.nodeID}"`}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-align-center inverse overlay-header">
          {node.hostname}
        </h2>
      </div>
    );
  }

  render() {

    // TODO: rename from classNames to className
    return (
      <SidePanel classNames="side-panel-detail"
        header={this.getHeader()}
        open={this.props.open}
        onClose={this.handlePanelClose}>
        {this.getNodeDetails()}
      </SidePanel>
    );
  }
}

NodeSidePanel.contextTypes = {
  router: React.PropTypes.func
};

NodeSidePanel.propTypes = {
  open: React.PropTypes.bool,
  nodeID: React.PropTypes.string,
  onClose: React.PropTypes.func
};
