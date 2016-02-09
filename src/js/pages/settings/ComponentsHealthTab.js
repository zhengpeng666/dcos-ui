import classNames from 'classnames';
import {Table} from 'reactjs-components';
import React from 'react';

import ResourceTableUtil from '../../utils/ResourceTableUtil';
import TableUtil from '../../utils/TableUtil';

const METHODS_TO_BIND = [
  'renderComponent',
  'renderHealth'
];

export default class ComponentsHealthTab extends React.Component {

  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);
  }

  renderComponent(prop, component) {
    return (
      <div>
        {component[prop]}
      </div>
    );
  }

  renderHealth(prop, component) {

    let health = component[prop];

    let statusClassSet = classNames({
      'text-success': health === 'ok',
      'text-warning': health === 'warn',
      'text-danger': health === 'critical',
      'text-mute': health === 'unknown'
    });

    return (
      <span className={statusClassSet}>
        {component[prop]}
      </span>
    );
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col />
      </colgroup>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;

    let columns = [
      {
        cacheCell: true,
        className,
        headerClassName: className,
        prop: 'name',
        render: this.renderComponent,
        sortable: true,
        sortFunction: ResourceTableUtil.getPropSortFunction('id'),
        heading: ResourceTableUtil.renderHeading({name: 'NAME'})
      },
      {
        className,
        headerClassName: className,
        prop: 'health',
        render: this.renderHealth,
        sortable: true,
        sortFunction: ResourceTableUtil.getPropSortFunction('health'),
        heading: ResourceTableUtil.renderHeading({health: 'HEALTH'})
      }
    ];

    return columns;
  }

  getData() {
    // for demo until stores are created
    return [
      {
        'id': 'mesos',
        'name': 'Mesos',
        'version': '0.27.1',
        'health': 'critical'
      },
      {
        'id': 'service-manager',
        'name': 'Service Manager',
        'version': '0.0.1',
        'health': 'ok'
      }
    ];
  }

  render() {
    return (
      <div className="flex-container-col">
        <h3 className="h4 inverse flush-top">Components</h3>
        <div className="page-content-fill flex-grow flex-container-col">
          <Table
            className="table inverse table-borderless-outer
              table-borderless-inner-columns flush-bottom"
            columns={this.getColumns()}
            colGroup={this.getColGroup()}
            containerSelector=".gm-scroll-view"
            data={this.getData().slice()}
            idAttribute="id"
            itemHeight={TableUtil.getRowHeight()}
            sortBy={{prop: 'health', order: 'desc'}}
            />
        </div>
      </div>
    );
  }
}
