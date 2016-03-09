import classNames from 'classnames';
import React from 'react';
import {Table} from 'reactjs-components';

import CompositeState from '../../../src/js/structs/CompositeState';
import FilterInputText from '../../../src/js/components/FilterInputText';
import MesosStateStore from '../../../src/js/stores/MesosStateStore';
import StringUtil from '../../../src/js/utils/StringUtil';
import TableUtil from '../../../src/js/utils/TableUtil';

const METHODS_TO_BIND = [
  'alignTableCellRight',
  'handleSearchStringChange'
];

const RIGHT_ALIGNED_TABLE_CELLS = [
  'machineReachability'
];

class ClientsTable extends React.Component {
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

  getClientsTable(clients) {
    return (
      <Table
        className="table table-borderless-outer table-borderless-inner-columns
          flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        containerSelector=".gm-scroll-view"
        data={clients}
        idAttribute="vip"
        sortBy={{prop: 'ip', order: 'desc'}} />
    );
  }

  getColumns() {
    let className = this.getTableCellClassNameFn();
    let heading = this.renderHeading({
      ip: 'CLIENT',
      machineReachability: 'MACHINE REACHABILITY'
    });

    return [
      {
        className,
        headerClassName: className,
        prop: 'ip',
        sortable: true,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'machineReachability',
        render: this.renderMachineReachability,
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

  getFailSuccessRenderFn(type) {
    let classes = classNames({
      'text-danger': type === 'fail',
      'text-success': type === 'success'
    });

    return function (prop, item) {
      return <span className={classes}>{item[prop]}</span>;
    };
  }

  getHeaderText(clients) {
    let numClients = clients.length;
    return `${numClients} ${StringUtil.pluralize('Client', numClients)}`;
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

  getTableCellClassNameFn() {
    let {alignTableCellRight} = this;

    return function (prop, sortBy, row) {
      return classNames({
        'text-align-right': alignTableCellRight(prop),
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

  processClients(clientList) {
    return clientList.getItems().map(function (client) {
      return {
        ip: client.getIP(),
        machineReachability: client.getMachineReachability()
      };
    });
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

  renderMachineReachability(prop, item) {
    let value = item[prop];
    if (value) {
      return 'Reachable';
    }
    return 'Unreachable';
  }

  renderPercentage(prop, item) {
    return `${item[prop]}%`;
  }

  render() {
    let {state} = this;
    let clients = this.processClients(this.props.clients);

    if (state.searchString !== '') {
      clients = StringUtil.filterByString(clients, 'ip',
        this.state.searchString);
    }

    return (
      <div className="flex-container-col flex-grow">
        <h3 className="text-align-left flush-top">
          {this.getHeaderText(clients)}
        </h3>
        <div className="flex-box control-group">
          <FilterInputText
            searchString={state.searchString}
            handleFilterChange={this.handleSearchStringChange}
            inverseStyle={false} />
        </div>
        {this.getClientsTable(clients)}
      </div>
    );
  }
}

module.exports = ClientsTable;
