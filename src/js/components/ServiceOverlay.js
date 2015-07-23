var React = require("react");
var PropTypes = React.PropTypes;
var Cluster = require("../utils/Cluster");
var DOMUtils = require("../utils/DOMUtils");

var ServiceOverlay = React.createClass({

  displayName: "ServiceOverlay",

  propTypes: {
    shouldOpen: PropTypes.bool,
    shouldClose: PropTypes.bool,
    serviceUrl: PropTypes.string
  },

  getDefaultProps: function () {
    return {
      shouldOpen: false,
      shouldClose: false
    };
  },

  closeService: function () {
    var overlay = document.getElementById("service-overlay");
    if (overlay) {
      overlay.parentElement.removeChild(overlay);
    }
  },

  renderService: function (children) {
    // Create a new div and append to body in order
    // to always be full screen.
    var overlay = document.createElement("div");
    overlay.id = "service-overlay";
    overlay.style.position = "absolute";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style["z-index"] = 2000;

    document.body.appendChild(overlay);

    React.render(
      children,
      overlay
    );

    var iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style["min-height"] = DOMUtils.getComputedDimensions(overlay).height + "px";
    iframe.style.border = 0;
    iframe.src = Cluster.getServiceLink(this.props.serviceName);

    overlay.appendChild(iframe);
  },

  render: function () {
    if (this.props.shouldOpen) {
      this.renderService(this.props.children);
    } else if (this.props.shouldClose) {
      this.closeService();
    }

    // Return a plain div when not activated
    return (
      <div>
      </div>
    );
  }
});

module.exports = ServiceOverlay;
