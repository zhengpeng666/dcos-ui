var _ = require('underscore');
import {Link} from 'react-router';
var React = require('react');

import Cluster from '../utils/Cluster';
var EventTypes = require('../constants/EventTypes');
var HealthLabels = require('../constants/HealthLabels');
var HealthTypesDescription = require('../constants/HealthTypesDescription');
var MarathonStore = require('../stores/MarathonStore');
var ResourceTableUtil = require('../utils/ResourceTableUtil');
var ServiceTableHeaderLabels = require('../constants/ServiceTableHeaderLabels');
import {Table} from 'reactjs-components';
import TableUtil from '../utils/TableUtil';
var TooltipMixin = require('../mixins/TooltipMixin');
var Units = require('../utils/Units');

var ServicesTable = React.createClass({

  displayName: 'ServicesTable',

  mixins: [TooltipMixin],

  propTypes: {
    services: React.PropTypes.array.isRequired,
    healthProcessed: React.PropTypes.bool.isRequired
  },

  componentDidMount: function () {
    MarathonStore.addChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonAppsChange
    );
  },

  componentWillUnmount: function () {
    MarathonStore.removeChangeListener(
      EventTypes.MARATHON_APPS_CHANGE,
      this.onMarathonAppsChange
    );
  },

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  onMarathonAppsChange: function () {
    this.forceUpdate();
  },

  renderHeadline: function (prop, service) {
    let appImages = MarathonStore.getServiceImages(service.name);
    let imageTag = null;

    if (appImages) {
      imageTag = (
        <span className="icon icon-small icon-image-container icon-app-container">
          <img src={appImages['icon-small']} />
        </span>
      );
    }

    return (
      <div className="service-table-heading flex-box flex-box-align-vertical-center
        table-cell-flex-box">
        <Link to="services-panel"
          className="table-cell-icon"
          params={{serviceName: service.name}}>
          {imageTag}
        </Link>
        <Link to="services-panel"
          className="headline table-cell-value flex-box flex-box-col"
          params={{serviceName: service.name}}>
          <span className="text-overflow">
            {service[prop]}
          </span>
        </Link>
        <a
          className="table-display-on-row-hover"
          href={Cluster.getServiceLink(service.name)}
          target="_blank"
          title="Open in a new window"
          >
          <i className="icon icon-align-right icon-margin-wide icon-sprite
            icon-sprite-small icon-new-window icon-sprite-small-white"></i>
        </a>
      </div>
    );
  },

  renderHealth: function (prop, service) {
    let appHealth = service.getHealth();

    if (!this.props.healthProcessed) {
      return (
        <div className="loader-small ball-beat">
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }

    let attributes = {};
    attributes['data-behavior'] = 'show-tip';
    attributes['data-tip-content'] = HealthTypesDescription[appHealth.key];

    return React.createElement(
      'span',
      _.extend({className: appHealth.classNames}, attributes),
      HealthLabels[appHealth.key]
    );

  },

  renderStats: function (prop, service) {
    return (
      <span>
        {Units.formatResource(prop, service.used_resources[prop])}
      </span>
    );
  },

  getColumns: function () {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading(ServiceTableHeaderLabels);
    let propSortFunction = ResourceTableUtil.getPropSortFunction('id');
    let statSortFunction = ResourceTableUtil.getStatSortFunction(
      'id',
      function (service, resource) {
        return service.getUsageStats(resource).value;
      }
    );

    return [
      {
        className,
        headerClassName: className,
        prop: 'name',
        render: this.renderHeadline,
        sortable: true,
        sortFunction: propSortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'health',
        render: this.renderHealth,
        sortable: true,
        sortFunction: propSortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'TASK_RUNNING',
        render: ResourceTableUtil.renderTask,
        sortable: true,
        sortFunction: propSortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'cpus',
        render: this.renderStats,
        sortable: true,
        sortFunction: statSortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'mem',
        render: this.renderStats,
        sortable: true,
        sortFunction: statSortFunction,
        heading
      },
      {
        className,
        headerClassName: className,
        prop: 'disk',
        render: this.renderStats,
        sortable: true,
        sortFunction: statSortFunction,
        heading
      }
    ];
  },

  getColGroup: function () {
    return (
      <colgroup>
        <col />
        <col style={{width: '14%'}} />
        <col style={{width: '100px'}} />
        <col className="hidden-mini" style={{width: '120px'}} />
        <col className="hidden-mini" style={{width: '120px'}} />
        <col className="hidden-mini" style={{width: '120px'}} />
      </colgroup>
    );
  },

  render: function () {
    return (
      <div>
        <Table
          buildRowOptions={this.getRowAttributes}
          className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={this.props.services.slice()}
          itemHeight={TableUtil.getRowHeight()}
          containerSelector=".gm-scroll-view"
          sortBy={{prop: 'name', order: 'desc'}} />
      </div>
    );
  }
});

module.exports = ServicesTable;
