jest.dontMock('../Highlight');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Highlight = require('../Highlight');

describe('Highlight instance', function () {

  it('is what it says it is', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight search="world">
        Hello World
      </Highlight>
    );
    var node = ReactDOM.findDOMNode(instance);
    var match = node.querySelector('strong');
    expect(TestUtils.isCompositeComponent(instance)).toBe(true);
    expect(TestUtils.isCompositeComponentWithType(instance, Highlight))
      .toBe(true);
    expect(match.textContent).toEqual('World');
  });

  it('should have children', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight search="fox">
        The quick brown fox jumped over the lazy dog.
      </Highlight>
    );

    var node = ReactDOM.findDOMNode(instance);
    var matches = node.querySelectorAll('.highlight');
    expect(node.children.length).toEqual(3);
    expect(matches.length).toEqual(1);

  });

  it('should support custom HTML tag for matching elements', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight matchElement="em" search="world">
        Hello World
      </Highlight>
    );

    var node = ReactDOM.findDOMNode(instance);
    var matches = node.querySelectorAll('em');
    expect(matches.length).toEqual(1);
  });

  it('should support custom className for matching element', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight matchClass="fffffound" search="Seek">
        Hide and Seek
      </Highlight>
    );

    var node = ReactDOM.findDOMNode(instance);
    var matches = node.querySelectorAll('.fffffound');
    expect(matches.length).toEqual(1);
  });

  it('should support passing props to parent element', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight className="myHighlighter" search="world">
        Hello World
      </Highlight>
    );

    var node = ReactDOM.findDOMNode(instance);
    var match = node.querySelector('strong');

    expect(node.className).toEqual('myHighlighter');
    expect(match.className).toEqual('highlight');
  });

  it('should support regular expressions in search', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight className="myHighlighter" search={/[A-Za-z]+/}>
        Easy as 123, ABC...
      </Highlight>
    );

    var node = ReactDOM.findDOMNode(instance);
    var matches = node.querySelectorAll('strong');

    expect(matches[0].textContent).toEqual('Easy');
    expect(matches[1].textContent).toEqual('as');
    expect(matches[2].textContent).toEqual('ABC');
  });

  it('should support escaping arbitrary string in search', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight className="myHighlighter" search="Test (">
        Test (should not throw)
      </Highlight>
    );

    expect(TestUtils.renderIntoDocument.bind(TestUtils, instance))
      .not.toThrow(Error);
  });
});
