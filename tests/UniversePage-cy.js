describe.only('Universe Page', function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      acl: true
    })
    .visitUrl({url: '/'});
  });

  it('goes to Universe page when tab is clicked', function () {
    cy.get('.sidebar-menu-item').contains('Universe').click();
    cy.hash().should('match', /universe/);
  });
});
