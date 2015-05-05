/** @jsx React.DOM */

var React = require("react/addons");

var HostTable = require("../components/HostTable");

var NodesListView = React.createClass({
  render: function () {
    return (
      <HostTable hosts={this.props.data.hosts} />
    );
  }
});

module.exports = NodesListView;
