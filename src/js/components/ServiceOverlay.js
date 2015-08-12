var React = require("react");
var PropTypes = React.PropTypes;

var Cluster = require("../utils/Cluster");
var HealthLabels = require("../constants/HealthLabels");

var ServiceOverlay = React.createClass({

  displayName: "ServiceOverlay",

  propTypes: {
    onServiceClose: PropTypes.func,
    shouldOpen: PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      onServiceClose: function () {},
      shouldOpen: false
    };
  },

  shouldComponentUpdate: function (nextProps) {
    var shouldOpen = nextProps.shouldOpen && !this.props.shouldOpen;
    return shouldOpen && this.props.service !== nextProps.service;
  },

  componentDidUpdate: function () {
    if (this.props.shouldOpen) {
      this.renderService();
    }
  },

  closeService: function () {
    if (this.overlay) {
      // Remove the div that we created at the root of the dom.
      React.unmountComponentAtNode(this.overlay);
      document.body.removeChild(this.overlay);
      this.overlay = null;
      this.props.onServiceClose();
    }
  },

  getServiceNav: function () {
    var service = this.props.service;
    var serviceHealth = HealthLabels[service.health.key];
    var taskCount = "N/A";

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
  },

  renderService: function () {
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
  },

  render: function () {
    return null;
  }
});

module.exports = ServiceOverlay;
