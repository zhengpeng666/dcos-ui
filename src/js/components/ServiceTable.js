/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Cluster = require("../utils/Cluster");
var HealthLabels = require("../constants/HealthLabels");
var HealthTypes = require("../constants/HealthTypes");
var HealthTypesDescription = require("../constants/HealthTypesDescription");
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

  getDefaultProps: function () {
    return {
      services: []
    };
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
          href={Cluster.getServiceLink(model.name)}
          target="_blank"
          className="h5 headline cell-link">
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

    var statusClassSet = React.addons.classSet({
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
      <Table
        className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        data={this.props.services.slice(0)}
        keys={["id"]}
        sortBy={{prop: "name", order: "desc"}}
        sortFunc={ResourceTableUtil.getSortFunction("name")} />
    );
  }
});

module.exports = ServicesTable;
