/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../Dropdown");
jest.dontMock("./fixtures/MockFrameworks");

var Dropdown = require("../Dropdown");
var MockFrameworks = require("./fixtures/MockFrameworks");

function itemClicked(item) {
  console.log(item);
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

  });

  it("should display the last failure rate", function () {
    var dropdown = TestUtils.renderIntoDocument(
      <Dropdown
        defaultKey={MockFrameworks.frameworks[0].id}
        handleItemSelection={itemClicked}>
        {this.items}
      </Dropdown>
    );

    // Verify that percentage is set correctly
    var button = TestUtils.findRenderedDOMComponentWithClass(
      dropdown, "dropdown-toggle"
    );

    var name = TestUtils.findRenderedDOMComponentWithClass(
      button, "name"
    );

    expect(name.getDOMNode().textContent).toEqual(this.items[0].name);
  });
});
