import classNames from 'classnames';
import React from 'react';
import {Table} from 'reactjs-components';

import PackagesTableHeaderLabels from '../constants/PackagesTableHeaderLabels';
import ResourceTableUtil from '../utils/ResourceTableUtil';
import UniversePackagesList from '../structs/UniversePackagesList';

const METHODS_TO_BIND = [
  'getHeadline'
];

class PackagesTable extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getHeadline(prop, cosmosPackage) {
    let packageImages = cosmosPackage.getIcons();
    return (
      <div className="package-table-heading flex-box flex-box-align-vertical-center
        table-cell-flex-box">
        <span className="icon icon-small icon-image-container icon-app-container">
          <img src={packageImages['icon-small']} />
        </span>
        <span className="text-overflow">
          {this.getProp(prop, cosmosPackage)}
        </span>
      </div>
    );
  }

  getProp(prop, cosmosPackage) {
    return cosmosPackage.get('packageDefinition')[prop];
  }

  getClassName(prop, sortBy, row) {
    return classNames({
      'text-align-right': true,
      'highlight': prop === sortBy.prop,
      'clickable': row == null // this is a header
    });
  }

  getColumns() {
    let getClassName = this.getClassName;
    let heading = ResourceTableUtil.renderHeading(PackagesTableHeaderLabels);
    let sortFunction = ResourceTableUtil
      .getStatSortFunction('name', function (cosmosPackage, prop) {
        return cosmosPackage.get('packageDefinition')[prop];
      });

    return [
      {
        getClassName,
        headerClassName: getClassName,
        prop: 'name',
        render: this.getHeadline,
        sortable: true,
        sortFunction: sortFunction,
        heading
      },
      {
        getClassName,
        headerClassName: getClassName,
        prop: 'version',
        render: this.getProp,
        sortable: true,
        sortFunction: sortFunction,
        heading
      }
    ];
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col className="hidden-mini" style={{width: '120px'}} />
      </colgroup>
    );
  }

  render() {
    return (
      <Table
        className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        data={this.props.packages.getItems().slice()}
        sortBy={{prop: 'name', order: 'desc'}} />
    );
  }
}

PackagesTable.defaultProps = {
  packages: new UniversePackagesList()
};

PackagesTable.propTypes = {
  packages: React.PropTypes.object.isRequired
};

module.exports = PackagesTable;
