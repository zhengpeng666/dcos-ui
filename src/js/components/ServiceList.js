/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");

var HealthLabels = require("../constants/HealthLabels");
var HealthTypesDescription = require("../constants/HealthTypesDescription");
var List = require("./List");

var STATES = {
  UNHEALTHY: {key: "UNHEALTHY", classes: {"text-danger": true}},
  HEALTHY: {key: "HEALTHY", classes: {"text-success": true}},
  IDLE: {key: "IDLE", classes: {"text-warning": true}},
  NA: {key: "NA", classes: {"text-mute": true}}
};

var ServiceList = React.createClass({

  displayName: "ServiceList",

  propTypes: {
    services: React.PropTypes.array.isRequired,
    healthProcessed: React.PropTypes.bool.isRequired
  },

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  shouldComponentUpdate: function (nextProps) {
    return !_.isEqual(this.props, nextProps);
  },

  getServices: function (services, healthProcessed) {
    return _.map(services, function (service) {
      var attributes = {};
      var state = STATES.NA;
      var title = service.name;

      if (service.health != null) {
        state = STATES[service.health.key];

        attributes["data-behavior"] = "show-tip";
        attributes["data-tip-place"] = "top-left";

        if (service.health.key === STATES.HEALTHY.key) {
          attributes["data-tip-content"] = HealthTypesDescription.HEALTHY;
        } else if (service.health.key === STATES.UNHEALTHY.key) {
          attributes["data-tip-content"] = HealthTypesDescription.UNHEALTHY;
        } else if (service.health.key === STATES.IDLE.key) {
          attributes["data-tip-content"] = HealthTypesDescription.IDLE;
        } else if (service.health.key === STATES.NA.key) {
          attributes["data-tip-content"] = HealthTypesDescription.NA;
        }
      }

      var health = HealthLabels[state.key];
      if (!healthProcessed) {
        health = (
          <div className="loader-small ball-beat">
            <div></div>
            <div></div>
            <div></div>
          </div>
        );
      }

      if (service.webui_url && service.webui_url.length > 0) {
        title = (
          <a href={service.webui_url} className="h3">
            {service.name}
          </a>
        );
      }

      return {
        title: {
          value: title
        },
        health: {
          value: health,
          classes: state.classes,
          attributes: attributes,
          textAlign: "right"
        }
      };
    });
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
    var listOrder = ["title", "health"];

    return (
      <div className="service-list-component">
        <List
          list={this.getServices(this.props.services, this.props.healthProcessed)}
          order={listOrder} />
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
    return this.getContent();
  }
});

module.exports = ServiceList;
