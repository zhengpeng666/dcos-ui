/** @jsx React.DOM */

var React = require("react/addons");

var MesosStateActions = require("../actions/MesosStateActions");

var ServicesFilter = React.createClass({

  displayName: "ServicesFilter",

  propTypes: {
    filterString: React.PropTypes.string.isRequired
  },

  getDefaultProps: function () {
    return {
      filterString: ""
    };
  },

  handleSubmit: function () {
    var filterString = this.refs.filterInput.getDOMNode().value;

    MesosStateActions.setFilterString(filterString);
  },

  getFilterInputField: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <input
          type="text"
          className="form-control"
          placeholder="Filter for..."
          defaultValue={this.props.filterString}
          onChange={this.handleSubmit}
          ref="filterInput" />
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="filter-controls">
        {this.getFilterInputField()}
      </div>
    );
  }
});

module.exports = ServicesFilter;
