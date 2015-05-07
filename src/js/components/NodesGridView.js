/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./charts/Chart");
var DialChart = require("./charts/DialChart");
var ResourceTypes = require("../constants/ResourceTypes");

var colors = {
  error: 2,
  unused: 6
};

var NodesGridView = React.createClass({

  propTypes: {
    hosts: React.PropTypes.array.isRequired,
    // enum: ["cpus", "mem", "disk"]
    selectedResource: React.PropTypes.string.isRequired
  },

  getDialConfig: function (active, resource, resourceConfig) {
    if (active) {
      return {
        data: this.getActiveSliceData(resourceConfig, resource.percentage),
        description: [
          <span className="unit" key={"unit"}>
            {resource.percentage}%
          </span>,
          <span className="unit-label text-muted" key={"unit-label"}>
            {resourceConfig.label}
          </span>
        ]
      };
    } else {
      return {
        data: this.getInactiveSliceData(),
        description: (
          <span className="error">
            <i className="icon icon-medium icon-medium-white icon-alert"/>
          </span>
        )
      };
    }
  },

  getActiveSliceData: function (resourceConfig, percentage) {
    return [
      {
        colorIndex: resourceConfig.colorIndex,
        name: resourceConfig.label,
        percentage: percentage
      },
      {
        colorIndex: colors.unused,
        name: "Unused",
        percentage: 100 - percentage
      }
    ];
  },

  getInactiveSliceData: function () {
    return [
      {
        colorIndex: colors.error,
        name: "Error",
        percentage: 100
      }
    ];
  },

  getDials: function () {
    var resourceConfig = ResourceTypes[this.props.selectedResource];

    return _.map(this.props.hosts, function (host) {
      var resource = _.last(host.used_resources[this.props.selectedResource]);
      var config = this.getDialConfig(host.active, resource, resourceConfig);

      return (
        <div className="nodes-grid-item" key={host.id}>
          <div className="chart">
            <Chart calcHeight={function (w) { return w; }}>
              <DialChart data={config.data}
                  value="percentage">
                <div className="description">
                  {config.description}
                </div>
              </DialChart>
            </Chart>
          </div>
        </div>
      );
    }, this);
  },

  // Zero-height spacer items force dial charts in the last line of the flex layout
  // not to spread themselves across the line.
  getSpacers: function () {
    return _.times(30, function () {
      return <div className="nodes-grid-spacer"></div>;
    });
  },

  render: function () {
    return (
      <div className="nodes-grid">
        {this.getDials()}
        {this.getSpacers()}
      </div>
    );
  }

});

module.exports = NodesGridView;
