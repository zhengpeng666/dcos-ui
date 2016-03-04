describe('Packages Tab', function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      universePackages: true
    });
  });

  it('should display correct error message', function () {
    cy
      .route({
        method: 'POST',
        url: /package\/search/,
        status: 400,
        response: {type: 'InvalidRepositoryUri', name: 'Invalid'}
      })
      .visitUrl({url: '/universe'});

    cy
      .get('h3 .inverse.text-align-center')
      .should('contain', 'The repository Invalid does not have a valid URL, or its host did not resolve. If you need to change the URL you can go to the Repositories Settings page, uninstall it, and add the correct URL.');
  });

  it('should display correct error message', function () {
    cy
      .route({
        method: 'POST',
        url: /package\/search/,
        status: 400,
        response: {type: 'IndexNotFound', name: 'Invalid'}
      })
      .visitUrl({url: '/universe'});

    cy
      .get('h3 .inverse.text-align-center')
      .should('contain', 'The index file is missing in the repository Invalid. If you need to change the URL you can go to the Repositories Settings page, uninstall it, and add the correct URL.');
  });

  it('should display correct error message', function () {
    cy
      .route({
        method: 'POST',
        url: /package\/search/,
        status: 400,
        response: {type: 'PackageFileMissing', name: 'Invalid'}
      })
      .visitUrl({url: '/universe'});

    cy
      .get('h3 .inverse.text-align-center')
      .should('contain', 'The index file is missing in the repository Invalid. If you need to change the URL you can go to the Repositories Settings page, uninstall it, and add the correct URL.');
  });
});
