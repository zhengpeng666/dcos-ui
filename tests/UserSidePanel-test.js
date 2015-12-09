describe("User Details Sidepanel [02k]", function () {

  beforeEach(function () {
    cy
      .server()
      .route(/apps/, "fx:marathon-1-task/app")
      .route(/history\/minute/, "fx:marathon-1-task/history-minute")
      .route(/history\/last/, "fx:marathon-1-task/summary")
      .route(/state-summary/, "fx:marathon-1-task/summary")
      .route(/state/, "fx:marathon-1-task/state")
      .route(/api\/v1\/users/, "fx:acl/users-unicode")
      .route(/api\/v1\/groups/, "fx:acl/groups-unicode")
      .route(/ui-config/, "fx:config/tracking-disabled")
      .visit("http://localhost:4200/", {
      onBeforeLoad: function (contentWindow) {
        contentWindow.localStorage.setItem("email", "ui-bot@mesosphere.io");
      }
    });

    cy.get(".sidebar-menu-item").contains("Settings").click();
  });

  context("Permissions tab [02v]", function () {

    beforeEach(function () {
      cy.visit("http://localhost:4200/#/settings/organization/users/quis");
      cy.get(".side-panel").as("sidePanel");
    });

    it("displays 'Add Service' in the dropdown box [02x]", function () {
      cy
        .get("@sidePanel")
        .get(".dropdown .dropdown-toggle > span")
        .should("contain", "Add Service");
    });

    it("displays the selected element in the dropdown box [02y]", function () {
      cy
        .get("@sidePanel")
        .get(".dropdown .dropdown-toggle > span")
        .click();

      cy
        .get("@sidePanel")
        .get(".dropdown-menu-list > .clickable:last-child > a")
        .click({multiple: true});

      cy
        .get("@sidePanel")
        .get(".dropdown .dropdown-toggle > span")
        .should("contain", "Kirby Ying Coyer");
    });

    it("shouldn't contain services that are already in permissions [02z]", function () {
      cy
        .get("@sidePanel")
        .get(".dropdown .dropdown-toggle > span")
        .click();

      cy
        .get("@sidePanel")
        .get(".dropdown-menu-list")
        .should(function (list) {
          var children = list.children();
          var result = false;
          for (var i = 0; i < children.length; i++) {
            if (children[i].textContent === "service.marathon") {
              result = true;
            }
          }

          expect(result).to.equal(false);
        });
    });

  });

});
