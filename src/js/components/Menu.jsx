/** @jsx React.DOM */

var React = require("react/addons");
var Link = require("react-router").Link;

var Menu = React.createClass({

  displayName: "Menu",

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    return (
      <div className="navbar navbar-default" role="navigation">
        <ul className="nav navbar-nav">
          <li><Link to="home">Activity</Link></li>
          <li><Link to="services">Services</Link></li>
          <li><Link to="modules">Modules</Link></li>
        </ul>
      </div>
    );
  }

});

module.exports = Menu;
