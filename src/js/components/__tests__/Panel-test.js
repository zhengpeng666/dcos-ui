jest.dontMock('../Panel');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var Panel = require('../Panel');

describe('Panel', function () {
  beforeEach(function () {
    this.onClickSpy = jasmine.createSpy('onClickSpy');
    this.instance = TestUtils.renderIntoDocument(
      <Panel
        className="foo"
        contentClass="bar"
        footer="footer"
        footerClass="qux"
        heading="heading"
        headingClass="norf"
        onClick={this.onClickSpy}>
        <div className="quis" />
      </Panel>
    );
  });

  describe('#render', function () {
    it('should render children', function () {
      var child =
        TestUtils.findRenderedDOMComponentWithClass(this.instance, 'quis');
      expect(TestUtils.isDOMComponent(child)).toBe(true);
    });

    it('should render with given className', function () {
      var panel =
        TestUtils.findRenderedComponentWithType(this.instance, Panel);
      var node = ReactDOM.findDOMNode(panel);
      expect(node.className).toBe('foo');
    });

    it('should override className to content node', function () {
      var content = TestUtils.findRenderedDOMComponentWithClass(
        this.instance,
        'bar'
      );
      var node = ReactDOM.findDOMNode(content);
      expect(node.className).toBe('bar');
    });

    it('should use default className to content node', function () {
      var content = TestUtils.findRenderedDOMComponentWithClass(
        TestUtils.renderIntoDocument(<Panel />),
        'panel-content'
      );
      var node = ReactDOM.findDOMNode(content);
      expect(node.className).toBe('panel-content');
    });

    it('should override className to footer node', function () {
      var footer = TestUtils.findRenderedDOMComponentWithClass(
        this.instance,
        'bar'
      );
      var node = ReactDOM.findDOMNode(footer);
      expect(node.className).toBe('bar');
    });

    it('should use default className to footer node', function () {
      var footer = TestUtils.findRenderedDOMComponentWithClass(
        TestUtils.renderIntoDocument(<Panel footer="footer" />),
        'panel-footer'
      );
      var node = ReactDOM.findDOMNode(footer);
      expect(node.className).toBe('panel-footer');
    });

    it('should not render footer when none is given', function () {
      var panel = TestUtils.renderIntoDocument(<Panel />);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(
        panel,
        'panel-footer'
      ).length).toBe(0);
    });

    it('should override className to heading node', function () {
      var heading = TestUtils.findRenderedDOMComponentWithClass(
        this.instance,
        'bar'
      );
      var node = ReactDOM.findDOMNode(heading);
      expect(node.className).toBe('bar');
    });

    it('should use default className to heading node', function () {
      var heading = TestUtils.findRenderedDOMComponentWithClass(
        TestUtils.renderIntoDocument(<Panel heading="heading" />),
        'panel-heading'
      );
      var node = ReactDOM.findDOMNode(heading);
      expect(node.className).toBe('panel-heading');
    });

    it('should not render heading when none is given', function () {
      var panel = TestUtils.renderIntoDocument(<Panel />);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(
        panel,
        'panel-heading'
      ).length).toBe(0);
    });

    it('should be able to add an onClick to the panel node', function () {
      var panel =
        TestUtils.findRenderedComponentWithType(this.instance, Panel);
      TestUtils.Simulate.click(ReactDOM.findDOMNode(panel));
      expect(this.onClickSpy).toHaveBeenCalled();
    });
  });
});
