/** @jsx React.DOM */

var _ = require("underscore");
var Humanize = require("humanize");
var React = require("react/addons");

var HealthTypes = require("../constants/HealthTypes");
var HealthLabels = require("../constants/HealthLabels");
var Maths = require("../utils/Maths");
var Strings = require("../utils/Strings");
var Table = require("./Table");

function isStat(prop) {
  return _.contains(["cpus", "mem", "disk"], prop);
}

function getClassName(prop, sortBy, row) {
  var classSet = React.addons.classSet({
    "align-right": isStat(prop) || prop === "tasks_size",
    "hidden-mini fixed-width": isStat(prop),
    "highlighted": prop === sortBy.prop,
    "clickable": row == null // this is a header
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

var ServicesTable = React.createClass({

  displayName: "ServicesTable",

  propTypes: {
    frameworks: React.PropTypes.array.isRequired
  },

  renderHeadline: function (prop, model) {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    if (model.webui_url.length === 0) {
      return (
        <span className="h5 flush-top flush-bottom headline">
          <i className="icon icon-small icon-small-white border-radius"></i>
          {model[prop]}
        </span>
      );
    }

    return (
      <span className="h5 flush-top flush-bottom">
        <a href={Strings.formatUrl(model.webui_url)} target="_blank" className="headline">
          <i className="icon icon-small icon-small-white border-radius"></i>
          {model[prop]}
        </a>
      </span>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  renderHealth: function (prop, model) {
    var statusClassSet = React.addons.classSet({
      "collection-item-content-status": true,
      "text-success": model.health.value === HealthTypes.HEALTHY,
      "text-danger": model.health.value === HealthTypes.UNHEALTHY,
      "text-warning": model.health.value === HealthTypes.IDLE,
      "text-mute": model.health.value === HealthTypes.NA
    });

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <span className={statusClassSet}>{HealthLabels[model.health.key]}</span>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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
    if(prop !== "cpus") {
      value = Humanize.filesize(value * 1024 * 1024, 1024, 1);
    }

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <span>
        {value}
      </span>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getDefaultProps: function () {
    return {
      frameworks: []
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
        title: "SERVICE NAME",
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "active",
        render: this.renderHealth,
        sortable: true,
        title: "HEALTH",
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "tasks_size",
        render: this.renderTask,
        sortable: true,
        title: "TASKS",
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        title: "CPU",
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        title: "MEM",
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        prop: "disk",
        render: this.renderStats,
        sortable: true,
        title: "DISK",
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
        data={this.props.frameworks.slice(0)}
        keys={["id"]}
        sortBy={{prop: "name", order: "desc"}}
        sortFunc={sortFunction} />
    );
  }
});

module.exports = ServicesTable;
