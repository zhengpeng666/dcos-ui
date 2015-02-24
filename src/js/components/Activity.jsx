/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateActions = require("../actions/MesosStateActions");
var MesosStateStore = require("../stores/MesosStateStore");
var ResourceChart = require("./ResourceChart");

function getMesosState() {
  var mesosTransp = MesosStateStore.getTransposed();

  return {
    frameworks: mesosTransp.frameworks || [],
    totalResources: mesosTransp.totalResources
  };
}

var Activity = React.createClass({

  displayName: "Activity",

  getInitialState: function () {
    var state = getMesosState();
    state.mode = "cpus";
    return state;
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_TRANSPOSED_STATE_CHANGE,
      this.onChange
    );
    MesosStateActions.updateTransposed();
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_TRANSPOSED_STATE_CHANGE,
      this.onChange
    );
  },

  onChange: function () {
    this.setState(getMesosState());
  },

  changeMode: function (mode) {
    this.setState({mode: mode});
  },

  getModeButtons: function () {
    var mode = this.state.mode;
    var buttonNameMap = {
      cpus: "CPU",
      disk: "Disk",
      mem: "Memory"
    };

    return _.map(buttonNameMap, function (value, key) {
      var classSet = React.addons.classSet({
        "button button-large": true,
        "button-primary": mode === key
      });
      /* jshint trailing:false, quotmark:false, newcap:false */
      /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
      return (
        <button
            key={key}
            className={classSet}
            onClick={this.changeMode.bind(this, key)}>
          {value}
        </button>
      );
      /* jshint trailing:true, quotmark:true, newcap:true */
      /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    }, this);
  },

  render: function () {
    var state = this.state;
    var data = state.frameworks;
    if (data.length === 0) {
      return null;
    }
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div>
        <ResourceChart
            data={data}
            totalResources={state.totalResources}
            mode={state.mode}
            height={200}
            width={600} />
        <div className="button-collection flush-bottom">
          {this.getModeButtons()}
        </div>
      </div>
    );
  }

});

module.exports = Activity;
