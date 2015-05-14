/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./charts/Chart");
var DialChart = require("./charts/DialChart");
var ResourceTypes = require("../constants/ResourceTypes");

var colors = {
  error: 2,
  unused: 8
};

var NodesGridDials = React.createClass({

  propTypes: {
    hosts: React.PropTypes.array.isRequired,
    // enum: ["cpus", "mem", "disk"]
    selectedResource: React.PropTypes.string.isRequired,
    serviceColors: React.PropTypes.object.isRequired,
    showServices: React.PropTypes.bool.isRequired,
    resourcesByFramework: React.PropTypes.object.isRequired
  },

  getActiveSliceData: function (host) {
    var config = [];
    var usedPercentage = 0;
    var props = this.props;

    if (props.showServices) {
      var resourcesByFramework = props.resourcesByFramework[host.id];

      if (resourcesByFramework) {
        _.each(resourcesByFramework, function (fwkResources, fwkId) {
          var percentage = fwkResources[props.selectedResource] * 100;
          percentage /= host.resources[props.selectedResource];
          usedPercentage += percentage;

          config.push({
            colorIndex: props.serviceColors[fwkId],
            name: fwkId,
            percentage: percentage
          });
        });
      }
    } else {
      var resourceConfig = ResourceTypes[props.selectedResource];
      usedPercentage = _.last(
        host.used_resources[props.selectedResource]
      ).percentage;

      config.push({
        colorIndex: resourceConfig.colorIndex,
        name: resourceConfig.label,
        percentage: usedPercentage
      });
    }

    usedPercentage = Math.round(usedPercentage);

    config.push({
      colorIndex: colors.unused,
      name: "Unused",
      percentage: 100 - usedPercentage
    });

    return {
      data: config,
      usedPercentage: usedPercentage
    };
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

  getDialConfig: function (host) {
    var resourceConfig = ResourceTypes[this.props.selectedResource];

    if (host.active) {
      var slideData = this.getActiveSliceData(host);
      return {
        data: slideData.data,
        description: [
          <span className="unit" key={"unit"}>
            {slideData.usedPercentage}%
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

  getDials: function () {
    return _.map(this.props.hosts, function (host) {
      var config = this.getDialConfig(host);

      return (
        <div className="nodes-grid-dials-item" key={host.id}>
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
    return _.times(30, function (n) {
      return <div className="nodes-grid-dials-spacer" key={n}></div>;
    });
  },

  render: function () {
    return (
      <div className="nodes-grid-dials">
        {this.getDials()}
        {this.getSpacers()}
      </div>
    );
  }

});

module.exports = NodesGridDials;
