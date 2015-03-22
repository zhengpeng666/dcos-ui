/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;

require("./utils/ReactSVG");
var ActivityPage = require("./pages/ActivityPage");
var DatacenterPage = require("./pages/DatacenterPage");
var Index = require("./pages/Index");
var ServicesPage = require("./pages/ServicesPage");
var NotFoundPage = require("./pages/NotFoundPage");

/* jshint trailing:false, quotmark:false, newcap:false */
/* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="activity" path="activity/" handler={ActivityPage} />
    <Route name="services" path="services/" handler={ServicesPage} />
    <Route name="datacenter" path="datacenter/" handler={DatacenterPage} />
    <Redirect from="/" to="activity" />
    <NotFoundRoute handler={NotFoundPage}/>
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler state={state} />, document.body);
});
