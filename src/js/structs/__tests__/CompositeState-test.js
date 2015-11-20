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
      expect(this.instance.data).toEqual({foo: "bar"});
    });

  });

  describe("#addSummary", function () {

    it("adds an object to state", function () {
      this.instance.addSummary({foo: "bar"});
      expect(this.instance.data).toEqual({foo: "bar"});
    });

  });

  describe("#addMarathon", function () {

    it("adds marathon metadata to an existing framework, matching by id",
      function () {
      this.instance.addState({
        frameworks: [{
          id: "foo",
          bar: "baz"
        }]
      });

      this.instance.addMarathon({
        foo: {
          qux: "quux",
          corge: "grault"
        }
      });

      expect(this.instance.data.frameworks[0]._meta).toEqual({
        marathon: {
          qux: "quux",
          corge: "grault"
        }
      });
    });

    it("replaced old marathon data with new marathon data",
      function () {
      this.instance.addState({
        frameworks: [{
          id: "foo",
          bar: "baz"
        }]
      });

      this.instance.addMarathon({
        foo: {
          qux: "quux",
          corge: "grault"
        }
      });

      this.instance.addMarathon({
        foo: {
          grault: "garply"
        }
      });

      expect(this.instance.data.frameworks[0]._meta).toEqual({
        marathon: {
          grault: "garply"
        }
      });
    });

    it("does not add marathon data if it doesn't find a matching id",
      function () {
      this.instance.addState({
        frameworks: [{
          id: "foo",
          bar: "baz"
        }]
      });

      this.instance.addMarathon({
        bar: {
          qux: "quux",
          corge: "grault"
        }
      });

      expect(this.instance.data.frameworks[0]._meta).toBeUndefined;
    });

  });

  describe("#mergeData", function () {

    it("deeply merges old and new states", function () {
      this.instance.addState({foo: "bar"});
      this.instance.addState({
        baz: {
          qux: "quux",
          corge: {
            grault: "garply",
            fred: "plugh"
          }
        }
      });
      this.instance.addState({
        baz: {
          qux: "quux",
          corge: {
            fred: "foo"
          },
          xyzzy: ["thud", "bar"]
        }
      });

      expect(this.instance.data).toEqual({
        foo: "bar",
        baz: {
          qux: "quux",
          corge: {
            grault: "garply",
            fred: "foo"
          },
          xyzzy: ["thud", "bar"]
        }
      });
    });

    it("merges old and new states, overwriting old with new", function () {
      this.instance.addState({foo: "bar"});
      this.instance.addState({baz: "qux"});
      this.instance.addState({foo: "baz"});
      expect(this.instance.data).toEqual({foo: "baz", baz: "qux"});
    });

    it("merges framework data set with both addState and addSummary",
      function () {
      this.instance.addState({
        frameworks: [{
          id: "foo",
          baz: {
            qux: "quux",
            fred: "plugh"
          }
        }, {
          id: "baz",
          baz: {
            qux: "quux",
            corge: "graply"
          }
        }]
      });

      this.instance.addSummary({
        frameworks: [{
          id: "foo",
          bar: {
            qux: "grault"
          }
        }, {
          id: "baz",
          baz: {
            corge: "quux"
          }
        }]
      });

      expect(this.instance.data).toEqual({
        frameworks: [
          {
            id: "foo",
            baz: {
              qux: "quux",
              fred: "plugh"
            },
            bar: {
              qux: "grault"
            }
          },
          {
            id: "baz",
            baz: {
              corge: "quux"
            }
          }
        ]
      });
    });

    it("removes framework IDs that were not received in the new data",
      function () {
      this.instance.addState({
        frameworks: [{
          id: "foo",
          bar: "baz"
        }]
      });

      this.instance.addState({
        frameworks: [{
          id: "bar",
          bar: "baz"
        }]
      });

      expect(this.instance.data).toEqual({
        frameworks: [{
          id: "bar",
          bar: "baz"
        }]
      });
    });

  });

  describe("#getServiceList", function () {

    it("returns a list with the current frameworks", function () {
      this.instance.addState({
        frameworks: [{
          id: "foo",
          bar: "baz"
        }, {
          id: "quux",
          corge: "grault"
        }]
      });

      this.instance.addMarathon({
        foo: {
          qux: "quux",
          corge: "grault"
        }
      });

      let expectedResult = [{
        id: "foo",
        bar: "baz",
        _meta: {
          marathon: {
            qux: "quux",
            corge: "grault"
          }
        }
      }, {
        id: "quux",
        corge: "grault"
      }];

      let serviceList = this.instance.getServiceList();

      serviceList.getItems().forEach(function (item) {
        expect(item.get()).toEqual(expectedResult.shift());
      });

    });

  });

});
