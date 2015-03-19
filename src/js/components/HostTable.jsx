/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Table = require("./Table");

function isStat(prop) {
  return _.contains(["cpus", "mem", "disk"], prop);
}

function getClassName(prop, sortBy) {
  var classSet = React.addons.classSet({
    "align-right": isStat(prop) || prop === "tasks_size",
    "hidden-mini fixed-width": isStat(prop),
    "highlighted": prop === sortBy.prop
  });

  return classSet;
}

function sortFunction(prop) {
  if (isStat(prop)) {
    return function (model) {
      return _.last(model.used_resources[prop]).value + "-" +
          model.name.toLowerCase();
    };
  } else {
    return function (model) {
      var value = model[prop].toString().toLowerCase();
      return value + "-" + model.hostname.toLowerCase();
    };
  }
}

function rowOptions(model) {
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
    return (
      <span className="h5 flush-top flush-bottom headline">
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
    var value = _.last(model.used_resources[prop]).percentage;
    return (
      <span>
        {value}%
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
        title: "HOST NAME"
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "tasks_size",
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
      },
    ];
  },

  render: function () {

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Table
        className="table"
        columns={this.getColumns()}
        data={this.props.hosts.slice(0)}
        keys={["id"]}
        sortBy={{ prop: "hostname", order: "desc" }}
        sortFunc={sortFunction}
        buildRowOptions={rowOptions} />
    );
  }
});

module.exports = HostTable;
