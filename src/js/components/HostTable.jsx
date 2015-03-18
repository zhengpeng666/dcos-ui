/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Table = require("./Table");

function isStat(prop) {
  return _.contains(["cpus", "mem", "disk"], prop);
}

function renderHeadline(prop, model) {
  return (
    <span className="h5 flush-top flush-bottom headline">
      {model[prop]}
    </span>
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
  var value = _.last(model.used_resources[prop]).percentage;
  return (
    <span>
      {value}%
    </span>
  );
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
      return _.last(model.used_resources[prop]).value;
    };
  }

  // rely on default sorting
  return null;
}

function rowOptions(model) {
  return {
    className: React.addons.classSet({
      "danger": !model.active
    })
  };
}

var columns = [
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "hostname",
    render: renderHeadline,
    sortable: true,
    title: "HOST NAME"
  },
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "tasks_size",
    render: renderTask,
    sortable: true,
    title: "TASKS"
  },
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "cpus",
    render: renderStats,
    sortable: true,
    title: "CPU"
  },
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "mem",
    render: renderStats,
    sortable: true,
    title: "MEM"
  },
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "disk",
    render: renderStats,
    sortable: true,
    title: "DISK"
  },
];

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

  render: function () {

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <Table
        className="table"
        columns={columns}
        keys={["id"]}
        sortBy={{ prop: "hostname", order: "desc" }}
        sortFunc={sortFunction}
        buildRowOptions={rowOptions}
        dataArray={this.props.hosts} />
    );
  }
});

module.exports = HostTable;
