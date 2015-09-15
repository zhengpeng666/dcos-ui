import _ from "underscore";
import React from "react/addons";
import {SidePanel} from "reactjs-components";

import EventTypes from "../constants/EventTypes";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";

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

function changeListeners(listeners, changeListener) {
  Object.keys(listeners).forEach(function (listener) {
    let store = listeners[listener];
    store.store[changeListener](
      store.event, this.onStoreChange
    );
  }, this);
}

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
      Object.keys(listener.unmountWhen).forEach(function (prop) {
        if (!!listener.store.get(prop) === listener.unmountWhen[prop]) {
          listener.store.removeChangeListener(
            listener.event, this.onStoreChange
          );
          this.storesListeners.splice(i, 1);
        }
      }, this);
    }, this);

    // Always forceUpdate no matter where the change came from
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
