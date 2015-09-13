import _ from "underscore";
import React from "react/addons";
import {SidePanel} from "reactjs-components";

import EventTypes from "../constants/EventTypes";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";

const METHODS_TO_BIND = [
  "handlePanelClose",
  "onMesosStateChange",
  "onMesosSummaryChange"
];

export default class DetailSidePanel extends React.Component {
  constructor() {
    super(...arguments);

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props;
    let currentItem = props.itemID;
    let nextItem = nextProps.itemID;

    let currentTab = this.state.currentTab;
    let nextTab = nextState.currentTab;

    return nextItem && currentItem !== nextItem ||
      currentTab !== nextTab || props.open !== nextProps.open;
  }

  componentDidMount() {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
    );

    this.forceUpdate();
  }

  componentWillUnmount() {
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );

    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
    );
  }

  onMesosSummaryChange() {
    if (MesosSummaryStore.get("statesProcessed")) {
      MesosSummaryStore.removeChangeListener(
        EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
      );
      this.forceUpdate();
    }
  }

  onMesosStateChange() {
    if (MesosStateStore.get("lastMesosState")) {
      MesosStateStore.removeChangeListener(
        EventTypes.MESOS_STATE_CHANGE, this.onMesosStateChange
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

  getNotFound(itemType) {
    return (
      <div>
        <h1 className="text-align-center inverse overlay-header">
          {`Error finding ${itemType}`}
        </h1>
        <div className="container container-pod text-align-center flush-top text-danger">
          {`Did not find a ${itemType} by the id "${this.props.itemID}"`}
        </div>
      </div>
    );
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
        onClose={this.handlePanelClose}
        open={this.props.open}>
        {this.getContents()}
      </SidePanel>
    );
  }
}

DetailSidePanel.contextTypes = {
  router: React.PropTypes.func
};

DetailSidePanel.propTypes = {
  itemID: React.PropTypes.string,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool
};
