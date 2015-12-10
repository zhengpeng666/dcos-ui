var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

export default class Application extends React.Component {
  render() {
    return <RouteHandler {...this.props} />;
  }
}
