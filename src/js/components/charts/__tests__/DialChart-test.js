/** @jsx React.DOM */

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../DialChart");
jest.dontMock("../DialSlice");
jest.dontMock("../../../mixins/InternalStorageMixin");
var DialChart = require("../DialChart");

describe("DialChart", function () {

  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <DialChart
        data={[]}
        label={"Items"}
        unit={100} />
    );
  });

  describe("#getNormalizedData", function () {

    it("returns an empty item for each slice when no data is present", function () {
      var normalizedData = this.instance.getNormalizedData([
          { name: "TASK_1", value: 0 }, { name: "TASK_2", value: 0 }
        ], []
      );
      expect(normalizedData).toEqual([
        { name: "TASK_1", value: 0 }, { name: "TASK_2", value: 0 }
      ]);
    });

    it("returns the union of its slices and its data", function () {
      var normalizedData = this.instance.getNormalizedData(
        [{ name: "TASK_1", value: 0 }, { name: "TASK_2", value: 0 }],
        [{ name: "TASK_2", value: 10 }, { name: "TASK_3", value: 20 }]
      );
      expect(normalizedData).toEqual([
        { name: "TASK_1", value: 0 },
        { name: "TASK_2", value: 10 },
        { name: "TASK_3", value: 20 }
      ]);
    });

  });

  describe("#render", function () {

    beforeEach(function () {
      this.instance.setProps({data: [
        {name: "TASK_1", value: 3},
        {name: "TASK_2", value: 1}
      ]});
    });

    it("renders its unit", function () {
      var unit = TestUtils.findRenderedDOMComponentWithClass(
        this.instance, "unit"
      );
      expect(unit.getDOMNode().textContent).toEqual("100");
    });

    it("renders its label", function () {
      var label = TestUtils.findRenderedDOMComponentWithClass(
        this.instance, "unit-label"
      );
      expect(label.getDOMNode().textContent).toEqual("Items");
    });

    it("when no data is present, it renders empty slices to the DOM", function () {
      this.instance.setProps({
        slices: [ { name: "TASK_1" }, { name: "TASK_2" } ],
        data: []
      });
      var slices = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "arc"
      );
      expect(slices.length).toEqual(2);
    });

    it("renders a slice for each category of tasks", function () {
      var slices = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "arc"
      );
      expect(slices.length).toEqual(2);
    });

    it("does not remove 0-length slices from the DOM", function () {
      this.instance.setProps({
        slices: [ { name: "TASK_1" }, { name: "TASK_2" } ],
        data: [ { name: "TASK_1", value: 4 } ]
      });
      var slices = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "arc"
      );
      expect(slices.length).toEqual(2);
    });

  });

});
