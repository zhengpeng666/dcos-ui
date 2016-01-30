describe('Group Details Sidepanel [02k]', function () {

  beforeEach(function () {
    cy.configureCluster({
      mesos: '1-task-healthy',
      acl: true,
      plugins: 'settings-enabled'
    })
    .visitUrl({url: '/settings/organization/groups/olis', identify: true});
  });

  it('displays the correct group [040]', function() {
    cy
      .get('.side-panel .side-panel-content-header-label .form-element-inline-text')
      .should(function ($header) {
        expect($header[0].textContent).to.equal("藍-遙 遥 悠 遼 Größe");
      });
  });

  it('sets the first tab as active [041]', function() {
    cy
      .get('.side-panel .tabs .active')
      .should('contain', 'Permissions');
  });

  context('User Membership [05z]', function() {

    beforeEach(function () {
      cy
        .get('.side-panel .tabs .tab-item-label')
        .contains('Members')
        .click();
    });

    it('displays the users belong to the group [061]', function() {
      cy
        .get('.side-panel .table tbody')
        .should(function ($tbody) {
          expect($tbody.children().length).to.equal(4);
        });
    });

    it('displays the confirmation modal when clicking remove [060]', function() {
      cy
        .get('.side-panel .table tbody tr:eq(1) button')
        .click();

      cy
        .get('.confirm-modal')
        .should(function ($modal) {
          expect($modal.length).to.equal(1);
        });
    });

  });

});
