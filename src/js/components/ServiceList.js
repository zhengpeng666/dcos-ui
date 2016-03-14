const _ = require('underscore');
import classNames from 'classnames';
import {List} from 'reactjs-components';
const React = require('react');

const HealthLabels = require('../constants/HealthLabels');
const HealthStatus = require('../constants/HealthStatus');
const HealthTypesDescription = require('../constants/HealthTypesDescription');
const MarathonStore = require('../stores/MarathonStore');
const TooltipMixin = require('../mixins/TooltipMixin');

let ServiceList = React.createClass({

  displayName: 'ServiceList',

  propTypes: {
    services: React.PropTypes.array.isRequired,
    healthProcessed: React.PropTypes.bool.isRequired
  },

  mixins: [TooltipMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      services: []
    };
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    var changedState =
      nextState !== undefined && !_.isEqual(this.state, nextState);

    return !_.isEqual(this.props, nextProps) || changedState;
  },

  handleServiceClick: function (serviceName) {
    this.context.router.transitionTo('dashboard-panel', {serviceName});
  },

  getServices: function (services, healthProcessed) {
    return _.map(services, function (service) {
      let appHealth = MarathonStore.getServiceHealth(service.name);
      let attributes = {};
      let state = HealthStatus.NA;

      if (appHealth != null) {
        state = HealthStatus[appHealth.key];

        attributes['data-behavior'] = 'show-tip';
        attributes['data-tip-place'] = 'top-left';

        if (appHealth.key === HealthStatus.HEALTHY.key) {
          attributes['data-tip-content'] = HealthTypesDescription.HEALTHY;
        } else if (appHealth.key === HealthStatus.UNHEALTHY.key) {
          attributes['data-tip-content'] = HealthTypesDescription.UNHEALTHY;
        } else if (appHealth.key === HealthStatus.IDLE.key) {
          attributes['data-tip-content'] = HealthTypesDescription.IDLE;
        } else if (appHealth.key === HealthStatus.NA.key) {
          attributes['data-tip-content'] = HealthTypesDescription.NA;
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

      let classSet = classNames(
        'h4 inverse flush-top flush-bottom text-align-right',
        state.classNames
      );

      return {
        content: [
          {
            className: null,
            content: (
              <a key="title"
                onClick={this.handleServiceClick.bind(this, service.name)}
                className="h4 inverse flush-top flush-bottom clickable">
                {service.name}
              </a>
            ),
            tag: 'span'
          },
          {
            className: null,
            content: (
              <div key="health" className={classSet} {...attributes}>
                {healthLabel}
              </div>
            ),
            tag: 'div'
          }
        ]
      };
    }, this);
  },

  getNoServicesMessage: function () {
    return (
      <div className="vertical-center">
        <h3 className="flush-top inverse text-align-center">No Services Running</h3>
        <p className="inverse flush text-align-center">Use the DCOS command line tools to find and install services.</p>
      </div>
    );
  },

  getList: function () {
    let props = this.props;

    return (
      <div className="service-list-component">
        <List
          className="list list-unstyled flush"
          content={this.getServices(props.services, props.healthProcessed)}
          transition={false} />
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
