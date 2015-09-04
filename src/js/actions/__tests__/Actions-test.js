var _ = require("underscore");

jest.dontMock("../Actions");
var Actions = require("../Actions");

global.analytics = {
  initialized: true,
  page: _.noop,
  track: _.noop
};

describe("Actions", function () {

  Actions.initialize();

  describe("#log", function () {

    beforeEach(function () {
      spyOn(global.analytics, "track");
    });

    afterEach(function () {
      global.analytics.track = _.noop;
    });

    it("calls analytics#track", function () {
      Actions.log({uiEventName: "foo"});
      expect(global.analytics.track.calls.length).toEqual(1);
    });

    it("calls analytics#track with correct uiEventName", function () {
      Actions.log({});
      expect(global.analytics.track.calls[0].args[0]).toEqual("dcos-ui");
    });

    it("calls analytics#track with correct log", function () {
      Actions.log({uiEventName: "foo"});

      var args = global.analytics.track.calls[0].args[1];
      expect(args.appVersion).toBeDefined();
      expect(args.date).toBeDefined();
      expect(args.uiEventName).toEqual("foo");
      expect(args.duration).toBeDefined();
      expect(args.page).toBeDefined();
      expect(args.stintID).toBeDefined();
      expect(args.uiVersion).toBeDefined();
    });

  });

  describe("#prepareLog", function () {

    beforeEach(function () {
      Actions.activePage = "/services";

      this.log = {
        date: Date.now()
      };
    });

    it("does not create unique event id", function () {
      var log = Actions.prepareLog(this.log);

      expect(log.uniqueEventID).not.toBeDefined();
    });

    it("creates a unique event id", function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        data: {foo: "bar"},
        componentID: "Baz"
      }));

      expect(log.uniqueEventID).toBeDefined();
    });

    it("flattens a uiEventName of type array", function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        uiEventName: ["foo", "bar"]
      }));

      expect(_.isArray(log.uiEventName)).toBe(false);
    });

    it("adds page to uiEventName when uiEventName is array", function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        uiEventName: ["foo", "bar"]
      }));

      expect(log.uiEventName).toBe("services.foo.bar");
    });

    it("does not add a page to non Array uiEventNames", function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        uiEventName: "foo"
      }));

      expect(log.uiEventName).toBe("foo");
    });

    it("sets the duration since last log", function () {
      var delta = 123456;

      Actions.lastLogDate = this.log.date;
      this.log.date += delta;

      var log = Actions.prepareLog(this.log);

      expect(log.duration).toBe(delta);
    });

  });

});
