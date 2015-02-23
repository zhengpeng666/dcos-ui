/** @jsx React.DOM */

var React = require("react");
var DOMProperty = require("react/lib/DOMProperty");
var Router = require("react-router");
var Route = Router.Route;

require("./scrollHandler");
var ActivityPage = require("./components/ActivityPage");
var Index = require("./components/Index");
var ServicesPage = require("./components/ServicesPage");

// hack for getting react to render clip-path attribute
DOMProperty.injection.injectDOMPropertyConfig({
  isCustomAttribute: function (attributeName) {
    return (attributeName === "clip-path");
  }
});

/* jshint trailing:false, quotmark:false, newcap:false */
/* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="activity" path="activity/" handler={ActivityPage} />
    <Route name="services" path="services/" handler={ServicesPage} />
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler state={state} />, document.body);
});
