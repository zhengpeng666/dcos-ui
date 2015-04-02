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
    services: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  getServices: function (services) {
    return _.map(services, function (service) {
      var attributes = {};
      var state = STATES.NA;
      if (service.health != null) {
        state = STATES[service.health.key];

        if (service.health.key in [STATES.HEALTHY.key, STATES.UNHEALTHY.key]) {
            attributes["data-behavior"] = "show-tip";
            attributes["data-tip-place"] = "top-left";
        }

        if (service.health.key === STATES.HEALTHY.key) {
          attributes["data-tip-content"] = HealthTypesDescription.HEALTHY;
        } else if (service.health.key === STATES.UNHEALTHY.key) {
          attributes["data-tip-content"] = HealthTypesDescription.UNHEALTHY;
        }
      }

      return {
        title: {value: service.name},
        health: {
          value: HealthLabels[state.key],
          classes: state.classes,
          attributes: attributes,
          textAlign: "right"
        }
      };
    });
  },

  getNoServicesMessage: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="text-align-center vertical-center">
        <h2>No Services Running</h2>
        <p>Use the DCOS command line tools to find and install services.</p>
      </div>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getList: function () {
    var listOrder = ["title", "health"];

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <List
        list={this.getServices(this.props.services)}
        order={listOrder} />
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
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
