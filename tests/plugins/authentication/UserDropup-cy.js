describe("UserDropup [028]", function () {

  context("Sidebar button [029]", function () {

    beforeEach(function () {
      cy
        .configureCluster({
          mesos: "1-task-healthy",
          acl: true,
          plugins: "authentication-enabled"
        })
        .visitUrl({url: "/dashboard", logIn: true})
        .get(".sidebar .user-dropdown.dropdown-toggle").as("sidebarButton");
    });

    it("should show the user [02a]", function () {
      cy
        .get("@sidebarButton")
        .get(".user-description")
        .should("contain", "Joe Doe");
    });
  });

  context("Modal [02b]", function () {

    beforeEach(function () {
      cy
        .configureCluster({
          mesos: "1-task-healthy",
          acl: true,
          plugins: "authentication-enabled"
        })
        .visitUrl({url: "/dashboard", logIn: true})
        .get(".sidebar .open .user-dropdown.dropdown-toggle")
          .as("sidebarButton")
        .click()
        .get(".user-dropdown-menu.dropdown .dropdown-menu").as("modal");
    });

    it("should show the user [02c]", function () {
      cy
        .get("@modal")
        .get(".user-description")
        .should("contain", "Joe Doe");
    });

    it("should list 4 menu items [02d]", function () {
      cy
        .get("@modal")
        .get(".dropdown-menu-list li").as("list");

      cy
        .get("@list").eq(0)
        .should("contain", "Documentation")
        .get("@list").eq(1)
        .should("contain", "Talk with us")
        .get("@list").eq(2)
        .should("contain", "Walkthrough")
        .get("@list").eq(3)
        .should("contain", "Sign Out");
    });

  });

});
