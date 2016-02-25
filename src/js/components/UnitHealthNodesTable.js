import React from 'react';
import {Table} from 'reactjs-components';

import ResourceTableUtil from '../utils/ResourceTableUtil';
import StringUtil from '../utils/StringUtil';
import TableUtil from '../utils/TableUtil';
import UnitHealthStore from '../stores/UnitHealthStore';
import UnitHealthUtil from '../utils/UnitHealthUtil';

const METHODS_TO_BIND = [
  'renderHealth',
  'renderHealthCheckName',
  'renderNode'
];

module.exports = class UnitHealthNodesTable extends React.Component {

  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '20%'}} />
        <col style={{width: '40%'}} />
        <col style={{width: '40%'}} />
      </colgroup>
    );
  }

  getColumns() {
    let classNameFn = ResourceTableUtil.getClassName;

    return [
      {
        className: classNameFn,
        headerClassName: classNameFn,
        heading: ResourceTableUtil.renderHeading({node_health: 'HEALTH'}),
        prop: 'node_health',
        render: this.renderHealth,
        sortable: true,
        sortFunction: UnitHealthUtil.getHealthSortFunction('node_id')
      },
      {
        className: classNameFn,
        headerClassName: classNameFn,
        heading: ResourceTableUtil.renderHeading({check: 'HEALTH CHECK NAME'}),
        prop: 'check',
        render: this.renderHealthCheckName
      },
      {
        className: classNameFn,
        headerClassName: classNameFn,
        heading: ResourceTableUtil.renderHeading({hostname: 'NODE'}),
        prop: 'hostname',
        render: this.renderNode,
        sortable: true,
        sortFunction: ResourceTableUtil.getPropSortFunction('hostname')
      }
    ];
  }

  getNodeLink(node, linkText) {
    let path = 'settings-system-units-unit-nodes-node-panel';
    let params = {unitID: this.props.itemID, unitNodeID: node.get('hostname')};

    return (
      <a
        className="emphasize clickable text-overflow"
        onClick={() => { this.props.parentRouter.transitionTo(path, params); }}
        title={linkText}>
        {linkText}
      </a>
    );
  }

  renderHealth(prop, node) {
    let health = node.getHealth();

    return (
      <span className={health.classNames}>
        {StringUtil.capitalize(health.title)}
      </span>
    );
  }

  renderHealthCheckName(prop, node) {
    let linkTitle = `${this.props.unit.get('unit_title')} Health Check`;
    return this.getNodeLink(node, linkTitle);
  }

  renderNode(prop, node) {
    return this.getNodeLink(node,
      (
        <span>
          {node.get(prop)}
          <span className="mute">
            {` (${StringUtil.capitalize(node.get('node_role'))})`}
          </span>
        </span>
      )
    );
  }

  render() {
    return (
      <Table
        className="table table-borderless-outer
          table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        containerSelector=".gm-scroll-view"
        data={this.props.nodes}
        idAttribute="id"
        itemHeight={TableUtil.getRowHeight()}
        sortBy={{prop: 'node_health', order: 'desc'}}
        />
    );
  }
};

// UnitHealthNodesTable.propTypes = {
//   nodes: React.PropTypes.array.isRequired
// };
