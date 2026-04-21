# 🍽️ Smart Mess Attendance System

## 📌 Overview

The **Smart Mess Attendance System** is a full-stack web application designed to manage student meal bookings, attendance, and payments in a hostel mess.
It eliminates manual tracking and provides a structured, database-driven solution for administrators and students.

---

## 🎯 Key Features

* 👤 Student Registration & Login (JWT-based authentication)
* 🛠️ Admin Login & Management Panel
* 🍛 Meal Options Management (Breakfast, Lunch, Dinner)
* 📅 Meal Booking System with confirmation status
* 💳 Payment Tracking (Cash, UPI, Card, Net Banking)
* 📊 Reports Dashboard (student-wise & date-wise)
* 🔒 Secure Password Storage using bcrypt
* 🚫 Prevent Duplicate Bookings using constraints

---

## 🏗️ Tech Stack

### 🔹 Frontend

* React (Vite)
* React Router v6
* Axios
* CSS

### 🔹 Backend

* Node.js
* Express.js
* MySQL (mysql2)
* bcryptjs
* dotenv
* CORS

### 🔹 Database

* MySQL (Relational DBMS)

---

## 🗄️ Database Schema

### Tables:

* **Student**
* **Admin**
* **Meal_Option**
* **Meal_Booking**
* **Payment**

### 🔗 Relationships:

* One Student → Many Bookings
* One Booking → One Payment
* Admin manages bookings
* Meal_Option linked to bookings

---

## 📂 Project Structure

```
mess-attendance/
│
├── backend/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── App.jsx
│   └── main.jsx
│
├── database/
│   └── db_setup.sql
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 1. Clone Repository

```bash
git clone https://github.com/Diksha-21-web/DBMS_MINI_PROJECT.git
cd mess-attendance
```

---

### 🔹 2. Setup Database

* Open MySQL
* Create database:

```sql
CREATE DATABASE mess_attendance;
```

* Import `db_setup.sql`

---

### 🔹 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

---

### 🔹 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

### 👤 Students

* `GET /api/students`
* `POST /api/students`
* `PUT /api/students/:id`
* `DELETE /api/students/:id`
* `POST /api/students/login`

### 🛠️ Admin

* `POST /api/admin/login`

### 🍛 Meal Options

* `GET /api/meal-options`
* `POST /api/meal-options`
* `PUT /api/meal-options/:id`
* `DELETE /api/meal-options/:id`

### 📅 Bookings

* `GET /api/bookings`
* `POST /api/bookings`
* `GET /api/bookings/student/:id`
* `PUT /api/bookings/:id`
* `DELETE /api/bookings/:id`

### 💳 Payments

* `GET /api/payments`
* `POST /api/payments`
* `GET /api/payments/student/:id`
* `PUT /api/payments/:id`
* `GET /api/payments/summary`

---

## 📊 Sample Data Included

* 1 Admin
* 5 Students
* 3 Meal Options
* 5 Bookings
* 5 Payments

---

## 🔐 Security Features

* Password hashing using bcrypt
* Input validation
* Controlled API access
* CORS restricted to frontend

---

## 🚀 Future Enhancements

* QR-based attendance scanning
* Mobile app integration
* Payment gateway integration
* Real-time notifications

---

## 👩‍💻 Author

**Diksha Dhakne**
GitHub: https://github.com/Diksha-21-web

---

## ⭐ Contribution

Feel free to fork, improve, and contribute to this project.

---
