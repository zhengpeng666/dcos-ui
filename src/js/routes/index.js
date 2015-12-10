import {Route, Redirect, NotFoundRoute} from "react-router";

import dashboard from "./dashboard";
import Index from "../pages/Index";
import nodes from "./nodes";
import NotFoundPage from "../pages/NotFoundPage";
import services from "./services";

let routes = [
  {
    type: Route,
    name: "home",
    path: "/",
    children: [
      dashboard,
      services,
      nodes,
      {
        type: Route,
        authentication: true,
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
      }
    ]
  }
];

export default routes;
