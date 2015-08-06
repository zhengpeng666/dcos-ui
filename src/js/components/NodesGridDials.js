var _ = require("underscore");
var React = require("react/addons");

var Chart = require("./charts/Chart");
var DialChart = require("./charts/DialChart");
var ResourceTypes = require("../constants/ResourceTypes");
var TooltipMixin = require("../mixins/TooltipMixin");

var colors = {
  error: 2,
  unused: "unused"
};

var NodesGridDials = React.createClass({

  displayName: "NodesGridDials",

  mixins: [TooltipMixin],

  propTypes: {
    hosts: React.PropTypes.array.isRequired,
    // enum: ["cpus", "mem", "disk"]
    selectedResource: React.PropTypes.string.isRequired,
    serviceColors: React.PropTypes.object.isRequired,
    showServices: React.PropTypes.bool.isRequired,
    resourcesByFramework: React.PropTypes.object.isRequired
  },

  getServiceSlicesConfig: function (host) {
    var config = [];
    var props = this.props;
    var resourcesByFramework = props.resourcesByFramework[host.id];

    if (!resourcesByFramework) {
      return config;
    }

    _.each(resourcesByFramework, function (fwkResources, fwkId) {
      var percentage = fwkResources[props.selectedResource] * 100;
      percentage /= host.resources[props.selectedResource];

      config.push({
        colorIndex: props.serviceColors[fwkId],
        name: fwkId,
        percentage: percentage
      });
    });

    return config;
  },

  getUsedSliceConfig: function (host) {
    var props = this.props;
    var resourceConfig = ResourceTypes[props.selectedResource];
    var serviceSlices = this.getServiceSlicesConfig(host);
    var percentage;

    if (serviceSlices.length > 0) {
      percentage = _.foldl(serviceSlices, function (memo, slice) {
        return memo + slice.percentage;
      }, 0);
    } else {
      percentage = _.last(
        host.used_resources[props.selectedResource]
      ).percentage;
    }

    return [{
      colorIndex: resourceConfig.colorIndex,
      name: resourceConfig.label,
      percentage: percentage
    }];
  },

  getActiveSliceData: function (host) {
    var config;
    var props = this.props;

    if (props.showServices) {
      config = this.getServiceSlicesConfig(host);
    } else {
      config = this.getUsedSliceConfig(host);
    }

    var percentage = _.reduce(config, function (memo, slice) {
      memo += slice.percentage;
      return memo;
    }, 0);
    percentage = Math.round(percentage);

    config.push({
      colorIndex: colors.unused,
      name: "Unused",
      percentage: 100 - percentage
    });

    return {
      data: config,
      usedPercentage: percentage
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
      var sliceData = this.getActiveSliceData(host);
      return {
        data: sliceData.data,
        description: [
          <span className="unit" key={"unit"}>
            {sliceData.usedPercentage}%
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
      var tooltipProps = {};

      if (!host.active) {
        tooltipProps = {
          "data-behavior": "show-tip",
          "data-tip-place": "top",
          "data-tip-content": "Connection to node lost"
        };
      }

      return (
        <div className="nodes-grid-dials-item" key={host.id}>
          <div className="chart">
            <Chart calcHeight={function (w) { return w; }}>
              <DialChart data={config.data}
                  value="percentage">
                <div {...tooltipProps} className="description">
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
