/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var HealthLabels = require("../constants/HealthLabels");
var HealthSorting = require("../constants/HealthSorting");
var HealthTypes = require("../constants/HealthTypes");
var HealthTypesDescription = require("../constants/HealthTypesDescription");
var Maths = require("../utils/Maths");
var Strings = require("../utils/Strings");
var Table = require("./Table");
var TooltipMixin = require("../mixins/TooltipMixin");
var Units = require("../utils/Units");

var healthKey = "health";

function isStat(prop) {
  return _.contains(["cpus", "mem", "disk"], prop);
}

function getClassName(prop, sortBy, row) {
  return React.addons.classSet({
    "align-right": isStat(prop) || prop === "TASK_RUNNING",
    "hidden-mini fixed-width": isStat(prop),
    "fixed-width": prop === "TASK_RUNNING",
    "highlight": prop === sortBy.prop,
    "clickable": row == null // this is a header
  });
}

function sortFunction(prop) {
  if (isStat(prop)) {
    return function (model) {
      return _.last(model.used_resources[prop]).value;
    };
  }

  return function (model) {
    var value = model[prop];
    if (_.isNumber(value)) {
      return value;
    }

    if (prop === healthKey) {
      value = HealthSorting[value.key];
    }

    return value.toString().toLowerCase() + "-" + model.name.toLowerCase();
  };
}

var ServicesTable = React.createClass({

  displayName: "ServicesTable",

  mixins: [TooltipMixin],

  propTypes: {
    services: React.PropTypes.array.isRequired,
    healthProcessed: React.PropTypes.bool.isRequired
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
          href={Strings.ipToHostAddress(model.webui_url)}
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

  renderTask: function (prop, model) {
    return (
      <span>
        {model[prop]}
        <span className="visible-mini-inline"> Tasks</span>
      </span>
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

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  getColumns: function () {
    return [
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "name",
        render: this.renderHeadline,
        sortable: true,
        title: "SERVICE NAME"
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: healthKey,
        render: this.renderHealth,
        sortable: true,
        title: "HEALTH"
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "TASK_RUNNING",
        render: this.renderTask,
        sortable: true,
        title: "TASKS"
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        title: "CPU"
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        title: "MEM"
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "disk",
        render: this.renderStats,
        sortable: true,
        title: "DISK"
      }
    ];
  },

  render: function () {
    return (
      <Table
        className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        data={this.props.services.slice(0)}
        keys={["id"]}
        sortBy={{prop: "name", order: "desc"}}
        sortFunc={sortFunction} />
    );
  }
});

module.exports = ServicesTable;
