jest.dontMock("../MarathonStore");
jest.dontMock("./fixtures/MockAppMetadata");
jest.dontMock("./fixtures/MockMarathonResponse");
jest.dontMock("./fixtures/MockParsedAppMetadata");

var MarathonStore = require("../MarathonStore");
var MockAppMetadata = require("./fixtures/MockAppMetadata");
var MockMarathonResponse = require("./fixtures/MockMarathonResponse");
var MockParsedAppMetadata = require("./fixtures/MockParsedAppMetadata");

// mock global string decoder
global.atob = function () {
  return MockAppMetadata.decodedString;
};

describe("MarathonStore", function () {

  describe("#getFrameworkHealth", function () {

    it("should return NA health when app has no health check", function () {
      var health = MarathonStore.getFrameworkHealth(
        MockMarathonResponse.hasNoHealthy.apps[0]
      );
      expect(health).toEqual(null);
    });

    it("should return idle when app has no running tasks", function () {
      var health = MarathonStore.getFrameworkHealth(
        MockMarathonResponse.hasNoRunningTasks.apps[0]
      );
      expect(health.key).toEqual("IDLE");
    });

    it("should return unhealthy when app has only unhealthy tasks",
      function () {
        var health = MarathonStore.getFrameworkHealth(
          MockMarathonResponse.hasOnlyUnhealth.apps[0]
        );
        expect(health.key).toEqual("UNHEALTHY");
      }
    );

    it("should return unhealthy when app has both healthy and unhealthy tasks",
      function () {
        var health = MarathonStore.getFrameworkHealth(
          MockMarathonResponse.hasOnlyUnhealth.apps[0]
        );
        expect(health.key).toEqual("UNHEALTHY");
      }
    );

    it("should return healthy when app has healthy and no unhealthy tasks",
      function () {
        var health = MarathonStore.getFrameworkHealth(
          MockMarathonResponse.hasHealth.apps[0]
        );
        expect(health.key).toEqual("HEALTHY");
      }
    );
  });

  describe("#parseMetadata", function () {

    it("should parse metadata correctly", function () {
      var result = MarathonStore.parseMetadata(
        MockAppMetadata.encodedString
      );
      expect(result).toEqual(MockParsedAppMetadata);
    });
  });

  describe("#getFrameworkImages", function () {
    it("should return parsed images when app has metadata with images",
      function () {
        var images = MarathonStore.getFrameworkImages(
          MockMarathonResponse.hasMetadata.apps[0]
        );
        expect(images).toEqual(MockParsedAppMetadata.images);
      }
    );

    it("should return default images when app has metadata with images",
      function () {
        var images = MarathonStore.getFrameworkImages(
          MockMarathonResponse.hasHealth.apps[0]
        );
        expect(images).toEqual(MarathonStore.NA_IMAGES);
      }
    );
  });

  describe("#processMarathonApps", function () {

    it("should set Marathon health to idle with no apps", function () {
      MarathonStore.processMarathonApps({apps: []});
      expect(MarathonStore.apps.marathon.health.key).toEqual("IDLE");
    });

    it("should set Marathon health to healthy with some apps", function () {
      MarathonStore.processMarathonApps(
        MockMarathonResponse.hasOnlyUnhealth
      );
      expect(MarathonStore.apps.marathon.health.key).toEqual("HEALTHY");
    });

  });

});
