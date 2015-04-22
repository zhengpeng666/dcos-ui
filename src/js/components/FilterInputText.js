/** @jsx React.DOM */

var React = require("react/addons");

var FilterInputText = React.createClass({

  displayName: "FilterInputText",

  propTypes: {
    searchString: React.PropTypes.string.isRequired,
    handleFilterChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      searchString: ""
    };
  },

  handleChange: function (e) {
    e.preventDefault();
    this.props.handleFilterChange(this.refs.filterInput.getDOMNode().value);
  },

  handleClearInput: function (e) {
    e.preventDefault();
    this.props.handleFilterChange("");
  },

  render: function () {
    var props = this.props;
    var clearIconClasses = React.addons.classSet({
      "form-control-group-add-on form-control-group-add-on-append": true,
      "hidden": props.searchString.length === 0
    });

    return (
      <div className="form-group form-group-small filter-input-text-group">
        <div className="form-control form-control-small form-control-inverse form-control-group">
          <span className="form-control-group-add-on form-control-group-add-on-prepend">
            <i className="icon icon-mini icon-search"></i>
          </span>
          <input
            type="text"
            className="form-control form-control-small form-control-inverse filter-input-text"
            placeholder="Filter for..."
            value={this.props.searchString}
            onChange={this.handleChange}
            ref="filterInput" />
          <span className={clearIconClasses}>
            <a href="#" onClick={this.handleClearInput}>
              <i className="icon icon-mini icon-mini-white icon-close"></i>
            </a>
          </span>
        </div>
      </div>
    );
  }
});

module.exports = FilterInputText;
