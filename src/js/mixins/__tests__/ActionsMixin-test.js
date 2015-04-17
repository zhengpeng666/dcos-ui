var _ = require("underscore");

jest.dontMock("../../actions/Actions");
jest.dontMock("../ActionsMixin");

var Actions = require("../../actions/Actions");
var ActionsMixin = require("../ActionsMixin");

global.analytics = {
  initialized: true,
  page: _.noop,
  track: _.noop
};

describe("ActionsMixin", function () {

  describe("#actions_processState", function () {

    beforeEach(function () {
      this.instance = _.extend({}, ActionsMixin);
      this.instance.constructor.displayName = "FakeInstance";

      Actions._logBatchAction_bak = Actions.logBatchAction;
      spyOn(Actions, "logBatchAction");
    });

    afterEach(function () {
      Actions.logBatchAction = Actions._logBatchAction_bak;
    });

    it("does not call Actions#logBatchAction", function () {
      this.instance.actions_processState({});
      expect(Actions.logBatchAction).not.toHaveBeenCalled();
    });

    it("calls Actions#logBatchAction", function () {
      this.instance.actions_processState({foo: "bar"});
      expect(Actions.logBatchAction).toHaveBeenCalled();
    });

    it("calls Actions#logBatchAction with single message", function () {
      this.instance.actions_processState({foo: "bar"});
      expect(Actions.logBatchAction.calls[0].args[0]).toEqual([
        [this.instance.constructor.displayName, "foo"]
      ]);
    });

    it("calls Actions#logBatchAction with multiple messages", function () {
      this.instance.actions_processState({foo: "bar", baz: "qux"});
      expect(Actions.logBatchAction.calls[0].args[0]).toEqual([
        [this.instance.constructor.displayName, "foo"],
        [this.instance.constructor.displayName, "baz"]
      ]);
    });

    it("calls Actions#logBatchAction with custom message", function () {
      this.instance.actions_configuration = {};
      this.instance.actions_configuration.state = {
        foo: function () {
          return "baz";
        }
      };

      this.instance.actions_processState({foo: "bar"});
      expect(Actions.logBatchAction.calls[0].args[0]).toEqual([
        [this.instance.constructor.displayName, "foo", "baz"]
      ]);
    });

    it("skips state key", function () {
      this.instance.actions_configuration = {};
      this.instance.actions_configuration.state = {
        foo: {skip: true}
      };

      this.instance.actions_processState({foo: "bar"});
      expect(Actions.logBatchAction).not.toHaveBeenCalled();
    });

  });

});
