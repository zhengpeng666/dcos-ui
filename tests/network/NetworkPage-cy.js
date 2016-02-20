describe('Network Page [0hy]', function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      acl: true,
      networkVIPSummaries: true
    });
  });

  it('goes to Network page when tab is clicked [0hz]', function () {
    cy
      .visitUrl({url: '/'})
      .get('.sidebar-menu-item')
      .contains('Network')
      .click();

    cy.hash().should('match', /network/);
  });

  it('shows the loading indicator before receiving data [06f]', function () {

    cy.get('.ball-scale').should(function ($loadingIndicator) {
      expect($loadingIndicator).length.to.be(1);
    });

  });

  describe('VIPsTable [0i0]', function () {

    it('renders the correct number of VIPs [0i1]', function () {
      cy
        .get('.table tbody')
        .should(function ($tbody) {
          expect($tbody.children().length).to.equal(5);
        });
    });

    it('allows filtering of the table by VIP [0i1]', function () {
      cy
        .get('.filter-input-text-group input')
        .type('1.2.3.4');

      cy
        .get('.table tbody')
        .should(function ($tbody) {
          expect($tbody.children().length).to.equal(3);
        });
    });

    it('displays all data when clearing the filter [0i1]', function () {
      cy
        .get('.filter-input-text-group a')
        .click();

      cy
        .get('.table tbody')
        .should(function ($tbody) {
          expect($tbody.children().length).to.equal(5);
        });
    });

    it('renders the successes and failures with the right classes [0i1]',
      function () {
        cy
          .get('.table tbody .text-success').should(function ($textSuccess) {
            expect($textSuccess.length).to.equal(3);
          });

        cy
          .get('.table tbody .text-danger').should(function ($textSuccess) {
            expect($textSuccess.length).to.equal(3);
          });
    });

  });
});
