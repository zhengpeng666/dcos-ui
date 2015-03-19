/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");

var List = require("./List");

var STATES = {
  SICK: {value: "Sick", classes: {"text-danger": true}},
  HEALTHY: {value: "Healthy", classes: {"text-success": true}},
  IDLE: {value: "Idle", classes: {"text-warning": true}},
  NA: {value: "N/A", classes: {"text-mute": true}}
};

var ServiceList = React.createClass({

  displayName: "ServiceList",

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  getServices: function (services) {
    var displayServices = _.map(services, function (service) {
      var state = STATES.NA;
      if (service.health != null) {
        state = STATES[service.health.key];
      }

      return {
        title: {value: service.name},
        health: {value: state.value, classes: state.classes, textAlign: "right"}
      };
    });

    return displayServices;
  },

  render: function () {
    var listOrder = ["title", "health"];

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <List
        list={this.getServices(this.props.services)}
        order={listOrder} />
    );
  }
});

module.exports = ServiceList;
