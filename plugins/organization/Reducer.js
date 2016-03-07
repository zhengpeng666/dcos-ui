import aclReducer from './submodules/acl/Reducer';
import directoriesReducer from './submodules/directories/Reducer';
import groupsReducer from './submodules/groups/Reducer';
import usersReducer from './submodules/users/Reducer';

const initialState = {
  acl: {},
  directories: {},
  groups: {}
};

module.exports = function (state = initialState, action) {
  return {
    acl: aclReducer(state.acl, action),
    directories: directoriesReducer(state.directories, action),
    groups: groupsReducer(state.groups, action),
    users: usersReducer(state.users, action)
  };
};
