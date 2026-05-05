# Order Management & E-commerce System

This repository contains the complete source code for a full-stack E-commerce platform and its accompanying Order Management System (OMS). The system is designed to provide a seamless shopping experience for customers while giving administrators a powerful tool to manage inventory, process orders, and view system analytics.

## System Architecture

This project is divided into three main components:

1.  **Backend API (`oms-system/order_management`)**: A robust Spring Boot application serving as the central nervous system. It handles database operations, business logic, authentication, and exposes RESTful APIs for both frontends.
2.  **OMS Admin Dashboard (`oms-system/oms`)**: A React-based frontend application for staff and administrators. It provides interfaces for managing the product catalog, viewing customer orders, and monitoring system reports.
3.  **E-commerce Storefront (`ecommerce-shop`)**: A React-based frontend application for customers. It provides the public-facing shop where users can browse products, manage their cart, and place orders.

---

## Directory Structure

```text
order management/
├── ecommerce-shop/             # React E-commerce Frontend
├── oms-system/
│   ├── oms/                    # React Admin/OMS Frontend
│   └── order_management/       # Spring Boot Backend API
```

---

## Step-by-Step Setup Guide

Follow these steps to get the entire system running on your local machine.

### Prerequisites

Ensure you have the following installed on your system:
*   [Java Development Kit (JDK) 17+](https://adoptium.net/) (for the backend)
*   [Maven](https://maven.apache.org/) (for building the backend, though the `mvnw` wrapper is included)
*   [Node.js](https://nodejs.org/) (v16+ recommended, for the frontends)
*   A Database (e.g., MySQL, PostgreSQL) running locally as configured in the Spring Boot `application.properties`.

### Step 1: Start the Backend (Spring Boot)

The backend must be running before the frontends can successfully fetch data.

1.  Navigate to the backend directory:
    ```bash
    cd "oms-system/order_management"
    ```
2.  Configure your database credentials in `src/main/resources/application.properties` (or `application.yml`).
3.  Run the application using Maven:
    ```bash
    ./mvnw spring-boot:run
    ```
    *(On Windows, use `mvnw.cmd spring-boot:run`)*
4.  The backend API should now be running on `http://localhost:8080`.

### Step 2: Start the E-commerce Storefront (React)

Open a **new terminal window** and start the customer-facing frontend.

1.  Navigate to the e-commerce directory:
    ```bash
    cd ecommerce-shop
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  The storefront will automatically open in your browser, typically at `http://localhost:3000` (or `3001` if `3000` is in use).

### Step 3: Start the OMS Admin Dashboard (React)

Open a **third terminal window** to start the admin frontend.

1.  Navigate to the OMS frontend directory:
    ```bash
    cd "oms-system/oms"
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  The admin dashboard will open in your browser. If you already have the e-commerce site running on port `3000`, you will be prompted to run this app on another port (e.g., `http://localhost:3001` or `3002`). Accept the prompt.

---

## Deployment Configuration

When moving to a production environment (like AWS, Vercel, or Heroku):

*   **Backend**: Build the Spring Boot `.jar` file using `./mvnw clean package` and deploy it to a Java hosting environment. Ensure you update CORS settings to allow requests from your production frontend domains.
*   **Frontends**: For both `ecommerce-shop` and `oms-system/oms`, run `npm run build` to generate static assets. Deploy the resulting `build/` folders to a static hosting provider (e.g., Vercel, Netlify).
*   **Environment Variables**: Update the API base URLs in your React applications (usually via `.env` files) to point to your live backend domain instead of `localhost`.
