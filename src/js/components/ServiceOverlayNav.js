var React = require("react");
var Cluster = require("../utils/Cluster");

var ServiceOverlayNav = React.createClass({

  displayName: "ServiceOverlayNav",

  render: function () {
    var taskCount = this.props.serviceTasks || "N/A";

    return (
      <div className="overlay-nav">
        <span
          className="button button-link overlay-back-button overlay-nav-button"
          onClick={this.props.onBackClick}>
          Back
        </span>

        <h3 className="flush-top text-align-center inverse overlay-header">
          {this.props.serviceName}
          <div className="overlay-subheader flush-bottom text-align-center">
            {this.props.serviceHealth}
            {" (" + taskCount + ")"}
          </div>
        </h3>

        <a href={Cluster.getServiceLink(this.props.serviceName)}
          target="_blank"
          className="button button-link text-align-right overlay-new-window-button overlay-nav-button">
          Open in a New Window
        </a>
      </div>
    );
  }
});

module.exports = ServiceOverlayNav;
