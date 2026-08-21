/**
 * DevLogix CRM — App bootstrap
 * Wires up search, filtering, mobile navigation, and the new-lead action.
 */

const searchInput = document.getElementById('leadSearch');
const priorityFilter = document.getElementById('priorityFilter');
const addLeadBtn = document.getElementById('addLeadBtn');
const toastEl = document.getElementById('toast');

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

let toastTimer = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 2600);
}

/**
 * Applies the current search term and priority filter, then re-renders
 * the board with the resulting list of leads.
 */
function applyFiltersAndRender() {
  const query = searchInput.value.trim().toLowerCase();
  const priority = priorityFilter.value;

  const visibleLeads = leads.filter((lead) => {
    const matchesQuery =
      !query ||
      lead.name.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query);

    const matchesPriority = priority === 'all' || lead.priority === priority;

    return matchesQuery && matchesPriority;
  });

  renderBoard(visibleLeads);
}

searchInput.addEventListener('input', applyFiltersAndRender);
priorityFilter.addEventListener('change', applyFiltersAndRender);
addLeadBtn.addEventListener('click', openNewLeadModal);

/* ---- Mobile sidebar ---- */

function openSidebar() {
  sidebar.classList.add('is-open');
  sidebarOverlay.hidden = false;
  menuToggle.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
  sidebar.classList.remove('is-open');
  sidebarOverlay.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
  const isOpen = sidebar.classList.contains('is-open');
  isOpen ? closeSidebar() : openSidebar();
});

sidebarOverlay.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
    closeSidebar();
  }
});

/* ---- Placeholder navigation feedback ---- */

document.querySelectorAll('[data-placeholder]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const label = link.querySelector('span:last-child').textContent;
    showToast(`${label} is not part of this build yet`);
  });
});

/* ---- Initial render ---- */

applyFiltersAndRender();
