import React from "react/addons";
import Router from "react-router";
import _ from "underscore";

import Cluster from "../utils/Cluster";
import EventTypes from "../constants/EventTypes";
import HealthLabels from "../constants/HealthLabels";
import HealthTypes from "../constants/HealthTypes";
import MarathonStore from "../stores/MarathonStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import StringUtil from "../utils/StringUtil";

const PropTypes = React.PropTypes;

function getServiceFromName(name) {
  let services = MesosSummaryStore.getLatest().frameworks;

  return _.find(services, function (service) {
    return service.name === name;
  });
}

export default class ServiceOverlay extends React.Component {

  constructor() {
    const methodsToBind = [
      "handleServiceClose",
      "onMesosSummaryChange",
      "onPopState",
      "removeMesosStateListeners"
    ];
    super();

    methodsToBind.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  shouldComponentUpdate(nextProps) {
    let currentService = this.props.params.serviceName;
    let nextService = nextProps.params.serviceName;

    if (nextService && currentService !== nextService) {
      this.removeOverlay();
      this.findAndRenderService(nextService);
    }

    return false;
  }

  componentDidMount() {
    if (MesosSummaryStore.get("statesProcessed")) {
      this.findAndRenderService(this.props.params.serviceName);
    } else {
      this.addMesosStateListeners();
    }
  }

  componentWillUnmount() {
    if (this.overlayEl) {
      this.removeOverlay();
      this.props.onServiceClose();
    }
  }

  addMesosStateListeners() {
    MesosSummaryStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
  }

  removeMesosStateListeners() {
    MesosSummaryStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
  }

  onMesosSummaryChange() {
    if (MesosSummaryStore.get("statesProcessed")) {
      // Once we have the data we need (frameworks), stop listening for changes.
      this.removeMesosStateListeners();
      this.findAndRenderService(this.props.params.serviceName);
    }
  }

  removeOverlay() {
    if (!this.overlayEl) {
      return;
    }

    // Remove the div that we created at the root of the dom.
    React.unmountComponentAtNode(this.overlayEl);
    document.body.removeChild(this.overlayEl);
    this.overlayEl = null;
  }

  handleServiceClose() {
    Router.History.back();
  }

  onPopState() {
    window.removeEventListener("popstate", this.onPopState);
    this.context.router.transitionTo("services");
  }

  findAndRenderService(serviceName) {
    this.service = getServiceFromName(serviceName);

    // Did not find a service.
    if (!this.service) {
      // We do this in order to not break the user's back button.
      // If we go to /services/ui/unknown-service and redirect to /services
      // and the user presses back, they'll be stuck in a loop.
      // Doing this prevents that.
      window.addEventListener("popstate", this.onPopState);
      Router.History.back();
      return;
    }

    this.renderService();
  }

  getServiceNav(service) {
    let marathonApps = MarathonStore.getApps();
    let appHealth = {
      key: "NA",
      value: HealthTypes.NA
    };

    if (marathonApps && marathonApps[service.name.toLowerCase()]) {
      appHealth = marathonApps[service.name.toLowerCase()].health;
    }

    let serviceHealth = HealthLabels[appHealth.key];
    let taskCount = "";

    if (_.isNumber(service.TASK_RUNNING)) {
      let pluralized = StringUtil.pluralize("task", service.TASK_RUNNING);
      taskCount = ` (${service.TASK_RUNNING} ${pluralized})`;
    }

    if (serviceHealth === "N/A") {
      serviceHealth = "Health N/A";
    }

    return (
      <div className="container container-fluid flush-left flush-right overlay-nav">
        <div>
          <span
            className="button button-link button-inverse overlay-nav-button"
            onClick={this.handleServiceClose}>
            <i className="icon icon-small icon-back icon-small-white"></i>
            <span className="overlay-short-top">Back</span>
          </span>
        </div>

        <h2 className="text-align-center inverse overlay-header">
          {service.name}
          <div className="h4 overlay-subheader flush-top text-align-center">
            {serviceHealth + taskCount}
          </div>
        </h2>

        <div>
          <a href={Cluster.getServiceLink(service.name)}
            target="_blank"
            title="Open in a new window"
            className="button button-link
              button-inverse
              text-align-right
              overlay-nav-button"
            >
            <i className="icon icon-small icon-new-window icon-small-white"></i>
            <span className="overlay-short-top">Open in a New Window</span>
          </a>
        </div>
      </div>
    );
  }

  renderService() {
    // Create a new div and append to body in order
    // to always be full screen.
    this.overlayEl = document.createElement("div");
    this.overlayEl.className = "service-overlay";
    document.body.appendChild(this.overlayEl);
    let service = this.service;

    React.render(
      <div className="overlay-container">
        {this.getServiceNav(service)}
        <iframe
          src={Cluster.getServiceLink(service.name)}
          className="overlay-frame" />
      </div>,
      this.overlayEl
    );
  }

  render() {
    return null;
  }
}

ServiceOverlay.propTypes = {
  onServiceClose: PropTypes.func,
  shouldOpen: PropTypes.bool
};

ServiceOverlay.defaultProps = {
  onServiceClose: function () {},
  shouldOpen: false
};

ServiceOverlay.contextTypes = {
  router: React.PropTypes.func
};
