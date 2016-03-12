describe('ComponentsList [10b]', function() {

  context('No Components Found [10f]', function () {

    it('shows error when components not found [10d]', function() {

      cy.configureCluster({
        mesos: '1-task-healthy',
        componentHealth: false
      })
      .visitUrl({url: '/dashboard', identify: true, fakeAnalytics: true});

      cy.get('.component-list-component h3').should(function ($error) {
        expect($error).to.contain('Components Not Found');
      });
    });

  });

  context('Components List Widget [10e]', function () {

    beforeEach(function () {
      cy.configureCluster({
        mesos: '1-task-healthy',
        componentHealth: true
      })
      .visitUrl({url: '/dashboard', identify: true, fakeAnalytics: true});
    });

    it('navigates to unit health page [10c]', function() {
      cy.get('.more-button').contains('Components').click();
      cy.hash().should('match', /system\/units/);
    });

  });
});
