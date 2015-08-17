var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../Dropdown");
jest.dontMock("../../mixins/GetSetInternalStorageMixin");
jest.dontMock("./fixtures/MockFrameworks");
jest.dontMock("../../mixins/InternalStorageMixin");

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

function getIDInToggleButton(button) {
  return TestUtils.findRenderedDOMComponentWithClass(
    button, "id"
  );
}

function getItemsInList(dropdown) {
  var list = TestUtils.findRenderedDOMComponentWithClass(
    dropdown, "dropdown-menu"
  );

  return TestUtils.scryRenderedDOMComponentsWithTag(
    list, "li"
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

    this.onItemSelection = function () {};
    this.selectedId = MockFrameworks.frameworks[0].id;

    this.dropdown = TestUtils.renderIntoDocument(
      <Dropdown
        selectedId={this.selectedId}
        onItemSelection={this.onItemSelection}
        items={this.items} />
    );

    this.toggleButton = TestUtils.findRenderedDOMComponentWithClass(
      this.dropdown, "dropdown-toggle"
    );
  });

  it("should display the first item as default item", function () {
    var id = getIDInToggleButton(this.toggleButton);

    expect(id.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[0].id);
  });

  it("should display all items in the list", function () {
    React.addons.TestUtils.Simulate.click(this.toggleButton);

    var items = getItemsInList(this.dropdown);

    expect(items.length).toEqual(5);
  });

  it("should render correctly with another selected id", function () {
    this.selectedId = MockFrameworks.frameworks[3].id;
    var dropdown = TestUtils.renderIntoDocument(
      <Dropdown
        selectedId={this.selectedId}
        onItemSelection={this.onItemSelection}
        items={this.items} />
    );

    var toggleButton = TestUtils.findRenderedDOMComponentWithClass(
      dropdown, "dropdown-toggle"
    );

    var id = getIDInToggleButton(toggleButton);

    expect(id.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[3].id);
  });
});
