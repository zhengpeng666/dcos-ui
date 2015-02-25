/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var MesosStateActions = require("../actions/MesosStateActions");
var MesosStateStore = require("../stores/MesosStateStore");
var ResourceChart = require("./ResourceChart");

function getMesosState() {
  return {
    frameworks: MesosStateStore.getFrameworks(),
    totalResources: MesosStateStore.getTotalResources(),
    usedResources: MesosStateStore.getUsedResources()
  };
}

var Activity = React.createClass({

  displayName: "Activity",

  getInitialState: function () {
    var state = {
      mode: "cpus",
      divideByFramework: false
    };

    return _.extend(state, getMesosState());
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_FRAMEWORKS_CHANGE,
      this.onChange
    );
    MesosStateActions.updateFrameworks();
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_FRAMEWORKS_CHANGE,
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

  changeDivision: function () {
    this.setState({divideByFramework: !this.state.divideByFramework});
  },

  getDivideButton: function () {
    var divideByFramework = this.state.divideByFramework;
    var classSet = React.addons.classSet({
      "button button-large": true,
      "button-primary": divideByFramework
    });
    var label = "Divide by frameworks";
    if (divideByFramework) {
      label = "Show accumulated";
    }
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <button
          className={classSet}
          onClick={this.changeDivision}>
        {label}
      </button>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    var state = this.state;
    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div>
        <ResourceChart
            data={state.frameworks}
            totalResources={state.totalResources}
            usedResources={state.usedResources}
            mode={state.mode}
            divide={state.divideByFramework}
            height={200}
            width={600} />
        <div className="button-collection flush-bottom">
          {this.getModeButtons()}
        </div>
        <div className="button-collection flush-bottom">
          {this.getDivideButton()}
        </div>
      </div>
    );
  }

});

module.exports = Activity;
