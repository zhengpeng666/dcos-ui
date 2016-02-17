import _ from 'underscore';
import classNames from 'classnames';
import {Link} from 'react-router';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';
import {Table} from 'reactjs-components';

import ComponentHealthStore from '../../stores/ComponentHealthStore';
import FilterHeadline from '../../components/FilterHeadline';
import FilterButtons from '../../components/FilterButtons';
import FilterInputText from '../../components/FilterInputText';
import ResourceTableUtil from '../../utils/ResourceTableUtil';
import StringUtil from '../../utils/StringUtil';
import TableUtil from '../../utils/TableUtil';

const METHODS_TO_BIND = [
  'getHandleHealthFilterChange',
  'handleSearchStringChange',
  'renderComponent',
  'renderHealth',
  'resetFilter'
];

class ComponentsHealthTab extends mixin(StoreMixin) {

  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'componentHealth',
        events: ['success', 'error', 'reportSuccess', 'reportError']
      }
    ];

    this.state = {
      healthFilter: 'all',
      searchString: ''
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidMount() {
    super.componentDidMount();
    ComponentHealthStore.fetchComponents();
    ComponentHealthStore.fetchReport();
  }

  handleHealthReportClick() {
    console.log(ComponentHealthStore.get('report'));
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  renderComponent(prop, component) {
    return (
      <div>
        <Link to="settings-system-components"
          className="headline">
          {component[prop]}
        </Link>
      </div>
    );
  }

  renderHealth(prop, component) {
    let health = component.getHealth();

    return (
      <span className={health.classNames}>
        {StringUtil.capitalize(health.title)}
      </span>
    );
  }

  getButtonContent(filterName, count) {
    let dotClassSet = classNames({
      'dot': filterName !== 'all',
      'danger': filterName === 'unhealthy',
      'success': filterName === 'healthy'
    });

    return (
      <span className="button-align-content">
        <span className={dotClassSet}></span>
        <span className="label">{StringUtil.capitalize(filterName)}</span>
        <span className="badge">{count}</span>
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

  getHandleHealthFilterChange(healthFilter) {
    return () => {
      this.setState({healthFilter});
    };
  }

  getVisibleData(data) {
    let {healthFilter, searchString} = this.state;
    let filteredData = data;
    healthFilter = healthFilter.toLowerCase();
    searchString = searchString.toLowerCase();

    if (healthFilter !== 'all') {
      filteredData = _.filter(filteredData, function (datum) {
        return datum.getHealth().title.toLowerCase() === healthFilter;
      });
    }

    if (searchString !== '') {
      filteredData = _.filter(filteredData, function (datum) {
        let name = datum.get('name').toLowerCase();
        return name.indexOf(searchString) > -1;
      });
    }

    return filteredData;
  }

  resetFilter() {
    this.setState({
      searchString: '',
      healthFilter: 'all'
    });
  }

  render() {
    let data = ComponentHealthStore.get('components').getItems();
    let state = this.state;
    let visibleData = this.getVisibleData(data);
    let pluralizedItemName = StringUtil.pluralize('Component', data.length);
    let dataHealth = data.map(function (component) {
      return component.getHealth();
    });

    return (
      <div className="flex-container-col">
        <div className="components-health-table-header">
          <FilterHeadline
            onReset={this.resetFilter}
            name={pluralizedItemName}
            currentLength={visibleData.length}
            totalLength={data.length} />
          <ul className="list list-unstyled list-inline flush-bottom">
            <li>
              <FilterButtons
                renderButtonContent={this.getButtonContent}
                filters={['all', 'healthy', 'unhealthy']}
                filterByKey={'title'}
                getfilterChangeHandler={this.getHandleHealthFilterChange}
                itemList={dataHealth}
                selectedFilter={state.healthFilter} />
            </li>
            <li>
              <FilterInputText
                searchString={state.searchString}
                handleFilterChange={this.handleSearchStringChange}
                inverseStyle={true} />
            </li>
            <li className="button-collection list-item-aligned-right">
              <a
                className="button button-primary"
                onClick={this.handleHealthReportClick}>
                Download Health
              </a>
            </li>
          </ul>
        </div>
        <div className="page-content-fill flex-grow flex-container-col">
          <Table
            className="table inverse table-borderless-outer
              table-borderless-inner-columns flush-bottom"
            columns={this.getColumns()}
            colGroup={this.getColGroup()}
            containerSelector=".gm-scroll-view"
            data={visibleData}
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
