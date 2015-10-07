import _ from "underscore";

import EventTypes from "../constants/EventTypes";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";

const ListenersDescription = {
  summary: {

    // Which store to use
    store: MesosSummaryStore,

    // What event to listen to
    event: EventTypes.MESOS_SUMMARY_CHANGE,

    // When to remove listener
    unmountWhen: function (store) {
      return store.get("statesProcessed");
    },

    // Set to true to keep listening until unmount
    listenAlways: false,

    // Make onChange a function to use your own callback. The default listener
    // simply forceUpdates
    onChange: false
  },

  state: {
    store: MesosStateStore,
    event: EventTypes.MESOS_STATE_CHANGE,
    unmountWhen: function (store) {
      return Object.keys(store.get("lastMesosState")).length;
    },
    listenAlways: false,
    onChange: false
  },

  marathon: {
    store: MarathonStore,
    event: EventTypes.MARATHON_APPS_CHANGE,
    unmountWhen: function (store) {
      return store.hasProcessedApps();
    },
    listenAlways: false,
    onChange: false
  }
};

const StoreMixin = {
  componentDidMount() {
    if (this.storesListeners) {
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

    if (super.componentDidMount) {
      super.componentDidMount();
    }
  },

  componentWillUnmount() {
    this.changeListeners.call(this, this.storesListeners, "removeChangeListener");

    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }
  },

  changeListeners(listeners, changeListener) {
    Object.keys(listeners).forEach(function (listener) {
      let store = listeners[listener];
      let onChange = store.onChange || this.onStoreChange;

      store.store[changeListener](
        store.event, onChange
      );
    }, this);
  },

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
};

module.exports = StoreMixin;
