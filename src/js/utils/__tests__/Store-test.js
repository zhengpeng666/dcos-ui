var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../utils/Store");

var GetSetMixin = require("../../mixins/GetSetMixin");
var Store = require("../../utils/Store");

var EventEmitterProps = [
  "addListener",
  "emit",
  "listeners",
  "mixins",
  "on",
  "once",
  "removeAllListeners",
  "removeListener",
  "setMaxListeners"
];

describe("Store", function () {

  describe("#createStore", function () {

    it("should return a store if given store is undefined", function () {
      var newStore = Store.createStore();

      expect(typeof newStore).toEqual("object");
    });

    it("should not modify the EventEmitter", function () {
      var newStore = Store.createStore({
        someProperty: "someValue"
      });

      expect(EventEmitter).not.toEqual(newStore);
    });

    it("should be able to create a store without mixins", function () {
      var newStore = Store.createStore({});
      var props = _.sortBy(Object.keys(newStore), function (el) {
        return el;
      });
      props.map(function (key, index) {
        expect(key).toEqual(EventEmitterProps[index]);
      });
    });

    it("should be able to create a store with 1 mixin", function () {
      var newStore = Store.createStore({
        mixins: [GetSetMixin]
      });

      Object.keys(newStore).map(function (key, index) {
        if (EventEmitterProps[index] == null) {
          expect(
            key === "get" ||
            key === "set" ||
            key === "mixins"
          ).toEqual(true);
        }
      });
    });

    it("should be able to create a store with multiple mixins", function () {
      var newStore = Store.createStore({
        mixins: [
          {someProperty: "someValue"},
          {anotherProperty: "anotherValue"}
        ]
      });

      expect(newStore.someProperty).toEqual("someValue");
      expect(newStore.anotherProperty).toEqual("anotherValue");
    });

    it("should let store take preceedence over mixins", function () {
      var newStore = Store.createStore({
        someProperty: "someValue",
        mixins: [{someProperty: "anotherValue"}]
      });

      expect(newStore.someProperty).toEqual("someValue");
    });

    it("should let mixins take preceedence over EventEmitter", function () {
      var newStore = Store.createStore({
        mixins: [{emit: "someValue"}]
      });

      expect(newStore.emit).toEqual("someValue");
    });

  });

});
