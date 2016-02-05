jest.dontMock('../Panel');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var Panel = require('../Panel');

describe('Panel', function () {
  beforeEach(function () {
    this.onClickSpy = jasmine.createSpy('onClickSpy');
    this.instance = TestUtils.renderIntoDocument(
      <Panel
        className="foo"
        contentClass="bar"
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
      expect(panel.props.className).toBe('foo');
    });

    it('should append className to content node', function () {
      var content = TestUtils.findRenderedDOMComponentWithClass(
        this.instance,
        'panel-content'
      );
      expect(content.props.className).toBe('panel-content bar');
    });

    it('should be able to add an onClick to the panel node', function () {
      var panel =
        TestUtils.findRenderedComponentWithType(this.instance, Panel);
      TestUtils.Simulate.click(React.findDOMNode(panel));
      expect(this.onClickSpy).toHaveBeenCalled();
    });
  });
});
