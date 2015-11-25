describe("Tracking Plugin Enabled [02w]", function() {

  beforeEach(function() {
    cy
      .server()
      .route(/apps/, "fx:marathon-1-task/app")
      .route(/history\/minute/, "fx:marathon-1-task/history-minute")
      .route(/history\/last/, "fx:marathon-1-task/summary")
      .route(/state-summary/, "fx:marathon-1-task/summary")
      .route(/state/, "fx:marathon-1-task/state")
      .route(/ui-config/, "fx:config/tracking-enabled")
      .visit("http://localhost:4200/", {
      onBeforeLoad: function(contentWindow) {
        contentWindow.localStorage.setItem("email", "ui-bot@mesosphere.io");
        contentWindow.analytics = {
          initialized: true,
          page: function(){},
          track: function(){}
        };
      }
    });
  });

  context("Sidebar [02x]", function() {
    it("should have three sidebar icons [02y]", function() {
      cy.get(".sidebar-footer").find(".button").should("to.have.length", 3);
    })
  });

  context("Welcome Modal [02z]", function() {
    it("should not show modal when 'email' in localStorage [030]", function() {
      cy.get(".modal").should("not");
    });

    context("New User [037]", function() {
      beforeEach(function() {
        cy.clearLocalStorage().visit("http://localhost:4200/");
      });

      it("should show modal when no 'email' in localStorage [031]", function() {
        cy.get(".modal");
      });
    });

  });
});

describe("Tracking Plugin Disabled [03d]", function() {

  beforeEach(function() {
    cy
      .server()
      .route(/apps/, "fx:marathon-1-task/app")
      .route(/history\/minute/, "fx:marathon-1-task/history-minute")
      .route(/history\/last/, "fx:marathon-1-task/summary")
      .route(/state-summary/, "fx:marathon-1-task/summary")
      .route(/state/, "fx:marathon-1-task/state")
      .route(/ui-config/, "fx:config/tracking-disabled")
      .clearLocalStorage()
      .visit("http://localhost:4200/");
  });

  context("Sidebar [03c]", function() {
    it("should have no sidebar icons [03e]", function() {
      cy.get(".sidebar-footer").find(".button").should("to.have.length", 0);
    })
  });

  context("Welcome Modal [03f]", function() {
    it("should not show modal when no email in localStorage [03g]", function() {
      cy.get(".modal").should("not");
    });

    context("Email in localStorage [03h]", function() {
      beforeEach(function() {
        cy.visit("http://localhost:4200/", {
          onBeforeLoad: function(contentWindow) {
            contentWindow.localStorage.setItem("email", "ui-bot@mesosphere.io");
            contentWindow.analytics = {
              initialized: true,
              page: function(){},
              track: function(){}
            };
          }
        });
      });

      it("should not show modal when 'email' in localStorage [03i]",
        function() {
          cy.get(".modal").should("not");
        }
      );
    });

  });
});
