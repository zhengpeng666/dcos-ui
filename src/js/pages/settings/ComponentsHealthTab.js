import classNames from 'classnames';
import {Table} from 'reactjs-components';
import React from 'react';

import ResourceTableUtil from '../../utils/ResourceTableUtil';
import TableUtil from '../../utils/TableUtil';

const METHODS_TO_BIND = [
  'renderComponent',
  'renderHealth'
];

class ComponentsHealthTab extends React.Component {

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
        <col style={{width: '75%'}} />
        <col style={{width: '25%'}} />
      </colgroup>
    );
  }

  getColumns() {
    let classNameFn = ResourceTableUtil.getClassName;

    return [
      {
        cacheCell: true,
        className: classNameFn,
        headerClassName: classNameFn,
        prop: 'name',
        render: this.renderComponent,
        sortable: true,
        sortFunction: ResourceTableUtil.getPropSortFunction('id'),
        heading: ResourceTableUtil.renderHeading({name: 'NAME'})
      },
      {
        className: classNameFn,
        headerClassName: classNameFn,
        prop: 'health',
        render: this.renderHealth,
        sortable: true,
        sortFunction: ResourceTableUtil.getPropSortFunction('health'),
        heading: ResourceTableUtil.renderHeading({health: 'HEALTH'})
      }
    ];
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
        <span className="h4 inverse flush-top">Components</span>
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

module.exports = ComponentsHealthTab;
