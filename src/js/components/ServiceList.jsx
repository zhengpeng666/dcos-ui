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
    var servicesHealth = this.mapServicesHealth(nextProps.servicesHealth);
    this.setState({servicesHealth: servicesHealth});
  },

  mapServicesHealth: function (servicesHealth) {
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
      <List list={this.state.servicesHealth} order={listOrder} />
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getContent: function () {
    if (this.state.servicesHealth.length === 0) {
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
