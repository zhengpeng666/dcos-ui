describe('Units Tab [0e2]', function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      plugins: 'settings-enabled',
      componentHealth: true
    })
      .visitUrl({url: '/settings/system/units', identify: true});
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

    it('filters by node health [0e7]', function () {
      cy.get('.button-group .button').last().click();
      cy.get('tr a').should(function ($row) {
        expect($row.length).to.equal(1);
      });
    });

    it('filters by node name [0e6]', function () {
      cy.get('.form-control input[type=\'text\']').type('nginx');
      cy.get('tr a').should(function ($row) {
        expect($row.length).to.equal(1);
      });
    });

    it('filters by node health and name at the same time [0e8]', function () {
      cy.get('.button-group .button').eq(1).click();
      cy.get('.form-control input[type=\'text\']').type('mesos');
      cy.get('tr a').should(function ($row) {
        expect($row.length).to.equal(1);
      });
    });

    it('opens unit detail side panel [0ed]', function () {
      cy.get('tr a').contains('Mesos DNS').click();
      cy.hash().should('match', /mesos_dns_service/);
    });

  });

  context('Unit Side Panel [0e9]', function () {

    beforeEach(function () {
      cy
        .visitUrl(
          {url: '/settings/system/units/mesos_dns_service/', identify: true}
        );
    });

    it('renders unit title [0ea]', function () {
      cy.get('h1').should(function ($title) {
        expect($title).to.contain('Mesos DNS');
      });
    });

    it('renders unit health [0eb]', function () {
      cy.get('.side-panel-content-header-details')
        .find('.text-danger')
        .should(function ($health) {
          expect($health).to.contain('Unhealthy');
        });
    });

    it('filters by node health [0ec]', function () {
      cy.get('button').last().click();
      cy.get('.dropdown').find('li').eq(1).click();
      cy.get('tr a').contains('Health Check').should(function ($row) {
        expect($row.length).to.equal(1);
      });
    });

    it('opens unit node detail side panel [0ee]', function () {
      cy.get('tr a').contains('ip-10-10-0-236').click();
      cy.hash().should('match', /ip-10-10-0-236/);
    });
  });

  context('Unit Node Side Panel [0ef]', function () {

    beforeEach(function () {
      cy
        .visitUrl(
          {url: '/settings/system/units/mesos_dns_service/nodes/ip-10-10-0-236', identify: true}
        );
    });

    it('renders health check title [0ei]', function () {
      cy.get('h1').should(function ($title) {
        expect($title).to.contain('Mesos DNS Health Check');
      });
    });

    it('renders node health [0ej]', function () {
      cy.get('.side-panel-content-header-details')
        .should(function ($health) {
          expect($health).to.contain('Unhealthy');
        });
    });

    it('renders health check output [0ek]', function () {
      cy.get('.side-panel-tab-content')
        .find('pre')
        .should(function ($output) {
          expect($output).to.contain('Please');
        });
    });
  });
});
