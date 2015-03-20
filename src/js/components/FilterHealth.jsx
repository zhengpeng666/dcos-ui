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
    onSubmit: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      healthFilter: null
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

  getFilterButtons: function () {
    var mode = this.state.filter;
    var props = this.props;


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
          <span className="badge">{props.healthHash[key]}</span>
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
