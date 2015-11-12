var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

jest.dontMock("../TaskFailureTimeSeriesChart");

var TaskFailureTimeSeriesChart = require("../TaskFailureTimeSeriesChart");

describe("TaskFailureTimeSeriesChart", function () {

  describe("#getLatestPercent", function () {

    it("returns zero when there's no datum with rate", function () {
      let result = TaskFailureTimeSeriesChart.prototype
        .getLatestPercent([{rate: null}]);

      expect(result).toEqual(0);
    });

  });

});
