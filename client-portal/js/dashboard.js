/* =============================================================
   CLIENT DASHBOARD — MAIN CONTROLLER
   =============================================================
   Squad Lead : Fatima Nadeem
   Team       : BD CRM Client Portal Frontend Squad
   Company    : DevLogix Technologies
   File       : js/dashboard.js
   Task       : Backend API Integration
   Subtasks   : - Hook up timeline to live endpoint data
                - Implement download functionality for invoices
                - Connect digital agreement signature to backend
                - Auth guard for session protection
   ============================================================= */

(function () {
  'use strict';

  /* =============================================================
     SVG ICON TEMPLATES
     ============================================================= */
  var Icons = {
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>',
    document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    fileInvoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
    fileAgreement: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15l2 2 4-4"></path></svg>',
    fileEmpty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>'
  };

  /* =============================================================
     GLOBAL STATE
     ============================================================= */
  var documentList = [];
  var currentDocFilter = 'all';
  var currentUser = null;

  /* =============================================================
     PROGRESS TRACKER — LOADING SKELETON
     ============================================================= */
  function renderProgressSkeleton(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var html = '';
    html += '<div class="section-header">';
    html += '  <div>';
    html += '    <div class="skeleton skeleton-line medium" style="height:22px;width:200px;margin-bottom:8px;"></div>';
    html += '    <div class="skeleton skeleton-line short" style="height:14px;width:280px;"></div>';
    html += '  </div>';
    html += '  <div class="skeleton skeleton-line" style="height:28px;width:60px;"></div>';
    html += '</div>';
    html += '<div class="skeleton skeleton-bar"></div>';
    html += '<div class="skeleton-tracker">';
    for (var i = 0; i < 6; i++) {
      html += '<div class="skeleton-step">';
      html += '  <div class="skeleton skeleton-circle"></div>';
      html += '  <div class="skeleton skeleton-line" style="width:80px;height:12px;"></div>';
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  /* =============================================================
     PROGRESS TRACKER — ERROR STATE
     ============================================================= */
  function renderProgressError(containerId, message) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML =
      '<div class="error-state">'
      + '  <div class="error-state-icon">⚠</div>'
      + '  <h3 class="error-state-title">Failed to load timeline</h3>'
      + '  <p class="error-state-desc">' + (message || 'Something went wrong. Please try again.') + '</p>'
      + '  <button class="retry-btn" id="retryTimeline">Retry</button>'
      + '</div>';

    var retryBtn = document.getElementById('retryTimeline');
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        loadTimelineFromAPI();
      });
    }
  }

  /* =============================================================
     PROGRESS TRACKER — RENDER (from data)
     ============================================================= */
  function renderProgressTracker(containerId, steps) {
    var container = document.getElementById(containerId);
    if (!container || !steps || !steps.length) return;

    var completedCount = 0;
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].status === 'completed') completedCount++;
    }
    var totalCount = steps.length;
    var progressPercent = Math.round((completedCount / totalCount) * 100);

    var html = '';

    /* Section header */
    html += '<div class="section-header">';
    html += '  <div>';
    html += '    <h2 class="section-title">Onboarding Progress</h2>';
    html += '    <p class="section-subtitle">Track your onboarding journey from start to finish.</p>';
    html += '  </div>';
    html += '  <div class="progress-summary">';
    html += '    <div class="progress-badge">';
    html += '      <span class="progress-percent">' + progressPercent + '%</span>';
    html += '      <span class="progress-label">Complete</span>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    /* Progress bar */
    html += '<div class="progress-bar-track">';
    html += '  <div class="progress-bar-fill" style="width: ' + progressPercent + '%"></div>';
    html += '</div>';

    /* Stepper */
    html += '<div class="tracker" role="list" aria-label="Onboarding steps">';

    for (var s = 0; s < steps.length; s++) {
      var step = steps[s];
      var isLast = s === steps.length - 1;
      var connectorClass = step.status === 'completed' ? 'completed' : 'pending';
      var titleClass = step.status === 'pending' ? 'step-title muted' : 'step-title';

      html += '<div class="tracker-step" role="listitem">';
      html += '  <div class="step-header">';
      html += '    <div class="step-circle ' + step.status + '" aria-label="' + step.status + ': ' + step.title + '">';

      if (step.status === 'completed') {
        html += Icons.check;
      } else {
        html += '<span class="step-number">' + (s + 1) + '</span>';
      }

      html += '    </div>';

      if (!isLast) {
        html += '    <div class="step-connector ' + connectorClass + '" aria-hidden="true"></div>';
      }

      html += '  </div>';
      html += '  <div class="step-body">';
      html += '    <h4 class="' + titleClass + '">' + step.title + '</h4>';

      if (step.date) {
        html += '    <span class="step-date">' + step.date + '</span>';
      }
      if (step.description) {
        html += '    <p class="step-desc">' + step.description + '</p>';
      }

      html += '  </div>';
      html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
  }

  /* =============================================================
     TIMELINE — LOAD FROM API (Subtask: Hook up timeline)
     ============================================================= */
  function loadTimelineFromAPI() {
    var token = typeof AuthGuard !== 'undefined' ? AuthGuard.getToken() : null;

    renderProgressSkeleton('progressSection');

    if (typeof MockAPI === 'undefined') return;

    MockAPI.getTimelineSteps(token)
      .then(function (response) {
        if (response.success) {
          renderProgressTracker('progressSection', response.steps);
          showToast('✅ Timeline data loaded from API');
        } else {
          renderProgressError('progressSection', response.message);
        }
      })
      .catch(function (error) {
        console.error('Timeline API Error:', error);
        renderProgressError('progressSection', 'Network error. Please check your connection.');
      });
  }

  /* =============================================================
     DOCUMENTS — LOAD FROM API
     ============================================================= */
  function loadDocumentsFromAPI() {
    var token = typeof AuthGuard !== 'undefined' ? AuthGuard.getToken() : null;

    if (typeof MockAPI === 'undefined') return;

    MockAPI.getDocuments(token, 'all')
      .then(function (response) {
        if (response.success) {
          documentList = response.documents;
          renderDocumentCenter('documentSection', documentList);
        } else {
          showToast('⚠ Failed to load documents: ' + response.message);
        }
      })
      .catch(function (error) {
        console.error('Documents API Error:', error);
        showToast('⚠ Failed to load documents');
      });
  }

  /* =============================================================
     DOCUMENT CENTER — HELPERS
     ============================================================= */
  function getDocStatusClass(status) {
    var map = {
      'Paid': 'status-success',
      'Signed': 'status-success',
      'Pending': 'status-warning',
      'Pending Review': 'status-warning',
      'Draft': 'status-muted',
      'Overdue': 'status-error',
      'Cancelled': 'status-error'
    };
    return map[status] || 'status-muted';
  }

  function getDocTypeIcon(type) {
    return type === 'invoice' ? Icons.fileInvoice : Icons.fileAgreement;
  }

  /* --- Build table row with sign button for agreements --- */
  function buildTableRow(doc) {
    var statusClass = getDocStatusClass(doc.status);
    var typeIcon = getDocTypeIcon(doc.type);

    var row = '<tr>';
    row += '<td><div class="doc-name">';
    row += '  <div class="doc-name-icon ' + doc.type + '">' + typeIcon + '</div>';
    row += '  <span class="doc-name-text">' + doc.name + '</span>';
    row += '</div></td>';
    row += '<td><span class="doc-type">' + doc.type + '</span></td>';
    row += '<td><span class="status-badge ' + statusClass + '">' + doc.status + '</span></td>';
    row += '<td><span class="doc-date">' + doc.date + '</span></td>';
    row += '<td><div class="doc-actions">';
    row += '  <button class="action-btn" data-action="view" data-id="' + doc.id + '" aria-label="View ' + doc.name + '">';
    row += '    ' + Icons.eye;
    row += '    <span class="btn-tooltip">View</span>';
    row += '  </button>';

    if (doc.type === 'invoice') {
      row += '  <button class="action-btn" data-action="download" data-id="' + doc.id + '" aria-label="Download ' + doc.name + '">';
      row += '    ' + Icons.download;
      row += '    <span class="btn-tooltip">Download</span>';
      row += '  </button>';
    } else if (doc.type === 'agreement' && doc.status !== 'Signed') {
      row += '  <button class="action-btn sign-btn" data-action="sign" data-id="' + doc.id + '" aria-label="Sign ' + doc.name + '">';
      row += '    ' + Icons.pen;
      row += '    <span class="btn-tooltip">Sign</span>';
      row += '  </button>';
    }

    row += '</div></td>';
    row += '</tr>';
    return row;
  }

  /* --- Build mobile card with sign button --- */
  function buildMobileCard(doc) {
    var statusClass = getDocStatusClass(doc.status);
    var typeIcon = getDocTypeIcon(doc.type);

    var card = '<div class="doc-card">';
    card += '  <div class="doc-card-header">';
    card += '    <div class="doc-name-icon ' + doc.type + '">' + typeIcon + '</div>';
    card += '    <span class="doc-card-name">' + doc.name + '</span>';
    card += '  </div>';
    card += '  <div class="doc-card-meta">';
    card += '    <span class="doc-type">' + doc.type + '</span>';
    card += '    <span class="meta-sep">|</span>';
    card += '    <span class="status-badge ' + statusClass + '">' + doc.status + '</span>';
    card += '    <span class="meta-sep">|</span>';
    card += '    <span class="doc-date">' + doc.date + '</span>';
    card += '  </div>';
    card += '  <div class="doc-card-actions">';
    card += '    <button class="doc-card-action-btn" data-action="view" data-id="' + doc.id + '">';
    card += '      ' + Icons.eye + ' View';
    card += '    </button>';

    if (doc.type === 'invoice') {
      card += '    <button class="doc-card-action-btn" data-action="download" data-id="' + doc.id + '">';
      card += '      ' + Icons.download + ' Download';
      card += '    </button>';
    } else if (doc.type === 'agreement' && doc.status !== 'Signed') {
      card += '    <button class="doc-card-action-btn" data-action="sign" data-id="' + doc.id + '">';
      card += '      ' + Icons.pen + ' Sign';
      card += '    </button>';
    }

    card += '  </div>';
    card += '</div>';
    return card;
  }

  function buildEmptyState() {
    return '<div class="empty-state">'
         + '  <div class="empty-state-icon">' + Icons.fileEmpty + '</div>'
         + '  <h3 class="empty-state-title">No documents available yet.</h3>'
         + '  <p class="empty-state-desc">Documents will appear here once they are generated and ready for review.</p>'
         + '</div>';
  }

  /* =============================================================
     DOCUMENT CENTER — UPDATE VIEW
     ============================================================= */
  function updateDocumentView() {
    var filteredDocs = [];
    for (var i = 0; i < documentList.length; i++) {
      if (currentDocFilter === 'all' || documentList[i].type === currentDocFilter) {
        filteredDocs.push(documentList[i]);
      }
    }

    /* Update tab active states */
    var tabs = document.querySelectorAll('.doc-tab');
    for (var t = 0; t < tabs.length; t++) {
      if (tabs[t].getAttribute('data-filter') === currentDocFilter) {
        tabs[t].classList.add('active');
        tabs[t].setAttribute('aria-selected', 'true');
      } else {
        tabs[t].classList.remove('active');
        tabs[t].setAttribute('aria-selected', 'false');
      }
    }

    var tableBody = document.getElementById('docTableBody');
    var cardsContainer = document.getElementById('docCardsContainer');
    var emptyContainer = document.getElementById('docEmptyState');

    if (!tableBody || !cardsContainer || !emptyContainer) return;

    if (filteredDocs.length === 0) {
      tableBody.innerHTML = '';
      cardsContainer.innerHTML = '';
      tableBody.closest('.doc-table-wrapper').style.display = 'none';
      cardsContainer.style.display = 'none';
      emptyContainer.innerHTML = buildEmptyState();
      emptyContainer.style.display = 'flex';
    } else {
      emptyContainer.style.display = 'none';

      var rows = '';
      for (var r = 0; r < filteredDocs.length; r++) {
        rows += buildTableRow(filteredDocs[r]);
      }
      tableBody.innerHTML = rows;

      var cards = '';
      for (var c = 0; c < filteredDocs.length; c++) {
        cards += buildMobileCard(filteredDocs[c]);
      }
      cardsContainer.innerHTML = cards;

      tableBody.closest('.doc-table-wrapper').style.display = '';
      cardsContainer.style.display = '';
    }
  }

  /* =============================================================
     INVOICE DOWNLOAD — API Integration
     ============================================================= */
  function handleInvoiceDownload(docId) {
    var token = typeof AuthGuard !== 'undefined' ? AuthGuard.getToken() : null;

    showToast('⏳ Preparing invoice download...');

    if (typeof MockAPI === 'undefined') return;

    MockAPI.downloadInvoice(token, docId)
      .then(function (response) {
        if (response.success) {
          var url = URL.createObjectURL(response.blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = response.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          showToast('✅ Invoice downloaded: ' + response.filename);
        } else {
          showToast('⚠ Download failed: ' + response.message);
        }
      })
      .catch(function (error) {
        console.error('Download Error:', error);
        showToast('⚠ Download failed. Please try again.');
      });
  }

  /* =============================================================
     SIGNATURE MODAL — Controller
     ============================================================= */
  var activeSignDoc = null;

  function openSignatureModal(doc) {
    activeSignDoc = doc;

    var modal = document.getElementById('signatureModal');
    var docInfo = document.getElementById('modalDocInfo');
    var signerName = document.getElementById('signerName');
    var signatureInput = document.getElementById('signatureInput');
    var signaturePreview = document.getElementById('signaturePreview');
    var termsAccept = document.getElementById('termsAccept');
    var modalSubmit = document.getElementById('modalSubmit');
    var modalAlert = document.getElementById('modalAlert');
    var modalClose = document.getElementById('modalClose');

    if (!modal) return;

    /* Populate document info */
    if (docInfo) {
      docInfo.innerHTML =
        '<div class="modal-doc-icon">' + Icons.fileAgreement + '</div>'
        + '<div>'
        + '  <div class="modal-doc-name">' + doc.name + '</div>'
        + '  <div class="modal-doc-date">' + doc.date + '</div>'
        + '</div>';
    }

    if (signerName) {
      signerName.value = currentUser ? (currentUser.name || '') : '';
    }

    if (signatureInput) signatureInput.value = '';
    if (signaturePreview) signaturePreview.textContent = 'Your signature appears here';
    if (termsAccept) termsAccept.checked = false;
    if (modalSubmit) {
      modalSubmit.disabled = true;
      modalSubmit.innerHTML = 'Sign Agreement';
    }
    if (modalAlert) {
      modalAlert.className = 'modal-alert';
      modalAlert.textContent = '';
    }
    if (modalClose) modalClose.innerHTML = Icons.close;

    modal.style.display = 'flex';
    requestAnimationFrame(function () {
      modal.classList.add('visible');
    });
    document.body.style.overflow = 'hidden';

    if (signatureInput) {
      signatureInput.oninput = function () {
        var val = this.value.trim();
        if (signaturePreview) signaturePreview.textContent = val || 'Your signature appears here';
        validateSignForm();
      };
    }

    if (signerName) signerName.oninput = validateSignForm;
    if (termsAccept) termsAccept.onchange = validateSignForm;

    function validateSignForm() {
      var nameOk = signerName && signerName.value.trim().length >= 2;
      var sigOk = signatureInput && signatureInput.value.trim().length >= 2;
      var termsOk = termsAccept && termsAccept.checked;
      if (modalSubmit) modalSubmit.disabled = !(nameOk && sigOk && termsOk);
    }
  }

  function closeSignatureModal() {
    var modal = document.getElementById('signatureModal');
    if (!modal) return;
    modal.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(function () {
      modal.style.display = 'none';
    }, 300);
    activeSignDoc = null;
  }

  function submitSignature() {
    if (!activeSignDoc) return;

    var token = typeof AuthGuard !== 'undefined' ? AuthGuard.getToken() : null;
    var signerName = document.getElementById('signerName').value.trim();
    var modalSubmit = document.getElementById('modalSubmit');
    var modalAlert = document.getElementById('modalAlert');

    modalSubmit.disabled = true;
    modalSubmit.innerHTML = '<span class="spinner-sm"></span> Signing...';

    if (typeof MockAPI === 'undefined') return;

    MockAPI.signAgreement(token, activeSignDoc.id, {
      signerName: signerName,
      acceptedTerms: true
    })
      .then(function (response) {
        if (response.success) {
          for (var i = 0; i < documentList.length; i++) {
            if (documentList[i].id === activeSignDoc.id) {
              documentList[i].status = 'Signed';
              break;
            }
          }

          if (modalAlert) {
            modalAlert.className = 'modal-alert visible success';
            modalAlert.textContent = '✅ ' + response.message;
          }
          if (modalSubmit) modalSubmit.innerHTML = '✓ Signed!';

          setTimeout(function () {
            updateDocumentView();
            closeSignatureModal();
            showToast('✅ ' + response.message);
          }, 1200);
        } else {
          if (modalAlert) {
            modalAlert.className = 'modal-alert visible error';
            modalAlert.textContent = '⚠ ' + response.message;
          }
          if (modalSubmit) {
            modalSubmit.disabled = false;
            modalSubmit.innerHTML = 'Sign Agreement';
          }
        }
      })
      .catch(function (error) {
        console.error('Signature Error:', error);
        if (modalAlert) {
          modalAlert.className = 'modal-alert visible error';
          modalAlert.textContent = '⚠ Something went wrong. Please try again.';
        }
        if (modalSubmit) {
          modalSubmit.disabled = false;
          modalSubmit.innerHTML = 'Sign Agreement';
        }
      });
  }

  /* =============================================================
     DOCUMENT CENTER — EVENT DELEGATION
     ============================================================= */
  function bindDocActionEvents() {
    var section = document.getElementById('documentSection');
    if (!section) return;

    section.onclick = function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;

      var action = btn.getAttribute('data-action');
      var docId = parseInt(btn.getAttribute('data-id'), 10);
      var doc = null;

      for (var i = 0; i < documentList.length; i++) {
        if (documentList[i].id === docId) {
          doc = documentList[i];
          break;
        }
      }

      if (!doc) return;

      if (action === 'view') {
        showToast('📄 Opening preview for "' + doc.name + '"');
      } else if (action === 'download') {
        handleInvoiceDownload(docId);
      } else if (action === 'sign') {
        openSignatureModal(doc);
      }
    };
  }

  /* =============================================================
     DOCUMENT CENTER — RENDER (initial)
     ============================================================= */
  function renderDocumentCenter(containerId, docs) {
    if (docs) documentList = docs;

    var container = document.getElementById(containerId);
    if (!container) return;

    var allCount = documentList.length;
    var invoiceCount = 0;
    var agreementCount = 0;
    for (var i = 0; i < documentList.length; i++) {
      if (documentList[i].type === 'invoice') invoiceCount++;
      if (documentList[i].type === 'agreement') agreementCount++;
    }

    var html = '';

    /* Section header */
    html += '<div class="section-header">';
    html += '  <div>';
    html += '    <h2 class="section-title">Document Center</h2>';
    html += '    <p class="section-subtitle">View and manage your invoices and agreements.</p>';
    html += '  </div>';
    html += '</div>';

    /* Tabs */
    html += '<div class="doc-tabs" role="tablist">';
    html += '  <button class="doc-tab active" role="tab" data-filter="all" aria-selected="true">';
    html += '    All <span class="tab-count">' + allCount + '</span>';
    html += '  </button>';
    html += '  <button class="doc-tab" role="tab" data-filter="invoice" aria-selected="false">';
    html += '    Invoices <span class="tab-count">' + invoiceCount + '</span>';
    html += '  </button>';
    html += '  <button class="doc-tab" role="tab" data-filter="agreement" aria-selected="false">';
    html += '    Agreements <span class="tab-count">' + agreementCount + '</span>';
    html += '  </button>';
    html += '</div>';

    /* Desktop table */
    html += '<div class="doc-table-wrapper">';
    html += '  <table class="doc-table">';
    html += '    <thead><tr>';
    html += '      <th>Document Name</th>';
    html += '      <th>Type</th>';
    html += '      <th>Status</th>';
    html += '      <th>Date</th>';
    html += '      <th>Actions</th>';
    html += '    </tr></thead>';
    html += '    <tbody id="docTableBody"></tbody>';
    html += '  </table>';
    html += '</div>';

    /* Mobile cards */
    html += '<div class="doc-cards-wrapper" id="docCardsContainer"></div>';

    /* Empty state */
    html += '<div id="docEmptyState" style="display:none;"></div>';

    container.innerHTML = html;

    /* Bind tab click events */
    var tabs = container.querySelectorAll('.doc-tab');
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].addEventListener('click', function () {
        currentDocFilter = this.getAttribute('data-filter');
        updateDocumentView();
      });
    }

    /* Initial render */
    currentDocFilter = 'all';
    updateDocumentView();

    /* Bind action events */
    bindDocActionEvents();
  }

  /* =============================================================
     SIDEBAR RENDER (with user data + logout)
     ============================================================= */
  function renderSidebar(user) {
    var brandEl = document.getElementById('sidebarBrand');
    if (brandEl) {
      brandEl.innerHTML =
        '<div class="brand-mark">' + Icons.layers + '</div>'
        + '<span class="brand-text">DevLogix Portal</span>';
    }

    var navEl = document.getElementById('sidebarNav');
    if (navEl) {
      navEl.innerHTML =
        '<span class="nav-label">Menu</span>'
        + '<a href="#" class="nav-item active">' + Icons.dashboard + '<span>Dashboard</span></a>'
        + '<a href="#" class="nav-item">' + Icons.document + '<span>Documents</span><span class="nav-badge">6</span></a>'
        + '<a href="#" class="nav-item">' + Icons.settings + '<span>Settings</span></a>'
        + '<span class="nav-label">Support</span>'
        + '<a href="#" class="nav-item">' + Icons.help + '<span>Help Center</span></a>';
    }

    var initials = user ? user.initials : 'JD';
    var name = user ? user.name : 'Jane Doe';
    var company = user ? user.company : 'Acme Corporation';

    var footerEl = document.getElementById('sidebarFooter');
    if (footerEl) {
      footerEl.innerHTML =
        '<div class="sidebar-user">'
        + '  <div class="user-avatar">' + initials + '</div>'
        + '  <div class="user-info">'
        + '    <span class="user-name">' + name + '</span>'
        + '    <span class="user-role">' + company + '</span>'
        + '  </div>'
        + '</div>'
        + '<button class="logout-btn" id="logoutBtn" aria-label="Sign out">'
        + '  ' + Icons.logout
        + '  <span>Sign Out</span>'
        + '</button>';

      var logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
          if (confirm('Are you sure you want to sign out?')) {
            if (typeof AuthGuard !== 'undefined') {
              AuthGuard.logout();
            }
          }
        });
      }
    }
  }

  /* =============================================================
     TOPBAR RENDER
     ============================================================= */
  function renderTopbar(user) {
    var topbar = document.getElementById('topbar');
    if (!topbar) return;

    var initials = user ? user.initials : 'JD';

    topbar.innerHTML =
      '<div class="topbar-left">'
      + '  <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">' + Icons.menu + '</button>'
      + '  <div class="topbar-breadcrumb">'
      + '    <span class="breadcrumb-root">Client Portal</span>'
      + '    <span class="breadcrumb-sep">/</span>'
      + '    <span class="breadcrumb-current">Dashboard</span>'
      + '  </div>'
      + '</div>'
      + '<div class="topbar-right">'
      + '  <button class="topbar-icon-btn" aria-label="Notifications">'
      + '    ' + Icons.bell
      + '    <span class="notification-dot"></span>'
      + '  </button>'
      + '  <div class="topbar-avatar" aria-label="User menu">' + initials + '</div>'
      + '</div>';
  }

  /* =============================================================
     MOBILE MENU
     ============================================================= */
  function setupMobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');

    if (!toggle || !sidebar || !overlay) return;

    function openMenu() {
      sidebar.classList.add('open');
      overlay.style.display = 'block';
      overlay.offsetHeight;
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      toggle.innerHTML = Icons.close;
      toggle.setAttribute('aria-label', 'Close menu');
    }

    function closeMenu() {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
      toggle.innerHTML = Icons.menu;
      toggle.setAttribute('aria-label', 'Toggle menu');
      setTimeout(function () {
        if (!overlay.classList.contains('visible')) {
          overlay.style.display = 'none';
        }
      }, 400);
    }

    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (sidebar.classList.contains('open')) closeMenu();
        var sigModal = document.getElementById('signatureModal');
        if (sigModal && sigModal.classList.contains('visible')) closeSignatureModal();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* =============================================================
     SIGNATURE MODAL — Button Bindings
     ============================================================= */
  function setupSignatureModal() {
    var modalClose = document.getElementById('modalClose');
    var modalCancel = document.getElementById('modalCancel');
    var modalSubmit = document.getElementById('modalSubmit');
    var modalOverlay = document.getElementById('signatureModal');

    if (modalClose) modalClose.addEventListener('click', closeSignatureModal);
    if (modalCancel) modalCancel.addEventListener('click', closeSignatureModal);
    if (modalSubmit) modalSubmit.addEventListener('click', submitSignature);

    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) closeSignatureModal();
      });
    }
  }

  /* =============================================================
     TOAST NOTIFICATION
     ============================================================= */
  function showToast(message) {
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = '<span class="toast-icon">' + Icons.info + '</span><span>' + message + '</span>';

    container.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('visible');
      });
    });

    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (container.children.length === 0 && container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 300);
    }, 3000);
  }

  /* =============================================================
     INITIALIZE — Auth Guard + API Data Loading
     ============================================================= */
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof AuthGuard === 'undefined') return;

    /* Auth Guard check */
    if (!AuthGuard.requireAuth()) return;

    /* Verify session with API */
    AuthGuard.verifySession()
      .then(function (user) {
        currentUser = user;

        renderSidebar(user);
        renderTopbar(user);
        setupMobileMenu();
        setupSignatureModal();

        loadTimelineFromAPI();
        loadDocumentsFromAPI();

        showToast('👋 Welcome back, ' + user.name + '!');
      })
      .catch(function (error) {
        console.error('Session verification failed:', error);
      });
  });

})();
