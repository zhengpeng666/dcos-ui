describe("ServerErrorModal", function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: "1-task-healthy",
      acl: true,
      plugins: "settings-enabled"
    })
    .visitUrl({url: "/", logIn: true});
  });

  context("opens when group update error happens", function () {
    beforeEach(function () {
      cy.route({
        method: "PATCH",
        url: /api\/v1\/groups\/olis/,
        status: 422,
        response: {error: "There was an error."}
      })
        .visitUrl({url: "/settings/organization/groups/olis"})
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
