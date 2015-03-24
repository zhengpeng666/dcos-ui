/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var HealthLabels = require("../constants/HealthLabels");
var HealthTypes = require("../constants/HealthTypes");

var buttonMap = _.pick(
  HealthLabels,
  "ALL",
  "HEALTHY",
  "UNHEALTHY"
);

var FilterHealth = React.createClass({

  displayName: "FilterHealth",

  propTypes: {
    countByHealth: React.PropTypes.object.isRequired,
    healthFilter: React.PropTypes.oneOfType(
      [React.PropTypes.string, React.PropTypes.number]
    ),
    onSubmit: React.PropTypes.func,
    servicesLength: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      countByHealth: {},
      healthFilter: null,
      onSubmit: _.noop,
      servicesLength: 0
    };
  },

  getInitialState: function () {
    return {
      filter: null
    };
  },

  handleChange: function (health) {
    this.setState({filter: health});
    this.props.onSubmit(health);
  },

  getCountByHealth: function (key) {
    var props = this.props;
    if (key === "ALL") {
      return props.servicesLength;
    }
    return props.countByHealth[HealthTypes[key]];
  },

  getFilterButtons: function () {
    var mode = this.state.filter;

    return _.map(buttonMap, function (value, key) {
      var health = HealthTypes[key];
      if (typeof health === "undefined") {
        health = null;
      }
      var classSet = React.addons.classSet({
        "button": true,
        "active": mode === health
      });

      var dotClassSet = React.addons.classSet({
        "dot": _.contains([HealthTypes.UNHEALTHY, HealthTypes.HEALTHY], health),
        "danger": HealthTypes.UNHEALTHY === health,
        "success": HealthTypes.HEALTHY === health
      });

      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <button
            key={key}
            className={classSet}
            onClick={this.handleChange.bind(this, health)}>
            <span className="button-align-content">
              <span className={dotClassSet}></span>
              <span className="label">{value}</span>
              <span className="badge">{this.getCountByHealth(key)}</span>
            </span>
        </button>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }, this);
  },

  render: function () {
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className="button-group">
        {this.getFilterButtons()}
      </div>
    );
  }
});

module.exports = FilterHealth;
