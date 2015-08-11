var React = require("react");

var PropTypes = React.PropTypes;
var Cluster = require("../utils/Cluster");
var ServiceOverlayNav = require("./ServiceOverlayNav");
var Frame = require("./Frame");
var HealthLabels = require("../constants/HealthLabels");

var ServiceOverlay = React.createClass({

  displayName: "ServiceOverlay",

  propTypes: {
    shouldOpen: PropTypes.bool,
    serviceUrl: PropTypes.string,
    onServiceClose: PropTypes.func
  },

  getDefaultProps: function () {
    return {
      shouldOpen: false
    };
  },

  componentDidUpdate: function () {
    if (this.props.shouldOpen && !this.overlay && this.props.service !== this.previousService) {
      this.renderService();
      this.previousService = this.props.service;
    }
  },

  closeService: function () {
    if (this.overlay) {
      // Remove the div that we created at the root of the dom.
      React.unmountComponentAtNode(this.overlay);
      document.body.removeChild(this.overlay);
      this.overlay = null;
      this.previousService = null;
      this.props.onServiceClose();
    }
  },

  renderService: function () {
    // Create a new div and append to body in order
    // to always be full screen.
    this.overlay = document.createElement("div");
    this.overlay.className = "service-overlay";
    document.body.appendChild(this.overlay);

    var service = this.props.service;

    React.render(
      <div className="overlay-container">
        <ServiceOverlayNav
          className="overlay-nav"
          onBackClick={this.closeService}
          serviceName={service.name}
          serviceHealth={HealthLabels[service.health.key]}
          serviceTasks={service.TASK_RUNNING} />

        <Frame
          src={Cluster.getServiceLink(service.name)}
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
