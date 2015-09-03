var _ = require("underscore");
var classNames = require("classnames");
var React = require("react/addons");

var FilterState = React.createClass({

  displayName: "FilterState",

  propTypes: {
    handleFilterChange: React.PropTypes.func,
    statusCounts: React.PropTypes.object
  },

  getDefaultProps: function () {
    return {
      handleFilterChange: _.noop,
      statusCounts: {active: 0, completed: 0}
    };
  },

  getFilterButtons: function () {
    var currentState = this.props.currentFilterState;

    return _.map(["active", "completed"], function (value, key) {
      var buttonClassSet = classNames({
        "button button-small button-stroke": true,
        "active": currentState === value
      });
      var count = this.props.statusCounts[value] || 0;

      return (
        <button
          className={buttonClassSet}
          key={key}
          onClick={this.props.handleFilterChange.bind(null, value)}>
          <span className="button-align-content">
            <span className="label">{value}</span>
            <span className="badge">{count}</span>
          </span>
        </button>
      );
    }, this);

  },

  render: function () {
    return (
      <div className="button-group">
        {this.getFilterButtons()}
      </div>
    );
  }
});

module.exports = FilterState;
