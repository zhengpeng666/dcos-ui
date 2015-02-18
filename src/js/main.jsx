/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

require("./scrollHandler");
var Activity = require("./components/Activity");
var ActivityPage = require("./components/ActivityPage");
var Index = require("./components/Index");
var ModuleList = require("./components/ModuleList");
var ServicesList = require("./components/ServicesList");

/* jshint trailing:false, quotmark:false, newcap:false */
/* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="activity" path="activity/" handler={ActivityPage}>
      <DefaultRoute handler={Activity}/>
      <Route name="modules" path="modules" handler={ModuleList} />
      <Route name="services" path="services" handler={ServicesList} />
    </Route>
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler state={state} />, document.body);
});
