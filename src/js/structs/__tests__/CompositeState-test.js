jest.autoMockOff();

let CompositeState = require("../CompositeState");

describe("CompositeState", function () {

  beforeEach(function () {
    this.instance = new CompositeState();
  });

  describe("#constructor", function () {

    it("populates data with the object it's given", function () {
      this.instance = new CompositeState({foo: "bar"});
      expect(this.instance.data).toEqual({foo: "bar"});
    });

  });

  describe("#addState", function () {

    it("adds an object to state", function () {
      this.instance.addState({foo: "bar"});
      expect(this.instance.data.state).toEqual({foo: "bar"});
    });

    it("merges old and new states", function () {
      this.instance.addState({foo: "bar"});
      this.instance.addState({baz: "qux"});
      expect(this.instance.data.state).toEqual({foo: "bar", baz: "qux"});
    });

    it("merges old and new states, overwriting old with new", function () {
      this.instance.addState({foo: "bar"});
      this.instance.addState({baz: "qux"});
      this.instance.addState({foo: "baz"});
      expect(this.instance.data.state).toEqual({foo: "baz", baz: "qux"});
    });

  });

  describe("#addMarathon", function () {

    it("adds an object to marathon state", function () {
      this.instance.addMarathon({foo: "bar"});
      expect(this.instance.data.marathon).toEqual({foo: "bar"});
    });

    it("merges old and new marathon states", function () {
      this.instance.addMarathon({foo: "bar"});
      this.instance.addMarathon({baz: "quux"});
      expect(this.instance.data.marathon).toEqual(
        {foo: "bar", baz: "quux"}
      );
    });

    it("merges old and new marathon states, overwriting old with new",
      function () {
      this.instance.addMarathon({foo: "bar"});
      this.instance.addMarathon({baz: "quux"});
      this.instance.addMarathon({foo: "baz", corge: "grault"});
      expect(this.instance.data.marathon).toEqual(
        {foo: "baz", baz: "quux", corge: "grault"}
      );
    });

  });

  describe("#getServiceList", function () {

    it("returns a list with its current state and marathon data", function () {
      this.instance.addMarathon({foo: "bar"});
      this.instance.addState({baz: "qux"});

      let serviceList = this.instance.getServiceList();

      expect(serviceList.list[0].marathon).toEqual({foo: "bar"});
      expect(serviceList.list[0].state).toEqual({baz: "qux"});
    });

  });

});
