/** @jsx React.DOM */

var React = require("react/addons");
var Router = require("react-router");
var MesosStateStore = require("../stores/MesosStateStore");

function getMesosServices() {
  return {
    allItems: MesosStateStore.getAll().frameworks
  };
}

var Griddle = require("griddle-react");

var ServicesList = React.createClass({

  displayName: "ServicesList",

  mixins: [Router.State],

  getInitialState: function () {
    return {
      frameworks: []
    };
  },

  componentDidMount: function () {
    MesosStateStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(getMesosServices());
  },

  render: function () {

    var classes = {};

    if (this.props.className != null) {
      classes[this.props.className] = true;
    }

    var classSet = React.addons.classSet(classes);

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <div className={classSet}>
        <Griddle results={this.state.allItems} />
      </div>
    );
  }
});

module.exports = ServicesList;
