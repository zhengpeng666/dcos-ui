let ActionTypes = {};
[
  'INTERCOM_ACTION',
  'REQUEST_INTERCOM_CLOSE',
  'REQUEST_INTERCOM_OPEN'
].forEach(function (actionType) {
  ActionTypes[actionType] = actionType;
});

module.exports = ActionTypes;
