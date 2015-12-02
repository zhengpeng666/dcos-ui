import _ from "underscore";

import ACLGroupsActions from "../events/ACLGroupsActions";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../events/AppDispatcher";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import Group from "../structs/Group";
import Store from "../utils/Store";

/**
 * This store will keep track of groups and their details
 */
let ACLGroupStore = Store.createStore({
  storeID: "group",

  mixins: [GetSetMixin],

  getSet_data: {
    groups: {},
    // A hash of groupIDs that we're fetching
    // The value is a list of requests that have been received
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

  addUser: ACLGroupsActions.addUser,

  deleteUser: ACLGroupsActions.deleteUser,

  /**
   * Will fetch a group and their details.
   * Will make a request to various different endpoints to get all details
   *
   * @param  {Number} groupID
   */
  fetchGroupWithDetails: function (groupID) {
    let groupsFetching = this.get("groupsFetching");

    groupsFetching[groupID] = {group: false, users: false, permissions: false};
    this.set(groupsFetching);

    ACLGroupsActions.fetchGroup(groupID);
    ACLGroupsActions.fetchGroupPermissions(groupID);
    ACLGroupsActions.fetchGroupUsers(groupID);
  },

  /**
   * Validates if the details for a group have been successfuly fetched
   *
   * @param  {Number} groupID
   * @param  {String} type The type of detail that has been successfuly
   *   received
   */
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
      this.emit(EventTypes.ACL_GROUP_DETAILS_FETCHED_SUCCESS, groupID);
    }
  },

  /**
   * Emits error if we're in the process of fetching details for a group
   * but one of the requests fails.
   *
   * @param  {Number} groupID
   */
  invalidateGroupWithDetailsFetch: function (groupID) {
    let groupsFetching = this.get("groupsFetching");
    if (groupsFetching[groupID] == null) {
      return;
    }

    delete groupsFetching[groupID];
    this.set(groupsFetching);
    this.emit(EventTypes.ACL_GROUP_DETAILS_FETCHED_ERROR, groupID);
  },

  /**
   * Process a group response
   *
   * @param  {Object} groupData see /acl/groups/group schema
   */
  processGroup: function (groupData) {
    let group = this.getGroupRaw(groupData.gid) || {};

    group = _.extend(group, groupData);

    this.setGroup(group.gid, group);
    this.emit(EventTypes.ACL_GROUP_DETAILS_GROUP_CHANGE, group.gid);

    this.validateGroupWithDetailsFetch(group.gid, "group");
  },

  processGroupError: function (groupID) {
    this.emit(EventTypes.ACL_GROUP_DETAILS_GROUP_ERROR, groupID);
    this.invalidateGroupWithDetailsFetch(groupID);
  },

  /**
   * Process a group permissions response
   *
   * @param  {Object} groupID
   * @param  {Object} permissions see /acl/groups/group/permissions schema
   */
  processGroupPermissions: function (groupID, permissions) {
    let group = this.getGroupRaw(groupID) || {};

    group.permissions = permissions;

    // Use groupID throughout as the group may not have been previously set
    this.setGroup(groupID, group);
    this.emit(EventTypes.ACL_GROUP_DETAILS_PERMISSIONS_CHANGE, groupID);

    this.validateGroupWithDetailsFetch(groupID, "permissions");
  },

  processGroupPermissionsError: function (groupID) {
    this.emit(EventTypes.ACL_GROUP_DETAILS_PERMISSIONS_ERROR, groupID);
    this.invalidateGroupWithDetailsFetch(groupID);
  },

  /**
   * Process a grup users response
   *
   * @param  {Object} groupID
   * @param  {Object} users see /acl/groups/group/users schema
   */
  processGroupUsers: function (groupID, users) {
    let group = this.getGroupRaw(groupID) || {};

    group.users = users;

    // Use groupID throughout as the group may not have been previously set
    this.setGroup(groupID, group);
    this.emit(EventTypes.ACL_GROUP_DETAILS_USERS_CHANGE, groupID);

    this.validateGroupWithDetailsFetch(groupID, "users");
  },

  processGroupUsersError: function (groupID) {
    this.emit(EventTypes.ACL_GROUP_DETAILS_USERS_ERROR, groupID);
    this.invalidateGroupWithDetailsFetch(groupID);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_ACL_GROUP_SUCCESS:
        ACLGroupStore.processGroup(action.data);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_ERROR:
        ACLGroupStore.processGroupError(action.groupID);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS:
        ACLGroupStore.processGroupPermissions(action.groupID, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_ERROR:
        ACLGroupStore.processGroupPermissionsError(action.groupID);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_USERS_SUCCESS:
        ACLGroupStore.processGroupUsers(action.groupID, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_USERS_ERROR:
        ACLGroupStore.processGroupUsersError(action.groupID);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_ADD_USER_SUCCESS:
        ACLGroupStore.emit(EventTypes.ACL_GROUP_USERS_CHANGED);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_ADD_USER_ERROR:
        ACLGroupStore.emit(EventTypes.ACL_GROUP_ADD_USER_ERROR);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS:
        ACLGroupStore.emit(EventTypes.ACL_GROUP_USERS_CHANGED);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_ERROR:
        ACLGroupStore.emit(EventTypes.ACL_GROUP_REMOVE_USER_ERROR);
        break;
    }

    return true;
  })

});

export default ACLGroupStore;
