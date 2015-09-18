var classNames = require("classnames");
import {Link} from "react-router";
var React = require("react/addons");

var HostTableHeaderLabels = require("../constants/HostTableHeaderLabels");
var ResourceTableUtil = require("../utils/ResourceTableUtil");
var ProgressBar = require("./charts/ProgressBar");
// var Table = require("./Table");
import {Table} from "reactjs-components";
var TooltipMixin = require("../mixins/TooltipMixin");

var HostTable = React.createClass({

  displayName: "HostTable",

  mixins: [TooltipMixin],

  statics: {
    routeConfig: {
      label: "Nodes",
      icon: "datacenter",
      matches: /^\/nodes/
    }
  },

  propTypes: {
    hosts: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      hosts: []
    };
  },

  renderHeadline: function (prop, node) {
    let icon = null;
    let toolTip = {};

    if (!node.isActive()) {
      icon = <i className="icon icon-mini icon-mini-white icon-alert disable-pointer-events" />;
      toolTip = {
        "data-behavior": "show-tip",
        "data-tip-place": "top",
        "data-tip-content": "Connection to node lost"
      };
    }

    // Anything nested in elements hosting a tooltip needs to have
    // "disable-pointer-events" in order for the tip to render correctly.
    return (
      <div className="h5 flush-top flush-bottom">
        <Link params={{nodeID: node.get("id")}}
          to="nodes-list-panel"
          {...toolTip}>
          {icon}
        </Link>
        <Link className="headline"
          params={{nodeID: node.get("id")}}
          to="nodes-list-panel"
          {...toolTip}>
          {node.get(prop)}
        </Link>
      </div>
    );
  },

  renderStats: function (prop, node) {
    var colorMapping = {
      cpus: 1,
      mem: 2,
      disk: 3
    };

    var value = node.getUsageStats(prop).percentage;
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
        sortFunction: ResourceTableUtil.getSortFunction("hostname"),
        heading: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "TASK_RUNNING",
        render: ResourceTableUtil.renderTask,
        sortable: true,
        sortFunction: ResourceTableUtil.getSortFunction("hostname"),
        heading: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        sortFunction: ResourceTableUtil.getSortFunction("hostname"),
        heading: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        sortFunction: ResourceTableUtil.getSortFunction("hostname"),
        heading: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "disk",
        render: this.renderStats,
        sortable: true,
        sortFunction: ResourceTableUtil.getSortFunction("hostname"),
        heading: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
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

  getRowAttributes: function (node) {
    return {
      className: classNames({
        "danger": node.isActive() === false
      })
    };
  },

  render: function () {
    return (
      <Table
        className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        data={this.props.hosts.slice()}
        keys={["id"]}
        sortBy={{ prop: "hostname", order: "desc" }}
        buildRowOptions={this.getRowAttributes} />
    );
  }
});

module.exports = HostTable;
