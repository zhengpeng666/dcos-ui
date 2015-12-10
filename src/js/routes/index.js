import Router from "react-router";
let Route = Router.Route;
let Redirect = Router.Redirect;
let NotFoundRoute = Router.NotFoundRoute;

import dashboard from "./dashboard";
import Index from "../pages/Index";
import nodes from "./nodes";
import NotFoundPage from "../pages/NotFoundPage";
import services from "./services";
import settings from "./settings";

let routes = [{
  type: Route,
  name: "home",
  path: "/",
  children: [{
    type: Route,
    handler: Index,
    children: [
      dashboard,
      services,
      nodes,
      settings,
      {
        type: Redirect,
        from: "/",
        to: "dashboard"
      },
      {
        type: NotFoundRoute,
        handler: NotFoundPage
      }
    ]
  }]
}];

export default routes;
