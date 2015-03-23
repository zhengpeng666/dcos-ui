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
    healthHash: React.PropTypes.object.isRequired,
    healthFilter: React.PropTypes.oneOfType(
      [React.PropTypes.string, React.PropTypes.number]
    ),
    onSubmit: React.PropTypes.func,
    totalFrameworksLength: React.PropTypes.number.isRequired
  },

  getDefaultProps: function () {
    return {
      healthHash: {},
      healthFilter: null,
      onSubmit: _.noop,
      totalFrameworksLength: 0
    };
  },

  getInitialState: function () {
    return {
      filter: undefined
    };
  },

  handleChange: function (health) {
    this.setState({filter: health});
    this.props.onSubmit(health);
  },

  getHealthTypeLength: function (key) {
    var props = this.props;
    if (key === "ALL") {
      return props.totalFrameworksLength;
    }
    return props.healthHash[HealthTypes[key]];
  },

  getFilterButtons: function () {
    var mode = this.state.filter;

    return _.map(buttonMap, function (value, key) {
      var health = HealthTypes[key];
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
          <span className={dotClassSet}></span>
          <span className="label">{value}</span>
          <span className="badge">{this.getHealthTypeLength(key)}</span>
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
