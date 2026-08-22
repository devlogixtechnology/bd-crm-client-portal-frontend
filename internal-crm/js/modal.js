/**
 * DevLogix CRM — Lead Detail Modal
 */

const modalEl = document.getElementById('leadModal');
const modalBackdropEl = document.getElementById('modalBackdrop');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalLeadName = document.getElementById('modalLeadName');
const modalLeadCompany = document.getElementById('modalLeadCompany');
const leadForm = document.getElementById('leadForm');

const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const deleteLeadBtn = document.getElementById('deleteLeadBtn');

const formFields = {
  name: document.getElementById('fieldName'),
  company: document.getElementById('fieldCompany'),
  email: document.getElementById('fieldEmail'),
  phone: document.getElementById('fieldPhone'),
  owner: document.getElementById('fieldOwner'),
  stage: document.getElementById('fieldStage'),
  priority: document.getElementById('fieldPriority'),
  source: document.getElementById('fieldSource'),
  lastActivity: document.getElementById('fieldActivity'),
  notes: document.getElementById('fieldNotes')
};

let activeLeadId = null;
let lastFocusedElement = null;

function fillForm(lead) {
  formFields.name.value = lead.name;
  formFields.company.value = lead.company;
  formFields.email.value = lead.email;
  formFields.phone.value = lead.phone;
  formFields.owner.value = lead.owner;
  formFields.stage.value = lead.stage === 'meeting-booked' ? 'Meeting Booked' : capitalize(lead.stage);
  formFields.priority.value = lead.priority;
  formFields.source.value = lead.source;
  formFields.lastActivity.value = lead.lastActivity;
  formFields.notes.value = lead.notes;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function setFormDisabled(isDisabled) {
  Object.values(formFields).forEach((field) => {
    field.disabled = isDisabled;
  });
}

function setEditMode(isEditing) {
  setFormDisabled(!isEditing);
  editBtn.hidden = isEditing;
  saveBtn.hidden = !isEditing;
  cancelBtn.textContent = isEditing ? 'Cancel' : 'Close';
}

function openLeadModal(leadId) {
  const lead = leads.find((item) => item.id === leadId);
  if (!lead) return;

  activeLeadId = leadId;
  lastFocusedElement = document.activeElement;

  modalLeadName.textContent = lead.name;
  modalLeadCompany.textContent = lead.company;
  fillForm(lead);
  setEditMode(false);

  modalBackdropEl.hidden = false;
  modalEl.hidden = false;

  document.body.style.overflow = 'hidden';
  markSelectedCard(leadId);
  modalCloseBtn.focus();
}

function closeLeadModal() {
  modalBackdropEl.hidden = true;
  modalEl.hidden = true;
  document.body.style.overflow = '';
  activeLeadId = null;
  clearSelectedCard();

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function markSelectedCard(leadId) {
  clearSelectedCard();
  const card = boardEl.querySelector(`.lead-card[data-lead-id="${leadId}"]`);
  if (card) card.classList.add('is-selected');
}

function clearSelectedCard() {
  boardEl.querySelectorAll('.lead-card.is-selected').forEach((card) => {
    card.classList.remove('is-selected');
  });
}

function saveLeadChanges() {
  const lead = leads.find((item) => item.id === activeLeadId);
  if (!lead) return;

  if (!formFields.name.value.trim() || !formFields.company.value.trim()) {
    showToast('Lead name and company are required');
    return;
  }

  lead.name = formFields.name.value.trim();
  lead.company = formFields.company.value.trim();
  lead.email = formFields.email.value.trim();
  lead.phone = formFields.phone.value.trim();
  lead.owner = formFields.owner.value.trim() || lead.owner;
  lead.stage =
    formFields.stage.value === 'Meeting Booked' ? 'meeting-booked' : formFields.stage.value.toLowerCase();
  lead.priority = formFields.priority.value;
  lead.source = formFields.source.value.trim();
  lead.notes = formFields.notes.value.trim();

  modalLeadName.textContent = lead.name;
  modalLeadCompany.textContent = lead.company;

  setEditMode(false);
  applyFiltersAndRender();
  markSelectedCard(lead.id);
  showToast(`${lead.name} was updated`);
}

function openNewLeadModal() {
  const newLead = {
    id: `lead-${Date.now()}`,
    name: '',
    company: '',
    email: '',
    phone: '',
    owner: '',
    stage: 'contacted',
    priority: 'Medium',
    source: '',
    lastActivity: 'Today',
    notes: ''
  };

  leads.push(newLead);
  activeLeadId = newLead.id;
  lastFocusedElement = document.activeElement;

  modalLeadName.textContent = 'New lead';
  modalLeadCompany.textContent = 'Fill in the details below';
  fillForm(newLead);
  setEditMode(true);

  modalBackdropEl.hidden = false;
  modalEl.hidden = false;
  document.body.style.overflow = 'hidden';

  applyFiltersAndRender();
  formFields.name.focus();
}

function deleteActiveLead() {
  const lead = leads.find((item) => item.id === activeLeadId);
  if (!lead) return;

  const confirmed = window.confirm(`Delete ${lead.name} from ${lead.company}? This cannot be undone.`);
  if (!confirmed) return;

  leads = leads.filter((item) => item.id !== activeLeadId);
  closeLeadModal();
  applyFiltersAndRender();
  showToast(`${lead.name} was deleted`);
}

editBtn.addEventListener('click', () => setEditMode(true));

cancelBtn.addEventListener('click', () => {
  const lead = leads.find((item) => item.id === activeLeadId);

  if (!saveBtn.hidden) {
    if (lead && !lead.name.trim()) {
      leads = leads.filter((item) => item.id !== activeLeadId);
      closeLeadModal();
      applyFiltersAndRender();
      return;
    }
    fillForm(lead);
    setEditMode(false);
  } else {
    closeLeadModal();
  }
});

saveBtn.addEventListener('click', saveLeadChanges);
deleteLeadBtn.addEventListener('click', deleteActiveLead);
modalCloseBtn.addEventListener('click', closeLeadModal);
modalBackdropEl.addEventListener('click', closeLeadModal);

leadForm.addEventListener('submit', (event) => event.preventDefault());

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalEl.hidden) {
    closeLeadModal();
  }

  if (event.key === 'Tab' && !modalEl.hidden) {
    trapFocus(event);
  }
});

function trapFocus(event) {
  const focusable = modalEl.querySelectorAll(
    'button:not([hidden]):not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
