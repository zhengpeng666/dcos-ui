/** @jsx React.DOM */

var Link = require("react-router").Link;
var React = require("react/addons");

var DOMUtils = require("../utils/DOMUtils");
var Panel = require("../components/Panel");
var SidebarActions = require("../events/SidebarActions");
var SidebarToggle = require("./SidebarToggle");

var NotFoundPage = React.createClass({

  displayName: "NotFoundPage",

  getInitialState: function () {
    return {
      height: 0
    };
  },

  statics: {
    willTransitionTo: function () {
      SidebarActions.close();
    }
  },

  componentDidMount: function() {
    var panel = this.refs.panel.getDOMNode();
    var width = DOMUtils.getComputedWidth(panel);
    this.setState({height: width});
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    return (
      <div className="flex-container-col flex-item">
        <div className="page-header">
          <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-bottom-align-right">
            <div className="page-header-context">
              <SidebarToggle />
            </div>
            <div className="page-header-navigation" />
          </div>
        </div>
        <div className="page-content container-scrollable">
          <div className="container container-fluid container-pod">
            <div className="column-small-offset-2 column-small-8 column-medium-offset-3 column-medium-6 column-large-offset-4 column-large-4">
              <Panel ref="panel"
                  style={{height: this.state.height}}
                  className="vertical-center text-align-center">
                <h2>
                  Page Not Found
                </h2>
                <p>
                  The page you’ve requested cannot be found.
                  It’s possible you copied the wrong link.
                  Check again, or jump back to your&nbsp;
                  <Link to="activity">Dashboard</Link>.
                </p>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = NotFoundPage;
