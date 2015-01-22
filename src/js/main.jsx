/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

var Activity = require("./components/Activity");
var Index = require("./components/Index");
var ServicesList = require("./components/ServicesList");

/* jshint trailing:false, quotmark:false, newcap:false */
/* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="modules" path="/modules" handler={ServicesList} />
    <Route name="services" path="/services" handler={ServicesList} />
    <DefaultRoute handler={Activity}/>
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler state={state} />, document.body);
});
