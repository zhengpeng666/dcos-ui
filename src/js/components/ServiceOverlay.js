import React from "react/addons";
const PropTypes = React.PropTypes;

import Cluster from "../utils/Cluster";
import HealthLabels from "../constants/HealthLabels";

const methodsToBind = ["closeService"];

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

  closeService() {
    if (this.overlay) {
      // Remove the div that we created at the root of the dom.
      React.unmountComponentAtNode(this.overlay);
      document.body.removeChild(this.overlay);
      this.overlay = null;
      this.props.onServiceClose();
    }
  }

  getServiceNav() {
    let service = this.props.service;
    let serviceHealth = HealthLabels[service.health.key];
    let taskCount = "N/A";

    if (typeof service.TASK_RUNNING === "number") {
      taskCount = service.TASK_RUNNING;
    }

    return (
      <div className="container container-fluid flush-left flush-right overlay-nav">
        <div className="overlay-button-container">
          <span
            className="button button-link button-inverse overlay-nav-button"
            onClick={this.closeService}>
            <i className="icon icon-small icon-back icon-small-white"></i>
            Back
          </span>
        </div>

        <h2 className="text-align-center inverse overlay-header">
          {service.name}
          <div className="h4 overlay-subheader flush-top text-align-center">
            {serviceHealth + " (" + taskCount + ")"}
          </div>
        </h2>

        <div className="overlay-button-container text-align-right">
          <a href={Cluster.getServiceLink(service.name)}
            target="_blank"
            className="button button-link
              button-inverse
              text-align-right
              overlay-nav-button
              overlay-new-window-button"
            >
            Open in a New Window
            <i className="icon icon-small icon-new-window icon-small-white"></i>
          </a>
        </div>
      </div>
    );
  }

  renderService() {
    // Create a new div and append to body in order
    // to always be full screen.
    this.overlay = document.createElement("div");
    this.overlay.className = "service-overlay";
    document.body.appendChild(this.overlay);

    React.render(
      <div className="overlay-container">
        {this.getServiceNav()}
        <iframe
          src={Cluster.getServiceLink(this.props.service.name)}
          className="overlay-frame" />
      </div>,
      this.overlay
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

module.exports = ServiceOverlay;
