var _ = require("underscore");
var classNames = require("classnames");
var React = require("react/addons");

var Table = require("./Table");
var ProgressBar = require("./charts/ProgressBar");
var ResourceTableUtil = require("../utils/ResourceTableUtil");
var TooltipMixin = require("../mixins/TooltipMixin");

var HostTable = React.createClass({

  displayName: "HostTable",

  mixins: [TooltipMixin],

  propTypes: {
    hosts: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      hosts: []
    };
  },

  renderHeadline: function (prop, model) {
    var label = model[prop];

    if (model.active) {
      return (
        <span className="h5 flush-top flush-bottom headline">
          {label}
        </span>
      );
    }

    return (
      <span className="headline-tooltip"
          data-behavior="show-tip"
          data-tip-place="top"
          data-tip-content="Connection to node lost">
        <i className="icon icon-mini icon-mini-white icon-alert" />
        <span className="headline-label">
          {label}
        </span>
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
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "hostname",
        render: this.renderHeadline,
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
        <col style={{width: "100px"}} />
        <col className="hidden-mini" style={{width: "100px"}} />
        <col className="hidden-mini" style={{width: "100px"}} />
        <col className="hidden-mini" style={{width: "100px"}} />
      </colgroup>
    );
  },

  getRowAttributes: function (model) {
    return {
      className: classNames({
        "danger": model.active === false
      })
    };
  },

  render: function () {
    return (
      <Table
        className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        data={this.props.hosts.slice(0)}
        keys={["id"]}
        sortBy={{ prop: "hostname", order: "desc" }}
        sortFunc={ResourceTableUtil.getSortFunction("hostname")}
        buildRowOptions={this.getRowAttributes} />
    );
  }
});

module.exports = HostTable;
