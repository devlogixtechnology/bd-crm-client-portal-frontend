# Devlogics CRM - Kanban Board

## Subtask 3: Backend API Integration

This project contains the Vanilla HTML/CSS/JS frontend of the CRM Kanban board, integrated with a custom Node.js Express mock backend to fulfill the requirements of Subtask 3.

### 🔐 Test Credentials (Login Information)
To evaluate the application and test the Kanban board, please use the following credentials on the login screen:
- **Username:** `admin`
- **Password:** `admin`

### 🚀 How to Run the Project Locally
1. Make sure you have [Node.js](https://nodejs.org/) installed on your system.
2. Open your terminal in the extracted project folder.
3. Install the required backend dependencies by running:
   ```bash
   npm install
   ```
4. Start the server by running:
   ```bash
   npm run dev
   ```
   *(Alternatively, you can run `npm start`)*
5. Open your web browser and navigate to: `http://localhost:8080`

### 🛠️ What Was Implemented (Architecture & Features)
- **Mock Backend (`server.js`)**: A Node.js and Express server was created to serve the static frontend files and act as the REST API.
- **Authentication (`POST /api/auth/login`)**: Validates the user's credentials and returns a mock JWT token. The frontend intercepts unauthorized access and redirects users back to the login screen.
- **Data Fetching (`GET /api/leads`)**: The Kanban board no longer uses hardcoded arrays. It fetches the leads dynamically from the backend using the native `fetch` API, featuring a simulated network delay and a "Loading leads from API..." state.
- **Stage Updating (`PATCH /api/leads/:id/stage`)**: When a lead card is dragged and dropped into a new column, the frontend asynchronously updates the backend to keep data synced.
- **Token Management**: The frontend securely stores the mock auth token in `localStorage` and attaches it to the `Authorization: Bearer` header for all protected API calls.
