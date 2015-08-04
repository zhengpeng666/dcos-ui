var classNames = require("classnames");
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

  getInitialState: function () {
    return {
      focus: false
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

  handleBlur: function () {
    this.setState({
      focus: false
    });
  },

  handleFocus: function () {
    this.setState({
      focus: true
    });
  },

  render: function () {
    var props = this.props;
    var clearIconClasses = classNames({
      "form-control-group-add-on form-control-group-add-on-append": true,
      "hidden": props.searchString.length === 0
    });

    var iconSearchClasses = classNames({
      "icon icon-mini icon-mini-white icon-search": true,
      "active": this.state.focus
    });

    return (
      <div className="form-group form-group-small filter-input-text-group">
        <div className="form-control form-control-small form-control-inverse form-control-group">
          <span className="form-control-group-add-on form-control-group-add-on-prepend">
            <i className={iconSearchClasses}></i>
          </span>
          <input
            type="text"
            className="form-control form-control-small form-control-inverse filter-input-text"
            placeholder="Filter"
            value={this.props.searchString}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
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
