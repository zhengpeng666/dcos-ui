jest.dontMock('../SideTabs');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

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
      var listItems = TestUtils.scryRenderedDOMComponentsWithTag(
        this.instance, 'li'
      );

      expect(listItems.length).toEqual(this.tabs.length);
    });

    it('renders the selected tab with the \'selected\' class', function () {
      var selectedTab = TestUtils.findRenderedDOMComponentWithClass(
        this.instance, 'selected'
      );
      var selectedTabNode = React.findDOMNode(selectedTab);

      expect(selectedTabNode.textContent).toEqual('Application');
    });
  });
});
