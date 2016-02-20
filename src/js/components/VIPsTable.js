import classNames from 'classnames';
import React from 'react';
import {Table} from 'reactjs-components';

import ResourceTableUtil from '../utils/ResourceTableUtil';
import TableUtil from '../utils/TableUtil';

const METHODS_TO_BIND = ['getColumnClassname'];
const COLUMNS_TO_HIDE_MINI = [
  'failurePerecent',
  'applicationReachabilityPercent',
  'machineReachabilityPercent'
];

class VIPsTable extends React.Component {
   constructor() {
     super();

     this.state = {};

     METHODS_TO_BIND.forEach((method) => {
       this[method] = this[method].bind(this);
     });
   }

  getColumns() {
    let className = this.getColumnClassname;
    let heading = ResourceTableUtil.renderHeading({
      vip: 'VIRTUAL IP',
      successLastMinute: 'SUCCESSES',
      failLastMinute: 'FAILURES',
      failurePerecent: 'FAILURE %',
      applicationReachabilityPercent: 'APP REACHABILITY',
      machineReachabilityPercent: 'MACHINE REACHABILITY',
      p99Latency: '99TH% LATENCY'
    });

    return [
      {
        className,
        headerClassName: className,
        prop: 'vip',
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
        prop: 'failurePerecent',
        render: this.renderPercentage,
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'applicationReachabilityPercent',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'machineReachabilityPercent',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'p99Latency',
        sortable: true,
        heading
      }
    ];
  }

  getColumnClassname(prop, sortBy, row) {
    return classNames({
      'hidden-mini': this.hideColumnAtMini(prop),
      'highlight': prop === sortBy.prop,
      'clickable': row == null
    });
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '20%'}} />
        <col />
        <col />
        <col className="hidden-mini" />
        <col className="hidden-mini" />
        <col className="hidden-mini" />
        <col className="hidden-mini" />
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

  hideColumnAtMini(prop) {
    if (COLUMNS_TO_HIDE_MINI.indexOf(prop) > -1) {
      return true;
    }

    return false;
  }

  renderPercentage(prop, item) {
    return `${item[prop]}%`;
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
        sortBy={{prop: 'vip', order: 'desc'}}
        transition={false} />
    );
  }
}

module.exports = VIPsTable;
