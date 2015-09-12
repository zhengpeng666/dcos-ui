import React from "react/addons";
import _ from "underscore";

import Cluster from "../utils/Cluster";
import EventTypes from "../constants/EventTypes";
import HealthLabels from "../constants/HealthLabels";
import HistoryStore from "../stores/HistoryStore";
import InternalStorageMixin from "../mixins/InternalStorageMixin";
import MarathonStore from "../stores/MarathonStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import StringUtil from "../utils/StringUtil";
import Util from "../utils/Util";

const PropTypes = React.PropTypes;

export default class ServiceOverlay extends Util.mixin(InternalStorageMixin) {

  constructor() {
    super();

    const methodsToBind = [
      "handleServiceClose",
      "onMesosSummaryChange",
      "removeMesosStateListeners"
    ];

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
    // Next tick so that the history actually updates correctly
    setTimeout(() => {
      this.internalStorage_update({
        prevHistoryPath: HistoryStore.getHistoryAt(-1)
      });
    });

    if (MesosSummaryStore.get("statesProcessed")) {
      this.findAndRenderService(this.props.params.serviceName);
    } else {
      this.addMesosStateListeners();
    }
  }

  componentWillUnmount() {
    let overlayEl = this.internalStorage_get().overlayEl;

    if (overlayEl) {
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
      this.findAndRenderService();
    }
  }

  removeOverlay() {
    let overlayEl = this.internalStorage_get().overlayEl;

    if (!overlayEl) {
      return;
    }

    // Remove the div that we created at the root of the dom.
    React.unmountComponentAtNode(overlayEl);
    document.body.removeChild(overlayEl);
    this.internalStorage_update({overlayEl: null});
  }

  handleServiceClose() {
    let path = this.internalStorage_get().prevHistoryPath;
    let routeName = "services-panel";
    let serviceName = this.props.params.serviceName;

    if (path) {
      let matchedRoutes = this.context.router.match(path).routes;
      if (matchedRoutes[matchedRoutes.length - 1]) {
        routeName = matchedRoutes[matchedRoutes.length - 1].name;
      }
    }

    this.context.router.transitionTo(routeName, {serviceName});
  }

  findAndRenderService() {
    let serviceName = this.props.params.serviceName;
    let service = MesosSummaryStore.getServiceFromName(serviceName);

    // Did not find a service.
    if (!service) {
      this.context.router.transitionTo("services");
      this.context.router.transitionTo("services-panel", {serviceName});
      return;
    }

    this.renderService();
  }

  getServiceNav(service) {
    let appHealth = MarathonStore.getServiceHealth(service.name);
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
    let overlayEl = document.createElement("div");
    overlayEl.className = "service-overlay";
    document.body.appendChild(overlayEl);

    this.internalStorage_update({overlayEl});

    let serviceName = this.props.params.serviceName;
    let service = MesosSummaryStore.getServiceFromName(serviceName);

    React.render(
      <div className="overlay-container">
        {this.getServiceNav(service)}
        <iframe
          src={Cluster.getServiceLink(service.name)}
          className="overlay-frame" />
      </div>,
      overlayEl
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
