var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

const JestUtil = {
  renderAndFindTag: function (instance, tag) {
    var result = TestUtils.renderIntoDocument(instance);
    return TestUtils.findRenderedDOMComponentWithTag(result, tag);
  }
};

module.exports = JestUtil;
