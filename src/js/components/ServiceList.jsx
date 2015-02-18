/** @jsx React.DOM */

var React = require("react/addons");
var Router = require("react-router");
var _ = require("underscore");

var MesosStateStore = require("../stores/MesosStateStore");
var ServiceItem = require("./ServiceItem");

function getMesosServices() {
  return {
    collection: MesosStateStore.getAll().frameworks || []
  };
}

var ServicesList = React.createClass({

  displayName: "ServicesList",

  mixins: [Router.State],

  getInitialState: function () {
    return getMesosServices();
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(getMesosServices());
  },

  getServiceItems: function () {
    return _.map(this.state.collection, function (service) {
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <ServiceItem key={service.id} model={service} />
      );
    });
  },

  render: function () {

    var classes = {
      "table": true
    };

    if (this.props.className != null) {
      classes[this.props.className] = true;
    }

    var classSet = React.addons.classSet(classes);

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <table className={classSet}>
        <thead>
          <td>Status</td>
          <td>Completed Tasks</td>
          <td>Hostname</td>
          <td>Id</td>
          <td>Name</td>
          <td>Offers</td>
          <td>Resource</td>
          <td>Tasks</td>
          <td>User</td>
        </thead>
        <tbody>
          {this.getServiceItems()}
        </tbody>
      </table>
    );
  }
});

module.exports = ServicesList;
