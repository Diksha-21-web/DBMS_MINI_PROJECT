I am building a Mess Attendance System. Below is the exact database schema 
from my ER diagram. Create all MySQL tables EXACTLY as described, then build 
the full-stack project (React frontend + Node.js/Express backend).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE NAME: mess_attendance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- TABLE 1: Student
CREATE TABLE Student (
  Stud_id      INT AUTO_INCREMENT PRIMARY KEY,
  F_name       VARCHAR(50) NOT NULL,
  M_name       VARCHAR(50),
  L_name       VARCHAR(50) NOT NULL,
  DOB          DATE NOT NULL,
  Gender       ENUM('Male','Female','Other') NOT NULL,
  Contact_no   VARCHAR(15) NOT NULL,
  Mail_id      VARCHAR(100) NOT NULL UNIQUE,
  Password     VARCHAR(255) NOT NULL
);

-- TABLE 2: Admin
CREATE TABLE Admin (
  Admin_id     INT AUTO_INCREMENT PRIMARY KEY,
  F_name       VARCHAR(50) NOT NULL,
  M_name       VARCHAR(50),
  L_name       VARCHAR(50) NOT NULL,
  Mail_id      VARCHAR(100) NOT NULL UNIQUE,
  Password     VARCHAR(255) NOT NULL,
  Contact_no   VARCHAR(15) NOT NULL
);

-- TABLE 3: Meal_Option
CREATE TABLE Meal_Option (
  MealOption_id       INT AUTO_INCREMENT PRIMARY KEY,
  Meal_Type           ENUM('Breakfast','Lunch','Dinner') NOT NULL,
  Price               DECIMAL(8,2) NOT NULL,
  Availability_Status ENUM('Available','Unavailable') NOT NULL DEFAULT 'Available'
);

-- TABLE 4: Meal_Booking
CREATE TABLE Meal_Booking (
  Booking_id      INT AUTO_INCREMENT PRIMARY KEY,
  Stud_id         INT NOT NULL,
  MealOption_id   INT NOT NULL,
  Admin_id        INT NOT NULL,
  Booking_date    DATE NOT NULL,
  Booking_time    TIME NOT NULL,
  Confirmation    ENUM('Confirmed','Pending','Cancelled') NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (Stud_id)       REFERENCES Student(Stud_id) ON DELETE CASCADE,
  FOREIGN KEY (MealOption_id) REFERENCES Meal_Option(MealOption_id) ON DELETE CASCADE,
  FOREIGN KEY (Admin_id)      REFERENCES Admin(Admin_id) ON DELETE CASCADE
);

-- TABLE 5: Payment
CREATE TABLE Payment (
  Payment_id   INT AUTO_INCREMENT PRIMARY KEY,
  Booking_id   INT NOT NULL,
  Stud_id      INT NOT NULL,
  Amount       DECIMAL(10,2) NOT NULL,
  Pay_date     DATE NOT NULL,
  Pay_method   ENUM('Cash','UPI','Card','NetBanking') NOT NULL,
  Status       ENUM('Paid','Unpaid','Refunded') NOT NULL DEFAULT 'Unpaid',
  FOREIGN KEY (Booking_id) REFERENCES Meal_Booking(Booking_id) ON DELETE CASCADE,
  FOREIGN KEY (Stud_id)    REFERENCES Student(Stud_id) ON DELETE CASCADE
);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAMPLE DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 1 Admin record
- 3 Meal_Option records (Breakfast ₹50, Lunch ₹80, Dinner ₹70)
- 5 Student records
- 5 Meal_Booking records (mix of Confirmed/Pending)
- 5 Payment records (mix of Paid/Unpaid)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKEND (Node.js + Express + mysql2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Separate files in routes/ folder. Use connection pool. Credentials in .env.

API endpoints:
STUDENTS:   GET/POST /api/students | PUT/DELETE /api/students/:id | POST /api/students/login
ADMIN:      POST /api/admin/login
MEAL OPTIONS: GET/POST /api/meal-options | PUT/DELETE /api/meal-options/:id
BOOKINGS:   GET/POST /api/bookings | GET /api/bookings/student/:id | PUT/DELETE /api/bookings/:id
PAYMENTS:   GET/POST /api/payments | GET /api/payments/student/:id | PUT /api/payments/:id | GET /api/payments/summary

Rules: bcryptjs for passwords, try/catch on every DB call, CORS allow http://localhost:5173,
return { success, data, message } JSON always.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRONTEND (React + Vite + React Router v6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pages: Login (tabbed student/admin), Dashboard (summary cards), Students, 
Meal Options, Bookings, Payments, Reports (filter by student/date).
All API calls through src/api/axios.js (baseURL = http://localhost:5000/api).
Loading spinners + toast notifications on all actions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT ORDER (each file with full path as heading):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. db_setup.sql
2. backend/.env.example
3. backend/package.json
4. backend/server.js
5. backend/db.js
6. backend/routes/students.js
7. backend/routes/admin.js
8. backend/routes/mealOptions.js
9. backend/routes/bookings.js
10. backend/routes/payments.js
11. frontend/package.json
12. frontend/vite.config.js
13. frontend/src/api/axios.js
14. frontend/src/App.jsx
15. frontend/src/main.jsx
16. All frontend components

Every file must be 100% complete. No placeholder comments. No truncation.
