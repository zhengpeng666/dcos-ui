/** @jsx React.DOM */

jest.dontMock("../../constants/ResourceTypes");
jest.dontMock("../NodesGridView");

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var NodesGridView = require("../NodesGridView");
var ResourceTypes = require("../../constants/ResourceTypes");

var host = {
  id: "foo",
  active: true,
  used_resources: {
    cpus: [{
      percentage: 50
    }]
  }
};

describe("NodesGridView", function () {

  beforeEach(function () {
    this.hosts = [_.clone(host)];
    this.instance = TestUtils.renderIntoDocument(
      <NodesGridView hosts={this.hosts} selectedResource="cpus" />
    );
  });

  describe("#getDialConfig", function () {

    beforeEach(function () {
      this.resourceType = ResourceTypes.cpus;
    });

    it("returns different configurations depending on the active paramter", function () {
        var config1 = this.instance.getDialConfig(
          true, {percentage: 50}, this.resourceType
        );

        var config2 = this.instance.getDialConfig(
          false, {percentage: 50}, this.resourceType
        );

        expect(_.isEqual(config1, config2)).toEqual(false);
    });

  });

  describe("#getActiveSliceData", function () {

    beforeEach(function () {
      this.resourceType = ResourceTypes.cpus;
      this.activeSlices = this.instance.getActiveSliceData(
        this.resourceType, 50
      );
    });

    it("contains a slice for the used resource", function () {
      var slice = _.findWhere(this.activeSlices, {
        name: this.resourceType.label
      });
      expect(typeof slice).toEqual("object");
    });

    it("the used slice uses the correct color", function () {
      var slice = _.findWhere(this.activeSlices, {
        name: this.resourceType.label
      });
      expect(slice.colorIndex).toEqual(this.resourceType.colorIndex);
    });

    it("the used slice contains the correct percentage", function () {
      var slice = _.findWhere(this.activeSlices, {
        name: this.resourceType.label
      });
      expect(slice.percentage).toEqual(50);
    });

    it("contains an unused resources slice", function () {
      var slice = _.findWhere(this.activeSlices, {name: "Unused"});
      expect(typeof slice).toEqual("object");
    });

    it("the color for the unused slice should be gray", function () {
      var slice = _.findWhere(this.activeSlices, {name: "Unused"});
      expect(slice.colorIndex).toEqual(6);
    });

    it("the percentage of the unused slice should be the remaining of the passed percentage", function () {
      var slice = _.findWhere(this.activeSlices, {name: "Unused"});
      expect(slice.percentage).toEqual(50);
    });

  });

  describe("#getInactiveSliceData", function () {

    it("should use the correct color", function () {
      var inactiveSlice = this.instance.getInactiveSliceData();
      expect(inactiveSlice[0].colorIndex).toEqual(2);
    });

    it("should use 100% of the dial", function () {
      var inactiveSlice = this.instance.getInactiveSliceData();
      expect(inactiveSlice[0].percentage).toEqual(100);
    });

  });

  describe("#render", function () {

    it("render one chart", function () {
      var elements = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "chart"
      );

      expect(elements.length).toEqual(1);
    });

    it("render the correct number of charts", function () {
      var _host = _.clone(host);
      _host.id = "bar";
      this.hosts.push(_host);
      this.instance = TestUtils.renderIntoDocument(
        <NodesGridView hosts={this.hosts} selectedResource="cpus" />
      );

      var elements = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "chart"
      );

      expect(elements.length).toEqual(2);
    });

  });

});
