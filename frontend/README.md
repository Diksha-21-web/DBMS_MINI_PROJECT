# Mess Attendance System - Frontend

This is the React (Vite) frontend for the Mess Attendance System.

## Prerequisites

- Node.js (v18+)
- The Backend server should be running on `http://localhost:5000`

## Setup Instructions

1. **Install Dependencies**
   Run the following command to install required npm packages:
   ```bash
   npm install
   ```
   *(This installs `react`, `react-dom`, `react-router-dom`, `axios`, `lucide-react`, and `react-hot-toast`)*

2. **Start the Development Server**
   Start the Vite dev server:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   Open your browser and navigate to:
   `http://localhost:5173`

## Features

- **Dynamic Aesthetic Design:** Dark mode by default, built with pure CSS modules (using inline classes for consistency) without heavy CSS frameworks.
- **Dashboard:** View overall summary, attendance progress, and status per meal.
- **Student Management:** Full CRUD (Create, Read, Update, Delete) functionality for students.
- **Mark Attendance:** Efficiently mark presence/absence for an entire list at once.
- **Attendance Reports:** Searchable student list showing detailed attendance history.
