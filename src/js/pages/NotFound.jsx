/** @jsx React.DOM */

var Link = require("react-router").Link;
var React = require("react/addons");

var AlertPanel = require("../components/AlertPanel");
var Page = require("../components/Page");

var NotFoundPage = React.createClass({

  displayName: "NotFoundPage",

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <Page title="Page Not Found">
        <AlertPanel
          title="Page Not Found">
          <p>
            The page you’ve requested cannot be found.
            It’s possible you copied the wrong link.
            Check again, or jump back to your&nbsp;
            <Link to="dashboard">Dashboard</Link>.
          </p>
        </AlertPanel>
      </Page>
    );
  }

});

module.exports = NotFoundPage;
