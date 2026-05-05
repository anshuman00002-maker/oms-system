# Order Management System (OMS) Frontend

This is the React frontend for the Order Management System. It provides a comprehensive dashboard for administrators and staff to manage orders, products, users, and view system reports.

## Tech Stack

*   **React 19:** Frontend framework
*   **React Router v7:** Client-side routing
*   **Axios:** HTTP client for API requests
*   **Create React App:** Project bootstrapping and build tooling
*   **Vanilla CSS:** Styling and layout

## Project Structure

```text
src/
├── api/          # Axios instances and API configurations
├── components/   # Reusable UI components (Header, Sidebar, Toast, etc.)
├── pages/        # Route components (Dashboard, Login, Orders, Products, etc.)
├── services/     # Business logic and external service integrations
├── styles/       # Global CSS stylesheets
├── App.js        # Main application component and routing configuration
└── index.js      # Entry point
```

## Step-by-Step Setup & Implementation Guide

Follow these steps to set up the project locally and understand the core implementation flow.

### Step 1: Prerequisites

Ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/) (v16.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Step 2: Installation

Clone the repository and navigate to the project directory:

```bash
cd "oms-system/oms/oms"
npm install
```

This will install all the necessary dependencies defined in `package.json`, including React, React Router, and Axios.

### Step 3: Environment Configuration

The application communicates with a backend API (e.g., Spring Boot). You may need to configure the API base URL.
Check the `src/api` or `src/services` folder (e.g., `AuthService.js`) to ensure it points to the correct backend endpoint (usually `http://localhost:8080` for local development).

### Step 4: Running the Application Locally

To start the development server, run:

```bash
npm start
```

*   The app will compile and launch in your default browser.
*   By default, it runs on [http://localhost:3000](http://localhost:3000).
*   The page will automatically reload if you make edits to the source code.

### Step 5: Understanding Core Implementation Features

As you develop or review the code, take note of the following implemented features:

1.  **Authentication & Authorization (`AuthService.js`, `Login.js`, `Register.js`):**
    *   Handles user login and token management (likely JWT).
    *   `PrivateRoute.js` and `RoleRoute.js` protect routes from unauthorized access based on user roles.

2.  **Navigation & Layout (`Sidebar.js`, `Header.js`):**
    *   Provides the main shell of the application, allowing users to navigate between different modules.

3.  **Data Management Pages:**
    *   **`Dashboard.js`**: Displays high-level metrics and summaries.
    *   **`OrderEnquiry.js`**: Interface for searching, viewing, and managing customer orders.
    *   **`Products.js`**: Interface for managing the inventory and product catalog.
    *   **`Users.js`**: Admin interface for managing system users and roles.
    *   **`Reports.js`**: Generates and displays business and sales reports.

### Step 6: Testing

To run the interactive test watcher:

```bash
npm test
```

### Step 7: Building for Production

When you are ready to deploy the application, run:

```bash
npm run build
```

*   This command builds the app for production to the `build` folder.
*   It bundles React in production mode and optimizes the build for the best performance.
*   The build is minified and the filenames include the hashes.

## Deployment

The generated `build/` folder contains static assets that can be hosted on any static file server or cloud provider (e.g., Vercel, Netlify, AWS S3, Nginx).

