/** @jsx React.DOM */

var React = require("react/addons");
var MesosStateStore = require("../stores/MesosStateStore");
var ServicesFilterActions = require("../actions/ServicesFilterActions");
var ServicesFilter = React.createClass({

  displayName: "ServicesFilter",

  getInitialState: function () {
    return {
      filterString: MesosStateStore.getFilterOptions().searchString
    };
  },

  handleSubmit: function () {
    var filterString = this.refs.filterInput.getDOMNode().value;

    ServicesFilterActions.setFilterString(filterString);
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(this.onChange);
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
