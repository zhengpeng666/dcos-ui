import _ from "underscore";
import React from "react/addons";
import {SidePanel} from "reactjs-components";

import EventTypes from "../constants/EventTypes";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import MarathonStore from "../stores/MarathonStore";

const METHODS_TO_BIND = [
  "handlePanelClose",
  "onStoreChange"
];

const ListenersDescription = {
  summary: {
    store: MesosSummaryStore,
    event: EventTypes.MESOS_SUMMARY_CHANGE,
    unmountWhen: {
      statesProcessed: true
    }
  },
  state: {
    store: MesosStateStore,
    event: EventTypes.MESOS_STATE_CHANGE,
    unmountWhen: {
      lastMesosState: true
    }
  },
  marathon: {
    store: MarathonStore,
    event: EventTypes.MARATHON_APPS_CHANGE,
    unmountWhen: {
      apps: true
    }
  }
};

export default class DetailSidePanel extends React.Component {
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
    let listeners = this.storesListeners;
    let mergedListeners = {};
    this.storesListeners = mergedListeners;

    if (!listeners.length) {
      return;
    }

    listeners.forEach(function (listener) {
      if (typeof listener === "string") {
        mergedListeners[listener] = ListenersDescription[listener];
      } else {
        let storeName = listener.name;
        mergedListeners[storeName] =
          _.defaults(listener, ListenersDescription[storeName]);
      }
    });

    Object.keys(mergedListeners).forEach(function (listener) {
      var store = mergedListeners[listener];
      store.store.addChangeListener(
        store.event, this.onStoreChange
      );
    }, this);

    this.storesListeners = mergedListeners;
    this.forceUpdate();
  }

  componentWillUnmount() {
    Object.keys(this.storesListeners).forEach(function (listener) {
      var store = this.storesListeners[listener];
      store.store.removeChangeListener(
        store.event, this.onStoreChange
      );
    }, this);
  }

  onStoreChange() {
    Object.keys(this.storesListeners).forEach(function (listener) {
      var store = this.storesListeners[listener];

      if (!store.unmountWhen || store.listenAlways) {
        return;
      }

      Object.keys(store.unmountWhen).forEach(function (prop) {
        if (!!store.store.get(prop) === store.unmountWhen[prop]
          || store.listenOnce) {
          store.store.removeChangeListener(
            store.event, this.onStoreChange
          );
        }
      }, this);
    }, this);

    this.forceUpdate();
  }

  handlePanelClose() {
    if (_.isFunction(this.props.onClose)) {
      this.props.onClose();
    }
    this.forceUpdate();
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
