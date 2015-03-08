/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;


require("../utils/ScrollHandler");
var Sidebar = require("../components/Sidebar");
var MesosStateStore = require("../stores/MesosStateStore");

var Index = React.createClass({

  displayName: "Index",

  componentWillMount: function () {
    MesosStateStore.init();
  },

  // hack to make scroll work
  statics: {
    willTransitionTo: function (transition) {
      transition.wait(_.noop);
    }
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <div id="canvas">
        <Sidebar />
        <div id="page">
          <RouteHandler />
        </div>
      </div>
    );
  }
});

module.exports = Index;
