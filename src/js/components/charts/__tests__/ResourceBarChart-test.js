jest.dontMock("../ResourceBarChart");
jest.dontMock("../../../constants/ResourceTypes");

let React = require("react/addons");
let TestUtils = React.addons.TestUtils;

let Config = require("../../../config/Config");
let ResourceBarChart = require("../ResourceBarChart");

describe("ResourceBarChart", function () {

  beforeEach(function () {
    this.callback = jasmine.createSpy();
    this.instance = TestUtils.renderIntoDocument(
      <ResourceBarChart
        onResourceSelectionChange={this.callback}
        itemCount={10}
        refreshRate={2000}
        resourceType="CPUs"
        resources={{cpus: [], disk: [], memory: []}}
        totalResources={{cpus: [{
          date: 0,
          percentage: 0,
          value: 0
        }], disk: [], memory: []}}
        selectedResource="cpus" />
    );
  });

  it("will fill the resouces object with empty historical values for " +
    "missing states", function () {
    let data = this.instance.getData();
    expect(data[0].values.length).toEqual(Config.historyLength);
  });

});
