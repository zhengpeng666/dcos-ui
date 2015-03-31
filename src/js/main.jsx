/** @jsx React.DOM */

var overrides = require("./overrides");
overrides.override();

var Actions = require("./actions/Actions");
Actions.beginStint();

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;

require("./utils/ReactSVG");
var Dashboard = require("./pages/Dashboard");
var Nodes = require("./pages/Nodes");
var Index = require("./pages/Index");
var Services = require("./pages/Services");
var NotFound = require("./pages/NotFound");

/* jshint trailing:false, quotmark:false, newcap:false */
/* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="dashboard" path="dashboard/?" handler={Dashboard} />
    <Route name="services" path="services/?" handler={Services} />
    <Route name="nodes" path="nodes/?" handler={Nodes} />
    <Redirect from="/" to="dashboard" />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler state={state} />, document.body);
});
