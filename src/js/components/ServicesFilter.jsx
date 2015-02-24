/** @jsx React.DOM */

var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateStore = require("../stores/MesosStateStore");
var MesosStateActions = require("../actions/MesosStateActions");
var ServicesFilter = React.createClass({

  displayName: "ServicesFilter",

  getInitialState: function () {
    return {
      filterString: MesosStateStore.getFilterOptions().searchString
    };
  },

  handleSubmit: function () {
    var filterString = this.refs.filterInput.getDOMNode().value;

    MesosStateActions.setFilterString(filterString);
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
    this.setState({
      filterString: MesosStateStore.getFilterOptions().searchString
    });
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <input
        type="text"
        className="form-control"
        placeholder="Filter for..."
        defaultValue={this.state.filterString}
        onChange={this.handleSubmit}
        ref="filterInput" />
    );
  }
});

module.exports = ServicesFilter;
