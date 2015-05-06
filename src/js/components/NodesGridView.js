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

  getData: function (resourceConfig, percentage) {
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

  getErrorData: function () {
    return [
      {
        colorIndex: colors.error,
        name: "Error",
        percentage: 100
      }
    ];
  },

  /**
   * TODOS:
   * - Add services?
   * - Handle different screen sizes
   * - Optimize rendering
   * - Fix display on small size
   */

  getDials: function () {
    var resourceConfig = ResourceTypes[this.props.selectedResource];

    return _.map(this.props.hosts, function (host) {
      var last = _.last(host.used_resources[this.props.selectedResource]);
      var percentage = last.percentage;
      var unit = percentage + "%";
      var errorIcon;
      var data;

      if (host.active) {
        data = this.getData(resourceConfig, percentage);
      } else {
        data = this.getErrorData();
        errorIcon = (
          <span className="error">
            <i className="icon icon-medium icon-medium-white icon-alert"/>
          </span>
        );
      }

      return (
        <div className="nodes-grid-item" key={host.id}>
          <div className="chart">
            <Chart calcHeight={function (w) { return w; }}>
              <DialChart data={data}
                  label={resourceConfig.label}
                  value="percentage"
                  unit={unit}>
                {errorIcon}
              </DialChart>
            </Chart>
          </div>
        </div>
      );
    }, this);
  },

  render: function () {
    return (
      <div className="row">
      {this.getDials()}
      </div>
    );
  }

});

module.exports = NodesGridView;
