var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

jest.dontMock("../../utils/Store");

var Store = require("../../utils/Store");

describe("Store", function () {

  describe("#createStore", function () {

    beforeEach(function () {
      this.emitterProps = _.sortBy(Object.keys(EventEmitter.prototype), function (el) {
        return el;
      });
    });

    it("should return a store if given store is undefined", function () {
      var newStore = Store.createStore();

      expect(typeof newStore).toEqual("object");
    });

    it("should be able to create a store without mixins", function () {
      var emitterProps = this.emitterProps;
      var newStore = Store.createStore({});
      var props = _.sortBy(Object.keys(newStore), function (el) {
        return el;
      });
      props.map(function (key, index) {
        expect(key).toEqual(emitterProps[index]);
      });
    });

    it("should be able to create a store with 1 mixin", function () {
      var emitterProps = this.emitterProps;
      var newStore = Store.createStore({
        mixins: [{someProperty: "someValue"}]
      });

      Object.keys(newStore).map(function (key, index) {
        if (emitterProps[index] == null) {
          expect(key === "someProperty" || key === "mixins").toEqual(true);
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
