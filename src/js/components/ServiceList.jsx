/** @jsx React.DOM */

var _ = require("underscore");
var Humanize = require("humanize");
var React = require("react/addons");

var Table = require("./Table");

function renderHeadline(prop) {
  return (
    <span className="h5 flush-top flush-bottom headline">
      <i className="icon icon-small icon-small-white border-radius"></i>
      {prop}
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
    prop: "name",
    render: renderHeadline,
    sortable: true,
    title: "SERIVCE NAME",
  },
  {
    headerClassName: classHeader,
    prop: "active",
    render: renderHealth,
    sortable: true,
    title: "HEALTH",
  },
  {
    className: "align-right",
    headerClassName: classHeader,
    prop: "tasks_size",
    render: renderTask,
    sortable: true,
    title: "TASKS",
  },
  {
    className: classNameStats,
    headerClassName: classHeaderStats,
    prop: "cpus",
    render: renderStats,
    sortable: true,
    title: "CPU",
  },
  {
    className: classNameStats,
    headerClassName: classHeaderStats,
    prop: "mem",
    render: renderStats,
    sortable: true,
    title: "MEM",
  },
  {
    className: classNameStats,
    headerClassName: classHeaderStats,
    prop: "disk",
    render: renderStats,
    sortable: true,
    title: "DISK",
  },
];

var ServicesList = React.createClass({

  displayName: "ServicesList",

  propTypes: {
    frameworks: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      frameworks: []
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
        keys={["name"]}
        sortBy={{ prop: "name", order: "desc" }}
        sortFunc={this.sortFunction}
        dataArray={this.props.frameworks} />
    );
  }
});

module.exports = ServicesList;
