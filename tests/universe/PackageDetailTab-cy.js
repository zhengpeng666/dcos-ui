describe.only('Package Detail Tab', function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      universePackages: true
    });
  });

  it('displays package information on package page', function () {
    cy
      .visitUrl({url: '/universe/packages/marathon?packageVersion=0.11.1'})
      .get('.page-content h1')
      .should('contain', 'marathon');
  });

  it('displays marathon package details', function () {
    cy
      .visitUrl({url: '/universe/packages/marathon?packageVersion=0.11.1'})
      .get('.container-pod.container-pod-short-bottom.flush-top > p')
      .as('information');

    cy
      .get('@information').eq(0)
      .should('contain', 'A cluster-wide init and control system for services in cgroups or Docker containers.')
      .get('@information').eq(1)
      .should('contain', 'We recommend a minimum of one node with at least 2 CPU\'s and 1GB of RAM available for the Marathon Service.')
      .get('@information').eq(2)
      .should('contain', 'SCM: https://github.com/mesosphere/marathon.git')
      .get('@information').eq(3)
      .should('contain', 'Maintainer: support@mesosphere.io')
      .get('@information').eq(4)
      .should('contain', 'Apache License Version 2.0: https://github.com/mesosphere/marathon/blob/master/LICENSE');
  });
});
