# DevLogix Client Portal — Frontend

> **Squad Lead:** Fatima Nadeem  
> **Squad:** BD CRM Client Portal Frontend Squad  
> **Company:** DevLogix Technologies  
> **Sprint:** Week 1 — Initialization, Architecture, Dashboard UI & API Integration  

---

## 📁 Directory Structure

```
client-portal/
├── index.html                  # Client Login Page (Main Entry Point)
├── dashboard.html              # Client Dashboard & Document Center
├── css/
│   ├── login.css               # Clean modular styles for Login Page
│   └── dashboard.css           # Clean modular styles for Dashboard & Modals
├── js/
│   ├── api/
│   │   ├── mock-api.js         # Centralized Backend API Layer (REST simulation)
│   │   └── auth-guard.js       # Authentication Guard & Session Management
│   ├── login.js                # Login Page Controller & Form Validation
│   └── dashboard.js            # Dashboard Controller, Stepper, Downloads & Signature
└── README.md                   # Project Documentation & Architecture Guide
```

---

## 🚀 Key Features Implemented

### 1. Client Authentication Workflow
- **Form Validation:** Real-time email validation, password security check, and interactive error styling.
- **Stateless Token Auth:** Generates dummy JWT tokens that persist seamlessly across sessions.
- **Auth Guard:** Prevents unauthorized direct access to `dashboard.html` without valid credentials.
- **Auto-Redirect:** Automatically redirects logged-in clients straight to their dashboard.

### 2. Live Timeline Endpoint Integration
- **Loading Skeleton:** Displays modern shimmer effects while live data is fetched.
- **Dynamic Calculation:** Automatically calculates percentage completion and step statuses (`completed`, `active`, `pending`).
- **Resilience:** Built-in error handling and a 1-click **Retry** button if network calls fail.

### 3. Invoice Download Functionality
- **File Generation:** Dynamically generates PDF blobs containing invoice items, client details, and totals.
- **Browser Download:** Automatically triggers direct browser file download (`.pdf`).
- **User Feedback:** Provides instant visual toast notifications during download preparation and completion.

### 4. Digital Agreement Signature
- **Interactive Signature Modal:** Clean modal with document metadata and legal confirmation.
- **Real-Time Signature Preview:** Interactive font preview as the user types their legal digital signature.
- **Payload Submission:** Dispatches signature payload to the backend endpoint and updates the document status to **`Signed`** with timestamp.

---

## 🧪 Test Credentials (Demo Mode)

| Field | Value |
|---|---|
| **Email** | `client@devlogix.com` |
| **Password** | `Welcome@123` |

---

## 🔌 API Endpoints Contract (Mock Layer)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticates user and returns JWT token & profile |
| `POST` | `/api/auth/logout` | Clears user session |
| `GET` | `/api/auth/me` | Retrieves authenticated user profile |
| `GET` | `/api/timeline/steps` | Retrieves onboarding milestone steps |
| `GET` | `/api/documents` | Retrieves list of invoices and agreements |
| `GET` | `/api/documents/invoices/:id/download` | Generates and downloads invoice PDF |
| `POST` | `/api/agreements/:id/sign` | Submits digital signature payload |

> **Backend Handover Note:** When the live PHP / REST backend is deployed, simply update `js/api/mock-api.js` to point to production endpoints using `fetch()`. No UI changes required.
