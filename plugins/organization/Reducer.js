import aclReducer from './submodules/acl/Reducer';
import directoriesReducer from './submodules/directories/Reducer';
import groupsReducer from './submodules/groups/Reducer';

module.exports = function (state = {}, action) {
  return {
    acl: aclReducer(state.acl, action),
    directories: directoriesReducer(state.directories, action),
    groups: groupsReducer(state.groups, action)
  };
};
