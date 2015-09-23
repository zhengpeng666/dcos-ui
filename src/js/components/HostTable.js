var classNames = require("classnames");
import {Link} from "react-router";
var React = require("react/addons");

var HostTableHeaderLabels = require("../constants/HostTableHeaderLabels");
var ResourceTableUtil = require("../utils/ResourceTableUtil");
var ProgressBar = require("./charts/ProgressBar");
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
    var className = ResourceTableUtil.getClassName;
    var heading = ResourceTableUtil.renderHeading(HostTableHeaderLabels);
    var sortFunction = ResourceTableUtil.getSortFunction("hostname");

    return [
      {
        className,
        headerClassName: className,
        prop: "hostname",
        render: this.renderHeadline,
        sortable: true,
        sortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: "TASK_RUNNING",
        render: ResourceTableUtil.renderTask,
        sortable: true,
        sortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        sortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        sortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: "disk",
        render: this.renderStats,
        sortable: true,
        sortFunction,
        heading
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
        buildRowOptions={this.getRowAttributes}
        transition={false} />
    );
  }
});

module.exports = HostTable;
