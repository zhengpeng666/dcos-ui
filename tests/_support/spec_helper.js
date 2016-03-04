Cypress.addParentCommand('configureCluster', function (configuration) {
  if (Object.keys(configuration).length === 0) {
    return;
  }

  cy.chain().server();

  if (configuration.mesos === '1-task-healthy') {
    cy
      .route(/apps/, 'fx:marathon-1-task/app')
      .route(/dcos-version/, 'fx:dcos/dcos-version')
      .route(/history\/minute/, 'fx:marathon-1-task/history-minute')
      .route(/history\/last/, 'fx:marathon-1-task/summary')
      .route(/state-summary/, 'fx:marathon-1-task/summary')
      .route(/state/, 'fx:marathon-1-task/state');
  }

  if (configuration.mesos === '1-service-with-executor-task') {
    cy
      .route(/apps/, 'fx:1-service-with-executor-task/app')
      .route(/browse\.json/, 'fx:1-service-with-executor-task/browse')
      .route(/dcos-version/, 'fx:dcos/dcos-version')
      .route(/history\/minute/, 'fx:1-service-with-executor-task/history-minute')
      .route(/history\/last/, 'fx:1-service-with-executor-task/summary')
      .route(/master\/state/, 'fx:1-service-with-executor-task/state')
      .route(/state-summary/, 'fx:1-service-with-executor-task/summary')
      .route(/slave\/.*\/slave\(1\)\/state/, 'fx:1-service-with-executor-task/slave-state');
  }

  if (configuration.acl) {
    cy
      .route(/acls\?type=service/, 'fx:acl/acls-unicode')
      .route({
        method: 'GET',
        url: /api\/v1\/ldap\/config/,
        status: 400,
        response: 'fx:acl/acls-config-empty'
      })
      .route({
        method: 'POST',
        url: /api\/v1\/ldap\/config\/test/,
        status: 400,
        response: 'fx:acl/acls-config-server-test-error'
      })
      .route({
        status: 400,
        url: /api\/v1\/ldap\/config/,
        response: ''
      })
      .route(/api\/v1\/groups/, 'fx:acl/groups-unicode')
      .route(/groups\/olis/, 'fx:acl/group-unicode')
      .route(/groups\/olis\/users/, 'fx:acl/group-users')
      .route(/groups\/olis\/permissions/, 'fx:acl/group-permissions')
      .route(/api\/v1\/users/, 'fx:acl/users-unicode')
      .route(/users\/quis/, 'fx:acl/user-unicode')
      .route(/users\/quis\/groups/, 'fx:acl/user-groups')
      .route(/users\/quis\/permissions/, 'fx:acl/user-permissions');

    if (configuration.singleLDAP) {
      cy.route(/api\/v1\/ldap\/config/, 'fx:acl/acls-config-1-server');
    }
  }

  if (configuration.aclLDAPTestSuccessful) {
    cy.route({
      method: 'POST',
      url: /api\/v1\/ldap\/config/,
      status: 200,
      response: 'fx:acl/acls-config-server-test-success'
    });
  }

  if (configuration.aclLDAPDeleteSuccess) {
    cy.route({
      method: 'DELETE',
      url: /api\/v1\/ldap\/config/,
      status: 200,
      response: ''
    });
  }

  if (configuration.aclCreate) {
    cy
      .route(/acls\?type=service/, 'fx:acl/acls_empty')
      .route(/users\/quis\/permissions/, 'fx:acl/user-permissions-empty')
      .route({
        url: /acls\/service\.marathon/,
        method: 'PUT',
        status: 200,
        response: ''
      });
  }

  if (configuration.aclsWithMarathon) {
    cy
      .route(/acls\?type=service/, 'fx:acl/acls-unicode');
  }

  if (configuration.networkVIPSummaries) {
    cy
      .route(/networking\/api\/v1\/summary/,
        'fx:networking/networking-vip-summaries');
  }

  if (configuration.universePackages) {
    cy
      .route({
        method: 'POST',
        url: /package\/describe/,
        status: 200,
        response: 'fx:cosmos/package-describe'
      })
      .route({
        method: 'POST',
        url: /package\/list/,
        status: 200,
        response: 'fx:cosmos/packages-list'
      })
      .route({
        method: 'POST',
        url: /package\/search/,
        status: 200,
        response: 'fx:cosmos/packages-search'
      });
  }

  if (configuration.componentHealth) {
    cy
      .route(/api\/v1\/system\/health\/units/, 'fx:unit-health/units')
      .route(/api\/v1\/system\/health\/units\/mesos_dns_service/, 'fx:unit-health/unit')
      .route(/api\/v1\/system\/health\/units\/mesos_dns_service\/nodes/, 'fx:unit-health/unit-nodes')
      .route(/api\/v1\/system\/health\/units\/mesos_dns_service\/nodes\/ip-10-10-0-236/, 'fx:unit-health/unit-node');
  }

  // The app won't load until plugins are loaded
  var pluginsFixture = configuration.plugins || 'no-plugins';
  cy.route(/ui-config/, 'fx:config/' + pluginsFixture + '.json');

  // Metadata
  cy.route(/metadata(\?_timestamp=[0-9]+)?$/, 'fx:dcos/metadata');
});

Cypress.addParentCommand('visitUrl', function (options) {
  var callback = function () {};

  if (options.logIn) {
    callback = function (win) {
      win.document.cookie = 'dcos-acs-info-cookie=' +
        'eyJ1aWQiOiJqb2UiLCJkZXNjcmlwdGlvbiI6IkpvZSBEb2UifQ==';
    };
  } else if (options.identify) {
    callback = function (win) {
      win.localStorage.setItem('email', 'ui-bot@mesosphere.com');
    };
  }

  if (options.identify && options.fakeAnalytics) {
    var identifyCallback = callback;
    callback = function (win) {
      identifyCallback(win);
      win.analytics = {
        initialized: true,
        page: function () {},
        push: function () {},
        track: function () {}
      };
    };
  }

  var url = 'http://localhost:4200/#' + options.url;
  cy.visit(url, {onBeforeLoad: callback})
  .wait(2000);
});
