describe("Group Details Sidepanel [02k]", function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: "1-task-healthy",
      acl: true,
      plugins: "settings-enabled"
    })
    .visitUrl({url: "/settings/organization/groups/olis", identify: true});
  });

  it("displays the correct group [040]", function() {
    cy
      .get(".side-panel .side-panel-content-header-label .form-element-inline-text")
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

  context("Permissions tab [02v]", function () {

    beforeEach(function () {
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

    it("should have a table [01a]", function () {
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
