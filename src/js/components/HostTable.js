var classNames = require("classnames");
import {Link} from "react-router";
var React = require("react/addons");

var HostTableHeaderLabels = require("../constants/HostTableHeaderLabels");
var ResourceTableUtil = require("../utils/ResourceTableUtil");
var ProgressBar = require("./charts/ProgressBar");
var Table = require("./Table");
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
    var classSet = classNames({
      "h5 flush-top flush-bottom headline": true,
      "headline-tooltip": !node.isActive()
    });
    let icon = null;
    let toolTip = {};

    if (!node.isActive()) {
      icon = <i className="icon icon-mini icon-mini-white icon-alert" />;
      toolTip = {
        "data-behavior": "show-tip",
        "data-tip-place": "top",
        "data-tip-content": "Connection to node lost"
      };
    }

    return (
      <Link className={classSet}
        params={{nodeID: node.get("id")}}
        to="nodes-list-panel"
        {...toolTip}>
        <strong className="headline-label">
          {icon}
          <strong>
            {node.get(prop)}
          </strong>
        </strong>
      </Link>
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
        header: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "TASK_RUNNING",
        render: ResourceTableUtil.renderTask,
        sortable: true,
        header: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        header: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        header: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "disk",
        render: this.renderStats,
        sortable: true,
        header: ResourceTableUtil.renderHeader(HostTableHeaderLabels)
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
        data={this.props.hosts.slice(0)}
        keys={["id"]}
        sortBy={{ prop: "hostname", order: "desc" }}
        sortFunc={ResourceTableUtil.getSortFunction("hostname")}
        buildRowOptions={this.getRowAttributes} />
    );
  }
});

module.exports = HostTable;
