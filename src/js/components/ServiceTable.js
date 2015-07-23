var _ = require("underscore");
var classNames = require("classnames");
var React = require("react/addons");

var HealthLabels = require("../constants/HealthLabels");
var HealthTypes = require("../constants/HealthTypes");
var HealthTypesDescription = require("../constants/HealthTypesDescription");
var Maths = require("../utils/Maths");
var ResourceTableUtil = require("../utils/ResourceTableUtil");
var Table = require("./Table");
var TooltipMixin = require("../mixins/TooltipMixin");
var Units = require("../utils/Units");
var ServiceOverlay = require("./ServiceOverlay");
var Cluster = require("../utils/Cluster");

var ServicesTable = React.createClass({

  displayName: "ServicesTable",

  mixins: [TooltipMixin],

  propTypes: {
    services: React.PropTypes.array.isRequired,
    healthProcessed: React.PropTypes.bool.isRequired
  },

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  getInitialState: function () {
    return {
      openService: false
    };
  },

  openService: function (service, event) {
    event.preventDefault();

    // Render the overlay and set opened to true after
    // in order to make sure only one iframe gets created.
    this.setState({
      serviceId: service.id,
      serviceName: service.name,
      serviceHealth: HealthLabels[service.health.key],
      serviceTasks: service.TASK_RUNNING
    }, function () {
      this.setState({opened: true});
    });
  },

  closeService: function () {
    // Setting closing to false in the callback
    // forces the overlay to only close once.
    this.setState({serviceId: false, closing: true}, function () {
      this.setState({opened: false, closing: false});
    });
  },

  renderHeadline: function (prop, model) {
    if (model.webui_url.length === 0) {
      return (
        <span className="h5 flush-top flush-bottom headline">
          <img className="icon icon-small border-radius"
            src={model.images["icon-small"]} />
          {model[prop]}
        </span>
      );
    }

    return (
      <a ref={model.id}
          onClick={this.openService.bind(this, model)}
          target="_blank"
          className="h5 headline cell-link"
          href="#">
        <span className="flush-top flush-bottom">
          <img className="icon icon-small border-radius"
          src={model.images["icon-small"]} />
          {model[prop]}
        </span>
      </a>
    );
  },

  renderHealth: function (prop, model) {
    if (!this.props.healthProcessed) {
      return (
        <div className="loader-small ball-beat">
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }

    var statusClassSet = classNames({
      "text-success": model.health.value === HealthTypes.HEALTHY,
      "text-danger": model.health.value === HealthTypes.UNHEALTHY,
      "text-warning": model.health.value === HealthTypes.IDLE,
      "text-mute": model.health.value === HealthTypes.NA
    });

    var attributes = {};
    attributes["data-behavior"] = "show-tip";

    if (model.health.value === HealthTypes.HEALTHY) {
      attributes["data-tip-content"] = HealthTypesDescription.HEALTHY;
    } else if (model.health.value === HealthTypes.UNHEALTHY) {
      attributes["data-tip-content"] = HealthTypesDescription.UNHEALTHY;
    } else if (model.health.value === HealthTypes.IDLE) {
      attributes["data-tip-content"] = HealthTypesDescription.IDLE;
    } else if (model.health.value === HealthTypes.NA) {
      attributes["data-tip-content"] = HealthTypesDescription.NA;
    }

    return React.createElement(
      "span",
      _.extend({className: statusClassSet}, attributes),
      HealthLabels[model.health.key]
    );
  },

  renderStats: function (prop, model) {
    var value = Maths.round(_.last(model.used_resources[prop]).value, 2);
    if (prop !== "cpus") {
      value = Units.filesize(value * 1024 * 1024, 1);
    }

    return (
      <span>
        {value}
      </span>
    );
  },

  getServiceNavbar: function () {
    var navStyles = {
      width: "100%",
      height: "80px",
      background: "#9351e5",
      position: "relative",
      "font-size": "16px"
    };

    var backButtonStyle = {
      "text-align": "center",
      "padding-top": "30px",
      "padding-bottom": "30px",
      color: "white",
      height: "100%",
      width: "150px",
      cursor: "pointer",
      float: "left"
    };

    var newWindowButtonStyle = {
      "padding-top": "30px",
      "padding-bottom": "30px",
      right: "0px",
      top: "0px",
      position: "absolute",
      width: "250px",
      color: "white"
    };

    var centerInfoStyle = {
      "text-align": "center",
      width: "400px",
      "margin-left": "auto",
      "margin-right": "auto",
      color: "white",
      "padding-top": "20px"
    };

    var subHeaderStyle = {
      opacity: "0.5",
      "text-transform": "capitalize",
      "font-size": "14px"
    };

    return (
      <div style={navStyles}>
        <div
          style={backButtonStyle}
          onClick={this.closeService}>
          Back
        </div>

        <div
          style={centerInfoStyle}>
          {this.state.serviceName}<br/>
          <span style={subHeaderStyle}>
            {this.state.serviceHealth}
            {" (" + this.state.serviceTasks + ")"}
          </span>
        </div>

        <a href={Cluster.getServiceLink(this.state.serviceName).replace(/dcos.local/, "172.17.8.101")}
          target="_blank"
          style={newWindowButtonStyle}>
          Open in a New Window >
        </a>
      </div>
    );
  },

  getColumns: function () {
    return [
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "name",
        render: this.renderHeadline,
        sortable: true,
        header: ResourceTableUtil.renderHeader
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "health",
        render: this.renderHealth,
        sortable: true,
        header: ResourceTableUtil.renderHeader
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "TASK_RUNNING",
        render: ResourceTableUtil.renderTask,
        sortable: true,
        header: ResourceTableUtil.renderHeader
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        header: ResourceTableUtil.renderHeader
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        header: ResourceTableUtil.renderHeader
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "disk",
        render: this.renderStats,
        sortable: true,
        header: ResourceTableUtil.renderHeader
      }
    ];
  },

  getColGroup: function () {
    return (
      <colgroup>
        <col />
        <col style={{width: "14%"}} />
        <col style={{width: "100px"}} />
        <col className="hidden-mini" style={{width: "100px"}} />
        <col className="hidden-mini" style={{width: "100px"}} />
        <col className="hidden-mini" style={{width: "100px"}} />
      </colgroup>
    );
  },

  render: function () {
    return (
      <div>
        <Table
          className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={this.props.services.slice(0)}
          keys={["id"]}
          sortBy={{prop: "name", order: "desc"}}
          sortFunc={ResourceTableUtil.getSortFunction("name")} />

        <ServiceOverlay
          serviceName={this.state.serviceName}
          shouldOpen={this.state.serviceId && !this.state.opened}
          shouldClose={this.state.closing}>
          {this.getServiceNavbar()}
        </ServiceOverlay>
      </div>
    );
  }
});

module.exports = ServicesTable;
