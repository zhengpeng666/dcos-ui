/** @jsx React.DOM */

var React = require("react/addons");
var Router = require("react-router");
var _ = require("underscore");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var ServiceItem = require("./ServiceItem");

function getMesosServices() {
  var mesosState = MesosStateStore.getLatest();

  if (MesosStateStore.hasFilter()) {
    mesosState = MesosStateStore.getFiltered();
  }

  return {
    collection: mesosState.frameworks || [],
    totalResources: mesosState.totalResources || {}
  };
}

var ServicesList = React.createClass({

  displayName: "ServicesList",

  mixins: [Router.State],

  getInitialState: function () {
    return getMesosServices();
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onChange
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onChange
    );
  },

  onChange: function () {
    this.setState(getMesosServices());
  },

  getServiceItems: function () {
    var totalResources = this.state.totalResources;

    return _.map(this.state.collection, function (service) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <ServiceItem
            key={service.id}
            model={service}
            totalResources={totalResources} />
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <ul className="collection-list list-unstyled inverse">
        {this.getServiceItems()}
      </ul>
    );
  }
});

module.exports = ServicesList;
