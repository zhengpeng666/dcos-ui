import _ from "underscore";
import React from "react/addons";
import {SidePanel} from "reactjs-components";

import BarChart from "./charts/BarChart";
import Chart from "./charts/Chart";
import Config from "../config/Config";
import EventTypes from "../constants/EventTypes";
import InternalStorageMixin from "../mixins/InternalStorageMixin";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import ResourceTypes from "../constants/ResourceTypes";
import TabsMixin from "../mixins/TabsMixin";
import Units from "../utils/Units";
import Util from "../utils/Util";

// number to fit design of width vs. height ratio
const WIDTH_HEIGHT_RATIO = 4.5;

const METHODS_TO_BIND = [
  "handlePanelClose",
  "onStoreChange"
];

const ListenersDescription = {
  summary: {
    store: MesosSummaryStore,
    event: EventTypes.MESOS_SUMMARY_CHANGE,
    unmountWhen: function (store) {
      return store.get("statesProcessed");
    }
  },
  state: {
    store: MesosStateStore,
    event: EventTypes.MESOS_STATE_CHANGE,
    unmountWhen: function (store) {
      return Object.keys(store.get("lastMesosState")).length;
    }
  },
  marathon: {
    store: MarathonStore,
    event: EventTypes.MARATHON_APPS_CHANGE,
    unmountWhen: function (store) {
      return store.hasProcessedApps();
    }
  }
};

function changeListeners(listeners, changeListener) {
  Object.keys(listeners).forEach(function (listener) {
    let store = listeners[listener];
    store.store[changeListener](
      store.event, this.onStoreChange
    );
  }, this);
}

export default class DetailSidePanel extends Util.mixin(InternalStorageMixin, TabsMixin) {
  constructor() {
    super(...arguments);

    this.storesListeners = [];
    this.tabs = {
      tasks: "Tasks",
      details: "Details"
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);

    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props;
    let currentItem = props.itemID;
    let nextItem = nextProps.itemID;

    let currentTab = this.state.currentTab;
    let nextTab = nextState.currentTab;

    if (props.open !== nextProps.open) {
      if (nextProps.open) {
        changeListeners.call(this, this.storesListeners, "addChangeListener");
        this.mountedAt = Date.now();
      } else {
        changeListeners.call(
          this, this.storesListeners, "removeChangeListener"
        );
      }
    }

    return nextItem && currentItem !== nextItem ||
      currentTab !== nextTab || props.open !== nextProps.open;
  }

  componentDidMount() {
    this.storesListeners.forEach(function (listener, i) {
      if (typeof listener === "string") {
        this.storesListeners[i] = _.clone(ListenersDescription[listener]);
      } else {
        let storeName = listener.name;
        this.storesListeners[i] = _.defaults(
          listener, ListenersDescription[storeName]
        );
      }
    }, this);
  }

  componentWillUnmount() {
    changeListeners.call(this, this.storesListeners, "removeChangeListener");
  }

  onStoreChange() {
    // Iterate through all the current stores to see if we should remove our
    // change listener.
    this.storesListeners.forEach(function (listener, i) {
      if (!listener.unmountWhen || listener.listenAlways) {
        return;
      }

      // Remove change listener if the settings want to unmount after a certain
      // time such as "appsProcessed".
      if (listener.unmountWhen && listener.unmountWhen(listener.store)) {
        listener.store.removeChangeListener(
          listener.event, this.onStoreChange
        );

        this.storesListeners.splice(i, 1);
      }
    }, this);

    // Always forceUpdate no matter where the change came from
    this.forceUpdate();
  }

  handlePanelClose() {
    if (!this.props.open) {
      return;
    }

    if (_.isFunction(this.props.onClose)) {
      this.props.onClose();
    }

    let routes = this.context.router.getCurrentRoutes();
    let pageBefore = routes[routes.length - 2];
    this.context.router.transitionTo(pageBefore.name);
  }

  handleTabClick(nextTab) {
    this.setState({currentTab: nextTab});
  }

  getKeyValuePairs(hash, headline) {
    if (_.isEmpty(hash)) {
      return null;
    }

    let items = Object.keys(hash).map(function (key) {
      return (
        <dl key={key} className="row flex-box">
          <dt className="column-3 emphasize">
            {key}
          </dt>
          <dd className="column-9">
            {hash[key]}
          </dd>
        </dl>
      );
    });

    // Wrap in headline element and classes
    if (headline != null) {
      headline = (
        <h3 className="flush-top">
          {headline}
        </h3>
      );
    }

    return (
      <div>
        {headline}
        {items}
      </div>
    );
  }

  getResourceChart(resource, totalResources) {
    let colorIndex = ResourceTypes[resource].colorIndex;
    let resourceLabel = ResourceTypes[resource].label;
    let resourceData = [{
      name: "Alloc",
      colorIndex: colorIndex,
      values: totalResources[resource]
    }];
    let resourceValue = Units.formatResource(
      resource, _.last(totalResources[resource]).value
    );
    let resourceIconClasses = `icon icon-sprite icon-sprite-medium
      icon-sprite-medium-color icon-resources-${resourceLabel.toLowerCase()}`;

    let axisConfiguration = {
      x: {hideMatch: /^0$/},
      y: {showPercentage: false, suffix: "%"}
    };

    let maxY = 5;
    totalResources[resource].forEach(function (resourceTotal) {
      if (resourceTotal.percentage > maxY) {
        maxY = resourceTotal.percentage;
      }
    });

    maxY *= 1.5; // Multiply by 150%
    maxY /= 10; // Divide so that we can round to nearest tenth
    maxY = Math.round(maxY); // Round
    maxY *= 10; // Multiply so that we get a percentage number between 0-100
    maxY = Math.min(100, maxY); // Don't let it be greater than 100%

    return (
      <div key={resource} className="column-12
        flex-box-align-vertical-center
        container-pod
        container-pod-super-short
        flush-top">
        <div className="media-object media-object-align-middle">
          <div className="media-object-icon media-object-icon-medium">
            <i className={resourceIconClasses}></i>
          </div>
          <div className="media-object-content">
            <h4 className="flush-top flush-bottom text-color-neutral">
              {resourceValue}
            </h4>
            <span className={`side-panel-resource-label
                text-color-${colorIndex}`}>
              {resourceLabel.toUpperCase()}
            </span>
          </div>
        </div>

        <Chart calcHeight={function (w) { return w / WIDTH_HEIGHT_RATIO; }}
          delayRender={true}>
          <BarChart
            axisConfiguration={axisConfiguration}
            data={resourceData}
            inverseStyle={true}
            margin={{top: 0, left: 43, right: 10, bottom: 40}}
            maxY={maxY}
            refreshRate={Config.getRefreshRate()}
            ticksY={3}
            xGridLines={0}
            y="percentage" />
        </Chart>
      </div>
    );
  }

  getCharts(itemType, item) {
    if (!item) {
      return null;
    }

    let states = MesosSummaryStore.get("states");
    let resources = states[`getResourceStatesFor${itemType}IDs`]([item.id]);

    let charts = [
      this.getResourceChart("cpus", resources),
      this.getResourceChart("mem", resources),
      this.getResourceChart("disk", resources)
    ];

    return charts.map(function (chart, i) {
      return (
        <div key={i} className="column-12 column-mini-4">
          <div className="row chart">
            {chart}
          </div>
        </div>
      );
    });
  }

  getNotFound(itemType) {
    return (
      <div className="container container-fluid container-pod text-align-center">
        <h3 className="flush-top text-align-center">
          {`Error finding ${itemType}`}
        </h3>
        <p className="flush">{`Did not find a ${itemType} by the id "${this.props.itemID}"`}</p>
      </div>
    );
  }

  getLoadingScreen() {
    return (
      <div className="
        container
        container-fluid
        container-pod
        text-align-center
        vertical-center
        inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getHeader() {
    return (
      <div className="side-panel-header-actions side-panel-header-actions-primary">
        <span className="side-panel-header-action"
          onClick={this.handlePanelClose}>
          <i className="icon icon-sprite icon-sprite-small icon-close icon-sprite-small-white"></i>
          Close
        </span>
      </div>
    );
  }

  getContents() {
    // Needs to be implemented
    return null;
  }

  render() {
    return (
      <SidePanel className="side-panel-detail"
        header={this.getHeader()}
        headerContainerClass="side-panel-header-container container container-fluid container-fluid-narrow container-pod container-pod-short"
        bodyClass="side-panel-content flex-container-col"
        onClose={this.handlePanelClose}
        open={this.props.open}>
        {this.getContents()}
      </SidePanel>
    );
  }
}

DetailSidePanel.contextTypes = {
  router: React.PropTypes.func
};

DetailSidePanel.propTypes = {
  itemID: React.PropTypes.string,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool
};

DetailSidePanel.animationLengthSeconds = .5;
