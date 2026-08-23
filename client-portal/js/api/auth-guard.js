/* =================================================================
   AUTH GUARD — DevLogix Client Portal
   =================================================================
   Squad Lead : Fatima Nadeem
   Team       : BD CRM Client Portal Frontend Squad
   Company    : DevLogix Technologies
   File       : js/api/auth-guard.js
   Purpose    : Protects dashboard pages by checking session tokens.
                Redirects to login if not authenticated.
                Provides logout functionality.
   ================================================================= */

var AuthGuard = (function () {
  'use strict';

  var TOKEN_KEY = 'devlogix_auth_token';
  var USER_KEY = 'devlogix_user_data';
  var LOGIN_PAGE = 'index.html';

  /* ---------------------------------------------------------------
     Save authentication data after successful login
     --------------------------------------------------------------- */
  function saveSession(token, userData) {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (e) {}
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (e) {}
  }

  /* ---------------------------------------------------------------
     Get the stored auth token
     --------------------------------------------------------------- */
  function getToken() {
    var token = null;
    try {
      token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    } catch (e) {}
    return token;
  }

  /* ---------------------------------------------------------------
     Get the stored user data
     --------------------------------------------------------------- */
  function getUser() {
    var data = null;
    try {
      data = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    return null;
  }

  /* ---------------------------------------------------------------
     Check if user is authenticated
     --------------------------------------------------------------- */
  function isAuthenticated() {
    return !!getToken();
  }

  /* ---------------------------------------------------------------
     Protect a page — call this on dashboard pages
     Redirects to login if no valid token found
     --------------------------------------------------------------- */
  function requireAuth() {
    if (!isAuthenticated()) {
      window.location.href = LOGIN_PAGE;
      return false;
    }
    return true;
  }

  /* ---------------------------------------------------------------
     Logout — clear session and redirect to login
     --------------------------------------------------------------- */
  function logout() {
    var token = getToken();

    /* Clear session & local storage */
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (e) {}
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {}

    /* Call mock API logout if available */
    if (typeof MockAPI !== 'undefined' && MockAPI.logout) {
      MockAPI.logout(token).then(function () {
        window.location.href = LOGIN_PAGE;
      });
    } else {
      window.location.href = LOGIN_PAGE;
    }
  }

  /* ---------------------------------------------------------------
     Verify token with backend (async)
     Returns promise with user data or redirects to login
     --------------------------------------------------------------- */
  function verifySession() {
    var token = getToken();
    if (!token) {
      window.location.href = LOGIN_PAGE;
      return Promise.reject('No token');
    }

    if (typeof MockAPI !== 'undefined' && MockAPI.getProfile) {
      return MockAPI.getProfile(token).then(function (response) {
        if (!response.success) {
          try {
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          } catch (e) {}
          window.location.href = LOGIN_PAGE;
          return Promise.reject('Invalid session');
        }
        /* Update stored user data with fresh data from API */
        saveSession(token, response.user);
        return response.user;
      });
    }

    /* Fallback — return stored user data */
    var user = getUser();
    if (!user) {
      window.location.href = LOGIN_PAGE;
      return Promise.reject('No user data');
    }
    return Promise.resolve(user);
  }

  /* ===============================================================
     EXPOSE PUBLIC INTERFACE
     =============================================================== */
  return {
    saveSession: saveSession,
    getToken: getToken,
    getUser: getUser,
    isAuthenticated: isAuthenticated,
    requireAuth: requireAuth,
    verifySession: verifySession,
    logout: logout
  };

})();
