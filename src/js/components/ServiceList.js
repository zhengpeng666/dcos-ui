const _ = require("underscore");
const classNames = require("classnames");
const React = require("react");

const HealthLabels = require("../constants/HealthLabels");
const HealthTypesDescription = require("../constants/HealthTypesDescription");
const List = require("reactjs-components").List;
const MarathonStore = require("../stores/MarathonStore");
const ServiceSidePanel = require("./ServiceSidePanel");
const TooltipMixin = require("../mixins/TooltipMixin");

const STATES = {
  UNHEALTHY: {key: "UNHEALTHY", classes: {"text-danger": true}},
  HEALTHY: {key: "HEALTHY", classes: {"text-success": true}},
  IDLE: {key: "IDLE", classes: {"text-warning": true}},
  NA: {key: "NA", classes: {"text-mute": true}}
};

let ServiceList = React.createClass({

  displayName: "ServiceList",

  propTypes: {
    services: React.PropTypes.array.isRequired,
    healthProcessed: React.PropTypes.bool.isRequired
  },

  mixins: [TooltipMixin],

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  getInitialState: function () {
    return {
      selectedServiceName: null
    };
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    var changedState =
      nextState !== undefined && !_.isEqual(this.state, nextState);

    return !_.isEqual(this.props, nextProps) || changedState;
  },

  handleServiceClick: function (selectedServiceName) {
    this.setState({selectedServiceName});
  },

  onServiceDetailClose: function () {
    this.setState({selectedServiceName: null});
  },

  getServices: function (services, healthProcessed) {
    return _.map(services, function (service) {
      let appHealth = MarathonStore.getServiceHealth(service.name);
      let attributes = {};
      let state = STATES.NA;
      let title = service.name;

      if (appHealth != null) {
        state = STATES[appHealth.key];

        attributes["data-behavior"] = "show-tip";
        attributes["data-tip-place"] = "top-left";

        if (appHealth.key === STATES.HEALTHY.key) {
          attributes["data-tip-content"] = HealthTypesDescription.HEALTHY;
        } else if (appHealth.key === STATES.UNHEALTHY.key) {
          attributes["data-tip-content"] = HealthTypesDescription.UNHEALTHY;
        } else if (appHealth.key === STATES.IDLE.key) {
          attributes["data-tip-content"] = HealthTypesDescription.IDLE;
        } else if (appHealth.key === STATES.NA.key) {
          attributes["data-tip-content"] = HealthTypesDescription.NA;
        }
      }

      let healthLabel = HealthLabels[state.key];
      if (!healthProcessed) {
        healthLabel = (
          <div className="loader-small ball-beat">
            <div></div>
            <div></div>
            <div></div>
          </div>
        );
      }

      if (service.webui_url && service.webui_url.length > 0) {
        title = (
          <a
            onClick={this.handleServiceClick.bind(this, service.name)}
            className="h3 flush-top flush-bottom clickable">
            {service.name}
          </a>
        );
      }

      var classes = {"h3 flush-top flush-bottom text-align-right": true};
      _.extend(classes, state.classes);
      var classSet = classNames(classes);

      var value = [
        <div key="title" className="h3 flush-top flush-bottom">
          {title}
        </div>,
        <div key="health" className={classSet} {...attributes}>
          {healthLabel}
        </div>
      ];

      return {
        value: value
      };
    }, this);
  },

  getNoServicesMessage: function () {
    return (
      <div className="text-align-center vertical-center">
        <h2>No Services Running</h2>
        <p>Use the DCOS command line tools to find and install services.</p>
      </div>
    );
  },

  getList: function () {
    let listOrder = ["title", "health"];
    let selectedServiceName = this.state.selectedServiceName;

    return (
      <div className="service-list-component">
        <List
          className="list-unstyled"
          items={this.getServices(this.props.services, this.props.healthProcessed)}
          order={listOrder} />
        <ServiceSidePanel
          open={selectedServiceName != null}
          onClose={this.onServiceDetailClose}
          serviceName={selectedServiceName} />
      </div>
    );
  },

  getContent: function () {
    if (this.props.services.length === 0) {
      return this.getNoServicesMessage();
    } else {
      return this.getList();
    }
  },

  render: function () {
    return (
      <div>
        {this.getContent()}
      </div>
    );
  }
});

module.exports = ServiceList;
