describe('Directories Page [02l]', function () {

  context('No ldap config [02m]', function () {

    beforeEach(function () {
      cy.configureCluster({
        mesos: '1-task-healthy',
        acl: true,
        plugins: 'settings-enabled'
      })
      .visitUrl({url: '/settings/organization/directories', logIn: true});

      cy.get('.page-content .button-success').as('addDirectoryBtn');
    });

    it('displays the add directory button [02n]', function() {
      cy.get('@addDirectoryBtn')
        .should(function ($button) {
          expect($button[0].textContent).to.equal('+ Add Directory');
        });
    });

    it('display a modal when clicking the button [02o]', function () {
      cy.get('@addDirectoryBtn').click();
      cy.get('.modal .modal-header-title')
        .should(function ($header) {
          expect($header[0].textContent).to.equal('Add External Directory');
        });
    });

    it('closes modal when clicking Close button [02p]', function () {
      cy.get('@addDirectoryBtn').click();
      var mod = cy.get('.modal');
      cy.get('.modal .modal-footer button').contains('Close').click();
      cy.wait(1000);
      mod.should('be.null');
    });

  });

});
