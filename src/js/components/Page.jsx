/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var SidebarActions = require("../events/SidebarActions");
var SidebarToggle = require("./SidebarToggle");

var Page = React.createClass({

  displayName: "Page",

  propTypes: {
    title: React.PropTypes.string,
    renderNavigation: React.PropTypes.func
  },

  statics: {
    // Static life cycle method from react router, that will be called
    // "when a handler is about to render", i.e. on route change:
    // https://github.com/rackt/react-router/
    // blob/master/docs/api/components/RouteHandler.md
    willTransitionTo: function () {
      SidebarActions.close();
    }
  },

  getNavigation: function () {
    if (_.isFunction(this.props.renderNavigation)) {
      return this.props.renderNavigation();
    } else {
      return <div className="page-header-navigation" />;
    }
  },

  getPageContents: function () {
    return React.Children.map(this.props.children, function (child) {
      return child;
    });
  },

  /* jshint trailing:false, quotmark:false, newcap:false */
  /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  render: function () {
    var classes = {
      "flex-container-col": true
    };
    if (this.props.className) {
      classes[this.props.className] = true;
    }

    var classSet = React.addons.classSet(classes);



    return (
      <div className={classSet}>
        <div className="page-header">
          <div className="container container-fluid container-pod container-pod-short-bottom container-pod-divider-bottom container-pod-divider-bottom-align-right">
            <div className="page-header-context">
              <SidebarToggle />
              <h1 className="page-header-title flush-top flush-bottom">
                {this.props.title}
              </h1>
            </div>
            {this.getNavigation()}
          </div>
        </div>
        <div className="page-content container-scrollable">
          <div className="container container-fluid container-pod">
            {this.getPageContents()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Page;
