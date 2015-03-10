/** @jsx React.DOM */

var React = require("react/addons");

var FilterInputText = React.createClass({

  displayName: "FilterInputText",

  propTypes: {
    searchString: React.PropTypes.string.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      searchString: ""
    };
  },

  handleChange: function (e) {
    e.preventDefault();
    this.props.onSubmit(this.refs.filterInput.getDOMNode().value);
  },

  getFilterInputField: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <input
          type="text"
          className="form-control"
          placeholder="Filter for..."
          defaultValue={this.props.searchString}
          onChange={this.handleChange}
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

module.exports = FilterInputText;
