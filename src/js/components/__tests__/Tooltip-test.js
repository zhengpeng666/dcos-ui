jest.dontMock('../Tooltip');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var ReactDOM = require('react-dom');

var Tooltip = require('../Tooltip');

describe('Tooltip', function () {
  describe('#getTabs', function () {
    beforeEach(function () {
      this.container = document.createElement('div');
      this.instance = ReactDOM.render(
        <Tooltip
          content="application"
          behavior="show-tip"
          tipPlace="top">
          <h3>Header</h3>
        </Tooltip>,
        this.container
      );
    });

    afterEach(function () {
      ReactDOM.unmountComponentAtNode(this.container);
    });

    it('renders an element with data-behavior', function () {
      var node = ReactDOM.findDOMNode(this.instance);
      var element = node.querySelectorAll('[data-behavior~=show-tip]');

      expect(element.length).toEqual(1);
    });

    it('renders an element with data-tip-place', function () {
      var node = ReactDOM.findDOMNode(this.instance);
      var element = node.querySelectorAll('[data-tip-place~=top]');

      expect(element.length).toEqual(1);
    });

    it('renders an element with data-tip-content', function () {
      var node = ReactDOM.findDOMNode(this.instance);
      var element = node.querySelectorAll('[data-tip-content~=application]');

      expect(element.length).toEqual(1);
    });
  });
});
