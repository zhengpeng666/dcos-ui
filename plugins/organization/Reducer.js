import aclReducer from './submodules/acl/Reducer';

module.exports = function (state = {}, action) {
  return {
    acl: aclReducer(state, action)
  };
};
