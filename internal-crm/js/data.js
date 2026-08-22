/**
 * DevLogix CRM — Sample data
 * All names, companies, and contact details below are fictional and are
 * used only to demonstrate the interface.
 */

const STAGES = [
  { id: 'contacted', label: 'Contacted' },
  { id: 'meeting-booked', label: 'Meeting Booked' },
  { id: 'closed', label: 'Closed' }
];

let leads = [
  {
    id: 'lead-01',
    name: 'Priya Nair',
    company: 'Harborline Logistics',
    email: 'priya.nair@harborline.com',
    phone: '+1 (415) 555-0142',
    owner: 'Amara Kade',
    stage: 'contacted',
    priority: 'High',
    source: 'Referral',
    lastActivity: 'Aug 17, 2026',
    notes: 'Introduced by an existing client. Wants a walkthrough of the reporting dashboard before committing to a demo.'
  },
  {
    id: 'lead-02',
    name: 'Daniel Osei',
    company: 'Marrow Robotics',
    email: 'daniel.osei@marrowrobotics.io',
    phone: '+1 (312) 555-0198',
    owner: 'Marcus Wren',
    stage: 'contacted',
    priority: 'Medium',
    source: 'Website',
    lastActivity: 'Aug 15, 2026',
    notes: 'Downloaded the pricing sheet. No direct contact yet, following up this week.'
  },
  {
    id: 'lead-03',
    name: 'Elena Voss',
    company: 'Northfield Analytics',
    email: 'elena.voss@northfieldanalytics.com',
    phone: '+1 (206) 555-0176',
    owner: 'Amara Kade',
    stage: 'contacted',
    priority: 'Low',
    source: 'Cold outreach',
    lastActivity: 'Aug 12, 2026',
    notes: 'Early stage. Sent an intro email, awaiting reply.'
  },
  {
    id: 'lead-04',
    name: 'Tomás Rivera',
    company: 'Cascade Retail Group',
    email: 'tomas.rivera@cascaderetail.com',
    phone: '+1 (503) 555-0163',
    owner: 'Sana Iqbal',
    stage: 'meeting-booked',
    priority: 'High',
    source: 'Trade show',
    lastActivity: 'Aug 18, 2026',
    notes: 'Discovery call scheduled for Friday. Interested in the multi-location rollout plan.'
  },
  {
    id: 'lead-05',
    name: 'Grace Lindqvist',
    company: 'Bellcrest Financial',
    email: 'grace.lindqvist@bellcrest.com',
    phone: '+1 (617) 555-0119',
    owner: 'Marcus Wren',
    stage: 'meeting-booked',
    priority: 'Medium',
    source: 'LinkedIn',
    lastActivity: 'Aug 16, 2026',
    notes: 'Second meeting booked with their operations lead. Needs a security review document.'
  },
  {
    id: 'lead-06',
    name: 'Kwame Boateng',
    company: 'Solvent Health Group',
    email: 'kwame.boateng@solventhealth.org',
    phone: '+1 (404) 555-0157',
    owner: 'Sana Iqbal',
    stage: 'closed',
    priority: 'High',
    source: 'Referral',
    lastActivity: 'Aug 10, 2026',
    notes: 'Signed a twelve month agreement. Kickoff call scheduled with the implementation team.'
  },
  {
    id: 'lead-07',
    name: 'Isla Fernsby',
    company: 'Aldergate Studio',
    email: 'isla.fernsby@aldergatestudio.com',
    phone: '+1 (212) 555-0184',
    owner: 'Amara Kade',
    stage: 'closed',
    priority: 'Low',
    source: 'Website',
    lastActivity: 'Aug 6, 2026',
    notes: 'Closed on the starter plan. Revisit for an upgrade conversation next quarter.'
  }
];
