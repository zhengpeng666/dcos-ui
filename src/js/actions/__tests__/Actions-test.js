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
      Actions.log({description: "foo"});
      expect(global.analytics.track.calls.length).toEqual(1);
    });

    it("calls analytics#track with correct description", function () {
      Actions.log({description: "foo"});
      expect(global.analytics.track.calls[0].args[0]).toEqual("foo");
    });

    it("calls analytics#track with correct log", function () {
      Actions.log({description: "foo"});

      var args = global.analytics.track.calls[0].args[1];
      expect(args.appVersion).toBeDefined();
      expect(args.date).toBeDefined();
      expect(args.description).toEqual("foo");
      expect(args.duration).toBeDefined();
      expect(args.page).toBeDefined();
      expect(args.stintID).toBeDefined();
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

    it("flattens a description of type array", function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        description: ["foo", "bar"]
      }));

      expect(_.isArray(log.description)).toBe(false);
    });

    it("adds page to description when description is array", function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        description: ["foo", "bar"]
      }));

      expect(log.description).toBe("services.foo.bar");
    });

    it("does not add a page to non Array descriptions", function () {
      var log = Actions.prepareLog(_.extend(this.log, {
        description: "foo"
      }));

      expect(log.description).toBe("foo");
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
