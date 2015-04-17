/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../Dropdown");
jest.dontMock("./fixtures/MockFrameworks");

var Dropdown = require("../Dropdown");
var MockFrameworks = require("./fixtures/MockFrameworks");

function selectedHtml(obj) {
  return (
    <span className="id">
      {obj.id}
    </span>
  );
}

function itemHtml(obj) {
  return (
    <span className="name">{obj.name}</span>
  );
}

function getToggleButton(dropdown) {
  return TestUtils.findRenderedDOMComponentWithClass(
    dropdown, "dropdown-toggle"
  );
}

function getIdInToggleButton(button) {
  return TestUtils.findRenderedDOMComponentWithClass(
    button, "id"
  );
}

function getItemsInList(dropdown) {
  var list = TestUtils.findRenderedDOMComponentWithClass(
    dropdown, "dropdown-menu"
  );

  return TestUtils.scryRenderedDOMComponentsWithClass(
    list, "name"
  );
}

describe("Dropdown", function () {

  beforeEach(function () {
    this.items = _.map(MockFrameworks.frameworks, function (service) {
      return {
        id: service.id,
        name: service.name,
        html: itemHtml(service),
        selectedHtml: selectedHtml(service),
        slaves_count: service.slaves_count
      };
    });

    this.selectedId = MockFrameworks.frameworks[0].id;

    this.handleItemSelection = function (item) {
      this.selectedId = item.id;
    };

    this.getDropdown = function () {
      return TestUtils.renderIntoDocument(
        <Dropdown
          selectedId={this.selectedId}
          onItemSelection={this.handleItemSelection}
          items={this.items} />
      );
    };
  });

  it("should display the first item as default item", function () {

    var dropdown = this.getDropdown();
    var button = getToggleButton(dropdown);
    var id = getIdInToggleButton(button);

    expect(id.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[0].id);
  });

  it("should display all items in the list", function () {

    var dropdown = this.getDropdown();
    var button = getToggleButton(dropdown);
    React.addons.TestUtils.Simulate.click(button);

    var items = getItemsInList(dropdown);

    expect(items.length).toEqual(5);
  });

  it("should display 3rd item, after 3rd item is clicked", function () {

    var dropdown = this.getDropdown();
    var button = getToggleButton(dropdown);
    React.addons.TestUtils.Simulate.click(button);

    var items = getItemsInList(dropdown);
    React.addons.TestUtils.Simulate.click(items[2]);

    var id = getIdInToggleButton(button);

    expect(id.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[2].id);
  });

  it("should use custom render when specified", function () {
    var dropdown = TestUtils.renderIntoDocument(
      <Dropdown selectedId={this.selectedId}
        onItemSelection={this.handleItemSelection}
        items={this.items} />
    );

    var button = getToggleButton(dropdown);
    var id = getIdInToggleButton(button);

    expect(id.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[0].id);
  });

  it("should render correctly with another selected key", function () {
    this.selectedId = MockFrameworks.frameworks[3].id;

    var dropdown = this.getDropdown();
    var button = getToggleButton(dropdown);
    var id = getIdInToggleButton(button);

    expect(id.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[3].id);
  });
});
