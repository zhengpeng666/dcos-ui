describe('Directories Page [02l]', function () {

  it('allows navigating to External Directory page', function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      acl: true,
      plugins: 'settings-enabled'
    })
    .visitUrl({url: '/', logIn: true});

    cy.get('.sidebar-menu').contains('Settings').click();
    cy.get('.tabs').contains('External Directory').click();
    cy.hash().should('match', /settings\/organization\/directories/);
  });

  let addDirectoryBtnnText = '+ Add Directory';

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
          expect($button[0].textContent).to.equal(addDirectoryBtnnText);
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

  context('LDAP config', function () {

    beforeEach(function () {
      cy.configureCluster({
        mesos: '1-task-healthy',
        acl: true,
        plugins: 'settings-enabled',
        singleLDAP: true
      })
      .visitUrl({url: '/settings/organization/directories', logIn: true});
    });

    it('doesn\'t display the add button', function () {
      cy.get('.page-content button').should('not.html', addDirectoryBtnnText);
    });

    it('has a delete directory button', function () {
      cy.get('.page-content button').contains('Delete Directory');
    });

    it('displays information about external LDAP configuration', function() {
      let lists = cy.get('.page-content dl.row').as('list');
      cy.get('@list').eq(0).contains('Host');
      cy.get('@list').eq(0).contains('ipa.demo1.freeipa.org');
      cy.get('@list').eq(1).contains('Port');
      cy.get('@list').eq(1).contains('636');
      cy.get('@list').eq(2).contains('Distinguished Name template');
      cy.get('@list').eq(2).contains('uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org');
      cy.get('@list').eq(3).contains('Use SSL/TLS socket');
      cy.get('@list').eq(3).contains('Yes');
      cy.get('@list').eq(4).contains('Enforce StartTLS');
      cy.get('@list').eq(4).contains('No');
    });

  });

});
