import _ from "underscore";

import ACLGroupsStore from "../stores/ACLGroupsStore";
import ACLGroupStore from "../stores/ACLGroupStore";
import ACLUsersStore from "../stores/ACLUsersStore";
import ACLUserStore from "../stores/ACLUserStore";
import EventTypes from "../constants/EventTypes";
import MarathonStore from "../stores/MarathonStore";
import MesosStateStore from "../stores/MesosStateStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import StringUtil from "../utils/StringUtil";

const LISTENER_SUFFIX = "ListenerFn";

const ListenersDescription = {
  summary: {
    // Which store to use
    store: MesosSummaryStore,

    // What event to listen to
    events: {
      success: EventTypes.MESOS_SUMMARY_CHANGE,
      error: EventTypes.MESOS_SUMMARY_REQUEST_ERROR
    },

    // When to remove listener
    unmountWhen: function (store, event) {
      if (event === "success") {
        return store.get("statesProcessed");
      }
    },

    // Set to true to keep listening until unmount
    listenAlways: true
  },

  state: {
    store: MesosStateStore,
    events: {
      success: EventTypes.MESOS_STATE_CHANGE,
      error: EventTypes.MESOS_STATE_REQUEST_ERROR
    },
    unmountWhen: function (store, event) {
      if (event === "success") {
        return Object.keys(store.get("lastMesosState")).length;
      }
    },
    listenAlways: true
  },

  marathon: {
    store: MarathonStore,
    events: {
      success: EventTypes.MARATHON_APPS_CHANGE,
      error: EventTypes.MARATHON_APPS_ERROR
    },
    unmountWhen: function (store, event) {
      if (event === "success") {
        return store.hasProcessedApps();
      }
    },
    listenAlways: true
  },

  groups: {
    store: ACLGroupsStore,
    events: {
      success: EventTypes.ACL_GROUPS_CHANGE,
      error: EventTypes.ACL_GROUPS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  group: {
    store: ACLGroupStore,
    events: {
      success: EventTypes.ACL_GROUP_DETAILS_GROUP_CHANGE,
      error: EventTypes.ACL_GROUP_DETAILS_GROUP_ERROR,
      permissionsSuccess: EventTypes.ACL_GROUP_DETAILS_PERMISSIONS_CHANGE,
      permissionsError: EventTypes.ACL_GROUP_DETAILS_PERMISSIONS_ERROR,
      usersSuccess: EventTypes.ACL_GROUP_DETAILS_USERS_CHANGE,
      usersError: EventTypes.ACL_GROUP_DETAILS_USERS_ERROR,
      fetchedDetailsSuccess: EventTypes.ACL_GROUP_DETAILS_FETCHED_SUCCESS,
      fetchedDetailsError: EventTypes.ACL_GROUP_DETAILS_FETCHED_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  users: {
    store: ACLUsersStore,
    events: {
      success: EventTypes.ACL_USERS_CHANGE,
      error: EventTypes.ACL_USERS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  user: {
    store: ACLUserStore,
    events: {
      success: EventTypes.ACL_USER_DETAILS_USER_CHANGE,
      error: EventTypes.ACL_USER_DETAILS_USER_ERROR,
      permissionsSuccess: EventTypes.ACL_USER_DETAILS_PERMISSIONS_CHANGE,
      permissionsError: EventTypes.ACL_USER_DETAILS_PERMISSIONS_ERROR,
      groupsSuccess: EventTypes.ACL_USER_DETAILS_GROUPS_CHANGE,
      groupsError: EventTypes.ACL_USER_DETAILS_GROUPS_ERROR,
      fetchedDetailsSuccess: EventTypes.ACL_USER_DETAILS_FETCHED_SUCCESS,
      fetchedDetailsError: EventTypes.ACL_USER_DETAILS_FETCHED_ERROR,
      createSuccess: EventTypes.ACL_USER_CREATE_SUCCESS,
      createError: EventTypes.ACL_USER_CREATE_ERROR,
      updateSuccess: EventTypes.ACL_USER_UPDATE_SUCCESS,
      updateError: EventTypes.ACL_USER_UPDATE_ERROR,
      deleteSuccess: EventTypes.ACL_USER_DELETE_SUCCESS,
      deleteError: EventTypes.ACL_USER_DELETE_ERROR,
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
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
          // Use all defaults
          storesListeners[listener] = _.clone(ListenersDescription[listener]);
        } else {
          let storeName = listener.name;
          let events = listener.events;

          // Populate events by key. For example, a component
          // may only want to listen for "success" events
          if (events) {
            listener.events = {};
            events.forEach(function (event) {
              listener.events[event] =
                ListenersDescription[storeName].events[event];
            });
          }

          storesListeners[storeName] = _.defaults(
            listener, ListenersDescription[storeName]
          );
        }
      });

      this.store_listeners = storesListeners;
      this.store_addListeners();
    }
  },

  componentWillUnmount() {
    this.store_removeListeners();
  },

  store_addListeners() {
    Object.keys(this.store_listeners).forEach((storeID) => {
      let listenerDetail = this.store_listeners[storeID];

      // Loop through all available events
      Object.keys(listenerDetail.events).forEach((event) => {
        let eventListenerID = `${event}${LISTENER_SUFFIX}`;

        // Check to see if we are already listening for this event
        if (listenerDetail[eventListenerID]) {
          return;
        }

        // Create listener
        listenerDetail[eventListenerID] = this.store_onStoreChange.bind(
          this, storeID, event
        );

        // Set up listener with store
        listenerDetail.store.addChangeListener(
          listenerDetail.events[event], listenerDetail[eventListenerID]
        );
      });
    });
  },

  store_removeListeners() {
    Object.keys(this.store_listeners).forEach((storeID) => {
      let listenerDetail = this.store_listeners[storeID];

      // Loop through all available events
      Object.keys(listenerDetail.events).forEach((event) => {
        this.store_removeEventListenerForStoreID(storeID, event);
      });
    });
  },

  store_removeEventListenerForStoreID(storeID, event) {
    let listenerDetail = this.store_listeners[storeID];
    let eventListenerID = `${event}${LISTENER_SUFFIX}`;

    // Return if there was no listener setup
    if (!listenerDetail[eventListenerID]) {
      return;
    }

    listenerDetail.store.removeChangeListener(
      listenerDetail.events[event], listenerDetail[eventListenerID]
    );

    listenerDetail[eventListenerID] = null;
  },

  /**
   * This is a callback that will be invoked when stores emit a change event
   *
   * @param  {String} storeID The id of a store
   * @param  {String} event Normally a string containing success|error
   */
  store_onStoreChange(storeID, event, ...args) {
    // See if we need to remove our change listener
    let listenerDetail = this.store_listeners[storeID];
    // Maybe remove listener
    if (listenerDetail.unmountWhen && !listenerDetail.listenAlways) {
      // Remove change listener if the settings want to unmount after a certain
      // condition is truthy
      if (listenerDetail.unmountWhen(listenerDetail.store, event)) {
        this.store_removeEventListenerForStoreID(storeID, event);
      }
    }

    // Call callback on component that implements mixin if it exists
    let storeName = StringUtil.capitalize(listenerDetail.store.storeID);
    let eventName = StringUtil.capitalize(event);
    let onChangeFn = `on${storeName}Store${eventName}`;
    if (this[onChangeFn]) {
      this[onChangeFn].apply(this, args);
    }

    // Always forceUpdate no matter where the change came from
    this.forceUpdate();
  }
};

module.exports = StoreMixin;
