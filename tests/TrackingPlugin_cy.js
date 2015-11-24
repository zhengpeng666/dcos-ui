describe("Tracking Plugin [02w]", function() {

  beforeEach(function() {
    cy
      .server({force404: false})
      .route(/apps/, "fx:marathon-1-task/app")
      .route(/history\/minute/, "fx:marathon-1-task/history-minute")
      .route(/history\/last/, "fx:marathon-1-task/summary")
      .route(/state-summary/, "fx:marathon-1-task/summary")
      .route(/state/, "fx:marathon-1-task/state")
      .visit("http://localhost:4200/", {
      onBeforeLoad: function(contentWindow) {
        contentWindow.localStorage.setItem("email", "ui-bot@mesosphere.io");
      }
    });
  });

  context("Intercom [02t]", function() {
    // beforeEach(function() {
    //   // ??
    // });

    it("should add intercom script to body [02u]", function() {
      // cy.get("button[data-behavior='show-tip']").click();
      cy.contains("#intercom-container");
    });

    // it("should add Chameleon 'Getting Started'"), function() {
    //
    // });
    //
    // it("should identify users with Segment analytics"), function() {
    //
    // });
    //
    // it("should display Intercom when sidebar icon is active"), function() {
    //
    // });
    //
    // it("should not display Intercom when sidebar icon is inactive"), function() {
    //
    // });
  });
});
