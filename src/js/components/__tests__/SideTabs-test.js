jest.dontMock('../SideTabs');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var SideTabs = require('../SideTabs');

describe('SideTabs', function () {
  describe('#getTabs', function () {
    beforeEach(function () {
      this.tabs = [{title: 'Application'}, {title: 'Host'}];
      this.instance = TestUtils.renderIntoDocument(
        <SideTabs
          selectedTab="Application"
          tabs={this.tabs} />
      );
    });

    it('returns a list item for each tab', function () {
      var node = ReactDOM.findDOMNode(this.instance);
      var items = node.querySelectorAll('li');
      expect(items.length).toEqual(this.tabs.length);
    });

    it('renders the selected tab with the \'selected\' class', function () {
      var node = ReactDOM.findDOMNode(this.instance);
      var selectedTab = node.querySelector('.selected');

      expect(selectedTab.textContent).toEqual('Application');
    });
  });
});
