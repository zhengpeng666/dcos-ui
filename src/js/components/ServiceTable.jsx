/** @jsx React.DOM */

var _ = require("underscore");
var Humanize = require("humanize");
var React = require("react/addons");

var Table = require("./Table");

function isStat(prop) {
  return prop === "cpus" || prop === "mem" || prop === "disk";
}

function renderHeadline(prop, model) {
  return (
    <span className="h5 flush-top flush-bottom headline">
      <i className="icon icon-small icon-small-white border-radius"></i>
      {model[prop]}
    </span>
  );
}

function renderHealth(prop, model) {
  var status = "Active";
  if (model.active !== true) {
    status = "Inactive";
  }

  var statusClassSet = React.addons.classSet({
    "collection-item-content-status": true,
    "text-success": model.active,
    "text-danger": !model.active
  });

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  return (
    <span className={statusClassSet}>{status}</span>
  );
  /* jshint trailing:true, quotmark:true, newcap:true */
  /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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

function getClassName(prop, sortBy) {
  var classSet = React.addons.classSet({
    "align-right": isStat(prop) || prop === "tasks_size",
    "hidden-mini": isStat(prop),
    "highlighted": sortBy.prop === prop
  });

  return classSet;
}

var columns = [
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "name",
    render: renderHeadline,
    sortable: true,
    title: "SERIVCE NAME",
  },
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "active",
    render: renderHealth,
    sortable: true,
    title: "HEALTH",
  },
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "tasks_size",
    render: renderTask,
    sortable: true,
    title: "TASKS",
  },
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "cpus",
    render: renderStats,
    sortable: true,
    title: "CPU",
  },
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "mem",
    render: renderStats,
    sortable: true,
    title: "MEM",
  },
  {
    className: getClassName,
    headerClassName: getClassName,
    prop: "disk",
    render: renderStats,
    sortable: true,
    title: "DISK",
  },
];

var ServicesTable = React.createClass({

  displayName: "ServicesTable",

  propTypes: {
    frameworks: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      frameworks: []
    };
  },

  sortFunction: function (prop) {
    if (isStat(prop)) {
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
        keys={["name"]}
        sortBy={{ prop: "name", order: "desc" }}
        sortFunc={this.sortFunction}
        dataArray={this.props.frameworks} />
    );
  }
});

module.exports = ServicesTable;
