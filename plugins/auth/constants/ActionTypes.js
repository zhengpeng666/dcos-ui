let ActionTypes = {};
[
  'REQUEST_ACL_ROLE_ERROR',
  'REQUEST_ACL_ROLE_SUCCESS',
  'REQUEST_ACL_LOGIN_ERROR',
  'REQUEST_ACL_LOGIN_SUCCESS',
  'REQUEST_ACL_LOGOUT_ERROR',
  'REQUEST_ACL_LOGOUT_SUCCESS'
].forEach(function (actionType) {
  ActionTypes[actionType] = actionType;
});

module.exports = ActionTypes;
