describe.only("ServerErrorModal", function () {

  beforeEach(function () {
    cy
      .server()
      .route(/apps/, "fx:marathon-1-task/app")
      .route(/history\/minute/, "fx:marathon-1-task/history-minute")
      .route(/history\/last/, "fx:marathon-1-task/summary")
      .route(/state-summary/, "fx:marathon-1-task/summary")
      .route(/state/, "fx:marathon-1-task/state")
      .route(/ui-config/, "fx:config/settings-enabled.json")
      .route(/acls\?type=services/, "fx:acl/acls-unicode")
      .route(/api\/v1\/users/, "fx:acl/users-unicode")
      .route(/api\/v1\/groups/, "fx:acl/groups-unicode")
      .route(/groups\/olis/, "fx:acl/group-unicode")
      .route(/groups\/olis\/users/, "fx:acl/group-users")
      .route(/groups\/olis\/permissions/, "fx:acl/group-permissions")
      .route(/users\/quis/, "fx:acl/user-unicode")
      .route(/users\/quis\/groups/, "fx:acl/user-groups")
      .route(/users\/quis\/permissions/, "fx:acl/user-permissions");
  });

  context("opens when group update error happens", function () {
    beforeEach(function () {
      cy.route({
        method: "PATCH",
        url: /api\/v1\/groups\/olis/,
        status: 422,
        response: {error: "There was an error."}
      })
        .visit("http://localhost:4200/#/settings/organization/groups/olis")
        .get(".side-panel .side-panel-content-header-label .form-element-inline-text")
        .click();

      cy.get(".side-panel").click();
    });

    it("should open", function () {
      cy.get(".modal-header-title").should("contain", "An error has occurred");
    });
  });

  context("opens when group delete error happens", function () {
    beforeEach(function () {
      cy.route({
        method: "DELETE",
        url: /api\/v1\/groups\/olis/,
        status: 422,
        response: {error: "There was an error."}
      })
        .visit("http://localhost:4200/#/settings/organization/groups/olis")
        .get(".side-panel-header-actions-secondary span")
        .click();

      cy.get(".modal-container .button-danger").click();
    });

    it("should open", function () {
      cy.get(".modal-header-title").should("contain", "An error has occurred");
    });
  });

  context("opens when user update error happens", function () {
    beforeEach(function () {
      cy.route({
        method: "PATCH",
        url: /api\/v1\/users\/quis/,
        status: 422,
        response: {error: "There was an error."}
      })
        .visit("http://localhost:4200/#/settings/organization/users/quis")
        .get(".side-panel .side-panel-content-header-label .form-element-inline-text")
        .click();

      cy.get(".side-panel").click();
    });

    it("should open", function () {
      cy.get(".modal-header-title").should("contain", "An error has occurred");
    });
  });

  context("opens when user delete error happens", function () {
    beforeEach(function () {
      cy.route({
        method: "DELETE",
        url: /api\/v1\/users\/quis/,
        status: 422,
        response: {error: "There was an error."}
      })
        .visit("http://localhost:4200/#/settings/organization/users/quis")
        .get(".side-panel-header-actions-secondary span")
        .click();

      cy.get(".modal-container .button-danger").click();
    });

    it("should open", function () {
      cy.get(".modal-header-title").should("contain", "An error has occurred");
    });
  });
});
