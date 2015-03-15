/** @jsx React.DOM */

var _ = require("underscore");
var Humanize = require("humanize");
var React = require("react/addons");

var Table = require("./Table");

function renderHeadline(prop) {
  return (
    <h5 className="flush-top flush-bottom headline">
      {prop}
    </h5>
  );
}

function renderTask(prop, model) {
  return (
    <span>
      {model[prop]}
      <span className="visible-mini-inline"> Tasks</span>
    </span>
  );
}

function renderStats(prop, model) {
  var value = _.last(model.used_resources[prop]).value;
  if(prop !== "cpus") {
    value = Humanize.filesize(value * 1024 * 1024, 1024, 1);
  }

  return (
    <span>
      {value}
    </span>
  );
}

function classHeader(prop, sortBy) {
  if (sortBy.prop === prop) {
    return "highlighted";
  }

  return "";
}

function classHeaderStats(prop, sortBy) {
  var className = "align-right hidden-mini";
  if (sortBy.prop === prop) {
    className += " highlighted";
  }

  return className;
}

function classNameStats(prop, row, sortBy) {
  var className = "align-right hidden-mini";
  if (sortBy.prop === prop) {
    className += " highlighted";
  }

  return className;
}

var columns = [
  {
    headerClassName: classHeader,
    prop: "hostname",
    render: renderHeadline,
    sortable: true,
    title: "SERIVCE NAME"
  },
  {
    className: "align-right",
    headerClassName: classHeader,
    prop: "tasks_size",
    render: renderTask,
    sortable: true,
    title: "TASKS"
  },
  {
    className: classNameStats,
    headerClassName: classHeaderStats,
    prop: "cpus",
    render: renderStats,
    sortable: true,
    title: "CPU"
  },
  {
    className: classNameStats,
    headerClassName: classHeaderStats,
    prop: "mem",
    render: renderStats,
    sortable: true,
    title: "MEM"
  },
  {
    className: classNameStats,
    headerClassName: classHeaderStats,
    prop: "disk",
    render: renderStats,
    sortable: true,
    title: "DISK"
  },
];

var HostList = React.createClass({

  displayName: "HostList",

  propTypes: {
    hosts: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      hosts: []
    };
  },

  sortFunction: function (prop) {
    if (prop === "cpus" || prop === "mem" || prop === "disk") {

      return function (a, b) {
        a = _.last(a.used_resources[prop]).value;
        b = _.last(b.used_resources[prop]).value;
        return a < b ? -1 : a > b ? 1 : 0;
      };
    }

    // rely on default sorting
    return null;
  },

  render: function () {

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Table
        className="table"
        columns={columns}
        keys={["hostname"]}
        sortBy={{ prop: "hostname", order: "desc" }}
        sortFunc={this.sortFunction}
        dataArray={this.props.hosts} />
    );
  }
});

module.exports = HostList;
