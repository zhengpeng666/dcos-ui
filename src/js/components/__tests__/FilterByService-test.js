var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../Dropdown");
jest.dontMock("../FilterByService");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("./fixtures/MockFrameworks");

var FilterByService = require("../FilterByService");
var MockFrameworks = require("./fixtures/MockFrameworks");

describe("FilterByService", function () {

  beforeEach(function () {
    this.selectedId = MockFrameworks.frameworks[0].id;

    this.handleByServiceFilterChange = function (id) {
      this.byServiceFilter = id;
    };

    this.filterByService = TestUtils.renderIntoDocument(
      <FilterByService
        byServiceFilter={this.byServiceFilter}
        services={MockFrameworks.frameworks}
        totalHostsCount={10}
        handleFilterChange={this.handleByServiceFilterChange} />
    );
  });

  it("should display 'Filter by Service' as default item", function () {
    var button = TestUtils.findRenderedDOMComponentWithClass(
      this.filterByService, "dropdown-toggle"
    );
    var container = TestUtils.findRenderedDOMComponentWithClass(
      button, "badge-container"
    );

    expect(container.getDOMNode().textContent)
      .toEqual("Filter by Service");
  });

  describe("#itemHtml", function () {
    it("should display the badge correctly", function () {
      var item = TestUtils.renderIntoDocument(
        this.filterByService.itemHtml(MockFrameworks.frameworks[4])
      );
      var badge = TestUtils.findRenderedDOMComponentWithClass(item, "badge");
      expect(badge.getDOMNode().textContent)
        .toEqual(MockFrameworks.frameworks[4].slaves_count.toString());
    });
  });

  describe("#getDropdownItems", function () {
    it("should return all services and the all services item", function () {
      var items = this.filterByService.getDropdownItems(
        MockFrameworks.frameworks
      );
      expect(items.length)
        .toEqual(MockFrameworks.frameworks.length + 1);
    });

    it("should all have correct slaves_count values", function () {
      var items = this.filterByService.getDropdownItems(
        MockFrameworks.frameworks
      );
      var first = items.shift();
      expect(first.slaves_count).toEqual(10);

      _.each(items, function (item, index) {
        expect(item.slaves_count)
          .toEqual(MockFrameworks.frameworks[index].slaves_count);
      });
    });

    it("should only have selectedHtml on the first element", function () {
      var items = this.filterByService.getDropdownItems(
        MockFrameworks.frameworks
      );
      var first = items.shift();

      expect(_.isObject(first.selectedHtml)).toEqual(true);

      _.each(items, function (item) {
        expect(_.isObject(item.selectedHtml)).toEqual(false);
      });

    });
  });

  describe("#getSelectedId", function () {
    it("should return the same number when given a number", function () {
      expect(this.filterByService.getSelectedId(0)).toEqual(0);
    });

    it("should return the same string when given a string", function () {
      expect(this.filterByService.getSelectedId("thisIsAnID"))
        .toEqual("thisIsAnID");
    });

    it("should return the default id when given null", function () {
      expect(this.filterByService.getSelectedId(null)).toEqual("default");
    });
  });

});
