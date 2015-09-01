import React from "react/addons";
import {Link} from "react-router";
import {SidePanel} from "reactjs-components";

import EventTypes from "../constants/EventTypes";
import InternalStorageMixin from "../mixins/InternalStorageMixin";
import MesosSummaryStore from "../stores/MesosSummaryStore";

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

  getHeader: function () {
    return (
      <div>
        <span className="button button-link button-inverse"
          onClick={this.handlePanelClose}>
          <i className="service-detail-close"></i>
          Close
        </span>
      </div>
    );
  },

  getServiceDetails: function () {
    let service = MesosSummaryStore.getServiceFromName(this.props.serviceName);

    if (service == null) {
      return "loading...";
    }

    return (
      <div>
        <h2 className="text-align-center inverse overlay-header">
          {service.name}
        </h2>
        <div className="container container-pod">
          <div className="row">
            <div className="column-8">
            </div>
            <div className="column-4 text-align-right">
              {this.getOpenServiceButton()}
            </div>
          </div>
        </div>
      </div>
    );
  },

  getOpenServiceButton: function () {
    let service = MesosSummaryStore.getServiceFromName(this.props.serviceName);

    if (!service || !service.webui_url || service.webui_url.length === 0) {
      return null;
    }

    return (
      <Link className="button button-success text-align-right"
        params={{serviceName: this.props.serviceName}}
        to="service-ui">
        Open service
      </Link>
    );
  },

  render: function () {

    // TODO(ml): rename to className
    return (
      <SidePanel classNames="service-detail"
        header={this.getHeader()}
        open={this.props.open}
        onClose={this.handlePanelClose}>
        {this.getServiceDetails()}
      </SidePanel>
    );
  }
});

module.exports = ServiceSidePanel;
