/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var NodesGridDials = require("./NodesGridDials");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");

var NodesGridView = React.createClass({

  propTypes: {
    hosts: React.PropTypes.array.isRequired,
    selectedResource: React.PropTypes.string.isRequired
  },

  mixins: [InternalStorageMixin],

  getInitialState: function () {
    return {
      showServices: false
    };
  },

  componentWillMount: function () {
    this.internalStorage_set({serviceColors: {}});
  },

  componentWillReceiveProps: function (props) {
    var ids = _.pluck(props.services, "id");
    var serviceColors = this.internalStorage_get().serviceColors;

    if (!_.isEqual(Object.keys(serviceColors), ids)) {
      this.computeServiceColors(props.services);
    }
  },

  handleShowServices: function (e) {
    this.setState({showServices: e.currentTarget.checked});
  },

  computeServiceColors: function (services) {
    // {service.id: colorIndex}
    var colors = {};

    services.forEach(function (service) {
      // Drop all others into the same "other" color
      colors[service.id] = Math.min(service.colorIndex, 8);
    });

    console.log(colors);
    this.internalStorage_update({serviceColors: colors});
  },

  getServices: function (props) {
    var items = _.map(props.services, function (service) {
      // Drop all others into the same "other" color
      var index = Math.min(service.colorIndex, 8);
      var className = "service-legend-color service-color-" + index;
      return (
        <li key={service.id}>
          <span className={className}></span>
          <a className="clickable">{service.name}</a>
        </li>
      );
    });

    return (
      <ul className="list list-unstyled nodes-grid-service-list">
      {items}
      </ul>
    );
  },

  render: function () {
    var data = this.internalStorage_get();
    var props = this.props;
    var state = this.state;

    var classSet = React.addons.classSet({
      "nodes-grid-legend": true,
      "disabled": !state.showServices
    });

    return (
      <div className="nodes-grid">

        <div className={classSet}>
          <label className="show-services-label">
            <input type="checkbox"
              name="nodes-grid-show-services"
              checked={state.showServices}
              onChange={this.handleShowServices} />
            Show Services by Share
          </label>

          {this.getServices(props)}
        </div>

        <NodesGridDials
          hosts={props.hosts}
          selectedResource={props.selectedResource}
          serviceColors={data.serviceColors}
          showServices={state.showServices} />
      </div>
    );
  }

});

module.exports = NodesGridView;
