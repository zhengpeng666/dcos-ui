/** @jsx React.DOM */

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var Sidebar = require("../components/Sidebar");
var MesosStateStore = require("../stores/MesosStateStore");

var Index = React.createClass({

  displayName: "Index",

  componentWillMount: function () {
    MesosStateStore.init();
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
