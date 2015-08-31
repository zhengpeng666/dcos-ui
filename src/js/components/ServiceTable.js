var _ = require("underscore");
var classNames = require("classnames");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var HealthLabels = require("../constants/HealthLabels");
var HealthTypes = require("../constants/HealthTypes");
var HealthTypesDescription = require("../constants/HealthTypesDescription");
var MarathonStore = require("../stores/MarathonStore");
var Maths = require("../utils/Maths");
var ResourceTableUtil = require("../utils/ResourceTableUtil");
var ServiceSidePanel = require("./ServiceSidePanel");
var Table = require("./Table");
var TooltipMixin = require("../mixins/TooltipMixin");
var Units = require("../utils/Units");

var ServicesTable = React.createClass({

  displayName: "ServicesTable",

  mixins: [TooltipMixin],

  propTypes: {
    services: React.PropTypes.array.isRequired,
    healthProcessed: React.PropTypes.bool.isRequired
  },

  getInitialState: function () {
    return {serviceDetail: null};
  },

  componentDidMount: function () {
    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonAppsChange
    );
  },

  componentWillUnmount: function () {
    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonAppsChange
    );
  },

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  onMarathonAppsChange: function () {
    this.forceUpdate();
  },

  handleServiceClick: function (serviceDetail) {
    this.setState({serviceDetail});
  },

  onServiceDetailClose: function () {
    this.setState({serviceDetail: null});
  },

  renderHeadline: function (prop, model) {
    let appImages = MarathonStore.getServiceImages(model.name);
    let imageTag = null;

    if (appImages) {
      imageTag = (
        <img className="icon icon-small border-radius"
          src={appImages["icon-small"]} />
      );
    }

    if (model.webui_url.length === 0) {
      return (
        <span className="h5 flush-top flush-bottom headline">
          {imageTag}{model[prop]}
        </span>
      );
    }

    return (
      <a
        onClick={this.handleServiceClick.bind(this, model)}
        className="h5 headline cell-link clickable">
        <span className="flush-top flush-bottom">
          {imageTag}{model[prop]}
        </span>
      </a>
    );
  },

  renderHealth: function (prop, model) {
    let appHealth = MarathonStore.getServiceHealth(model.name);

    if (!this.props.healthProcessed) {
      return (
        <div className="loader-small ball-beat">
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }

    let statusClassSet = classNames({
      "text-success": appHealth.value === HealthTypes.HEALTHY,
      "text-danger": appHealth.value === HealthTypes.UNHEALTHY,
      "text-warning": appHealth.value === HealthTypes.IDLE,
      "text-mute": appHealth.value === HealthTypes.NA
    });

    let attributes = {};
    attributes["data-behavior"] = "show-tip";

    if (appHealth.value === HealthTypes.HEALTHY) {
      attributes["data-tip-content"] = HealthTypesDescription.HEALTHY;
    } else if (appHealth.value === HealthTypes.UNHEALTHY) {
      attributes["data-tip-content"] = HealthTypesDescription.UNHEALTHY;
    } else if (appHealth.value === HealthTypes.IDLE) {
      attributes["data-tip-content"] = HealthTypesDescription.IDLE;
    } else if (appHealth.value === HealthTypes.NA) {
      attributes["data-tip-content"] = HealthTypesDescription.NA;
    }

    return React.createElement(
      "span",
      _.extend({className: statusClassSet}, attributes),
      HealthLabels[appHealth.key]
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
    let marathonApps = MarathonStore.get("apps");
    let serviceDetail = this.state.serviceDetail;
    let serviceName = "";
    if (serviceDetail != null) {
      serviceName = serviceDetail.name;
    }

    return (
      <div>
        <Table
          className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={this.props.services.slice(0)}
          keys={["id"]}
          sortBy={{prop: "name", order: "desc"}}
          sortFunc={ResourceTableUtil.getSortFunction("name", {marathonApps})} />
        <ServiceSidePanel
          open={serviceDetail != null}
          onClose={this.onServiceDetailClose}
          serviceName={serviceName} />
      </div>
    );
  }
});

module.exports = ServicesTable;
