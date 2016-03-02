/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Route} from 'react-router';

import AccessDeniedPage from './components/AccessDeniedPage';
import ACLAuthConstants from './constants/ACLAuthConstants';
import Authenticated from './components/Authenticated';
import LoginPage from './components/LoginPage';
import UserDropup from './components/UserDropup';

let PluginHooks = {
  configuration: {
    enabled: false
  },
  /**
   * @param  {Object} Hooks The Hooks API
   */
  initialize(Hooks) {
    Hooks.addAction('AJAXRequestError', this.AJAXRequestError.bind(this));
    Hooks.addFilter('sidebarFooter', this.sidebarFooter.bind(this));
    Hooks.addFilter('openIdentifyModal', this.openIdentifyModal.bind(this));
    Hooks.addFilter('applicationRoutes', this.applicationRoutes.bind(this));
    Hooks.addAction('userLogoutSuccess', this.userLogoutSuccess.bind(this));
  },

  configure(configuration) {
    // Only merge keys that have a non-null value
    Object.keys(configuration).forEach((key) => {
      if (configuration[key] != null) {
        this.configuration[key] = configuration[key];
      }
    });
  },

  isEnabled() {
    return this.configuration.enabled;
  },

  AJAXRequestError(xhr) {
    if (xhr.status !== 401 && xhr.status !== 403) {
      return;
    }

    let location = global.location.hash;
    let onAccessDeniedPage = /access-denied/.test(location);
    let onLoginPage = /login/.test(location);

    // Unauthorized
    if (xhr.status === 401 && !onLoginPage) {
      global.document.cookie = `${ACLAuthConstants.userCookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      global.location.href = '#/login';
    }

    // Forbidden
    if (xhr.status === 403 && !onLoginPage && !onAccessDeniedPage) {
      global.location.href = '#/access-denied';
    }
  },

  openIdentifyModal(value) {
    if (this.isEnabled() !== true) {
      return value;
    }

    return false;
  },

  sidebarFooter(value, defaultButtonSet) {
    if (this.isEnabled() !== true) {
      return value;
    }

    let buttonSet = defaultButtonSet;
    if (value && value.props.children) {
      buttonSet = value.props.children;
    }

    return (
      <UserDropup items={buttonSet} />
    );
  },

  applicationRoutes(routes) {
    if (this.isEnabled() === true) {

      // Override handler of index to be 'authenticated'
      routes[0].children.forEach(function (child) {
        if (child.id === 'index') {
          child.handler = new Authenticated(child.handler);
        }
      });

      // Add access denied and login pages
      routes[0].children.unshift(
        {
          type: Route,
          name: 'access-denied',
          path: 'access-denied',
          handler: AccessDeniedPage
        },
        {
          handler: LoginPage,
          name: 'login',
          path: 'login',
          type: Route
        }
      );
    }
    return routes;
  },

  userLogoutSuccess() {
    window.location.href = '#/login';
  }
};

module.exports = PluginHooks;
