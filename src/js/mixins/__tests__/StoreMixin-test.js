jest.dontMock("../StoreMixin");
jest.dontMock("../../stores/MarathonStore");
jest.dontMock("../../utils/Store");

var _ = require("underscore");
var StoreMixin = require("../StoreMixin");
var MarathonStore = require("../../stores/MarathonStore");

describe("StoreMixin", function () {

  beforeEach(function () {
    this.instance = _.extend({}, StoreMixin);
    spyOn(MarathonStore, "addChangeListener");
  });

  describe("#componentDidMount", function () {

    it("should create an object for store_listeners", function () {
      this.instance.store_listeners = ["marathon"];
      this.instance.componentDidMount();

      expect(Object.keys(this.instance.store_listeners)).toEqual(["marathon"]);
    });

    it("sets up each store listener with a configuration", function () {
      this.instance.store_listeners = ["marathon"];
      this.instance.componentDidMount();

      let type = typeof this.instance.store_listeners.marathon;
      expect(type).toEqual("object");
    });

    it("merges custom configuration", function () {
      this.instance.store_listeners = [{
        name: "marathon",
        event: "FOO"
      }];
      this.instance.componentDidMount();

      expect(this.instance.store_listeners.marathon.event).toEqual("FOO");
    });

    it("starts listening for store changes", function () {
      this.instance.store_listeners = ["marathon"];
      this.instance.componentDidMount();
      expect(MarathonStore.addChangeListener.calls.length).toEqual(1);
    });

    it("calls the event listener with the configured event", function () {
      this.instance.store_listeners = [{
        name: "marathon",
        event: "FOO"
      }];
      this.instance.componentDidMount();
      expect(MarathonStore.addChangeListener)
        .toHaveBeenCalledWith("FOO", function() {});
    });

  });

  describe("#set", function () {

  });

});
