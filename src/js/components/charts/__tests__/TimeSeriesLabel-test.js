var React = require('react');
var TestUtils = require('react-addons-test-utils');

jest.dontMock('../TimeSeriesLabel');
var TimeSeriesLabel = require('../TimeSeriesLabel');

describe('TimeSeriesLabel', function () {

  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <TimeSeriesLabel colorIndex={2}
        currentValue="10"
        subHeading="Foo" />
    );
  });

  it('should display the correct label', function () {
    // Verify that percentage is set correctly
    var title = TestUtils.findRenderedDOMComponentWithClass(
      this.instance, 'unit'
    );
    expect(title.getDOMNode().textContent).toEqual('10%');
  });

  it('should display the correct sub heading', function () {
    // Verify that percentage is set correctly
    var label = TestUtils.findRenderedDOMComponentWithClass(
      this.instance, 'unit-label'
    );
    expect(label.getDOMNode().textContent).toBe('Foo');
  });

  it('should set sub heading text color', function () {
    // Verify that percentage is set correctly
    var label = TestUtils.findRenderedDOMComponentWithClass(
      this.instance, 'path-color-2'
    );
    expect(typeof label).toBe('object');
  });

});
