import React from "react/addons";
import {SidePanel} from "reactjs-components";

import EventTypes from "../constants/EventTypes";
import MesosSummaryStore from "../stores/MesosSummaryStore";

const NodeSidePanel = React.createClass({

  displayName: "NodeSidePanel",

  propTypes: {
    open: React.PropTypes.bool,
    nodeID: React.PropTypes.string,
    onClose: React.PropTypes.func
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  shouldComponentUpdate: function (nextProps) {
    let props = this.props;

    return props.nodeID !== nextProps.nodeID ||
      props.open !== nextProps.open;
  },

  componentDidMount: function () {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );

    this.forceUpdate();
  },

  componentWillUnmount: function () {
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
  },

  onMesosSummaryChange: function () {
    if (MesosSummaryStore.get("statesProcessed")) {
      // Once we have the data we need (nodes), stop listening for changes.
      MesosSummaryStore.removeChangeListener(
        EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
      );

      this.forceUpdate();
    }
  },

  handlePanelClose: function () {
    this.props.onClose();
    this.forceUpdate();
  },

  getHeader: function () {
    return (
      <div>
        <span className="button button-link button-inverse"
          onClick={this.handlePanelClose}>
          <i className="side-panel-detail-close"></i>
          Close
        </span>
      </div>
    );
  },

  getNodeDetails: function () {
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
  },

  render: function () {

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
});

module.exports = NodeSidePanel;
