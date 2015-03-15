/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");

var HealthTypes = require("../constants/HealthTypes");
var List = require("./List");

var ServiceList = React.createClass({

  displayName: "ServiceList",

  getInitialState: function () {
    return {
      servicesHealth: []
    };
  },

  getDefaultProps: function () {
    return {
      servicesHealth: []
    };
  },

  componentWillReceiveProps: function (nextProps) {
    var servicesHealth = this.mapSearvicesHealth(nextProps.servicesHealth);
    this.setState({servicesHealth: servicesHealth});
  },

  mapSearvicesHealth: function (servicesHealth) {
    var states = [
      {mapping: "SICK", value: "Sick", classes: {"text-danger": true}},
      {mapping: "HEALTHY", value: "Healthy", classes: {"text-success": true}},
      {mapping: "IDLE", value: "Idle", classes: {"text-warning": true}}
    ].map(function (obj, key) {
      obj.order = key;
      return obj;
    });

    var services = _.map(servicesHealth, function (service) {
      var state = _.find(states, function (obj) {
        return service.value === HealthTypes[obj.mapping];
      });
      return {
        title: {value: service.name},
        health: {value: state.value, classes: state.classes, textAlign: "right"}
      };
    });

    services.sort(function (a, b) {
      var order1 = _.findWhere(states, {value: a.health.value}).order;
      var order2 = _.findWhere(states, {value: b.health.value}).order;
      return order1 - order2;
    });

    return services;
  },

  render: function () {
    var listOrder = ["title", "health"];

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <List list={this.state.servicesHealth} order={listOrder} />
    );
  }
});

module.exports = ServiceList;
