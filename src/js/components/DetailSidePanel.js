import _ from "underscore";
import React from "react/addons";
import {SidePanel} from "reactjs-components";

import EventTypes from "../constants/EventTypes";
import MesosSummaryStore from "../stores/MesosSummaryStore";

const METHODS_TO_BIND = [
  "onMesosSummaryChange",
  "getContents",
  "handlePanelClose"
];

export default class DetailSidePanel extends React.Component {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  shouldComponentUpdate(nextProps) {
    let props = this.props;

    return props.nodeID !== nextProps.nodeID || props.open !== nextProps.open;
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
    if (_.isFunction(this.props.onClose)) {
      this.props.onClose();
    }
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

  getContents() {
    // Needs to be implemented
    return null;
  }

  render() {

    // TODO: rename from classNames to className
    return (
      <SidePanel classNames="side-panel-detail"
        header={this.getHeader()}
        open={this.props.open}
        onClose={this.handlePanelClose}>
        {this.getContents()}
      </SidePanel>
    );
  }
}

DetailSidePanel.contextTypes = {
  router: React.PropTypes.func
};

DetailSidePanel.propTypes = {
  open: React.PropTypes.bool,
  onClose: React.PropTypes.func
};
