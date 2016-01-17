describe('LoginModal [01i]', function () {

  beforeEach(function () {
    cy.configureCluster({
        mesos: '1-task-healthy',
        acl: true,
        plugins: 'authentication-enabled'
      })
      .route({
        method: 'POST',
        status: 201,
        url: /api\/v1\/auth\/login/,
        delay: 100,
        response: {uid: 'joe', description: 'Joe Doe'}
      })
      .route({
        method: 'GET',
        status: 200,
        url: /api\/v1\/users\/joe/,
        delay: 100,
        response: {uid: 'joe', description: 'Joe Doe'}
      })
      .visitUrl({url: '/', logIn: false});
  });

  it('should open the modal [01j]', function () {
    cy.get('.modal-container').should(function (modal) {
      expect(modal.length).to.equal(1);
    });
  });

  context('logging in [01k]', function () {
    beforeEach(function () {
      cy.get(".modal-container input[type='text']').type('kennyt");
      cy.get(".modal-container input[type='password']').type('1234");

    });

    it('disables the buttons while request is pending on submit [01l]', function () {
      cy
        .get('.modal-footer .button')
        .click()
        .get('.modal-footer .button.disabled').should(function (button) {
          expect(button.length).to.equal(1);
        });
    });

    it('routes to dashboard after login with admin [01m]', function () {
      cy
        .get('.modal-footer .button')
        .click()
        .wait(150);

      cy.hash().should('eq', '#/dashboard/');
    });

    it('redirects after successful login [02j]', function () {
      cy.visit(
        "http://localhost:4200/?redirect=%2Ffoo%2Fbar#/login"
      );
      cy.get(".modal-container input[type='text']').type('kennyt");
      cy.get(".modal-container input[type='password']').type('1234");

      cy.get('.modal-footer .button').click();

      cy.wait(500).location()
      .its('href').should('eq', 'http://localhost:4200/foo/bar');
    });

    it('routes to access-denied after login with non admin login', function () {
      cy
        .route({
          method: 'GET',
          status: 400,
          url: /api\/v1\/users\/joe/,
          delay: 100,
          response: {description: 'Some error'}
        })
        .wait(150);

      cy
        .get('.modal-footer .button')
        .click()
        .hash().should('eq', '#/access-denied');
    });
  });

});
