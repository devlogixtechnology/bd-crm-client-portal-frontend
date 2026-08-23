/* =================================================================
   MOCK API LAYER — DevLogix Client Portal
   =================================================================
   Squad Lead : Fatima Nadeem
   Team       : BD CRM Client Portal Frontend Squad
   Company    : DevLogix Technologies
   File       : js/api/mock-api.js
   Purpose    : Simulates backend REST API responses so the frontend
                can be fully developed and tested without a live server.
                When the real backend is ready, replace the mock
                functions with actual fetch() calls.
   ================================================================= */

var MockAPI = (function () {
  'use strict';

  var STORAGE_DOCS_KEY = 'devlogix_mock_documents';

  /* ---------------------------------------------------------------
     MOCK DATABASE — Users
     --------------------------------------------------------------- */
  var users = [
    {
      id: 1,
      email: 'client@devlogix.com',
      password: 'Welcome@123',
      name: 'Jane Doe',
      initials: 'JD',
      company: 'Acme Corporation',
      role: 'Client',
      avatar: null
    },
    {
      id: 2,
      email: 'admin@devlogix.com',
      password: 'Admin@123',
      name: 'Ali Khan',
      initials: 'AK',
      company: 'DevLogix',
      role: 'Admin',
      avatar: null
    }
  ];

  /* ---------------------------------------------------------------
     MOCK DATABASE — Onboarding Timeline Steps
     --------------------------------------------------------------- */
  var timelineSteps = [
    {
      id: 1,
      title: 'Onboarding Started',
      status: 'completed',
      date: 'Jan 15, 2025',
      description: 'Welcome package sent to client'
    },
    {
      id: 2,
      title: 'Information Submitted',
      status: 'completed',
      date: 'Jan 18, 2025',
      description: 'Client details collected and verified'
    },
    {
      id: 3,
      title: 'Documents Submitted',
      status: 'completed',
      date: 'Jan 22, 2025',
      description: 'All required documents received'
    },
    {
      id: 4,
      title: 'Verification',
      status: 'active',
      date: 'Jan 25, 2025',
      description: 'Identity and documents under review'
    },
    {
      id: 5,
      title: 'Agreement',
      status: 'pending',
      date: null,
      description: 'Service agreement to be signed'
    },
    {
      id: 6,
      title: 'Completed',
      status: 'pending',
      date: null,
      description: 'Onboarding process finalized'
    }
  ];

  /* ---------------------------------------------------------------
     MOCK DATABASE — Initial Documents
     --------------------------------------------------------------- */
  var initialDocuments = [
    { id: 1, name: 'Invoice - January 2025',  type: 'invoice',   status: 'Paid',           date: 'Jan 20, 2025', amount: '$2,500.00' },
    { id: 2, name: 'Master Service Agreement', type: 'agreement', status: 'Signed',         date: 'Jan 22, 2025', amount: null },
    { id: 3, name: 'Invoice - February 2025', type: 'invoice',   status: 'Pending',        date: 'Feb 15, 2025', amount: '$3,200.00' },
    { id: 4, name: 'Non-Disclosure Agreement', type: 'agreement', status: 'Draft',          date: 'Feb 10, 2025', amount: null },
    { id: 5, name: 'Invoice - March 2025',    type: 'invoice',   status: 'Paid',           date: 'Mar 18, 2025', amount: '$1,800.00' },
    { id: 6, name: 'Terms of Service',        type: 'agreement', status: 'Pending Review', date: 'Mar 20, 2025', amount: null }
  ];

  /* ---------------------------------------------------------------
     Load / Save documents with localStorage persistence
     --------------------------------------------------------------- */
  function getStoredDocuments() {
    try {
      var saved = localStorage.getItem(STORAGE_DOCS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(initialDocuments));
  }

  function saveStoredDocuments(docs) {
    try {
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(docs));
    } catch (e) {}
  }

  /* ---------------------------------------------------------------
     UTILITY — Simulate network latency
     --------------------------------------------------------------- */
  function simulateDelay(minMs, maxMs) {
    var delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  }

  /* ---------------------------------------------------------------
     UTILITY — Generate a stateless JWT-style token
     --------------------------------------------------------------- */
  function generateToken(userId) {
    var payload = btoa(JSON.stringify({ userId: userId, iat: Date.now() }));
    return 'mock_' + payload + '_' + Math.random().toString(36).substr(2, 12);
  }

  /* ---------------------------------------------------------------
     UTILITY — Validate token and return user (Stateless JWT decoder)
     --------------------------------------------------------------- */
  function validateToken(token) {
    if (!token || typeof token !== 'string') return null;
    try {
      if (token.indexOf('mock_') === 0) {
        var parts = token.split('_');
        if (parts.length >= 2) {
          var payloadStr = atob(parts[1]);
          var data = JSON.parse(payloadStr);
          var userId = data.userId;
          for (var i = 0; i < users.length; i++) {
            if (users[i].id === userId) return users[i];
          }
        }
      }
    } catch (e) {
      console.warn('Token validation error:', e);
    }
    return null;
  }

  /* ---------------------------------------------------------------
     UTILITY — Generate a dummy PDF blob for invoice download
     --------------------------------------------------------------- */
  function generateInvoicePDF(doc) {
    var content = [
      '================================================',
      '              DEVLOGIX - INVOICE                ',
      '================================================',
      '',
      'Invoice:    ' + doc.name,
      'Date:       ' + doc.date,
      'Status:     ' + doc.status,
      'Amount:     ' + (doc.amount || 'N/A'),
      '',
      '------------------------------------------------',
      'Client:     Acme Corporation',
      'Contact:    Jane Doe',
      'Email:      client@devlogix.com',
      '------------------------------------------------',
      '',
      'Description                          Amount',
      '------------------------------------------------',
      'Software Development Services     ' + (doc.amount || '$0.00'),
      '------------------------------------------------',
      'Total:                             ' + (doc.amount || '$0.00'),
      '',
      '================================================',
      'Thank you for your business!',
      'DevLogix Technologies Pvt. Ltd.',
      '================================================'
    ].join('\n');

    return new Blob([content], { type: 'application/pdf' });
  }

  /* ===============================================================
     PUBLIC API METHODS
     =============================================================== */

  /* ---------------------------------------------------------------
     POST /api/auth/login
     Body: { email, password }
     Returns: { success, token, user, message }
     --------------------------------------------------------------- */
  function login(email, password) {
    return simulateDelay(300, 600).then(function () {
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required.'
        };
      }

      var foundUser = null;
      for (var i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email.trim().toLowerCase()) {
          foundUser = users[i];
          break;
        }
      }

      if (!foundUser) {
        return {
          success: false,
          message: 'No account found with this email address.'
        };
      }

      if (foundUser.password !== password) {
        return {
          success: false,
          message: 'Incorrect password. Please try again.'
        };
      }

      var token = generateToken(foundUser.id);
      return {
        success: true,
        token: token,
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          initials: foundUser.initials,
          company: foundUser.company,
          role: foundUser.role
        },
        message: 'Login successful! Redirecting...'
      };
    });
  }

  /* ---------------------------------------------------------------
     POST /api/auth/logout
     Header: Authorization: Bearer <token>
     Returns: { success, message }
     --------------------------------------------------------------- */
  function logout(token) {
    return simulateDelay(150, 300).then(function () {
      return { success: true, message: 'Logged out successfully.' };
    });
  }

  /* ---------------------------------------------------------------
     GET /api/auth/me
     Header: Authorization: Bearer <token>
     Returns: { success, user } or { success: false, message }
     --------------------------------------------------------------- */
  function getProfile(token) {
    return simulateDelay(150, 350).then(function () {
      var user = validateToken(token);
      if (!user) {
        return {
          success: false,
          message: 'Session expired. Please login again.'
        };
      }
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          initials: user.initials,
          company: user.company,
          role: user.role
        }
      };
    });
  }

  /* ---------------------------------------------------------------
     GET /api/timeline/steps
     Header: Authorization: Bearer <token>
     Returns: { success, steps } or { success: false }
     --------------------------------------------------------------- */
  function getTimelineSteps(token) {
    return simulateDelay(250, 500).then(function () {
      var user = validateToken(token);
      if (!user) {
        return { success: false, message: 'Unauthorized. Please login.' };
      }
      var copy = JSON.parse(JSON.stringify(timelineSteps));
      return { success: true, steps: copy };
    });
  }

  /* ---------------------------------------------------------------
     GET /api/documents
     Query: ?type=all|invoice|agreement
     Header: Authorization: Bearer <token>
     Returns: { success, documents }
     --------------------------------------------------------------- */
  function getDocuments(token, typeFilter) {
    return simulateDelay(250, 450).then(function () {
      var user = validateToken(token);
      if (!user) {
        return { success: false, message: 'Unauthorized. Please login.' };
      }
      var docs = getStoredDocuments();
      var filtered = [];
      for (var i = 0; i < docs.length; i++) {
        if (!typeFilter || typeFilter === 'all' || docs[i].type === typeFilter) {
          filtered.push(JSON.parse(JSON.stringify(docs[i])));
        }
      }
      return { success: true, documents: filtered };
    });
  }

  /* ---------------------------------------------------------------
     GET /api/documents/invoices/:id/download
     Header: Authorization: Bearer <token>
     Returns: { success, blob, filename }
     --------------------------------------------------------------- */
  function downloadInvoice(token, docId) {
    return simulateDelay(400, 800).then(function () {
      var user = validateToken(token);
      if (!user) {
        return { success: false, message: 'Unauthorized. Please login.' };
      }

      var docs = getStoredDocuments();
      var doc = null;
      for (var i = 0; i < docs.length; i++) {
        if (docs[i].id === docId && docs[i].type === 'invoice') {
          doc = docs[i];
          break;
        }
      }

      if (!doc) {
        return { success: false, message: 'Invoice not found.' };
      }

      var blob = generateInvoicePDF(doc);
      var filename = doc.name.replace(/\s+/g, '_') + '.pdf';

      return { success: true, blob: blob, filename: filename };
    });
  }

  /* ---------------------------------------------------------------
     POST /api/agreements/:id/sign
     Body: { signerName, acceptedTerms }
     Header: Authorization: Bearer <token>
     Returns: { success, document, message }
     --------------------------------------------------------------- */
  function signAgreement(token, docId, payload) {
    return simulateDelay(400, 750).then(function () {
      var user = validateToken(token);
      if (!user) {
        return { success: false, message: 'Unauthorized. Please login.' };
      }

      if (!payload || !payload.signerName || !payload.acceptedTerms) {
        return {
          success: false,
          message: 'Please provide your name and accept the terms.'
        };
      }

      var docs = getStoredDocuments();
      var docIndex = -1;
      for (var i = 0; i < docs.length; i++) {
        if (docs[i].id === docId && docs[i].type === 'agreement') {
          docIndex = i;
          break;
        }
      }

      if (docIndex === -1) {
        return { success: false, message: 'Agreement not found.' };
      }

      if (docs[docIndex].status === 'Signed') {
        return { success: false, message: 'This agreement is already signed.' };
      }

      /* Update the document status */
      docs[docIndex].status = 'Signed';
      docs[docIndex].signedBy = payload.signerName;
      docs[docIndex].signedAt = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      saveStoredDocuments(docs);

      return {
        success: true,
        document: JSON.parse(JSON.stringify(docs[docIndex])),
        message: 'Agreement signed successfully by ' + payload.signerName + '.'
      };
    });
  }

  /* ===============================================================
     EXPOSE PUBLIC INTERFACE
     =============================================================== */
  return {
    login: login,
    logout: logout,
    getProfile: getProfile,
    getTimelineSteps: getTimelineSteps,
    getDocuments: getDocuments,
    downloadInvoice: downloadInvoice,
    signAgreement: signAgreement
  };

})();
