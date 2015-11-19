jest.autoMockOff();

let Core = require("../Core");

describe("Core", function () {

  describe("#addState", function () {

    it("adds an object to state", function () {
      Core.addState({foo: "bar"});
      expect(Core.compositeState.data.state).toEqual({foo: "bar"});
    });

    it("merges old and new states", function () {
      Core.addState({baz: "qux"});
      expect(Core.compositeState.data.state).toEqual({foo: "bar", baz: "qux"});
    });

    it("merges old and new states, overwriting old with new", function () {
      Core.addState({foo: "baz"});
      expect(Core.compositeState.data.state).toEqual({foo: "baz", baz: "qux"});
    });

  });

  describe("#addMarathon", function () {

    it("adds an object to marathon state", function () {
      Core.addMarathon({foo: "bar"});
      expect(Core.compositeState.data.marathon).toEqual({foo: "bar"});
    });

    it("merges old and new marathon states", function () {
      Core.addMarathon({baz: "quux"});
      expect(Core.compositeState.data.marathon).toEqual(
        {foo: "bar", baz: "quux"}
      );
    });

    it("merges old and new marathon states, overwriting old with new",
      function () {
      Core.addMarathon({foo: "baz", corge: "grault"});
      expect(Core.compositeState.data.marathon).toEqual(
        {foo: "baz", baz: "quux", corge: "grault"}
      );
    });

  });

  describe("#addSummary", function () {

    it("adds a summary snapshot", function () {
      Core.addSummary({
        frameworks: [{foo: "bar"}],
        slaves: [{bar: "baz"}],
        cluster: "qux",
        hostname: "corge"
      });

      expect(Core.summary.list[0].snapshot).toEqual({
        frameworks: [{foo: "bar"}],
        slaves: [{bar: "baz"}],
        cluster: "qux",
        hostname: "corge"
      });
    });

    it("adds multiple summary snapshots", function () {
      Core.addSummary({
        frameworks: [{foo: "bar"}],
        slaves: [{bar: "baz"}],
        cluster: "qux",
        hostname: "corge"
      });
      Core.addSummary({
        frameworks: [{foo: "bar"}],
        slaves: [{bar: "baz"}],
        cluster: "qux",
        hostname: "corge"
      });

      expect(Core.summary.list.length).toEqual(3);
    });

  });

  describe("#getLatest", function () {

    it("returns state and marathon summaries merged into one object",
      function () {
        expect(Core.getLatest()).toEqual({
          foo: "baz",
          baz: "quux",
          corge: "grault"
        });
    });

  });

});
