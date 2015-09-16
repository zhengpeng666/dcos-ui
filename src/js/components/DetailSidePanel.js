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

export default class DetailSidePanel extends Util.mixin(InternalStorageMixin) {
  constructor() {
    super(...arguments);

    this.storesListeners = [];

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props;
    let currentItem = props.itemID;
    let nextItem = nextProps.itemID;

    let currentTab = this.state.currentTab;
    let nextTab = nextState.currentTab;

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

    changeListeners.call(this, this.storesListeners, "addChangeListener");
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
    if (_.isFunction(this.props.onClose)) {
      this.props.onClose();
    }

    let routes = this.context.router.getCurrentRoutes();
    let pageBefore = routes[routes.length - 2];
    this.context.router.transitionTo(pageBefore.name);
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

    let axisConfiguration = {
      x: {hideMatch: /^0$/},
      y: {showPercentage: false, suffix: "%"}
    };

    let maxY = 5;
    totalResources[resource].forEach(function(resource) {
      if (resource.percentage > maxY) {
        maxY = resource.percentage;
      }
    });

    maxY *= 1.5; // Multiply by 150%
    maxY /= 10; // Divide so that we can round to nearest tenth
    maxY = Math.round(maxY); // Round
    maxY *= 10; // Multiply so that we get a percentage number between 0-100
    maxY = Math.min(100, maxY); // Don't let it be greater than 100%

    return (
      <div key={resource} className="column-4
        flex-box-align-vertical-center
        container-pod
        container-pod-super-short
        flush-top">
        <div>
          <h3 className="flush-top flush-bottom text-color-neutral">
            {resourceValue}
          </h3>
          <span className={`text-color-${colorIndex}`}>
            {resourceLabel.toUpperCase()}
          </span>
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

  getNotFound(itemType) {
    return (
      <div>
        <h1 className="text-align-center inverse overlay-header">
          {`Error finding ${itemType}`}
        </h1>
        <div className="container container-pod text-align-center flush-top text-danger">
          {`Did not find a ${itemType} by the id "${this.props.itemID}"`}
        </div>
      </div>
    );
  }

  getHeader() {
    return (
      <div>
        <span className="button button-link button-inverse"
          onClick={this.handlePanelClose}>
          <i className="side-panel-detail-close"></i>
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
    // TODO: rename from classNames to className
    return (
      <SidePanel classNames="side-panel-detail"
        header={this.getHeader()}
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
