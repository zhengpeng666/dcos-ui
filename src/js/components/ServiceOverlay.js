import React from "react/addons";
import _ from "underscore";
const PropTypes = React.PropTypes;

import Cluster from "../utils/Cluster";
import HealthLabels from "../constants/HealthLabels";

const methodsToBind = ["handleServiceClose"];

export default class ServiceOverlay extends React.Component {

  constructor() {
    super();

    methodsToBind.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  shouldComponentUpdate(nextProps) {
    let shouldOpen = nextProps.shouldOpen && !this.props.shouldOpen;
    return shouldOpen && this.props.service !== nextProps.service;
  }

  componentDidUpdate() {
    if (this.props.shouldOpen) {
      this.renderService();
    }
  }

  handleServiceClose() {
    if (this.overlayEl) {
      // Remove the div that we created at the root of the dom.
      React.unmountComponentAtNode(this.overlayEl);
      document.body.removeChild(this.overlayEl);
      this.overlayEl = null;
      this.props.onServiceClose();
    }
  }

  getServiceNav() {
    let service = this.props.service;
    let serviceHealth = HealthLabels[service.health.key];
    let taskCount = "N/A";

    if (_.isNumber(service.TASK_RUNNING)) {
      taskCount = service.TASK_RUNNING;
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
            {serviceHealth + " (" + taskCount + ")"}
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
          src={Cluster.getServiceLink(this.props.service.name)}
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
