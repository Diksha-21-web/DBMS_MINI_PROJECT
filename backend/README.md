# Mess Attendance System - Backend

This is the Node.js/Express backend for the Mess Attendance System.

## Prerequisites

- Node.js (v18+)
- MySQL Server running locally on your PC

## Setup Instructions

1. **Database Setup**
   Run the `db_setup.sql` script located in the root of the project to create the `mess_attendance` database, tables, and sample data.
   You can run this using a MySQL client (like MySQL Workbench, phpMyAdmin, or CLI):
   ```bash
   mysql -u root -p < ../db_setup.sql
   ```

2. **Environment Variables**
   Ensure your `.env` file is properly configured. If not, edit the `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=mess_attendance
   PORT=5000
   ```
   *(Make sure to change `yourpassword` to your actual MySQL root password)*

3. **Install Dependencies**
   Run the following command to install required npm packages:
   ```bash
   npm install
   ```

4. **Start the Server**
   Start the development server:
   ```bash
   npm run dev
   ```
   Or start normally:
   ```bash
   npm start
   ```

The backend API will run on `http://localhost:5000`.
