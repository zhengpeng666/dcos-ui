import React from "react/addons";
const PropTypes = React.PropTypes;
import Router from "react-router";
import _ from "underscore";

import Cluster from "../utils/Cluster";
import EventTypes from "../constants/EventTypes";
import HealthLabels from "../constants/HealthLabels";
import StringUtil from "../utils/StringUtil";
import MesosStateStore from "../stores/MesosStateStore";

function getServiceFromName(name) {
  let services = MesosStateStore.getLatest().frameworks;
  let foundService = null;

  services.forEach(function (service) {
    if (service.name === name) {
      foundService = service;
    }
  });

  return foundService;
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
    var currentService = this.props.params.servicename;
    var nextService = nextProps.params.servicename;

    if (nextService && currentService !== nextService) {
      if (this.overlayEl) {
        this.removeOverlay();
      }
      this.findAndRenderService(nextService);
    }

    return false;
  }

  componentDidMount() {
    if (MesosStateStore.isStatesProcessed()) {
      this.findAndRenderService();
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
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
  }

  removeMesosStateListeners() {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_SUMMARY_CHANGE, this.onMesosSummaryChange
    );
  }

  onMesosSummaryChange() {
    var state = MesosStateStore.isStatesProcessed();

    if (state) {
      this.removeMesosStateListeners();
      this.findAndRenderService();
    }
  }

  removeOverlay() {
    // Remove the div that we created at the root of the dom.
    React.unmountComponentAtNode(this.overlayEl);
    document.body.removeChild(this.overlayEl);
    this.overlayEl = null;
  }

  handleServiceClose() {
    Router.History.back();
  }

  onPopState() {
    this.context.router.transitionTo("services");
    window.removeEventListener('popstate', this.onPopState);
  }

  findAndRenderService(name) {
    let serviceName = name || this.props.params.servicename;

    if (serviceName) {
      this.service = getServiceFromName(serviceName);

      if (this.service) {
        this.renderService();
      } else {
        // Did not find a service.
        // We do this in order to not break the user's back button.
        // if we go to /services/ui/nonExistantService and redirect to /services
        // and the user presses back, they'll be stuck in a loop.
        // Doing this prevents that.
        window.addEventListener('popstate', this.onPopState);
        Router.History.back();
      }
    }
  }

  getServiceNav() {
    let service = this.service;
    let serviceHealth = HealthLabels[service.health.key];
    let taskCount = "";

    if (_.isNumber(service.TASK_RUNNING)) {
      var pluralized = StringUtil.pluralize("task", service.TASK_RUNNING);
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

    React.render(
      <div className="overlay-container">
        {this.getServiceNav()}
        <iframe
          src={Cluster.getServiceLink(this.service.name)}
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
