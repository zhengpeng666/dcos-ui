/** @jsx React.DOM */

var React = require("react/addons");

var FilterInputText = React.createClass({

  displayName: "FilterInputText",

  propTypes: {
    searchString: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      searchString: ""
    };
  },

  handleChange: function (e) {
    e.preventDefault();
    this.props.onChange(this.refs.filterInput.getDOMNode().value);
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="form-group">
        <input
          type="text"
          className="form-control filter-input-text form-control-inverse"
          placeholder="Filter for..."
          value={this.props.searchString}
          onChange={this.handleChange}
          ref="filterInput" />
      </div>
    );
  }
});

module.exports = FilterInputText;
