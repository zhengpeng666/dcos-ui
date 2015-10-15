import _ from "underscore";

import EventTypes from "../constants/EventTypes";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import StringUtil from "../utils/StringUtil";

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
    listenAlways: false
  },

  state: {
    store: MesosStateStore,
    event: EventTypes.MESOS_STATE_CHANGE,
    unmountWhen: function (store) {
      return Object.keys(store.get("lastMesosState")).length;
    },
    listenAlways: false
  },

  marathon: {
    store: MarathonStore,
    event: EventTypes.MARATHON_APPS_CHANGE,
    unmountWhen: function (store) {
      return store.hasProcessedApps();
    },
    listenAlways: false
  }
};

const StoreMixin = {
  componentDidMount() {
    if (this.store_listeners) {
      // Create a map of listeners, becomes useful later
      let storesListeners = {};

      // Merges options for each store listener with
      // the ListenersDescription definition above
      this.store_listeners.forEach(function (listener) {
        if (typeof listener === "string") {
          storesListeners[listener] = _.clone(ListenersDescription[listener]);
        } else {
          let storeName = listener.name;
          storesListeners[storeName] = _.defaults(
            listener, ListenersDescription[storeName]
          );
        }
      }, this);

      this.store_listeners = storesListeners;
      this.store_addListeners();
    }
    if (this.parent.componentDidMount) {
      this.parent.componentDidMount();
    }
  },

  componentWillUnmount() {
    this.store_removeListeners();

    if (this.parent.componentWillUnmount) {
      this.parent.componentWillUnmount();
    }
  },

  store_addListeners() {
    Object.keys(this.store_listeners).forEach(function (id) {
      let storeListener = this.store_listeners[id];

      // Check to see if we are already listening
      if (storeListener.activeListenerFn) {
        return;
      }

      storeListener.activeListenerFn = this.store_onStoreChange.bind(this, id);

      storeListener.store.addChangeListener(
        storeListener.event, storeListener.activeListenerFn
      );
    }, this);
  },

  store_removeListeners() {
    Object.keys(this.store_listeners).forEach(function (id) {
      let storeListener = this.store_listeners[id];

      // Check to see if we are already listening
      if (storeListener.activeListenerFn) {
        storeListener.store.removeChangeListener(
          storeListener.event, storeListener.activeListenerFn
        );

        storeListener.activeListenerFn = null;
      }
    }, this);
  },

  /**
   * This is a callback that will be invoked when stores emit a change event
   *
   * @param  {String} id The id of a store
   */
  store_onStoreChange(id, ...args) {
    // See if we need to remove our change listener
    let storeListener = this.store_listeners[id];

    // Maybe remove listener
    if (storeListener.unmountWhen && !storeListener.listenAlways) {
      // Remove change listener if the settings want to unmount after a certain
      // condition is truthy
      let unmountWhen = storeListener.unmountWhen;
      if (unmountWhen && unmountWhen(storeListener.store)) {
        storeListener.store.removeChangeListener(
          storeListener.event, storeListener.activeListenerFn
        );

        storeListener.activeListenerFn = null;
      }
    }

    // Call callback on component that implements mixin if it exists
    let storeName = StringUtil.capitalize(storeListener.store.storeID);
    let onChangeFn = this[`on${storeName}StoreChange`];
    if (this[onChangeFn]) {
      this[onChangeFn].apply(this, args);
    }

    // Always forceUpdate no matter where the change came from
    this.forceUpdate();
  }
};

module.exports = StoreMixin;
