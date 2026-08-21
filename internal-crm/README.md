# DevLogix CRM — Repository Setup & Wireframing

A static frontend CRM interface built with HTML5, CSS3, and vanilla ES6+ JavaScript. No frameworks, no build step, no backend.

## Running the project

No installation is required. Open `index.html` directly in a browser, or serve the folder locally for the best experience:

```
cd devlogix-crm
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

```
devlogix-crm/
├── index.html              Semantic markup for the app shell and modal
├── css/
│   ├── variables.css        Design tokens: colors, spacing, type scale
│   ├── base.css              Resets, base typography, accessibility utilities
│   ├── layout.css            Sidebar, header, main content grid
│   ├── components.css        Buttons, badges, avatars, form controls, toast
│   ├── kanban.css            Board, columns, lead cards, empty states
│   ├── modal.css              Lead Detail Modal
│   └── responsive.css        Tablet, mobile, and reduced-motion rules
├── js/
│   ├── data.js               Fictional sample lead data and pipeline stages
│   ├── kanban.js             Board rendering and drag-and-drop
│   ├── modal.js               Lead Detail Modal logic
│   └── app.js                 Search, filtering, mobile nav, bootstrap
└── README.md
```

CSS is split by concern rather than by page, so any file can be updated without side effects on unrelated components. JavaScript is split the same way: data, board rendering, modal behavior, and app-level wiring each live in their own file and communicate through a small set of shared functions.

## How the three tasks were completed

**Task 1 — Initialize repository and front-end framework**
A clean vanilla HTML/CSS/JS project was set up with a clear folder structure, no unused files, and no placeholder content. Styles are organized into token, base, layout, component, and page-specific files. JavaScript is split by responsibility instead of living in one large script.

**Task 2 — Finalize wireframes for the Kanban View and Lead Detail Modal**
The board uses exactly three stages: Contacted, Meeting Booked, and Closed. Each column shows a live lead count and an empty state. Lead cards show name, company, owner with initials avatar, email, phone, source, priority badge, and last activity, with default, hover, focus, selected, and dragging states. Clicking a card opens the Lead Detail Modal, which shows every required field, supports Edit and Save, Cancel, and Delete, and closes on the close button, backdrop click, or Escape.

**Task 3 — Build static UI shell**
The header contains the DevLogix brand mark, page title, search, a notification icon, and a user profile chip. The sidebar lists Dashboard, Leads, Contacts, Activities, Reports, and Settings, with Leads marked as the active page. Items outside this task's scope are visual placeholders that show a short message on click rather than pretending to work. The main area holds the page title, a description, filter controls, and the Kanban board.

## Color system

Only the following colors are used for text anywhere in the application:

| Purpose | Hex |
|---|---|
| Primary text | `#2C3E50` |
| Secondary text | `#5F6B73` |
| Muted text | `#849099` |
| Text on dark surfaces | `#FFFFFF` |
| Links | `#187666` |
| Link hover | `#125B50` |

The primary UI accent, `#41BFAA`, is used for active navigation, primary actions, focus rings, and selected states. Backgrounds, borders, and shadows use a small set of light neutral tones that sit outside the text-color rule.

## Interactions implemented

- Live search by lead name or company
- Priority filter (All, High, Medium, Low)
- Drag-and-drop between the three pipeline columns
- Lead card click opens the detail modal
- Modal Edit / Save / Cancel / Delete, with a confirmation step before delete
- New lead creation from the toolbar
- Escape-to-close and backdrop-click-to-close on the modal, with focus trapping and focus return
- Responsive sidebar that becomes an off-canvas drawer on small screens
- Horizontal-scrolling Kanban board on mobile widths

## Testing performed

- Manual walkthrough of every interaction above in a desktop browser at 1440px, 1024px, 768px, and 375px widths
- Keyboard-only pass through search, filters, cards, and the modal, confirming visible focus states throughout
- `node --check` run against all four JavaScript files to confirm there are no syntax errors
- Manual review of every CSS file to confirm only the six approved hex values are used for text color

## Known limitations

- Data resets on page reload since there is no backend or storage layer, matching the frontend-only scope of this task
- Dashboard, Contacts, Activities, Reports, and Settings are intentionally inactive placeholders, as building them out was outside this subtask
