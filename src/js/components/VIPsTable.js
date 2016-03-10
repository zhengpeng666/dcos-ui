import classNames from 'classnames';
import React from 'react';
import {Table} from 'reactjs-components';

import {Hooks} from 'PluginSDK';
import TableUtil from '../utils/TableUtil';

const METHODS_TO_BIND = [
  'getColumnClassname'
];

const COLUMNS_TO_HIDE_MEDIUM = [
  'successLastMinute',
  'failLastMinute'
];

const COLUMNS_TO_HIDE_MINI = [
  'successLastMinute',
  'failLastMinute',
  'applicationReachabilityPercent',
  'machineReachabilityPercent'
];

const RIGHT_ALIGNED_TABLE_CELLS = [
  'successLastMinute',
  'failLastMinute',
  'failurePercent',
  'applicationReachabilityPercent',
  'machineReachabilityPercent',
  'p99Latency'
];

class VIPsTable extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  alignTableCellRight(prop) {
    return RIGHT_ALIGNED_TABLE_CELLS.indexOf(prop) > -1;
  }

  getColumns() {
    let className = this.getColumnClassname;
    let heading = this.renderHeading({
      vip: 'VIRTUAL IP',
      successLastMinute: 'SUCCESSES',
      failLastMinute: 'FAILURES',
      failurePercent: 'FAILURE %',
      applicationReachabilityPercent: 'APP REACH',
      machineReachabilityPercent: 'IP REACH',
      p99Latency: '99TH% LATENCY'
    });

    return [
      {
        className,
        headerClassName: className,
        prop: 'vip',
        render: this.renderVIP,
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'successLastMinute',
        render: this.getFailSuccessRenderFn('success'),
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'failLastMinute',
        render: this.getFailSuccessRenderFn('fail'),
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'failurePercent',
        render: this.renderPercentage,
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'applicationReachabilityPercent',
        render: this.renderPercentage,
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'machineReachabilityPercent',
        render: this.renderPercentage,
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'p99Latency',
        sortable: true,
        render: this.renderMilliseconds,
        heading
      }
    ];
  }

  getColumnClassname(prop, sortBy, row) {
    let {alignTableCellRight, hideColumnAtScreenSize} = this;

    return classNames({
      'text-align-right': alignTableCellRight(prop),
      'hidden-medium': hideColumnAtScreenSize(prop, COLUMNS_TO_HIDE_MEDIUM),
      'hidden-small': hideColumnAtScreenSize(prop, COLUMNS_TO_HIDE_MINI),
      'hidden-mini': hideColumnAtScreenSize(prop, COLUMNS_TO_HIDE_MINI),
      'highlight': prop === sortBy.prop,
      'clickable': row == null
    });
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '20%'}} />
        <col className="hidden-mini" />
        <col className="hidden-mini" />
        <col />
        <col className="hidden-mini hidden-small hidden-medium" />
        <col className="hidden-mini hidden-small hidden-medium" />
        <col />
      </colgroup>
    );
  }

  getFailSuccessRenderFn(type) {
    let classes = classNames({
      'text-danger': type === 'fail',
      'text-success': type === 'success'
    });

    return function (prop, item) {
      return <span className={classes}>{item[prop]}</span>;
    };
  }

  hideColumnAtScreenSize(prop, columns) {
    return columns.indexOf(prop) > -1;
  }

  renderHeading(config) {
    return (prop, order, sortBy) => {
      let title = config[prop];
      let caret = {
        before: null,
        after: null
      };
      let caretClassSet = classNames(
        `caret caret--${order}`,
        {'caret--visible': prop === sortBy.prop}
      );

      if (this.alignTableCellRight(prop)) {
        caret.before = <span className={caretClassSet} />;
      } else {
        caret.after = <span className={caretClassSet} />;
      }

      return (
        <span>
          {caret.before}
          <span className="table-header-title">{title}</span>
          {caret.after}
        </span>
      );
    };
  }

  renderMilliseconds(prop, item) {
    return `${item[prop]}ms`;
  }

  renderPercentage(prop, item) {
    return `${item[prop]}%`;
  }

  renderVIP(prop, item) {
    let fullVIP = item.fullVIP;
    let displayedVIP = Hooks.applyFilter('NetworkingVIPTableLabel', item[prop], fullVIP);

    return (
      <span>
        {displayedVIP}
      </span>
    );
  }

  render() {
    return (
      <Table
        className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        containerSelector=".gm-scroll-view"
        data={this.props.vips}
        idAttribute="vip"
        itemHeight={TableUtil.getRowHeight()}
        sortBy={{prop: 'vip', order: 'desc'}} />
    );
  }
}

VIPsTable.defaultProps = {
  vips: []
};

VIPsTable.propTypes = {
  vips: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      vip: React.PropTypes.string,
      successLastMinute: React.PropTypes.number,
      failLastMinute: React.PropTypes.number,
      failurePercent: React.PropTypes.number,
      applicationReachabilityPercent: React.PropTypes.number,
      machineReachabilityPercent: React.PropTypes.number,
      p99Latency: React.PropTypes.number
    })
  )
};

module.exports = VIPsTable;
