/** @jsx React.DOM */

jest.dontMock("../../constants/ResourceTypes");
jest.dontMock("../NodesGridDials");

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var NodesGridDials = require("../NodesGridDials");
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

describe("NodesGridDials", function () {

  beforeEach(function () {
    this.hosts = [_.clone(host)];
    this.instance = TestUtils.renderIntoDocument(
      <NodesGridDials
        hosts={this.hosts}
        selectedResource="cpus"
        serviceColors={{}}
        showServices={false}
        resourcesByFramework={{}} />
    );
  });

  describe("#getActiveSliceData", function () {

    beforeEach(function () {
      this.resourceType = ResourceTypes.cpus;
      this.activeSlices = this.instance.getActiveSliceData(this.hosts[0]);
    });

    it("returns an object", function () {
      expect(typeof this.activeSlices).toEqual("object");
    });

    it("contains a data property which is an array", function () {
      expect(_.isArray(this.activeSlices.data)).toEqual(true);
    });

    it("contains a usedPercentage property which is a number", function () {
      expect(_.isNumber(this.activeSlices.usedPercentage)).toEqual(true);
    });

    it("contains a slice for the used resource", function () {
      var slice = _.findWhere(this.activeSlices.data, {
        name: this.resourceType.label
      });
      expect(typeof slice).toEqual("object");
    });

    it("the used slice uses the correct color", function () {
      var slice = _.findWhere(this.activeSlices.data, {
        name: this.resourceType.label
      });
      expect(slice.colorIndex).toEqual(this.resourceType.colorIndex);
    });

    it("the used slice contains the correct percentage", function () {
      var slice = _.findWhere(this.activeSlices.data, {
        name: this.resourceType.label
      });
      expect(slice.percentage).toEqual(50);
    });

    it("contains an unused resources slice", function () {
      var slice = _.findWhere(this.activeSlices.data, {name: "Unused"});
      expect(typeof slice).toEqual("object");
    });

    it("the color for the unused slice should be gray", function () {
      var slice = _.findWhere(this.activeSlices.data, {name: "Unused"});
      expect(slice.colorIndex).toEqual(8);
    });

    it("the percentage of the unused slice should be the remaining of the passed percentage", function () {
      var slice = _.findWhere(this.activeSlices.data, {name: "Unused"});
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

  describe("#getDialConfig", function () {

    beforeEach(function () {
      this.resourceType = ResourceTypes.cpus;
    });

    it("returns different configurations depending on the active paramter", function () {
      var _host = this.hosts[0];

      _host.active = true;
      var config1 = this.instance.getDialConfig(_host);

      _host.active = false;
      var config2 = this.instance.getDialConfig(_host);

      expect(_.isEqual(config1, config2)).toEqual(false);
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
        <NodesGridDials
          hosts={this.hosts}
          selectedResource="cpus"
          serviceColors={{}}
          showServices={false}
          resourcesByFramework={{}} />
      );

      var elements = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, "chart"
      );

      expect(elements.length).toEqual(2);
    });

  });

});
