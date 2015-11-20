jest.dontMock("../StoreMixin");
jest.dontMock("../../constants/EventTypes");
jest.dontMock("../../stores/MarathonStore");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/Util");

var EventTypes = require("../../constants/EventTypes");
var MarathonStore = require("../../stores/MarathonStore");
var StoreMixin = require("../StoreMixin");
var Util = require("../../utils/Util");

describe("StoreMixin", function () {

  beforeEach(function () {
    class MyClass extends Util.mixin(StoreMixin) {
      forceUpdate() {}
    }
    this.instance = new MyClass();
    spyOn(MarathonStore, "addChangeListener");
    spyOn(MarathonStore, "removeChangeListener");
  });

  describe("#componentDidMount", function () {

    it("does not create any store listeners", function () {
      this.instance.componentDidMount();
      expect(this.instance.store_listeners).toEqual(undefined);
    });

    it("calls #componentDidMount on the parent", function () {
      spyOn(this.instance.parent, "componentDidMount");
      this.instance.componentDidMount();
      expect(this.instance.parent.componentDidMount).toHaveBeenCalled();
    });

    it("calls the next mixin's #componentDidMount", function () {
      let finalMixin = jasmine.createSpyObj("finalMixin", [
        "componentDidMount"
      ]);

      class MyClass extends Util.mixin(StoreMixin, finalMixin) {}
      let instance = new MyClass();
      instance.componentDidMount();

      expect(finalMixin.componentDidMount.calls.length).toEqual(1);
    });

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
        listenAlways: false
      }];
      this.instance.componentDidMount();

      expect(this.instance.store_listeners.marathon.listenAlways).toBeFalsy();
    });

    it("starts listening for store changes", function () {
      this.instance.store_listeners = ["marathon"];
      this.instance.componentDidMount();
      // 2 because of success/error events
      expect(MarathonStore.addChangeListener.calls.length).toEqual(2);
    });

    it("calls the event listener with the configured event", function () {
      this.instance.store_listeners = [{
        name: "marathon",
        events: ["success"]
      }];
      this.instance.componentDidMount();

      expect(MarathonStore.addChangeListener.calls.length).toEqual(1);
      expect(MarathonStore.addChangeListener).toHaveBeenCalledWith(
        EventTypes.MARATHON_APPS_CHANGE, jasmine.any(Function)
      );
    });

  });

  describe("#store_addListeners", function () {

    it("doesn't create new listeners when they already exist", function () {
      this.instance.store_listeners = ["marathon"];
      this.instance.componentDidMount();
      this.instance.store_addListeners();
      // 2 because of success/error events
      expect(MarathonStore.addChangeListener.calls.length).toEqual(2);
    });

  });

  describe("#store_removeListeners", function () {

    it("it won't try to remove listeners that are not setup", function () {
      this.instance.store_listeners = [{
        name: "marathon",
        events: ["success"]
      }];
      this.instance.componentDidMount();
      // Multiple calls
      this.instance.store_removeListeners();
      this.instance.store_removeListeners();

      expect(MarathonStore.removeChangeListener.calls.length).toEqual(1);
    });

  });

  describe("#componentWillUnmount", function () {

    it("calls the next mixin's #componentWillUnmount", function () {
      let finalMixin = jasmine.createSpyObj("finalMixin", [
        "componentDidMount", "componentWillUnmount"
      ]);

      class MyClass extends Util.mixin(StoreMixin, finalMixin) {}
      let instance = new MyClass();
      instance.store_listeners = ["marathon"];
      instance.componentDidMount();
      instance.componentWillUnmount();

      expect(finalMixin.componentWillUnmount.calls.length).toEqual(1);
    });

    it("removes listeners from store", function () {
      this.instance.store_listeners = ["marathon"];
      this.instance.componentDidMount();
      this.instance.componentWillUnmount();
      // 2 because of success/error events
      expect(MarathonStore.removeChangeListener.calls.length).toEqual(2);
    });

    it("removes event listeners for configured event", function () {
      this.instance.store_listeners = [{
        name: "marathon",
        events: ["success"]
      }];
      this.instance.componentDidMount();
      this.instance.componentWillUnmount();

      expect(MarathonStore.removeChangeListener.calls.length).toEqual(1);
      expect(MarathonStore.removeChangeListener)
        .toHaveBeenCalledWith(EventTypes.MARATHON_APPS_CHANGE, function () {});
    });

  });

  describe("#store_onStoreChange", function () {

    it("calls unmountWhen", function () {
      let fn = jasmine.createSpy("unmountWhen");
      this.instance.store_listeners = [{
        name: "marathon",
        unmountWhen: fn,
        listenAlways: false
      }];
      this.instance.componentDidMount();
      this.instance.store_onStoreChange("marathon", "success");

      expect(fn).toHaveBeenCalled();
    });

    it("calls unmountWhen with the correct storeID and event", function () {
      let fn = jasmine.createSpy("unmountWhen");
      this.instance.store_listeners = [{
        name: "marathon",
        unmountWhen: fn,
        listenAlways: false
      }];
      this.instance.componentDidMount();
      this.instance.store_onStoreChange("marathon", "success");

      expect(fn.calls[0].args[0]).toEqual(jasmine.any(Object));
      expect(fn.calls[0].args[1]).toEqual("success");
    });

    it("removes listener when unmountWhen is truthy", function () {
      this.instance.store_listeners = [{
        name: "marathon",
        unmountWhen: function () { return true; },
        listenAlways: false
      }];
      this.instance.componentDidMount();
      this.instance.store_onStoreChange("marathon", "success");

      expect(MarathonStore.removeChangeListener).toHaveBeenCalled();
    });

    it("doesn't remove listener when unmountWhen is falsy", function () {
      this.instance.store_listeners = [{
        name: "marathon",
        unmountWhen: function () { return false; },
        listenAlways: false
      }];
      this.instance.componentDidMount();
      this.instance.store_onStoreChange("marathon", "success");

      expect(MarathonStore.removeChangeListener).not.toHaveBeenCalled();
    });

    it("doesn't remove listener when listenAlways is truthy", function () {
      this.instance.store_listeners = [{
        name: "marathon",
        unmountWhen: function () { return true; },
        listenAlways: true
      }];
      this.instance.componentDidMount();
      this.instance.store_onStoreChange("marathon", "success");

      expect(MarathonStore.removeChangeListener).not.toHaveBeenCalled();
    });

    it("doesn't remove listener when listenAlways is truthy", function () {
      let onMarathonStoreSuccess = jasmine.createSpy("onMarathonStoreSuccess");

      this.instance.store_listeners = ["marathon"];
      this.instance.componentDidMount();
      this.instance.onMarathonStoreSuccess = onMarathonStoreSuccess;
      this.instance.store_onStoreChange("marathon", "success");

      expect(onMarathonStoreSuccess).toHaveBeenCalled();
    });

    it("calls listener with passed arguments", function () {
      let onMarathonStoreSuccess = jasmine.createSpy("onMarathonStoreSuccess");

      this.instance.store_listeners = ["marathon"];
      this.instance.componentDidMount();
      this.instance.onMarathonStoreSuccess = onMarathonStoreSuccess;
      this.instance.store_onStoreChange("marathon", "success", 1, 2, 3, 4);

      expect(onMarathonStoreSuccess.calls[0].args).toEqual([1, 2, 3, 4]);
    });

    it("calls #forceUpdate on store change", function () {
      this.instance.store_listeners = ["marathon"];
      this.instance.componentDidMount();
      spyOn(this.instance, "forceUpdate");
      this.instance.store_onStoreChange("marathon", "success");

      expect(this.instance.forceUpdate).toHaveBeenCalled();
    });

  });

});
