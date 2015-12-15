describe.only("LoginModal", function () {

  beforeEach(function () {
    cy
      .server()
      .route(/apps/, "fx:marathon-1-task/app")
      .route(/history\/minute/, "fx:marathon-1-task/history-minute")
      .route(/history\/last/, "fx:marathon-1-task/summary")
      .route(/state-summary/, "fx:marathon-1-task/summary")
      .route(/state/, "fx:marathon-1-task/state")
      .route(/ui-config/, "fx:config/authentication-enabled.json")
      .route(/api\/v1\/users/, "fx:acl/users-unicode")
      .route(/api\/v1\/groups/, "fx:acl/groups-unicode")
      .route({
        method: "POST",
        status: 201,
        url: /api\/v1\/auth\/login/,
        delay: 100,
        response: {name: "John Doe"}
      })
      .visit("http://localhost:4200/", {
        onBeforeLoad: function (contentWindow) {
          contentWindow.cookie = "dcos-acs-info-cookie=";
        }
      });
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
