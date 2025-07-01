# FinanceApp (Personal Finance Tracker)

A full-stack web application for managing personal finances.
Users can register/login, track income and expenses, categorize transactions, view summaries and visualizations (pie chart), and export transactions history to PDF. A responsive design with light/dark theme support ensures usability across devices.

## 📚 Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Backend Setup](#backend-setup)
  * [Frontend Setup](#frontend-setup)
  * [Environment Variables](#environment-variables)
* [Folder Structure](#folder-structures)
* [Usage](#usage)

## 🧩 Features

* #### User Authentication

  * Register and login with email/password (JWT-based).
  * Password strength enforcement ( min 8 chars, uppercase, lowercase, digit, special).
* #### Transaction Management

  * Add income or expense transactions.
  * Only expenses require a category.
  * Edit and delete transactiosn.
  * Filter and search by date range, type, and category.
* #### Category Management

  * create, update, and delete expense categories ( with optional monthly budget).
  * Prevent duplicate category names per user.
* #### Dashboard and Summaries

  * Displays total income, total expense, and current balance.
  * Responsive table showing all transactions.
* #### Visiual Reports

  * Monthly expences breakdown pie chart by category.
  * Percentages displayed inside chart slices.
  * Custom legend beneath the chart.
* #### Export to PDF

  * Download current (filtered) transaction list as a styled PDF table (jsPDF + AutoTable).
* #### Responsive Design & Theming

  * Mobile-friendely layout.
  * Light/Dark mode toggle (CSS variables).
  * Clean, modern UI using CSS customm properties.

## 🛠 Tech Stack

* #### Backend

  * Node.js, Express
  * MongoDB (Mongoose ORM)
  * JSON Web Tokens (JWT) for Authentication
  * Bcrypt for password hashing
* #### Frontend

  * React (Create React App)
  * React Router v6
  * Axios for API calls
  * Recharts for pie chart
  * jsPDF & jspdf-autotable for PDF export
  * CSS3 (with custom variables for theming)

## 🚀 Getting Started

### 📦 Prerequisites

* Node.js >= 14 LTS
* npm (or Yarn)
* MongoDB (running locally or a cload URI)

Clone the repository and follow the steps below:

```bash
git clone https://github.com/sania2000/finance-tracker
cd finance-tracker
```

### 🧪 Backend Setup

1. Navigate to the backend/ directory

```bash
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file in backend/ with these variables (see [Environment Variables](#environment-variables) below). For example:

```bash
MONGODB_URI=mongodb://localhost:27017/finance
JWT_SECRET=your_jwt_secret_here
```

4. Start the server:

```bash
npm start
```

The backend runs on port 5000 by default.
You should see:

```
MongoDB connected
Server running on port 5000
```

### 🎨 Frontend Setup

1. In a new terminal, navigate to the frontend/ folder:

```bash
cd ../frontend
```

2. Install dependencies

```bash
npm install
```

3. Create .env file in frontend/ with:

```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the React development server:

```bash
npm start
```

The default runs on [http://localhost:3000/](http://localhost:3000/) by default.

### 🔐 Environment Variables

#### Backend (backend/.env)

```env
MONGODB_URI= #Your_database_library_URI
JWT_SECRET= #Any_strong_random_string
```

## 🗂 Folder Structures

```
finance-tracker/
├── backend/
│   ├── middleware/
│   │   └── authmiddleware.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── transactions.js
│   │   └── reports.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── logo.svg
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryPieChart.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── AddTransaction.js
│   │   │   ├── Categories.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── .env
├── .gitignore
├── README.md
└── package.json
```

## 🧪 Usage

1. #### Register a new user or Login if you already have an account.
2. #### On the dashboard you'll see:

* Total income, Total expense, and Balance cards.
* A transaction table with columns (Date, Type, Category, Amount, Description, Actions).
* Filter button to expand filters (by category, type, date range).
* "Export as PDF" button to download the current table view.
* "Add Transaction: and "Manage Categories" links.

3. #### Add Transaction:

* Enter amount, select "Income" or "Expense".
* If "Expense", choose a category.
* Pick date and optional description.
* Click "Save" to add it.

4. #### Manage Categories:

* Add new categories with an optional monthly budget.
* Edit or delete existing categories.

5. #### Pie Chart (Reports):

* Select a month (YYY-MM)
* View a donut chart of expense distribution by category for the month.
* Hover on slices to see exact totals; percentages are displayed on each slice.

6. #### Toggle Theme:

* Click the moon/sun icon in the NavBar to switch ligh and dark modes.

7. #### Export PDF:

* On the Dashboard, click Export as PDF to download a formatted PDF currently visible.
