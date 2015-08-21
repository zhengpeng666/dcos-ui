var _ = require("underscore");
var classNames = require("classnames");
var Link = require("react-router").Link;
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var HealthLabels = require("../constants/HealthLabels");
var HealthTypes = require("../constants/HealthTypes");
var HealthTypesDescription = require("../constants/HealthTypesDescription");
var MarathonStore = require("../stores/MarathonStore");
var Maths = require("../utils/Maths");
var ResourceTableUtil = require("../utils/ResourceTableUtil");
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

  renderHeadline: function (prop, model) {
    let marathonApps = MarathonStore.getApps();
    let currentApp = marathonApps[model.name.toLowerCase()];
    let images = currentApp.images;

    if (model.webui_url.length === 0) {
      return (
        <span className="h5 flush-top flush-bottom headline">
          <img className="icon icon-small border-radius"
            src={images["icon-small"]} />
          {model[prop]}
        </span>
      );
    }

    return (
      <Link to="service-ui"
        params={{serviceName: model.name}}
        className="h5 headline cell-link clickable">
        <span className="flush-top flush-bottom">
          <img className="icon icon-small border-radius"
          src={images["icon-small"]} />
          {model[prop]}
        </span>
      </Link>
    );
  },

  renderHealth: function (prop, model) {
    let marathonApps = MarathonStore.getApps();
    let currentApp = marathonApps[model.name.toLowerCase()];
    let health = currentApp.health;

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
      "text-success": health.value === HealthTypes.HEALTHY,
      "text-danger": health.value === HealthTypes.UNHEALTHY,
      "text-warning": health.value === HealthTypes.IDLE,
      "text-mute": health.value === HealthTypes.NA
    });

    let attributes = {};
    attributes["data-behavior"] = "show-tip";

    if (health.value === HealthTypes.HEALTHY) {
      attributes["data-tip-content"] = HealthTypesDescription.HEALTHY;
    } else if (health.value === HealthTypes.UNHEALTHY) {
      attributes["data-tip-content"] = HealthTypesDescription.UNHEALTHY;
    } else if (health.value === HealthTypes.IDLE) {
      attributes["data-tip-content"] = HealthTypesDescription.IDLE;
    } else if (health.value === HealthTypes.NA) {
      attributes["data-tip-content"] = HealthTypesDescription.NA;
    }

    return React.createElement(
      "span",
      _.extend({className: statusClassSet}, attributes),
      HealthLabels[health.key]
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
    let marathonApps = MarathonStore.getApps();
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
      </div>
    );
  }
});

module.exports = ServicesTable;
