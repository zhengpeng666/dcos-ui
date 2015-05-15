/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");

var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var MesosStateStore = require("../stores/MesosStateStore");
var NodesGridDials = require("./NodesGridDials");
var RequestErrorMsg = require("./RequestErrorMsg");

var NodesGridView = React.createClass({

  propTypes: {
    hosts: React.PropTypes.array.isRequired,
    selectedResource: React.PropTypes.string.isRequired
  },

  mixins: [InternalStorageMixin],

  getInitialState: function () {
    return {
      showServices: false,
      mesosStateErrorCount: 0
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

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
    );
  },

  componentWillUnmount: function () {
    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_CHANGE,
      this.onMesosStateChange
    );

    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
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
    var resourcesByFramework = this.internalStorage_get().resourcesByFramework;
    var slaves = MesosStateStore.getHostResourcesByFramework();

    if (!_.isEqual(resourcesByFramework, slaves)) {
      this.internalStorage_update({resourcesByFramework: slaves});
    }
  },

  onMesosStateRequestError: function () {
    this.setState({mesosStateErrorCount: this.state.mesosStateErrorCount + 1});
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

  hasLoadingError: function () {
    return this.state.mesosStateErrorCount >= 3;
  },

  getLoadingScreen: function () {
    var hasLoadingError = this.hasLoadingError();
    var errorMsg = null;
    if (hasLoadingError) {
      errorMsg = <RequestErrorMsg />;
    }

    var loadingClassSet = React.addons.classSet({
      "hidden": hasLoadingError
    });

    return (
      <div className="text-align-center vertical-center">
        <div className="row">
          <div className={loadingClassSet}>
            <div className="ball-scale">
              <div />
            </div>
          </div>
          {errorMsg}
        </div>
      </div>
    );
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

  getNodesGrid: function () {
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
  },

  render: function () {
    var showLoading = this.hasLoadingError() ||
      Object.keys(MesosStateStore.getLastMesosState()).length === 0;

    if (showLoading) {
      return this.getLoadingScreen();
    } else {
      return this.getNodesGrid();
    }
  }

});

module.exports = NodesGridView;
