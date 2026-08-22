/**
 * DevLogix CRM — Kanban board
 * Renders the three pipeline columns and lead cards, and handles
 * drag-and-drop between stages.
 */

const boardEl = document.getElementById('kanbanBoard');

let draggedLeadId = null;

function getInitials(fullName) {
  return fullName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function priorityBadge(priority) {
  const className =
    priority === 'High' ? 'badge-high' : priority === 'Medium' ? 'badge-medium' : 'badge-low';
  return `
    <span class="badge ${className}">
      <span class="badge-dot" aria-hidden="true"></span>
      ${priority} priority
    </span>
  `;
}

function leadCardTemplate(lead) {
  return `
    <button
      class="lead-card"
      type="button"
      draggable="true"
      data-lead-id="${lead.id}"
      role="listitem"
      aria-haspopup="dialog"
    >
      <div class="lead-card-top">
        <div class="lead-identity">
          <p class="lead-name">${lead.name}</p>
          <p class="lead-company">${lead.company}</p>
        </div>
        <span class="avatar avatar-sm" title="Owner: ${lead.owner}" aria-hidden="true">${getInitials(lead.owner)}</span>
      </div>

      <div class="lead-card-contact">
        <span class="lead-contact-row">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4V4Zm2 2v.4l6 4.2 6-4.2V6H6Zm12 2.4-5.4 3.8a1 1 0 0 1-1.2 0L6 8.4V18h12V8.4Z"/></svg>
          <span>${lead.email}</span>
        </span>
        <span class="lead-contact-row">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.4.55 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .55 3.4 1 1 0 0 1-.24 1Z"/></svg>
          <span>${lead.phone}</span>
        </span>
      </div>

      <div class="lead-card-meta">
        ${priorityBadge(lead.priority)}
        <span class="lead-source">${lead.source}</span>
      </div>

      <div class="lead-card-footer">
        <span class="lead-owner">
          <span class="lead-owner-name">${lead.owner}</span>
        </span>
        <span class="lead-activity">${lead.lastActivity}</span>
      </div>
    </button>
  `;
}

function emptyStateTemplate() {
  return `
    <div class="column-empty">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4V4Zm2 2v12h12V6H6Zm2 3h8v2H8V9Zm0 4h5v2H8v-2Z"/></svg>
      <p class="column-empty-title">No leads here yet</p>
      <p class="column-empty-text">Move a card in or add a new lead.</p>
    </div>
  `;
}

/**
 * Renders the full board using the given list of leads (already filtered
 * by app.js for search and priority).
 */
function renderBoard(visibleLeads) {
  boardEl.innerHTML = STAGES.map((stage) => {
    const stageLeads = visibleLeads.filter((lead) => lead.stage === stage.id);

    const cardsMarkup = stageLeads.length
      ? stageLeads.map(leadCardTemplate).join('')
      : emptyStateTemplate();

    return `
      <section class="kanban-column" data-stage="${stage.id}" role="listitem" aria-label="${stage.label} column">
        <div class="column-header">
          <div class="column-heading">
            <span class="column-dot" aria-hidden="true"></span>
            <h3 class="column-title">${stage.label}</h3>
          </div>
          <span class="badge-count">${stageLeads.length}</span>
        </div>
        <div class="column-cards" role="list">
          ${cardsMarkup}
        </div>
      </section>
    `;
  }).join('');

  attachCardListeners();
  attachDragAndDropListeners();
}

function attachCardListeners() {
  boardEl.querySelectorAll('.lead-card').forEach((card) => {
    card.addEventListener('click', () => {
      const leadId = card.getAttribute('data-lead-id');
      openLeadModal(leadId);
    });

    card.addEventListener('dragstart', () => {
      draggedLeadId = card.getAttribute('data-lead-id');
      card.classList.add('is-dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      draggedLeadId = null;
    });
  });
}

function attachDragAndDropListeners() {
  boardEl.querySelectorAll('.kanban-column').forEach((column) => {
    column.addEventListener('dragover', (event) => {
      event.preventDefault();
      column.classList.add('is-drag-over');
    });

    column.addEventListener('dragleave', () => {
      column.classList.remove('is-drag-over');
    });

    column.addEventListener('drop', (event) => {
      event.preventDefault();
      column.classList.remove('is-drag-over');

      if (!draggedLeadId) return;

      const targetStage = column.getAttribute('data-stage');
      const lead = leads.find((item) => item.id === draggedLeadId);

      if (lead && lead.stage !== targetStage) {
        lead.stage = targetStage;
        const stageLabel = STAGES.find((stage) => stage.id === targetStage).label;
        showToast(`${lead.name} moved to ${stageLabel}`);
        applyFiltersAndRender();
      }
    });
  });
}
