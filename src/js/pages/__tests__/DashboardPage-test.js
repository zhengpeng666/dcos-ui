jest.dontMock("../DashboardPage");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("../../mixins/InternalStorageMixin");
jest.dontMock("../../utils/Store");
jest.dontMock("../../constants/HealthSorting");

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var DashboardPage = require("../DashboardPage");
var MesosSummaryStore = require("../../stores/MesosSummaryStore");

MesosSummaryStore.getLatest = function () {
  return {frameworks: []};
};

describe("DashboardPage", function () {

  describe("#getServicesList", function () {

    beforeEach(function () {
      this.instance = TestUtils.renderIntoDocument(
        <DashboardPage servicesListLength={5}/>
      );
    });

    it("gets list of services", function () {
      var services = [
        {name: "foo", health: {key: "bar"}}
      ];
      var list = this.instance.getServicesList(services);
      expect(list).toEqual([{name: "foo", health: {key: "bar"}}]);
    });

    it("should pick out name,health keys only", function () {
      var services = [
        {name: "foo", health: {key: "bar"}, bar: "baz"}
      ];

      var list = this.instance.getServicesList(services);
      expect(list).toEqual([{name: "foo", health: {key: "bar"}}]);
    });

    it("handles services with missing health", function () {
      var services = [
        {name: "foo"}
      ];
      var list = this.instance.getServicesList(services);
      expect(list).toEqual([{name: "foo"}]);
    });

    it("sorts services by health", function () {
      var services = [
        {name: "bar", health: {key: "HEALTHY"}},
        {name: "foo", health: {key: "UNHEALTHY"}}
      ];
      var list = this.instance.getServicesList(services);
      expect(list[0].name).toEqual("foo");
      expect(list[1].name).toEqual("bar");
    });

  });

    it("should not return more services than servicesListLength", function () {
      var services = [
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}},
        {name: "foo", health: {key: "bar"}}
      ];

      var list = this.instance.getServicesList(services);
      expect(list.length).toEqual(5);
    });

    it("should sort by health", function () {
      var services = [
        {name: "foo", health: {key: "IDLE"}},
        {name: "bar", health: {key: "UNHEALTHY"}},
        {name: "qaz", health: {key: "HEALTHY"}},
        {name: "zin", health: {key: "NA"}},
      ];

      var list = this.instance.getServicesList(services);
      expect(list[0].health.key).toEqual("UNHEALTHY");
      expect(list[1].health.key).toEqual("HEALTHY");
      expect(list[2].health.key).toEqual("IDLE");
      expect(list[3].health.key).toEqual("NA");
    });
  });

  describe("getting data from the Store", function () {
    beforeEach(function () {
      // Get the listener to fake a summary change.
      MesosSummaryStore.addChangeListener = function (event, listener) {
        this.mesosStateListener = listener;
      }.bind(this);
    });

    it("should update on summary change from MesosSummaryStore", function () {
      // Mock all the return values from the Store.
      var mockedFunctions = {
        getAllocResources: {mocked: "data"},
        get: {mocked: "data"},
        getActiveHostsCount: {mocked: "data"},
        getRefreshRate: {mocked: "data"},
        getLatest: {frameworks: [{health: "HEALTHY"}], mocked: "data"},
        getTaskTotals: {mocked: "data"},
        getTotalResources: {mocked: "data"}
      };

      for (var key in mockedFunctions) {
        MesosSummaryStore[key] = function (data) {
          return data;
        }.bind(MesosSummaryStore, mockedFunctions[key]);
      }

      this.instance = TestUtils.renderIntoDocument(
        <DashboardPage/>
      );

      // Trigger the event listener. Pretend like the summary has changed.
      this.mesosStateListener();

      // Make sure the storage gets the same data.
      var internalStorage = this.instance.internalStorage_get();
      for (var key in internalStorage) {
        if (key === "services") {
          expect(internalStorage[key][0].health).toEqual("HEALTHY");
        } else {
          expect(internalStorage[key].mocked).toEqual("data");
        }
      }
    });
  });
});
