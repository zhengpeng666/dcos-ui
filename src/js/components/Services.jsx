/** @jsx React.DOM */

var React = require("react/addons");
var ServicesFilter = require("./ServicesFilter");
var ServicesList = require("./ServicesList");

var Services = React.createClass({

  displayName: "Services",

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    return (
      <div>
        <ServicesFilter />
        <ServicesList />
      </div>
    );
  }

});

module.exports = Services;
