# FinanceApp (Personal Finance Tracker)

A full-stack web application for managing personal finances.  
Users can register/login, track income and expenses, categorize transactions, view summaries and visualizations (pie chart), and export their transaction history to PDF. A responsive design with light/dark theme support ensures usability across devices.

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structures)
- [Usage](#usage)

## 🧩 Features
- #### User Authentication
  - Register and login with email/password (JWT-based).
  - Password strength enforcement (min 8 chars, uppercase, lowercase, digit, special).
- #### Transaction Management
  - Add income or expense transactions.
  - Only expenses require a category.
  - Edit and delete transactions.
  - Filter and search by date range, type, and category.
- #### Category Management
  - Create, update, and delete expense categories (with optional monthly budget).
  - Prevent duplicate category names per user.
- #### Dashboard and Summaries
  - Displays total income, total expense, and current balance.
  - Responsive table showing all transactions.
- #### Visual Reports
  - Monthly expenses breakdown pie chart by category.
  - Percentages displayed inside chart slices.
  - Custom legend beneath the chart.
- #### Export to PDF
  - Download current (filtered) transaction list as a styled PDF table (jsPDF + AutoTable).
- #### Responsive Design & Theming
  - Mobile-friendly layout.
  - Light/Dark mode toggle (CSS variables).
  - Clean, modern UI using CSS custom properties.

## 🛠 Tech Stack
- #### Backend
  - Node.js, Express
  - MongoDB (Mongoose ORM)
  - JSON Web Tokens (JWT) for authentication
  - Bcrypt for password hashing
- #### Frontend
  - React (Create React App)
  - React Router v6
  - Axios for API calls
  - Recharts for pie chart
  - jsPDF & jspdf-autotable for PDF export
  - CSS3 (with custom variables for theming)

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js ≥ 14 LTS
- npm (or Yarn)
- MongoDB (running locally or a cloud URI)

Clone the repository and follow the steps below:

```bash
git clone https://github.com/sania2000/finance-tracker
cd finance-tracker
