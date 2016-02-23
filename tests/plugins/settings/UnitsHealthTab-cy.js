describe('Components Tab [0e2]', function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      plugins: 'settings-enabled'
    })
    .visitUrl({url: '/settings/system/components', identify: true});
  });

  context('Filters [0e3]', function () {

    it('renders three filter buttons [0e4]', function () {
      cy.get('.button-group .button').should(function ($buttons) {
        expect($buttons.length).to.equal(3);
      });
    });

    it('renders string filter input box [0e5]', function () {
      cy.get('.filter-input-text').should(function ($input) {
        expect($input).to.exist;
      });
    });

    it('filters by component health [0e7]', function () {
      cy.get('.button-group .button').last().click();
      cy.get('tr a').should(function ($row) {
        expect($row.length).to.equal(1);
      });
    });

    it('filters by component name [0e6]', function () {
      cy.get('.form-control input[type=\'text\']').type('zoo');
      cy.get('tr a').should(function ($row) {
        expect($row.length).to.equal(1);
      });
    });

    it('filters by component health and name at the same time [0e8]', function () {
      cy.get('.button-group .button').eq(1).click();
      cy.get('.form-control input[type=\'text\']').type('apache');
      cy.get('tr a').should(function ($row) {
        expect($row.length).to.equal(1);
      });
    });

  });
  
});
