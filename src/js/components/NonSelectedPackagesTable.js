import classNames from 'classnames';
import {Table} from 'reactjs-components';
import mixin from 'reactjs-mixin';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import TableUtil from '../utils/TableUtil';
import UniversePackagesList from '../structs/UniversePackagesList';

const METHODS_TO_BIND = [
  'getDeployButton',
  'getHeadline'
];

class NonSelectedPackagesTable extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
    };

    this.store_listeners = [
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getClassName(prop, sortBy, row) {
    return classNames({
      'highlight': prop === sortBy.prop,
      'clickable': prop === 'appId' && row == null // this is a header
    });
  }

  getColumns() {
    let getClassName = this.getClassName;
    let heading = this.getHeader;
    let sortFunction = TableUtil
      .getSortFunction('appId', function (cosmosPackage, prop) {
        if (prop === 'appId') {
          return cosmosPackage.get('appId');
        }

        return cosmosPackage.get('packageDefinition')[prop];
      });

    return [
      {
        className: getClassName,
        headerClassName: getClassName,
        heading,
        prop: 'name',
        render: this.getHeadline,
        sortable: false,
        sortFunction
      },
      {
        className: getClassName,
        headerClassName: getClassName,
        heading: function () {},
        prop: 'deploy',
        render: this.getDeployButton,
        sortable: false
      }
    ];
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col style={{width: '120px'}} />
      </colgroup>
    );
  }

  getHeadline(prop, cosmosPackage) {
    let packageImages = cosmosPackage.getIcons();
    let name = cosmosPackage.get('name');

    // Remove initial slash if present
    if (name.charAt(0) === '/') {
      name = name.slice(1);
    }

    return (
      <div className="media-object-spacing-wrapper clickable" onClick={this.handleDetailOpen.bind(this, cosmosPackage)}>
        <div className="media-object media-object-align-middle">
          <div className="media-object-item">
            <div className="icon icon-large icon-image-container icon-app-container">
              <img src={packageImages['icon-large']} />
            </div>
          </div>
          <div className="media-object-item">
            <h2 className="inverse flush">
              {name}
            </h2>
            <p style={{marginTop: '5px', opacity: '0.5', marginBottom: '8px'}}>{cosmosPackage.get('currentVersion')}</p>
          </div>
        </div>
      </div>
    );
  }

  getHeader() {
    return null;
  }

  getDeployButton(prop, packageToDeploy) {
    return (
      <div className="flex-align-right">
        <button
          className="button button-success"
          onClick={this.props.onDeploy.bind(this, packageToDeploy)}>
          Deploy
        </button>
      </div>
    );
  }

  handleDetailOpen(cosmosPackage, event) {
    event.stopPropagation();
    this.props.router.transitionTo(
      'universe-packages-detail',
      {packageName: cosmosPackage.get('name')},
      {version: cosmosPackage.get('currentVersion')}
    );
  }

  render() {
    return (
      <Table
        className="table no-header inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        data={this.props.packages.getItems().slice()} />
    );
  }
}

NonSelectedPackagesTable.defaultProps = {
  packages: new UniversePackagesList()
};

NonSelectedPackagesTable.propTypes = {
  packages: React.PropTypes.object.isRequired
};

module.exports = NonSelectedPackagesTable;
