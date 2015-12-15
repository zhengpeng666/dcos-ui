describe("LoginModal", function () {

  beforeEach(function () {
    cy.configureCluster({
        mesos: "1-task-healthy",
        acl: true,
        plugins: "authentication-enabled"
      })
      .route({
        method: "POST",
        status: 201,
        url: /api\/v1\/auth\/login/,
        delay: 100,
        response: {name: "John Doe"}
      })
      .visitUrl({url: "/", logIn: false});
  });

  it("should open the modal", function () {
    cy.get(".modal-container").should(function (modal) {
      expect(modal.length).to.equal(1);
    });
  });

  context("logging in", function () {
    beforeEach(function () {
      cy.get(".modal-container input[type='text']").type("kennyt");
      cy.get(".modal-container input[type='password']").type("1234");

      cy.get(".modal-footer .button").click();
    });

    it("disables the buttons while request is pending on submit", function () {
      cy.get(".modal-footer .button.disabled").should(function (button) {
        expect(button.length).to.equal(1);
      });
    });

    it("routes to dashboard after successful login", function () {
      cy.wait(150);
      cy.hash().should("eq", "#/dashboard/");
    });
  });

});
