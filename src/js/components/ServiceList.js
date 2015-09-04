const _ = require("underscore");
import {List} from "reactjs-components";
const React = require("react/addons");

const HealthLabels = require("../constants/HealthLabels");
const HealthStatus = require("../constants/HealthStatus");
const HealthTypesDescription = require("../constants/HealthTypesDescription");
const MarathonStore = require("../stores/MarathonStore");
const TooltipMixin = require("../mixins/TooltipMixin");

let ServiceList = React.createClass({

  displayName: "ServiceList",

  propTypes: {
    services: React.PropTypes.array.isRequired,
    healthProcessed: React.PropTypes.bool.isRequired
  },

  mixins: [TooltipMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    var changedState =
      nextState !== undefined && !_.isEqual(this.state, nextState);

    return !_.isEqual(this.props, nextProps) || changedState;
  },

  handleServiceClick: function (serviceName) {
    this.context.router.transitionTo("dashboard-panel", {serviceName});
  },

  getServices: function (services, healthProcessed) {
    return _.map(services, function (service) {
      let appHealth = MarathonStore.getServiceHealth(service.name);
      let attributes = {};
      let state = HealthStatus.NA;

      if (appHealth != null) {
        state = HealthStatus[appHealth.key];

        attributes["data-behavior"] = "show-tip";
        attributes["data-tip-place"] = "top-left";

        if (appHealth.key === HealthStatus.HEALTHY.key) {
          attributes["data-tip-content"] = HealthTypesDescription.HEALTHY;
        } else if (appHealth.key === HealthStatus.UNHEALTHY.key) {
          attributes["data-tip-content"] = HealthTypesDescription.UNHEALTHY;
        } else if (appHealth.key === HealthStatus.IDLE.key) {
          attributes["data-tip-content"] = HealthTypesDescription.IDLE;
        } else if (appHealth.key === HealthStatus.NA.key) {
          attributes["data-tip-content"] = HealthTypesDescription.NA;
        }
      }

      let healthLabel = HealthLabels[state.key];
      if (!healthProcessed) {
        healthLabel = (
          <div className="loader-small ball-beat">
            <div></div>
            <div></div>
            <div></div>
          </div>
        );
      }

      let classSet = `h3 flush-top flush-bottom text-align-right ${state.classNames}`;
      return {
        value: [
          (
            <a key="title"
              onClick={this.handleServiceClick.bind(this, service.name)}
              className="h3 flush-top flush-bottom clickable">
              {service.name}
            </a>
          ),
          (
            <div key="health" className={classSet} {...attributes}>
              {healthLabel}
            </div>
          )
        ]
      };
    }, this);
  },

  getNoServicesMessage: function () {
    return (
      <div className="text-align-center vertical-center">
        <h2>No Services Running</h2>
        <p>Use the DCOS command line tools to find and install services.</p>
      </div>
    );
  },

  getList: function () {
    let props = this.props;

    return (
      <div className="service-list-component">
        <List
          className="list-unstyled"
          items={this.getServices(props.services, props.healthProcessed)} />
      </div>
    );
  },

  getContent: function () {
    if (this.props.services.length === 0) {
      return this.getNoServicesMessage();
    } else {
      return this.getList();
    }
  },

  render: function () {
    return (
      <div>
        {this.getContent()}
      </div>
    );
  }
});

module.exports = ServiceList;
