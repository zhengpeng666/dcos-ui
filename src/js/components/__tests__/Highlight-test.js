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

    var matches =
      TestUtils.scryRenderedDOMComponentsWithTag(instance, 'strong');
    expect(TestUtils.isCompositeComponent(instance)).toBe(true);
    expect(TestUtils.isCompositeComponentWithType(instance, Highlight))
      .toBe(true);
    expect(ReactDOM.findDOMNode(matches[0]).textContent).toEqual('World');
  });

  it('should have children', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight search="fox">
        The quick brown fox jumped over the lazy dog.
      </Highlight>
    );

    var matches =
      TestUtils.scryRenderedDOMComponentsWithClass(instance, 'highlight');
    expect(ReactDOM.findDOMNode(instance).children.length).toEqual(3);
    expect(matches.length).toEqual(1);

  });

  it('should support custom HTML tag for matching elements', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight matchElement="em" search="world">
        Hello World
      </Highlight>
    );

    var matches =
      TestUtils.scryRenderedDOMComponentsWithTag(instance, 'em');
    expect(matches.length).toEqual(1);
  });

  it('should support custom className for matching element', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight matchClass="fffffound" search="Seek">
        Hide and Seek
      </Highlight>
    );

    var matches =
      TestUtils.scryRenderedDOMComponentsWithClass(instance, 'fffffound');
    expect(matches.length).toEqual(1);
  });

  it('should support passing props to parent element', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight className="myHighlighter" search="world">
        Hello World
      </Highlight>
    );

    var matches =
      TestUtils.scryRenderedDOMComponentsWithTag(instance, 'strong');

    expect(ReactDOM.findDOMNode(instance).className).toEqual('myHighlighter');
    expect(ReactDOM.findDOMNode(matches[0]).className).toEqual('highlight');
  });

  it('should support regular expressions in search', function () {
    var instance = TestUtils.renderIntoDocument(
      <Highlight className="myHighlighter" search={/[A-Za-z]+/}>
        Easy as 123, ABC...
      </Highlight>
    );

    var matches =
      TestUtils.scryRenderedDOMComponentsWithTag(instance, 'strong');
    expect(ReactDOM.findDOMNode(matches[0]).textContent).toEqual('Easy');
    expect(ReactDOM.findDOMNode(matches[1]).textContent).toEqual('as');
    expect(ReactDOM.findDOMNode(matches[2]).textContent).toEqual('ABC');
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
