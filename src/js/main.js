/** @jsx React.DOM */

var overrides = require("./overrides");
overrides.override();

var Actions = require("./actions/Actions");
Actions.initialize();

Actions.log({description: "Stint started.", date: Actions.createdAt});
global.addEventListener("beforeunload", function () {
  Actions.log({description: "Stint ended."});
});

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;

require("./utils/ReactSVG");
var DashboardPage = require("./pages/DashboardPage");
var NodesPage = require("./pages/NodesPage");
var Index = require("./pages/Index");
var ServicesPage = require("./pages/ServicesPage");
var NotFoundPage = require("./pages/NotFoundPage");

var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="dashboard" path="dashboard/?" handler={DashboardPage} />
    <Route name="services" path="services/?" handler={ServicesPage} />
    <Route name="nodes" path="nodes/?" handler={NodesPage} />
    <Redirect from="/" to="dashboard" />
    <NotFoundRoute handler={NotFoundPage}/>
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler state={state} />, document.getElementById("application"));
});
