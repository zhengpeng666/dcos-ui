/** @jsx React.DOM */

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var Menu = require("../components/Menu");
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
      <div className="container">
        <Menu />
        <hr />
        <RouteHandler />
      </div>
    );
  }
});

module.exports = Index;
