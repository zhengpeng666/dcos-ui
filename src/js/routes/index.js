import {Route, Redirect, NotFoundRoute} from "react-router";

import dashboard from "./dashboard";
import Index from "../pages/Index";
import Login from "../pages/Login";
import nodes from "./nodes";
import NotFoundPage from "../pages/NotFoundPage";
import services from "./services";
import settings from "./settings";

let routes = [
  {
    type: Route,
    name: "home",
    path: "/",
    children: [{
        handler: Login,
        name: "login",
        type: Route
      },
      {
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
      }
    ]
  }
];

export default routes;
