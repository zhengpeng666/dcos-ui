/** @jsx React.DOM */

var React = require("react/addons");

var Activity = React.createClass({

  displayName: "Activity",

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    return (
      <p>
        This is the activity monitor
      </p>
    );
  }

});

module.exports = Activity;
