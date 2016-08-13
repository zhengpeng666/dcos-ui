import classNames from 'classnames';
import {Link} from 'react-router';
import React from 'react';

import CheckboxTable from './CheckboxTable';
import ResourceTableUtil from '../utils/ResourceTableUtil';
import TableUtil from '../utils/TableUtil';

const METHODS_TO_BIND = [
  'onCheckboxChange'
];

class PodTable extends React.Component {
  constructor() {
    super();

    this.state = {
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  onCheckboxChange(checkedIDs) {
    console.log('checked IDs:', checkedIDs);
  }

  renderHeadline(prop, task) {
    let title = task.id;
    let params = this.props.parentRouter.getCurrentParams();
    let routeParams = Object.assign({taskID: task.id}, params);

    let linkTo = 'services-task-details';
    if (params.nodeID != null) {
      linkTo = 'nodes-task-details';
    }

    return (
      <div className="flex-box flex-box-align-vertical-center
        table-cell-flex-box">
        <div className="table-cell-value flex-box flex-box-col">
          <Link
            className="emphasize clickable text-overflow"
            to={linkTo}
            params={routeParams}
            title={title}>
            {title}
          </Link>
        </div>
      </div>
    );
  }

  getColumns() {
    let sortFunction = ResourceTableUtil.getSortFunction('id');
    let className = '';
    let heading = '';

    return [
      {
        className,
        headerClassName: '',
        heading,
        prop: 'id',
        render: this.renderHeadline,
        sortable: true,
        sortFunction
      },
      {
        className,
        headerClassName: className,
        heading,
        prop: 'host',
        render: this.renderHost,
        sortable: true,
        sortFunction
      },
      {
        cacheCell: true,
        className,
        getValue: this.getStatusValue,
        headerClassName: className,
        heading,
        prop: 'status',
        render: this.renderStatus,
        sortable: true,
        sortFunction
      },
      {
        cacheCell: true,
        className,
        headerClassName: className,
        heading,
        prop: 'log',
        render: this.renderLog,
        sortable: false,
        sortFunction
      },
      {
        cacheCell: true,
        className,
        getValue: this.getStatValue,
        headerClassName: className,
        heading,
        prop: 'cpus',
        render: this.renderStats,
        sortable: true,
        sortFunction
      },
      {
        cacheCell: true,
        className,
        getValue: this.getStatValue,
        headerClassName: className,
        heading,
        prop: 'mem',
        render: this.renderStats,
        sortable: true,
        sortFunction
      },
      {
        className,
        headerClassName: className,
        heading,
        prop: 'updated',
        render: ResourceTableUtil.renderUpdated,
        sortable: true,
        sortFunction
      },
      {
        cacheCell: true,
        className,
        getValue: this.getVersionValue,
        headerClassName: className,
        heading,
        prop: 'version',
        render: this.renderVersion,
        sortable: true,
        sortFunction: TableUtil.getSortFunction('id', (task) => {
          let version = this.getVersionValue(task);
          if (version == null) {
            return null;
          }

          return new Date(version);
        })
      }
    ];
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '40px'}} />
        <col />
        <col style={{width: '15%'}} className="hidden-mini" />
        <col style={{width: '105px'}} />
        <col style={{width: '40px'}} className="hidden-medium hidden-small hidden-mini" />
        <col style={{width: '85px'}} className="hidden-mini" />
        <col style={{width: '85px'}} className="hidden-mini" />
        <col style={{width: '120px'}} />
        <col style={{width: '110px'}} className="hidden-medium hidden-small hidden-mini"/>
      </colgroup>
    );
  }

  render() {
    let checkedItemsMap = {};
    let className = '';
    let data = [];//this.props.pod.instances.getItems();

    return (
      <CheckboxTable
        checkedItemsMap={checkedItemsMap}
        className={className}
        columns={this.getColumns()}
        data={data}
        getColGroup={this.getColGroup}
        onCheckboxChange={this.onCheckboxChange}
        sortBy={{prop: 'updated', order: 'desc'}}
        sortOrder="desc"
        sortProp="updated"
        uniqueProperty="id" />
    );
  }

}

PodTable.defaultProps = {
};

PodTable.propTypes = {
};

module.exports = PodTable;
