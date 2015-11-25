describe("Tracking Plugin [02w]", function() {

  beforeEach(function() {
    cy
      .server()
      .route(/apps/, "fx:marathon-1-task/app")
      .route(/history\/minute/, "fx:marathon-1-task/history-minute")
      .route(/history\/last/, "fx:marathon-1-task/summary")
      .route(/state-summary/, "fx:marathon-1-task/summary")
      .route(/state/, "fx:marathon-1-task/state")
      .route(/ui-config/, "fx:config/config")
      .visit("http://localhost:4200/", {
      onBeforeLoad: function(contentWindow) {
        contentWindow.localStorage.setItem("email", "ui-bot@mesosphere.io");
      }
    });
    cy.fixture("config/Config.js");
  });

  context("Sidebar [02x]", function() {
    it("should have three sidebar icons [02y]", function() {
      cy.get(".sidebar-footer").find(".button").should("to.have.length", 3);
    })
  });

  // context("Intercom [02t]", function() {
  //   beforeEach(function() {
  //     cy.get("button[data-tip-content='Talk with us']").as("intercomButton");
  //   });
  //
  //   it("should identify users with Segment analytics"), function() {
  //    // TODO
  //   });
  //
  //   it("should add intercom script to body [02u]", function() {
  //     // cy.get("button[data-behavior='show-tip']").click();
  //     cy.get("#intercom-container");
  //   });
  //
  //   context("Closed -> Opened [036]", function() {
  //     beforeEach(function() {
  //       Intercom("hide");
  //     });
  //
  //     it("should not display Intercom when sidebar button is inactive [039]",
  //       function() {
  //         cy.get("@intercomButton").find(".icon")
  //           .should("not.have.class", "icon-sprite-medium-color");
  //         cy.get("#intercom-messenger").should("have.class", "intercom-messenger-inactive");
  //       }
  //     );
  //
  //     it("should display Intercom when inactive sidebar button clicked [033]",
  //       function() {
  //         cy.get("@intercomButton").click();
  //         cy.get("#intercom-messenger").should("have.class", "intercom-messenger-active");
  //       }
  //     );
  //   });
  //
  //   context("Open -> Closed [03a]", function() {
  //     beforeEach(function() {
  //       Intercom("show");
  //     });
  //
  //     it("should display Intercom when sidebar button is active [038]",
  //       function() {
  //         cy.get("@intercomButton").find(".icon")
  //           .should("have.class", "icon-sprite-medium-color");
  //         cy.get("#intercom-messenger").should("have.class", "intercom-messenger-active");
  //       }
  //     );
  //
  //     it("should hide Intercom when active sidebar button clicked [03b]", function() {
  //       cy.get("@intercomButton").click();
  //       cy.get("#intercom-messenger").should("have.class", "intercom-messenger-active");
  //     });
  //   });
  // });
  //
  // context("Chameleon", function() {
  //   it("should add Chameleon 'Getting Started'"), function() {
  //    // TODO
  //   });
  //
  //   it("should start tour when 'Getting Started' button is clicked"), function() {
  //    // TODO
  //   });
  // });

  // context("Welcome Modal [02z]", function() {
  //   it("should not show modal when 'email' in localStorage [030]", function() {
  //     cy.get(".modal").should("not");
  //   });
  //
  //   context("New User [037]", function() {
  //     beforeEach(function() {
  //       cy.clearLocalStorage().visit("http://localhost:4200/");
  //     });
  //
  //     it("should show modal when no 'email' in localStorage [031]", function() {
  //       cy.get(".modal");
  //     });
  //   });
  //
  // });
});
