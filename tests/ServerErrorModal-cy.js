describe("ServerErrorModal [01n]", function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: "1-task-healthy",
      acl: true,
      plugins: "settings-enabled"
    })
    .visitUrl({url: "/", identify: true});
  });

  context("opens when group update error happens [01o]", function () {
    beforeEach(function () {
      cy.route({
        method: "PATCH",
        url: /api\/v1\/groups\/olis/,
        status: 422,
        response: {error: "There was an error."}
      })
        .visitUrl({url: "/settings/organization/groups/olis", identify: true})
        .get(".side-panel .side-panel-content-header-label .form-element-inline-text")
        .click();

      cy.get(".side-panel").click();
    });

    it("should open [01p]", function () {
      cy.get(".modal-header-title").should("contain", "An error has occurred");
    });
  });

  context("opens when user update error happens [01s]", function () {
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

    it("should open [01t]", function () {
      cy.get(".modal-header-title").should("contain", "An error has occurred");
    });
  });

  context("opens when group user add error happens [06t]", function () {
    beforeEach(function () {
      cy.route({
        method: "PUT",
        url: /api\/v1\/groups\/olis\/users\/quis/,
        status: 422,
        response: {error: "There was an error."}
      })
        .visit("http://localhost:4200/#/settings/organization/groups/olis")
        .get(".tabs .tab-item")
        .contains("Members")
        .click();

      cy.get(".dropdown-toggle").click();

      cy.get(".dropdown-menu-list .is-selectable")
        .contains("藍-Schüler Zimmer verfügt über einen Schreibtisch, Telefon, Safe in Notebook-Größe")
        .click();
    });

    it("should open [06u]", function () {
      cy.get(".modal-header-title").should("contain", "An error has occurred");
    });
  });
});
