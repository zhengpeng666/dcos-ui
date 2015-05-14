/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var NodesGridDials = require("./NodesGridDials");

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
    this.internalStorage_set({
      serviceColors: {},
      resourcesByFramework: {}
    });

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );
  },

  componentWillReceiveProps: function (props) {
    var ids = _.pluck(props.services, "id");
    var serviceColors = this.internalStorage_get().serviceColors;

    if (!_.isEqual(Object.keys(serviceColors), ids)) {
      this.computeServiceColors(props.services);
    }
  },

  onMesosStateChange: function () {
    var state = MesosStateStore.getLastMesosState();
    this.calculateResourcesByFramework(state);
  },

  calculateResourcesByFramework: function (state) {
    var resourcesByFramework = this.internalStorage_get().resourcesByFramework;

    var slaves = _.foldl(state.frameworks, function (memo, framework) {
      _.each(framework.tasks, function (task) {
        if (memo[task.slave_id] == null) {
          memo[task.slave_id] = {};
        }

        var resources = _.pick(task.resources, "cpus", "disk", "mem");
        if (memo[task.slave_id][task.framework_id] == null) {
          memo[task.slave_id][task.framework_id] = resources;
        } else {
          // Aggregates used resources from each executor
          _.each(resources, function (value, key) {
            memo[task.slave_id][task.framework_id][key] += value;
          });
        }
      });

      return memo;
    }, {});

    if (!_.isEqual(resourcesByFramework, slaves)) {
      this.internalStorage_update({resourcesByFramework: slaves});
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
          resourcesByFramework={data.resourcesByFramework}
          showServices={state.showServices} />
      </div>
    );
  }

});

module.exports = NodesGridView;
