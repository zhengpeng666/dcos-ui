var overrides = require("./overrides");
overrides.override();

var Actions = require("./actions/Actions");
Actions.initialize();

Actions.log({eventID: "Stint started.", date: Actions.createdAt});
global.addEventListener("beforeunload", function () {
  Actions.log({eventID: "Stint ended."});
});

import _ from "underscore";
var React = require("react");
var Router = require("react-router");

require("./utils/MomentJSConfig");
require("./utils/ReactSVG");
var Config = require("./config/Config");
import appRoutes from "./routes/index";

function createRoutes(routes) {
  return routes.map(function (route) {
    let args = [route.type, _.omit(route, "type", "children")];

    if (route.children) {
      let children = createRoutes(route.children);
      args = args.concat(children);
    }

    return React.createElement.apply(null, args);
  });
}

let builtRoutes = createRoutes(appRoutes);

Router.run(builtRoutes[0], function (Handler, state) {
  Config.setOverrides(state.query);
  React.render(<Handler state={state} />, document.getElementById("application"));
});
