describe("Settings Page [05k]", function() {

  beforeEach(function() {
    cy
      .server()
      .route(/apps/, "fx:marathon-1-task/app")
      .route(/history\/minute/, "fx:marathon-1-task/history-minute")
      .route(/history\/last/, "fx:marathon-1-task/summary")
      .route(/state-summary/, "fx:marathon-1-task/summary")
      .route(/state/, "fx:marathon-1-task/state")
      .route(/api\/v1\/groups/, "fx:acl/groups-unicode")
      .route(/ui-config/, "fx:config/tracking-disabled")
      .visit("http://localhost:4200/", {
      onBeforeLoad: function(contentWindow) {
        contentWindow.localStorage.setItem("email", "ui-bot@mesosphere.io");
      }
    });

  });

  beforeEach(function() {
    cy.get(".sidebar-menu-item").contains("Settings").click();
  });

  context("Groups Table [05l]", function() {

    beforeEach(function() {
      cy.get(".page-header-navigation .tab-item-label").contains("Groups")
        .click();
    });

    it("routes to the group page [05p]", function() {
      cy.get(".page-header-navigation .tab-item-label").contains("Groups")
        .click();
      cy.hash().should("match", /groups/);
    });

    it("shows the groups tab as active [05q]", function() {
      cy.get(".page-header-navigation .active").as("activeTab");
      cy.get("@activeTab").should("contain", "Groups");
    });

    it("hides groups when no groups match the string [05r]", function() {
      cy.get(".groups-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .gm-scroll-view .table tbody tr")
        .as("tableRows");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be(1);
      });
    });

    it("displays 'No data' when it has filtered out all groups [05t]", function() {
      cy.get(".groups-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .gm-scroll-view .table tbody tr")
        .as("tableRows");
      cy.get("@tableRows").get("td").as("tableRowCell");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRowCell").should(function ($tableCell) {
        expect($tableCell[0].textContent).to.equal("No data");
      });
    });

    it("shows all groups after clearing the filter [05s]", function() {
      cy.get(".groups-table-header").as("groupsTableHeader");
      cy.get("@groupsTableHeader").get("input[type='text']")
        .as("filterTextbox");
      cy.get("@groupsTableHeader").get(".form-control-group-add-on a")
        .as("clearFilterButton");
      cy.get(".page-content-fill .gm-scroll-view .table tbody tr")
        .as("tableRows");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");
      cy.get("@clearFilterButton").click();

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be.above(10);
      });
    });

    it("allows users to filter by unicode characters [05u]", function() {
      cy.get(".groups-table-header").as("groupsTableHeader");
      cy.get("@groupsTableHeader").get("input[type='text']")
        .as("filterTextbox");

      cy.get("@filterTextbox").type("藍-遙 遥 悠 遼");

      cy.get(".page-content-fill .gm-scroll-view .table tbody tr")
        .as("tableRows");

      cy.get("@tableRows").should(function ($tableRows) {
        // We expect the length to be 3 because of the spacer on the top and
        // bottom of the actual table rows.
        expect($tableRows.length).to.equal(3);
      });
    });

  });

});
