var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

var CHANGE_EVENT = "change";

var _mesosState = [
  {Name: "Service 1", CPU: "∞"},
  {Name: "Service 2", CPU: 100000000},
  {Name: "Service 3", CPU: -100000000}
];

var MesosStateStore = _.extend({}, EventEmitter.prototype, {

  getAll: function () {
    return _mesosState;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

});

module.exports = MesosStateStore;
