import classNames from 'classnames';
import React from 'react';
import {Table} from 'reactjs-components';

let SDK = require('../SDK').getSDK();

let CompositeState = SDK.get('CompositeState');

let {StringUtil, FilterInputText} = SDK.get([
  'StringUtil', 'FilterInputText'
]);

const COLUMNS_TO_HIDE_MINI = [
  'failurePercent',
  'applicationReachabilityPercent',
  'machineReachabilityPercent'
];

const METHODS_TO_BIND = [
  'handleSearchStringChange',
  'alignTableCellRight'
];

const RIGHT_ALIGNED_TABLE_CELLS = [
  'successLastMinute',
  'failLastMinute',
  'p99Latency'
];

class BackendsTable extends React.Component {
  constructor() {
    super();

    this.state = {
      searchString: ''
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidMount() {
    this.mountedAt = Date.now();
  }

  alignTableCellRight(prop) {
    return RIGHT_ALIGNED_TABLE_CELLS.indexOf(prop) > -1;
  }

  getBackendsTable(backends) {
    return (
      <Table
        className="table table-borderless-outer table-borderless-inner-columns
          flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        containerSelector=".gm-scroll-view"
        data={backends}
        idAttribute="vip"

        sortBy={{prop: 'ip', order: 'desc'}} />
    );
  }

  getColumns() {
    let className = this.getTableCellClassName();
    let heading = this.renderHeading({
      ip: 'BACKEND NAME',
      successLastMinute: 'SUCCESSES',
      failLastMinute: 'FAILURES',
      p99Latency: '99TH% LATENCY'
    });

    return [
      {
        className,
        headerClassName: className,
        prop: 'ip',
        render: this.renderBackendName,
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'successLastMinute',
        render: this.getFailSuccessRender('success'),
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'failLastMinute',
        render: this.getFailSuccessRender('fail'),
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'p99Latency',
        render: this.renderPercentage,
        sortable: true,
        heading
      }
    ];
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '35%'}} />
        <col className="hidden-mini" />
        <col className="hidden-mini" />
      </colgroup>
    );
  }

  getFailSuccessRender(type) {
    let classes = classNames({
      'text-danger': type === 'fail',
      'text-success': type === 'success'
    });

    return function (prop, item) {
      return <span className={classes}>{item[prop]}</span>;
    };
  }

  getHeaderText(backends) {
    let numBackends = backends.length;
    return `${numBackends} ${StringUtil.pluralize('Backend', numBackends)}`;
  }

  getLoadingScreen() {
    return (
      <div className="container container-fluid container-pod text-align-center
        vertical-center inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getTableCellClassName() {
    let {alignTableCellRight, hideColumnAtMini} = this;

    return function (prop, sortBy, row) {
      return classNames({
        'text-align-right': alignTableCellRight(prop),
        'hidden-mini': hideColumnAtMini(prop),
        'highlight': prop === sortBy.prop,
        'clickable': row == null
      });
    };
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  hideColumnAtMini(prop) {
    return COLUMNS_TO_HIDE_MINI.indexOf(prop) > -1;
  }

  processBackends(backendsList) {
    return backendsList.getItems().map(function (backend) {
      return {
        ip: backend.getIP(),
        port: backend.getPort(),
        successLastMinute: backend.getSuccessLastMinute(),
        failLastMinute: backend.getFailLastMinute(),
        p99Latency: backend.getP99Latency(),
        taskID: backend.getTaskID(),
        frameworkID: backend.getFrameworkID()
      };
    });
  }

  renderBackendName(prop, item) {
    let selectedService = CompositeState.getServiceList()
      .filter({ids: [item.frameworkID]}) || [];

    let frameworkName = item.frameworkID;

    if (selectedService[0] && selectedService[0].name) {
      frameworkName = selectedService[0].name;
    }

    return (
      <div>
        <div className="backends-table-ip-address emphasize">
          {item.ip}:{item.port}
        </div>
        <div className="backends-table-task-details table-cell-details-secondary
          flex-box flex-box-align-vertical-center table-cell-flex-box
          deemphasize">
          <div className="backends-table-task-details-framework-id
            table-cell-value">
            <div className="text-overflow" title={item.frameworkID}>
              {frameworkName}
            </div>
          </div>
          <div className="backends-table-task-details-caret table-cell-icon">
            <i className="icon icon-sprite icon-sprite-mini icon-chevron flush" />
          </div>
          <div className="backends-table-task-details-task-id table-cell-value">
            <div className="text-overflow" title={item.taskID}>
              {item.taskID}
            </div>
          </div>
        </div>
      </div>
    );
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

  renderPercentage(prop, item) {
    return `${item[prop]}%`;
  }

  render() {
    let backends = this.processBackends(this.props.backends);

    if (this.state.searchString !== '') {
      backends = StringUtil.filterByString(backends, 'ip',
        this.state.searchString);
    }

    return (
      <div className="flex-container-col flex-grow">
        <h3 className="text-align-left flush-top">
          {this.getHeaderText(backends)}
        </h3>
        <div className="flex-box control-group">
          <FilterInputText
            searchString={this.state.searchString}
            handleFilterChange={this.handleSearchStringChange}
            inverseStyle={false} />
        </div>
        {this.getBackendsTable(backends)}
      </div>
    );
  }
}

module.exports = BackendsTable;
