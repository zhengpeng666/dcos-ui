describe("Settings Page [05k]", function () {

  context("Groups Tab [05l]", function () {

    beforeEach(function () {
      cy.configureCluster({
        mesos: "1-task-healthy",
        acl: true,
        plugins: "settings-enabled"
      })
      .visitUrl({url: "/settings/organization/groups/", identify: true});
    });

    it("routes to the group page [05p]", function () {
      cy.get(".page-header-navigation .tab-item-label").contains("Groups")
        .click();
      cy.hash().should("match", /groups/);
    });

    it("shows the loading indicator before receiving data [06c]", function () {
      cy.get(".ball-scale").should(function ($loadingIndicator) {
        expect($loadingIndicator).length.to.be(1);
      });
    });

    it("shows the groups tab as active [05q]", function () {
      cy.get(".page-header-navigation .active").as("activeTab");
      cy.get("@activeTab").should("contain", "Groups");
    });

    it("hides groups when no groups match the string [05r]", function () {
      cy.get(".groups-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr").as("tableRows");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be(1);
      });
    });

    it("displays 'No data' when it has filtered out all groups [05t]", function () {
      cy.get(".groups-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr").as("tableRows");
      cy.get("@tableRows").get("td").as("tableRowCell");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRowCell").should(function ($tableCell) {
        expect($tableCell[0].textContent).to.equal("No data");
      });
    });

    it("shows all groups after clearing the filter [05s]", function () {
      cy.get(".groups-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr").as("tableRows");
      cy.get(".groups-table-header .form-control-group-add-on a")
        .as("clearFilterButton");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");
      cy.get("@clearFilterButton").click();

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be.above(10);
      });
    });

    it("allows users to filter by unicode characters [05u]", function () {
      cy.get(".groups-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr").as("tableRows");

      cy.get("@filterTextbox").type("藍-遙 遥 悠 遼");
      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows.length).to.equal(1);
      });
    });

    context("Bulk Actions [04n]", function () {

      beforeEach(function () {
        cy.configureCluster({
          mesos: "1-task-healthy",
          acl: true,
          plugins: "settings-enabled"
        })
        .route(/api\/v1\/groups/, "fx:acl/groups-unicode-truncated")
        .visitUrl({url: "/settings/organization/groups/", identify: true});

        cy.get("tbody .checkbox").as("checkboxes");
        cy.get("tbody .checkbox input").as("checkboxesState");
        cy.get("thead .checkbox").as("checkboxHeader");
        cy.get("thead .checkbox input").as("checkboxHeaderState");
      });

      it("sets heading checkbox indeterminate when checkbox toggled [04i]",
        function () {
          cy.get("@checkboxes").first().click();

          cy.get("@checkboxHeaderState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].indeterminate).to.equal(true);
          });
        }
      );

      it("sets heading checkbox checked when all checkboxes toggled [04j]",
        function () {
          cy.get("@checkboxes").click({multiple: true});

          cy.get("@checkboxes").should(function ($checkboxes) {
            expect($checkboxes).length.to.be(4);
          });

          cy.get("@checkboxHeaderState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].checked).to.equal(true);
          });
        }
      );

      it("sets heading checkbox indeterminate when checkbox untoggled [04k]",
        function () {
          cy.get("@checkboxes").click({multiple: true});
          cy.get("@checkboxes").first().click();

          cy.get("@checkboxHeaderState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].indeterminate).to.equal(true);
          });
        }
      );

      it("checks all checkboxes on heading checkbox checked [04l]",
        function () {
          cy.get("@checkboxHeader").click();

          cy.get("@checkboxesState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].checked).to.equal(true);
            expect($checkboxHeader[1].checked).to.equal(true);
            expect($checkboxHeader[2].checked).to.equal(true);
            expect($checkboxHeader[3].checked).to.equal(true);
          });
        }
      );

      it("unchecks all checkboxes on heading checkbox unchecked [04m]",
        function () {
          cy.get("@checkboxHeader").click();
          cy.get("@checkboxHeader").click();

          cy.get("@checkboxesState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].checked).to.equal(false);
            expect($checkboxHeader[1].checked).to.equal(false);
            expect($checkboxHeader[2].checked).to.equal(false);
            expect($checkboxHeader[3].checked).to.equal(false);
          });
        }
      );

    });

  });

  context("Users Tab [05v]", function () {

    beforeEach(function () {
      cy.configureCluster({
        mesos: "1-task-healthy",
        acl: true,
        plugins: "settings-enabled"
      })
      .visitUrl({url: "/settings/organization/users/", identify: true});
    });

    it("routes to the user page [05x]", function () {
      cy.get(".page-header-navigation .tab-item-label").contains("Users")
        .click();
      cy.hash().should("match", /users/);
    });

    it("shows the loading indicator before receiving data [06f]", function () {
      cy.get(".ball-scale").should(function ($loadingIndicator) {
        expect($loadingIndicator).length.to.be(1);
      });
    });

    it("shows the users tab as active [05y]", function () {
      cy.get(".page-header-navigation .active").as("activeTab");
      cy.get("@activeTab").should("contain", "Users");
    });

    it("hides users when no users match the string [05z]", function () {
      cy.get(".users-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr").as("tableRows");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be(1);
      });
    });

    it("displays 'No data' when it has filtered out all users [06a]", function () {
      cy.get(".users-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr").as("tableRows");
      cy.get("@tableRows").get("td").as("tableRowCell");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");

      cy.get("@tableRowCell").should(function ($tableCell) {
        expect($tableCell[0].textContent).to.equal("No data");
      });
    });

    it("shows all users after clearing the filter [06b]", function () {
      cy.get(".users-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr").as("tableRows");
      cy.get(".users-table-header .form-control-group-add-on a")
        .as("clearFilterButton");

      cy.get("@filterTextbox").type("foo_bar_baz_qux");
      cy.get("@clearFilterButton").click();

      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows).length.to.be.above(10);
      });
    });

    it("allows users to filter by unicode characters [06c]", function () {
      cy.get(".users-table-header input[type='text']").as("filterTextbox");
      cy.get(".page-content-fill .table tbody tr").as("tableRows");

      cy.get("@filterTextbox").type("藍-遙 遥 悠 遼");
      cy.get("@tableRows").should(function ($tableRows) {
        expect($tableRows.length).to.equal(1);
      });
    });

    context("Bulk Actions [04c]", function () {

      beforeEach(function () {
        cy.configureCluster({
          mesos: "1-task-healthy",
          acl: true,
          plugins: "settings-enabled"
        })
        .route(/api\/v1\/users/, "fx:acl/users-unicode-truncated")
        .visitUrl({url: "/settings/organization/users/", identify: true});

        cy.get("tbody .checkbox").as("checkboxes");
        cy.get("tbody .checkbox input").as("checkboxesState");
        cy.get("thead .checkbox").as("checkboxHeader");
        cy.get("thead .checkbox input").as("checkboxHeaderState");
      });

      it("sets heading checkbox indeterminate when checkbox toggled [04d]",
        function () {
          cy.get("@checkboxes").first().click();

          cy.get("@checkboxHeaderState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].indeterminate).to.equal(true);
          });
        }
      );

      it("sets heading checkbox checked when all checkboxes toggled [04e]",
        function () {
          cy.get("@checkboxes").click({multiple: true});

          cy.get("@checkboxes").should(function ($checkboxes) {
            expect($checkboxes).length.to.be(4);
          });

          cy.get("@checkboxHeaderState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].checked).to.equal(true);
          });
        }
      );

      it("sets heading checkbox indeterminate when checkbox untoggled [04f]",
        function () {
          cy.get("@checkboxes").click({multiple: true});
          cy.get("@checkboxes").first().click();

          cy.get("@checkboxHeaderState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].indeterminate).to.equal(true);
          });
        }
      );

      it("checks all checkboxes on heading checkbox checked [04g]",
        function () {
          cy.get("@checkboxHeader").click();

          cy.get("@checkboxesState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].checked).to.equal(true);
            expect($checkboxHeader[1].checked).to.equal(true);
            expect($checkboxHeader[2].checked).to.equal(true);
            expect($checkboxHeader[3].checked).to.equal(true);
          });
        }
      );

      it("unchecks all checkboxes on heading checkbox unchecked [04h]",
        function () {
          cy.get("@checkboxHeader").click();
          cy.get("@checkboxHeader").click();

          cy.get("@checkboxesState").should(function ($checkboxHeader) {
            expect($checkboxHeader[0].checked).to.equal(false);
            expect($checkboxHeader[1].checked).to.equal(false);
            expect($checkboxHeader[2].checked).to.equal(false);
            expect($checkboxHeader[3].checked).to.equal(false);
          });
        }
      );

    });

  });

});
