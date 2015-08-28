import _ from "underscore";
import React from "react/addons";
import { SidePanel } from "reactjs-components";

import EventTypes from "../constants/EventTypes";
import InternalStorageMixin from "../mixins/InternalStorageMixin";
import MesosSummaryStore from "../stores/MesosSummaryStore";

function getServiceFromName(name) {
  let services = MesosSummaryStore.getLatest().frameworks;

  return _.find(services, function (service) {
    return service.name === name;
  });
}

const ServiceSidePanel = React.createClass({

  displayName: "ServiceSidePanel",

  mixins: [InternalStorageMixin],

  shouldComponentUpdate: function (nextProps) {
    let currentService = this.props.serviceName;
    let nextService = nextProps.serviceName;

    return nextService && currentService !== nextService;
  },

  componentDidMount: function () {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );

    this.internalStorage_update({open: true});
    this.forceUpdate();
  },

  onMesosSummaryChange: function () {
    if (MesosSummaryStore.get("statesProcessed")) {
      // Once we have the data we need (frameworks), stop listening for changes.
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

  getSerivceDetails: function () {
    let service = getServiceFromName(this.props.serviceName);

    if (service == null) {
      return "loading...";
    }

    return (
      <div>
        <button className="button button-stroke button-rounded"
          onClick={this.handlePanelClose}>
          ✕
        </button>
        {service.name}
      </div>
    );
  },

  render: function () {

    return (
      <SidePanel open={this.props.open}
        onClose={this.handlePanelClose}>
        {this.getSerivceDetails()}
      </SidePanel>
    );
  }
});

module.exports = ServiceSidePanel;
