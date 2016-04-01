var classNames = require('classnames');
import {Link} from 'react-router';
var React = require('react');
import {StoreMixin} from 'mesosphere-shared-reactjs';

var HostTableHeaderLabels = require('../constants/HostTableHeaderLabels');
var InternalStorageMixin = require('../mixins/InternalStorageMixin');
var ResourceTableUtil = require('../utils/ResourceTableUtil');
var ProgressBar = require('./charts/ProgressBar');
import StringUtil from '../utils/StringUtil';
import {Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';
var TooltipMixin = require('../mixins/TooltipMixin');
import UnitHealthUtil from '../utils/UnitHealthUtil';

var HostTable = React.createClass({

  displayName: 'HostTable',

  mixins: [InternalStorageMixin, TooltipMixin, StoreMixin],

  statics: {
    routeConfig: {
      label: 'Nodes',
      icon: 'datacenter',
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

  componentWillMount: function () {
    this.internalStorage_set({
      nodeHealthResponseReceived: false
    });

    this.store_listeners = [
      {
        name: 'nodeHealth',
        events: ['success'],
        listenAlways: false
      }
    ];
  },

  onNodeHealthStoreSuccess: function () {
    this.internalStorage_set({
      nodeHealthResponseReceived: true
    });
    this.forceUpdate();
  },

  renderHeadline: function (prop, node) {
    let icon = null;
    let toolTip = {};

    if (!node.isActive()) {
      icon = <i className="icon icon-mini icon-mini-white icon-alert disable-pointer-events" />;
      toolTip = {
        'data-behavior': 'show-tip',
        'data-tip-place': 'top',
        'data-tip-content': 'Connection to node lost'
      };
    }

    // Anything nested in elements hosting a tooltip needs to have
    // 'disable-pointer-events' in order for the tip to render correctly.
    return (
      <div>
        <Link params={{nodeID: node.get('id')}}
          to="nodes-list-panel"
          {...toolTip}>
          {icon}
        </Link>
        <Link className="headline emphasize"
          params={{nodeID: node.get('id')}}
          to="nodes-list-panel"
          {...toolTip}>
          {node.get(prop)}
        </Link>
      </div>
    );
  },

  renderHealth: function (prop, node) {
    let requestReceived = this.internalStorage_get().nodeHealthResponseReceived;

    if (!requestReceived) {
      return (
        <div className="loader-small ball-beat">
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }

    let health = node.getHealth();

    return (
      <span className={health.classNames}>
        {StringUtil.capitalize(health.title)}
      </span>
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
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading(HostTableHeaderLabels);
    let sortFunction = TableUtil.getSortFunction('hostname',
      function (node, prop) {
        if (prop === 'cpus' || prop === 'mem' || prop === 'disk') {
          return node.getUsageStats(prop).percentage;
        }

        if (prop === 'health') {
          return UnitHealthUtil.getHealthSorting(node);
        }

        return node.get(prop);
      }
    );

    return [
      {
        className,
        headerClassName: className,
        prop: 'hostname',
        render: this.renderHeadline,
        sortable: true,
        sortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'health',
        render: this.renderHealth,
        sortable: true,
        sortFunction,
        heading: ResourceTableUtil.renderHeading({health: 'HEALTH'})
      },
      {
        className,
        headerClassName: className,
        prop: 'TASK_RUNNING',
        render: ResourceTableUtil.renderTask,
        sortable: true,
        sortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'cpus',
        render: this.renderStats,
        sortable: true,
        sortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'mem',
        render: this.renderStats,
        sortable: true,
        sortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'disk',
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
        <col style={{width: '100px'}} />
        <col style={{width: '110px'}} />
        <col className="hidden-mini" style={{width: '135px'}} />
        <col className="hidden-mini" style={{width: '135px'}} />
        <col className="hidden-mini" style={{width: '135px'}} />
      </colgroup>
    );
  },

  getRowAttributes: function (node) {
    return {
      className: classNames({
        'danger': node.isActive() === false
      })
    };
  },

  render: function () {
    return (
      <Table
        className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        containerSelector=".gm-scroll-view"
        data={this.props.hosts.slice()}
        itemHeight={TableUtil.getRowHeight()}
        sortBy={{ prop: 'health', order: 'asc' }}
        buildRowOptions={this.getRowAttributes} />
    );
  }
});

module.exports = HostTable;
