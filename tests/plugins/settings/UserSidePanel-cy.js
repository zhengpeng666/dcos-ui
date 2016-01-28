describe('User Details Sidepanel [02k]', function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      acl: true,
      plugins: 'settings-enabled'
    })
    .visitUrl({url: '/settings/organization/users/quis', identify: true});
  });

  it('displays the correct user [05w]', function() {
    cy
      .get('.side-panel .side-panel-content-header-label .form-element-inline-text')
      .should(function ($header) {
        expect($header[0].textContent).to.equal('藍-Schüler Zimmer verfügt über einen Schreibtisch, Telefon, Safe in Notebook-Größe');
      });
  });

  it('has LDAP in subheader when user is external [056]', function() {
    cy
      .get('.side-panel .side-panel-content-header-label div')
      .should(function ($subheader) {
        expect($subheader[3].textContent).to.contain('External');
      });
  });

  it('sets the first tab as active [05y]', function() {
    cy
      .get('.side-panel .tabs .active')
      .should('contain', 'Permissions');
  });

  context('Group Membership [05z]', function() {

    beforeEach(function () {
      cy
        .get('.side-panel .tabs .tab-item-label')
        .contains('Group Membership')
        .click();
    });

    it('displays the groups that the member belongs to [05x]', function() {
      cy
        .get('.side-panel .table tbody')
        .should(function ($tbody) {
          expect($tbody.children().length).to.equal(2);
        });
    });

    it('displays the confirmation modal when clicking remove [060]', function() {
      cy
        .get('.side-panel .table tbody tr:first-child button')
        .click();

      cy
        .get('.confirm-modal')
        .should(function ($modal) {
          expect($modal.length).to.equal(1);
        });
    });

  });

  context('Delete User [042]', function() {
    beforeEach(function () {
      cy.get('.side-panel-header-actions-secondary').as('headerUserDelete');
    });

    it('shows delete modal when header delete button clicked [043]', function() {
      cy.get('@headerUserDelete')
        .find('.side-panel-header-action')
        .click()
      cy.get('.confirm-modal').should('to.have.length', 1);
    });

    it('returns to users page after user deleted [045]', function() {
      cy.route({
        method: 'DELETE',
        url: /users\/quis/,
        status: 200,
        response: {}
      });
      cy.get('@headerUserDelete')
        .find('.side-panel-header-action')
        .click();
      cy.get('.modal .button-danger').click();
      cy.url().should('contain', '/settings/organization/users')
    });

    it('shows error when request to delete user fails [044]', function() {
      cy.route({
        method: 'DELETE',
        url: /users\/quis/,
        status: 400,
        response: {description: 'There was an error.'}
      });
      cy.get('@headerUserDelete')
        .find('.side-panel-header-action')
        .click();
      cy.get('.modal .button-danger').click();
      cy.get('.text-error-state').should('contain', 'There was an error.');
    });

  });

  context('User Details [063]', function () {

    beforeEach(function () {
      cy
        .get('.side-panel .tabs .tab-item-label')
        .contains('Details')
        .click();
      cy
        .get('.side-panel .side-panel-content-user-details .row').as('rows');
    });

    it('displays the username in the first row [064]', function () {
      cy.get('@rows')
        .should(function ($rows) {
          var firstRow = $rows[0];
          expect(firstRow.children[1].textContent).to.equal('quis');
        });
    });

    it('displays the password form in the second row [065]', function () {
      cy.get('@rows')
        .should(function ($rows) {
          var secondRow = $rows[1];
          expect(secondRow.children[1].children[0].nodeName).to.equal('FORM');
        });
    });

    it('switches the password label into a password input element [066]',
      function () {
      cy.get('.side-panel-content-user-details form .form-element-inline-text')
        .click();

      cy.get('form input')
        .should(function ($input) {
          expect($input.length).to.equal(1);
          expect($input[0].type).to.equal('password');
        });
    });

  });

  context('Permissions tab [02v]', function () {

    beforeEach(function () {
      cy.get('.side-panel').as('sidePanel');
    });

    it('displays "Add Service" in the dropdown box [02x]', function () {
      cy
        .get('@sidePanel')
        .get('.dropdown .dropdown-toggle')
        .should('contain', 'Add Service');
    });

    it('displays the selected element in the dropdown box [02y]', function () {
      cy
        .get('@sidePanel')
        .get('.dropdown .dropdown-toggle')
        .click();

      cy
        .get('@sidePanel')
        .get('.dropdown-menu-list > .clickable:last-child')
        .click();

      cy
        .get('@sidePanel')
        .get('.dropdown .dropdown-toggle')
        .should('contain', 'Shelia Ike Bressette');
    });

    it('shouldn\'t contain services that are already in permissions [02z]', function () {
      cy
        .get('@sidePanel')
        .get('.dropdown .dropdown-toggle')
        .click();

      cy
        .get('@sidePanel')
        .get('.dropdown-menu-list')
        .should(function (list) {
          var children = list.children();
          var result = false;
          for (var i = 0; i < children.length; i++) {
            if (children[i].textContent === 'service.marathon') {
              result = true;
            }
          }

          expect(result).to.equal(false);
        });
    });

    it('should have a table with a row containing a service [01c]', function () {
      cy
        .get('@sidePanel')
        .get('table td')
        .should('contain', 'Marathon');
    });

    it('displays the confirmation modal when clicking remove [060]', function() {
      cy
        .get('@sidePanel')
        .get('.table tbody tr:first-child button')
        .click();

      cy
        .get('.confirm-modal')
        .should(function ($modal) {
          expect($modal.length).to.equal(1);
        });
    });

  });

});
