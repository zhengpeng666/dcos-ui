var _ = require("underscore");
var classNames = require("classnames");
import {Link} from "react-router";
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var HealthLabels = require("../constants/HealthLabels");
var HealthTypes = require("../constants/HealthTypes");
var HealthTypesDescription = require("../constants/HealthTypesDescription");
var MarathonStore = require("../stores/MarathonStore");
var Maths = require("../utils/Maths");
var ResourceTableUtil = require("../utils/ResourceTableUtil");
var ServiceTableHeaderLabels = require("../constants/ServiceTableHeaderLabels");
var Table = require("./Table");
var TooltipMixin = require("../mixins/TooltipMixin");
var Units = require("../utils/Units");

var ServicesTable = React.createClass({

  displayName: "ServicesTable",

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
        <img className="icon icon-small border-radius"
          src={appImages["icon-small"]} />
      );
    }

    return (
      <div className="h5 flush-top flush-bottom">
        <Link to="services-panel"
          params={{serviceName: service.name}}>
          {imageTag}
        </Link>
        <Link to="services-panel"
          className="headline"
          params={{serviceName: service.name}}>
          {service[prop]}
        </Link>
      </div>
    );
  },

  renderHealth: function (prop, service) {
    let appHealth = MarathonStore.getServiceHealth(service.name);

    if (!this.props.healthProcessed) {
      return (
        <div className="loader-small ball-beat">
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }

    let statusClassSet = classNames({
      "text-success": appHealth.value === HealthTypes.HEALTHY,
      "text-danger": appHealth.value === HealthTypes.UNHEALTHY,
      "text-warning": appHealth.value === HealthTypes.IDLE,
      "text-mute": appHealth.value === HealthTypes.NA
    });

    let attributes = {};
    attributes["data-behavior"] = "show-tip";

    if (appHealth.value === HealthTypes.HEALTHY) {
      attributes["data-tip-content"] = HealthTypesDescription.HEALTHY;
    } else if (appHealth.value === HealthTypes.UNHEALTHY) {
      attributes["data-tip-content"] = HealthTypesDescription.UNHEALTHY;
    } else if (appHealth.value === HealthTypes.IDLE) {
      attributes["data-tip-content"] = HealthTypesDescription.IDLE;
    } else if (appHealth.value === HealthTypes.NA) {
      attributes["data-tip-content"] = HealthTypesDescription.NA;
    }

    return React.createElement(
      "span",
      _.extend({className: statusClassSet}, attributes),
      HealthLabels[appHealth.key]
    );

  },

  renderStats: function (prop, service) {
    var value = Maths.round(service.used_resources[prop], 2);
    if (prop !== "cpus") {
      value = Units.filesize(value * 1024 * 1024, 1);
    }

    return (
      <span>
        {value}
      </span>
    );
  },

  getColumns: function () {
    return [
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "name",
        render: this.renderHeadline,
        sortable: true,
        header: ResourceTableUtil.renderHeader(ServiceTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "health",
        render: this.renderHealth,
        sortable: true,
        header: ResourceTableUtil.renderHeader(ServiceTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "TASK_RUNNING",
        render: ResourceTableUtil.renderTask,
        sortable: true,
        header: ResourceTableUtil.renderHeader(ServiceTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "cpus",
        render: this.renderStats,
        sortable: true,
        header: ResourceTableUtil.renderHeader(ServiceTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "mem",
        render: this.renderStats,
        sortable: true,
        header: ResourceTableUtil.renderHeader(ServiceTableHeaderLabels)
      },
      {
        className: ResourceTableUtil.getClassName,
        headerClassName: ResourceTableUtil.getClassName,
        prop: "disk",
        render: this.renderStats,
        sortable: true,
        header: ResourceTableUtil.renderHeader(ServiceTableHeaderLabels)
      }
    ];
  },

  getColGroup: function () {
    return (
      <colgroup>
        <col />
        <col style={{width: "14%"}} />
        <col style={{width: "100px"}} />
        <col className="hidden-mini" style={{width: "100px"}} />
        <col className="hidden-mini" style={{width: "100px"}} />
        <col className="hidden-mini" style={{width: "100px"}} />
      </colgroup>
    );
  },

  render: function () {
    let marathonApps = MarathonStore.get("apps");

    return (
      <div>
        <Table
          className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
          columns={this.getColumns()}
          colGroup={this.getColGroup()}
          data={this.props.services.slice(0)}
          keys={["id"]}
          sortBy={{prop: "name", order: "desc"}}
          sortFunc={ResourceTableUtil.getSortFunction("name", {marathonApps})} />
      </div>
    );
  }
});

module.exports = ServicesTable;
