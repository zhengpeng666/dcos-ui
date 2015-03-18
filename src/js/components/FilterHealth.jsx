/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var HealthLabels = require("../constants/HealthLabels");
var HealthTypes = require("../constants/HealthTypes");

var buttonNameMap = {
  all: "All",
  healthy: HealthLabels.HEALTHY,
  sick: HealthLabels.UNHEALTHY
};

var buttonHealthTypeMap = {
  all: "",
  healthy: HealthTypes.HEALTHY,
  sick: HealthTypes.SICK
};

var FilterHealth = React.createClass({

  displayName: "FilterHealth",

  propTypes: {
    healthTypeLengths: React.PropTypes.object.isRequired,
    healthFilter: React.PropTypes.oneOfType(
      [React.PropTypes.string, React.PropTypes.number]
    ),
    onSubmit: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      healthFilter: ""
    };
  },

  getInitialState: function () {
    return {
      filter: "all"
    };
  },

  handleChange: function (key) {
    this.setState({filter: key});
    this.props.onSubmit(buttonHealthTypeMap[key]);
  },

  getFilterButtons: function () {
    var mode = this.state.filter;
    var props = this.props;

    return _.map(buttonNameMap, function (value, key) {
      var classSet = React.addons.classSet({
        "button": true,
        "active": mode === key
      });

      var dotClassSet = React.addons.classSet({
        "dot": true,
        "hidden": key === "all",
        "danger": key === "sick",
        "success": key === "healthy"
      });

      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <button
            key={key}
            className={classSet}
            onClick={this.handleChange.bind(this, key)}>
          <span className={dotClassSet}></span>
          <span className="label">{value}</span>
          <span className="badge">{props.healthTypeLengths[key]}</span>
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
