let EventTypes = {};
[
  'ACL_DIRECTORIES_CHANGED',
  'ACL_DIRECTORIES_ERROR',
  'ACL_DIRECTORY_ADD_SUCCESS',
  'ACL_DIRECTORY_ADD_ERROR',
  'ACL_DIRECTORY_DELETE_SUCCESS',
  'ACL_DIRECTORY_DELETE_ERROR',
  'ACL_DIRECTORY_TEST_SUCCESS',
  'ACL_DIRECTORY_TEST_ERROR'
].forEach(function (eventType) {
  EventTypes[eventType] = eventType;
});

module.exports = EventTypes;
