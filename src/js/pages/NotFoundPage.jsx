/** @jsx React.DOM */

var _ = require("underscore");
var Link = require("react-router").Link;
var React = require("react/addons");

var Panel = require("../components/Panel");
var SidebarActions = require("../events/SidebarActions");
var SidebarToggle = require("./SidebarToggle");

function getComputedWidth(obj) {
  var compstyle;
  if (typeof window.getComputedStyle === "undefined") {
    compstyle = obj.currentStyle;
  } else {
    compstyle = window.getComputedStyle(obj);
  }
  return _.foldl(
    ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"],
    function (acc, key) {
      var val = parseInt(compstyle[key], 10);
    if (_.isNaN(val)) {
      return acc;
    } else {
      return acc - val;
    }
  }, obj.offsetWidth);
}

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
    var width = getComputedWidth(panel);
    this.setState({height: width});
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {

    var styles = {height: this.state.height};
    console.log(styles);

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
              <Panel ref="panel" style={styles} className="vertical-center text-align-center">
                <h2 className="">
                  Page Not Found
                </h2>
                <p className="">
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
