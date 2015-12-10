describe("Access Denied Page [046]", function () {

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
  });

  context("Authentication on [047]", function () {

    beforeEach(function () {
      cy.visit("http://localhost:4200/#/access-denied");
    });

    it("should show access denied page [04a]",
      function () {
        cy.get("h3").should(function (title) {
          expect(title[0].textContent).to.equal("Access Denied");
        });
      }
    );
  });

  context("Authentication off [048]", function () {

    beforeEach(function () {
      cy.visit("http://localhost:4200/");
    });

    it("should show dashboard [04b]",
      function () {
        cy.get("h1").should(function (title) {
          expect(title[0].textContent).to.equal("Dashboard");
        });
      }
    );
  });

});
