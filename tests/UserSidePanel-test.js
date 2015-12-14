describe("User Details Sidepanel [02k]", function () {

  beforeEach(function () {
    cy
      .server()
      .route(/apps/, "fx:marathon-1-task/app")
      .route(/history\/minute/, "fx:marathon-1-task/history-minute")
      .route(/history\/last/, "fx:marathon-1-task/summary")
      .route(/state-summary/, "fx:marathon-1-task/summary")
      .route(/state/, "fx:marathon-1-task/state")
      .route(/ui-config/, "fx:config/settings-enabled")
      .route(/api\/v1\/users/, "fx:acl/users-unicode")
      .route(/api\/v1\/groups/, "fx:acl/groups-unicode")
      .route(/acls\?type=services/, "fx:acl/acls-unicode")
      .route(/users\/quis/, "fx:acl/user-unicode")
      .route(/users\/quis\/groups/, "fx:acl/user-groups")
      .route(/users\/quis\/permissions/, "fx:acl/user-permissions")
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
        .get(".dropdown .dropdown-toggle")
        .should("contain", "Add Service");
    });

    it("displays the selected element in the dropdown box [02y]", function () {
      cy
        .get("@sidePanel")
        .get(".dropdown .dropdown-toggle")
        .click();

      cy
        .get("@sidePanel")
        .get(".dropdown-menu-list > .clickable:last-child")
        .click();

      cy
        .get("@sidePanel")
        .get(".dropdown .dropdown-toggle")
        .should("contain", "Shelia Ike Bressette");
    });

    it("shouldn't contain services that are already in permissions [02z]", function () {
      cy
        .get("@sidePanel")
        .get(".dropdown .dropdown-toggle")
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

    it("should have a table with a row containing a service", function () {
      cy
        .get("@sidePanel")
        .get("table td")
        .should("contain", "Marathon");
    });

    it("displays the confirmation modal when clicking remove [060]", function() {
      cy
        .get("@sidePanel")
        .get(".table tbody tr:first-child button")
        .click();

      cy
        .get(".confirm-modal")
        .should(function ($modal) {
          expect($modal.length).to.equal(1);
        });
    });

  });

});
