/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../Dropdown");
jest.dontMock("./fixtures/MockFrameworks");

var Dropdown = require("../Dropdown");
var MockFrameworks = require("./fixtures/MockFrameworks");

function getCurrentItem(key) {
  var child = _.find(MockFrameworks.frameworks, function (item) {
    return item.id === key;
  });

  return (
    <span className="name">
      {child.id}
    </span>
  );
}

function getToggleButton(dropdown) {
  return TestUtils.findRenderedDOMComponentWithClass(
    dropdown, "dropdown-toggle"
  );
}

function getNameInToggleButton(button) {
  return TestUtils.findRenderedDOMComponentWithClass(
    button, "name"
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
      return (
        <span key={service.id}>
          <span className="name">{service.name}</span>
        </span>
      );
    });

    this.selectedKey = MockFrameworks.frameworks[0].id;

    this.handleKeySelection = function (key) {
      this.selectedKey = key;
    };
  });

  it("should display the first item as default item", function () {

    var dropdown = TestUtils.renderIntoDocument(
      <Dropdown selectedKey={this.selectedKey}
        handleItemSelection={this.handleKeySelection}>
        {this.items}
      </Dropdown>
    );

    var button = getToggleButton(dropdown);
    var name = getNameInToggleButton(button);

    expect(name.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[0].name);
  });

  it("should display all items in the list", function () {

    var dropdown = TestUtils.renderIntoDocument(
      <Dropdown selectedKey={this.selectedKey}
        handleItemSelection={this.handleKeySelection}>
        {this.items}
      </Dropdown>
    );

    var button = getToggleButton(dropdown);
    React.addons.TestUtils.Simulate.click(button);

    var items = getItemsInList(dropdown);

    expect(items.length).toEqual(5);
  });

  it("should display 3rd item, after 3rd item is clicked", function () {
    var dropdown = TestUtils.renderIntoDocument(
      <Dropdown selectedKey={this.selectedKey}
        handleItemSelection={this.handleKeySelection}>
        {this.items}
      </Dropdown>
    );

    var button = getToggleButton(dropdown);
    React.addons.TestUtils.Simulate.click(button);

    var items = getItemsInList(dropdown);
    React.addons.TestUtils.Simulate.click(items[2]);

    var name = getNameInToggleButton(button);

    expect(name.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[2].name);
  });

  it("should use custom render when specified", function () {
    var dropdown = TestUtils.renderIntoDocument(
      <Dropdown selectedKey={this.selectedKey}
        handleItemSelection={this.handleKeySelection}
        getCurrentItem={getCurrentItem}>
        {this.items}
      </Dropdown>
    );

    var button = getToggleButton(dropdown);
    var name = getNameInToggleButton(button);

    expect(name.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[0].id);
  });

  it("should render correctly with another selected key", function () {
    this.selectedKey = MockFrameworks.frameworks[3].id;

    var dropdown = TestUtils.renderIntoDocument(
      <Dropdown selectedKey={this.selectedKey}
        handleItemSelection={this.handleKeySelection}>
        {this.items}
      </Dropdown>
    );

    var button = getToggleButton(dropdown);
    var name = getNameInToggleButton(button);

    expect(name.getDOMNode().textContent)
      .toEqual(MockFrameworks.frameworks[3].name);
  });
});
