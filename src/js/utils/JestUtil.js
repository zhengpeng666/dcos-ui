const TestUtils = require('react-addons-test-utils');

const JestUtil = {
  renderAndFindTag: function (instance, tag) {
    var result = TestUtils.renderIntoDocument(instance);
    return TestUtils.findRenderedDOMComponentWithTag(result, tag);
  }
};

module.exports = JestUtil;
