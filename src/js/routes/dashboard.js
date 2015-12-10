import Router from "react-router";
let Route = Router.Route;

import DashboardPage from "../pages/DashboardPage";

let dashboardRoutes = {
  type: Route,
  name: "dashboard",
  path: "dashboard/?",
  handler: DashboardPage,
  children: [
    {
      type: Route,
      name: "dashboard-panel",
      path: "service-detail/:serviceName"
    },
    {
      type: Route,
      name: "dashboard-task-panel",
      path: "task-detail/:taskID"
    }
  ]
};

export default dashboardRoutes;
