var overrides = require("./overrides");
overrides.override();

var Actions = require("./actions/Actions");
Actions.initialize();

Actions.log({eventID: "Stint started.", date: Actions.createdAt});
global.addEventListener("beforeunload", function () {
  Actions.log({eventID: "Stint ended."});
});

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;

require("./utils/ReactSVG");
var Config = require("./config/Config");
var DashboardPage = require("./pages/DashboardPage");
var HostTable = require("./components/HostTable");
var Index = require("./pages/Index");
var NodesPage = require("./pages/NodesPage");
var NodesGridView = require("./components/NodesGridView");
var NotFoundPage = require("./pages/NotFoundPage");
var ServiceOverlay = require("./components/ServiceOverlay");
var ServicesPage = require("./pages/ServicesPage");

var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="dashboard" path="dashboard/?" handler={DashboardPage} />
    <Route name="services" path="services/?" handler={ServicesPage}>
      <Route name="service-ui" path="ui/:serviceName" handler={ServiceOverlay} />
    </Route>
    <Route name="nodes" path="nodes/?" handler={NodesPage}>
      <Route name="nodes-list" path="list/?" handler={HostTable} />
      <Route name="nodes-grid" path="grid/?" handler={NodesGridView} />
      <Redirect from="/nodes/?" to="nodes-list" />
    </Route>
    <Redirect from="/" to="dashboard" />
    <NotFoundRoute handler={NotFoundPage}/>
  </Route>
);

Router.run(routes, function (Handler, state) {
  Config.setOverrides(state.query);
  React.render(<Handler state={state} />, document.getElementById("application"));
});
