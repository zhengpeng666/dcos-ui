describe("DCOS UI [00j]", function() {

  beforeEach(function() {
    cy
      .server()
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

  context("Services [00n]", function() {

    beforeEach(function() {
      cy.get(".sidebar-menu-item").contains("Services").click();
      cy.get("table tbody tr").as("tableRows");
    });

    it("should open the service panel [00p]", function() {
      // Open the Marathon task.
      cy.get("@tableRows").find("a").contains("marathon").click();
      // Get the task panel's header.
      cy.get(".side-panel-header-container").as("sidePanelHeader");
      // Open the Marathon UI.
      cy.get(".side-panel-content-header-actions")
        .find("a")
        .contains("Open Service")
        .click();
      // Get the service overlay's header.
      cy.get(".overlay-header-container").as("overlayHeader");

      // Assert that the height of the two headers are equal.
      cy.get("@sidePanelHeader").should(function($sidePanelHeader) {
        var sidePanelHeaderHeight = $sidePanelHeader.outerHeight();

        cy.get("@overlayHeader").should(function($overlayHeader) {
          var overlayHeaderHeight = $overlayHeader.outerHeight();
          expect(sidePanelHeaderHeight).to.eq(overlayHeaderHeight);
        });

      });

    });

  });

});
