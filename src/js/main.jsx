/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

require("./scrollHandler");
var Activity = require("./components/Activity");
var ActivityPage = require("./components/ActivityPage");
var Index = require("./components/Index");
var ServicesPage = require("./components/ServicesPage");
var ServiceList = require("./components/ServiceList");

/* jshint trailing:false, quotmark:false, newcap:false */
/* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="activity" path="activity/" handler={ActivityPage}>
      <DefaultRoute handler={Activity}/>
    </Route>
    <Route name="services" path="services/" handler={ServicesPage}>
      <DefaultRoute handler={ServiceList} />
    </Route>
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler state={state} />, document.body);
});
