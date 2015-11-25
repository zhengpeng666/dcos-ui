import _ from "underscore";
import ACLGroupActions from "../events/ACLGroupActions";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../events/AppDispatcher";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import Group from "../structs/Group";
import Store from "../utils/Store";

let GroupDetailStore = Store.createStore({
  storeID: "groupDetail",

  mixins: [GetSetMixin],

  getSet_data: {
    groups: {},
    groupsFetching: {}
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  getGroupRaw: function (groupID) {
    return this.get("groups")[groupID];
  },

  getGroup: function (groupID) {
    return new Group(this.getGroupRaw(groupID));
  },

  setGroup: function (groupID, group) {
    let groups = this.get("groups");
    groups[groupID] = group;
    this.set(groups);
  },

  fetchGroupWithDetails: function (groupID) {
    let groupsFetching = this.get("groupsFetching");

    groupsFetching[groupID] = {group: false, users: false, permissions: false};
    this.set(groupsFetching);

    ACLGroupActions.fetchGroup(groupID);
    ACLGroupActions.fetchGroupPermissions(groupID);
    ACLGroupActions.fetchGroupUsers(groupID);
  },

  validateGroupWithDetailsFetch: function (groupID, type) {
    let groupsFetching = this.get("groupsFetching");
    if (groupsFetching[groupID] == null) {
      return;
    }

    groupsFetching[groupID][type] = true;

    let fetchedAll = true;
    Object.keys(groupsFetching[groupID]).forEach(function (key) {
      if (groupsFetching[groupID][key] === false) {
        fetchedAll = false;
      }
    });

    if (fetchedAll) {
      delete groupsFetching[groupID];
      this.set(groupsFetching);
      this.emit(EventTypes.GROUP_DETAILS_FETCHED_SUCCESS, groupID);
    }
  },

  invalidateGroupWithDetailsFetch: function (groupID) {
    let groupsFetching = this.get("groupsFetching");
    if (groupsFetching[groupID] == null) {
      return;
    }

    delete groupsFetching[groupID];
    this.set(groupsFetching);
    this.emit(EventTypes.GROUP_DETAILS_FETCHED_ERROR, groupID);
  },

  processGroup: function (groupData) {
    let group = this.getGroupRaw(groupData.gid) || {};

    group = _.extend(group, groupData);

    this.setGroup(group.gid, group);
    this.emit(EventTypes.GROUP_DETAILS_GROUP_CHANGE, group.gid);

    this.validateGroupWithDetailsFetch(group.gid, "group");
  },

  processGroupError: function (groupID) {
    this.emit(EventTypes.GROUP_DETAILS_GROUP_ERROR, groupID);
    this.invalidateGroupWithDetailsFetch(groupID, "group");
  },

  processGroupPermissions: function (groupID, permissions) {
    let group = this.getGroupRaw(groupID) || {};

    group.permissions = permissions;

    this.setGroup(groupID, group);
    this.emit(EventTypes.GROUP_DETAILS_PERMISSIONS_CHANGE, groupID);

    this.validateGroupWithDetailsFetch(groupID, "permissions");
  },

  processGroupPermissionsError: function (groupID) {
    this.emit(EventTypes.GROUP_DETAILS_PERMISSIONS_ERROR, groupID);
    this.invalidateGroupWithDetailsFetch(groupID, "permissions");
  },

  processGroupUsers: function (groupID, users) {
    let group = this.getGroupRaw(groupID) || {};

    group.users = users;

    this.setGroup(groupID, group);
    this.emit(EventTypes.GROUP_DETAILS_USERS_CHANGE, groupID);

    this.validateGroupWithDetailsFetch(groupID, "users");
  },

  processGroupUsersError: function (groupID) {
    this.emit(EventTypes.GROUP_DETAILS_USERS_ERROR, groupID);
    this.invalidateGroupWithDetailsFetch(groupID, "users");
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_ACL_GROUP_DETAILS_GROUP_SUCCESS:
        GroupDetailStore.processGroup(action.data);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_DETAILS_GROUP_ERROR:
        GroupDetailStore.processGroupError(action.groupID);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_DETAILS_PERMISSIONS_SUCCESS:
        GroupDetailStore.processGroupPermissions(action.groupID, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_DETAILS_PERMISSIONS_ERROR:
        GroupDetailStore.processGroupPermissionsError(action.groupID);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_DETAILS_USERS_SUCCESS:
        GroupDetailStore.processGroupUsers(action.groupID, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_DETAILS_USERS_ERROR:
        GroupDetailStore.processGroupUsersError(action.groupID);
        break;
    }

    return true;
  })

});

export default GroupDetailStore;
