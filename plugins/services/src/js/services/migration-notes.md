`ServicesContainer` will be the main entry point and it will choose whether to
render `ServiceDetailContainer` or `ServiceTreeContainer` based on the route
parameter (id).

This means we only need to register `ServicesContainer` with the Route Service.
When we register `ServicesContainer`, we will also specify a dynamic Relay Query
so instead of registering with
```
<Route
    path="/services/:id"
    component={ServicesContainer}
    queries={ServicesQueries}
  />
```
We'd do this:
```
<Route
    path="/services/:id"
    component={ServicesContainer}
    getQueries={({ location, params }) => getServicesQueries(location, params)}
  />
```
Where `getServicesQueries` would return 1 of the 2 queries:
1) `Groups {groupId: $id}` in the case we are showing `ServiceTreeContainer`
2) `Service {serviceId: $id}` in the case we are showing `ServiceDetailContainer`

We would show `ServiceTreeContainer` if `!id || id.slice(-1) === '/'` otherwise
we show `ServiceDetailContainer`.

`ServiceDetailContainer` must render <RouteHandler /> in the meantime and after
upgrading react-router, it will render out `{this.props.children}` so we can
embed child routes/handlers (i.e. tier 2 navigation such as taskList, debug, etc)

TODO:
* Services Icon shouldn't live in DCOS
