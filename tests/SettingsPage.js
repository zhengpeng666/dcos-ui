describe("Settings Page [05k]", function () {

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

  context("Groups Table [05l]", function () {

    beforeEach(function () {
      cy.get(".page-header-navigation .tab-item-label").contains("Groups")
        .click();
      cy.get(".groups-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr")
        .as("tableRows");
    });

    it("routes to the group page [05p]", function () {
      cy.get(".page-header-navigation .tab-item-label").contains("Groups")
        .click();
      cy.hash().should("match", /groups/);
    });

    it("shows the groups tab as active [05q]", function () {
      cy.get(".page-header-navigation .active").as("activeTab");
      cy.get("@activeTab").should("contain", "Groups");
    });

    it("hides groups when no groups match the string [05r]", function () {
      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be(1);
      });
    });

    it("displays 'No data' when it has filtered out all groups [05t]", function () {
      cy.get("@tableRows").get("td").as("tableRowCell");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRowCell").should(function ($tableCell) {
        expect($tableCell[0].textContent).to.equal("No data");
      });
    });

    it("shows all groups after clearing the filter [05s]", function () {
      cy.get(".groups-table-header .form-control-group-add-on a")
        .as("clearFilterButton");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");
      cy.get("@clearFilterButton").click();

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be.above(10);
      });
    });

    it("allows users to filter by unicode characters [05u]", function () {
      cy.get("@filterTextbox").type("藍-遙 遥 悠 遼");
      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows.length).to.equal(1);
      });
    });

  });

  context("Users Table [05v]", function () {

    beforeEach(function () {
      cy.get(".page-header-navigation .tab-item-label").contains("Users")
        .click();
      cy.get(".users-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr")
        .as("tableRows");
    });

    it("routes to the user page [05x]", function () {
      cy.get(".page-header-navigation .tab-item-label").contains("Users")
        .click();
      cy.hash().should("match", /users/);
    });

    it("shows the users tab as active [05y]", function () {
      cy.get(".page-header-navigation .active").as("activeTab");
      cy.get("@activeTab").should("contain", "Users");
    });

    it("hides users when no users match the string [05z]", function () {
      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be(1);
      });
    });

    it("displays 'No data' when it has filtered out all users [06a]", function () {
      cy.get("@tableRows").get("td").as("tableRowCell");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRowCell").should(function ($tableCell) {
        expect($tableCell[0].textContent).to.equal("No data");
      });
    });

    it("shows all users after clearing the filter [06b]", function () {
      cy.get(".users-table-header .form-control-group-add-on a")
        .as("clearFilterButton");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");
      cy.get("@clearFilterButton").click();

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be.above(10);
      });
    });

    it("allows users to filter by unicode characters [06c]", function () {
      cy.get("@filterTextbox").type("藍-遙 遥 悠 遼");
      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows.length).to.equal(1);
      });
    });

  });

  context("User Details Sidepanel [05v]", function() {

    beforeEach(function() {
      cy
        .route(
          /users\/quis/, "fx:acl/user-unicode"
        )
        .route(
          /users\/quis\/groups/, []
        )
        .route(
          /users\/quis\/permissions/, {direct: [], groups: []}
        )
        .visit("http://localhost:4200/#/settings/organization/users/quis");
    });

    it("displays the correct user [05w]", function() {
      cy
        .get(".side-panel .side-panel-content-header-label")
        .should(function ($header) {
          expect($header[0].textContent).to.equal("藍-Schüler Zimmer verfügt über einen Schreibtisch, Telefon, Safe in Notebook-Größe");
        });
    });

    it("sets the first tab as active [05y]", function() {
      cy
        .get(".side-panel .tabs .active")
        .should("contain", "Permissions");
    });

    context("Group Membership [05z]", function() {

      beforeEach(function () {
        cy
          .get(".side-panel .tabs .tab-item-label")
          .contains("Group Membership")
          .click();
      });

      it("displays the groups that the member belongs to [05x]", function() {
        cy
          .get(".side-panel .table tbody")
          .should(function ($tbody) {
            expect($tbody.children().length).to.equal(2);
          });
      });

      it("displays the confirmation modal when clicking remove [060]", function() {
        cy
          .get(".side-panel .table tbody tr:first-child button")
          .click();

        cy
          .get(".confirm-modal")
          .should(function ($modal) {
            expect($modal.length).to.equal(1);
          });
      });

    });

    context("Delete User [042]", function() {
      beforeEach(function () {
        cy.get(".side-panel-header-actions-secondary").as("headerUserDelete");
      });

      it("shows delete modal when header delete button clicked [043]", function() {
        cy.get("@headerUserDelete")
          .find(".side-panel-header-action")
          .click()
        cy.get(".confirm-modal").should("to.have.length", 1);
      });

      it("returns to users page after user deleted [045]", function() {
        cy.route({
          method: "DELETE",
          url: /users\/quis/,
          status: 200,
          response: {}
        });
        cy.get("@headerUserDelete")
          .find(".side-panel-header-action")
          .click();
        cy.get(".button-danger").click();
        cy.url().should("contain", "/settings/organization/users")
      });

      it("shows error when request to delete user fails [044]", function() {
        cy.route({
          method: "DELETE",
          url: /users\/quis/,
          status: 400,
          response: {error: "There was an error."}
        });
        cy.get("@headerUserDelete")
          .find(".side-panel-header-action")
          .click();
        cy.get(".button-danger").click();
        cy.get(".text-error-state").should("contain", "There was an error.");
      });

    });

    context("User Details [063]", function () {

      beforeEach(function () {
        cy
          .get(".side-panel .tabs .tab-item-label")
          .contains("Details")
          .click();
        cy
          .get(".side-panel .side-panel-content-user-details .row").as("rows");
      });

      it("displays the username in the first row [064]", function () {
        cy.get("@rows")
          .should(function ($rows) {
            var firstRow = $rows[0];
            expect(firstRow.children[1].textContent).to.equal("quis");
          });
      });

      it("displays the password form in the second row [065]", function () {
        cy.get("@rows")
          .should(function ($rows) {
            var secondRow = $rows[1];
            expect(secondRow.children[1].children[0].nodeName).to.equal("FORM");
          });
      });

      it("switches the password label into a password input element [066]",
        function () {
        cy.get("form .read-only")
          .click();

        cy.get("form input")
          .should(function ($input) {
            expect($input.length).to.equal(1);
            expect($input[0].type).to.equal("password");
          });
      });

    });

  });

  context("Group Details Sidepanel [03z]", function() {

    beforeEach(function() {
      cy.visit("http://localhost:4200/#/settings/organization/groups/olis");
    });

    it("displays the correct group [040]", function() {
      cy
        .get(".side-panel .side-panel-content-header-label")
        .should(function ($header) {
          expect($header[0].textContent).to.equal("藍-遙 遥 悠 遼 Größe");
        });
    });

    it("sets the first tab as active [041]", function() {
      cy
        .get(".side-panel .tabs .active")
        .should("contain", "Permissions");
    });

    context("User Membership [05z]", function() {

      beforeEach(function () {
        cy
          .get(".side-panel .tabs .tab-item-label")
          .contains("Members")
          .click();
      });

      it("displays the users belong to the group [061]", function() {
        cy
          .get(".side-panel .table tbody")
          .should(function ($tbody) {
            expect($tbody.children().length).to.equal(2);
          });
      });

      it("displays the confirmation modal when clicking remove [060]", function() {
        cy
          .get(".side-panel .table tbody tr:first-child button")
          .click();

        cy
          .get(".confirm-modal")
          .should(function ($modal) {
            expect($modal.length).to.equal(1);
          });
      });

    });

  });

});
