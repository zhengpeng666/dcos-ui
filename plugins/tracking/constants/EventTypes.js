let EventTypes = {};
[
  'INTERCOM_CHANGE'
].forEach(function (eventType) {
  EventTypes[eventType] = eventType;
});

module.exports = EventTypes;
