var classNames = require("classnames");
var React = require("react/addons");

var FilterInputText = React.createClass({

  displayName: "FilterInputText",

  propTypes: {
    handleFilterChange: React.PropTypes.func.isRequired,
    inverseStyle: React.PropTypes.bool,
    searchString: React.PropTypes.string.isRequired
  },

  getDefaultProps: function () {
    return {
      searchString: "",
      inverseStyle: false
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
    var clearIconContainerClasses = classNames({
      "form-control-group-add-on form-control-group-add-on-append": true,
      "hidden": props.searchString.length === 0
    });

    var clearIconClasses = classNames({
      "icon icon-mini icon-close": true,
      "icon-mini-white": this.props.inverseStyle
    });

    var iconSearchClasses = classNames({
      "icon icon-mini icon-search": true,
      "icon-mini-white": this.props.inverseStyle,
      "icon-mini-color": !this.props.inverseStyle && this.state.focus,
      "active": this.state.focus
    });

    var inputClasses = classNames({
      "form-control form-control-small filter-input-text": true,
      "form-control-inverse": this.props.inverseStyle
    });

    let inputContainerClasses = classNames({
      "form-control form-control-small form-control-group": true,
      "form-control-inverse": this.props.inverseStyle,
      "focus": this.state.focus
    });

    return (
      <div className="form-group form-group-small filter-input-text-group">
        <div className={inputContainerClasses}>
          <span className="form-control-group-add-on form-control-group-add-on-prepend">
            <i className={iconSearchClasses}></i>
          </span>
          <input
            type="text"
            className={inputClasses}
            placeholder="Filter"
            value={this.props.searchString}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            ref="filterInput" />
          <span className={clearIconContainerClasses}>
            <a href="#" onClick={this.handleClearInput}>
              <i className={clearIconClasses}></i>
            </a>
          </span>
        </div>
      </div>
    );
  }
});

module.exports = FilterInputText;
