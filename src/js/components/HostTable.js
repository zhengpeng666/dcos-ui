/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Table = require("./Table");
var ProgressBar = require("./charts/ProgressBar");

function isStat(prop) {
  return _.contains(["cpus", "mem", "disk"], prop);
}

function getClassName(prop, sortBy, row) {
  return React.addons.classSet({
    "align-right": isStat(prop) || prop === "tasks_count",
    "hidden-mini fixed-width": isStat(prop),
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

    return value.toString().toLowerCase() + "-" + model.hostname.toLowerCase();
  };
}

function getRowAttributes(model) {
  return {
    className: React.addons.classSet({
      "danger": model.active === false
    })
  };
}

var HostTable = React.createClass({

  displayName: "HostTable",

  propTypes: {
    hosts: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      hosts: []
    };
  },

  renderHeadline: function (prop, model) {
    var alert = null;
    if (model.active === false) {
      alert = <i className="icon icon-mini icon-mini-white icon-alert" />;
    }

    return (
      <span className="h5 flush-top flush-bottom headline">
        {alert}
        {model[prop]}
      </span>
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
    var colorMapping = {
      cpus: 1,
      mem: 2,
      disk: 3
    };

    var value = _.last(model.used_resources[prop]).percentage;
    return (
      <span className="spread-content">
        <ProgressBar value={value}
          colorIndex={colorMapping[prop]} /> <span>{value}%</span>
      </span>
    );
  },

  getColumns: function () {
    return [
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "hostname",
        render: this.renderHeadline,
        sortable: true,
        title: "HOSTNAME"
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "tasks_count",
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
        className="table inverse table-borderless-outer table-borderless-inner-columns"
        columns={this.getColumns()}
        data={this.props.hosts.slice(0)}
        keys={["id"]}
        sortBy={{ prop: "hostname", order: "desc" }}
        sortFunc={sortFunction}
        buildRowOptions={getRowAttributes} />
    );
  }
});

module.exports = HostTable;
