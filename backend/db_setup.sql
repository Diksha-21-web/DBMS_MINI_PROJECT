CREATE DATABASE IF NOT EXISTS mess_attendance;
USE mess_attendance;

DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS meal_booking;
DROP TABLE IF EXISTS meal_option;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS student;

CREATE TABLE student (
  Stud_id INT PRIMARY KEY AUTO_INCREMENT,
  F_name VARCHAR(50) NOT NULL,
  M_name VARCHAR(50),
  L_name VARCHAR(50) NOT NULL,
  DOB DATE NOT NULL,
  Gender ENUM('Male','Female','Other') NOT NULL,
  Contact_no VARCHAR(15) NOT NULL,
  Mail_id VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL
);

CREATE TABLE admin (
  Admin_id INT PRIMARY KEY AUTO_INCREMENT,
  F_name VARCHAR(50) NOT NULL,
  M_name VARCHAR(50),
  L_name VARCHAR(50) NOT NULL,
  Mail_id VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Contact_no VARCHAR(15) NOT NULL
);

CREATE TABLE meal_option (
  MealOption_id INT PRIMARY KEY AUTO_INCREMENT,
  Meal_Type ENUM('Breakfast','Lunch','Dinner') NOT NULL,
  Price DECIMAL(8,2) NOT NULL,
  Availability_Status ENUM('Available','Unavailable') DEFAULT 'Available'
);

CREATE TABLE meal_booking (
  Booking_id INT PRIMARY KEY AUTO_INCREMENT,
  Stud_id INT NOT NULL,
  MealOption_id INT NOT NULL,
  Booking_date DATE NOT NULL,
  Booking_time TIME NOT NULL,
  Confirmation ENUM('Confirmed','Pending','Cancelled') DEFAULT 'Pending',
  FOREIGN KEY (Stud_id) REFERENCES student(Stud_id) ON DELETE CASCADE,
  FOREIGN KEY (MealOption_id) REFERENCES meal_option(MealOption_id) ON DELETE CASCADE
);

CREATE TABLE payment (
  Payment_id INT PRIMARY KEY AUTO_INCREMENT,
  Stud_id INT NOT NULL,
  Booking_id INT NOT NULL,
  Amount DECIMAL(10,2) NOT NULL,
  Pay_date DATE NOT NULL,
  Pay_method ENUM('Cash','UPI','Card','Online') NOT NULL,
  Status ENUM('Paid','Pending','Failed') DEFAULT 'Pending',
  FOREIGN KEY (Stud_id) REFERENCES student(Stud_id) ON DELETE CASCADE,
  FOREIGN KEY (Booking_id) REFERENCES meal_booking(Booking_id) ON DELETE CASCADE
);

-- Insert 5 sample rows into student
INSERT INTO student (F_name, M_name, L_name, DOB, Gender, Contact_no, Mail_id, Password) VALUES
('John', 'A', 'Doe', '2000-01-15', 'Male', '1234567890', 'john@example.com', 'hashedpwd1'),
('Jane', NULL, 'Smith', '2001-05-20', 'Female', '0987654321', 'jane@example.com', 'hashedpwd2'),
('Michael', 'B', 'Johnson', '1999-11-10', 'Male', '1122334455', 'michael@example.com', 'hashedpwd3'),
('Emily', 'C', 'Davis', '2002-03-08', 'Female', '2233445566', 'emily@example.com', 'hashedpwd4'),
('Chris', NULL, 'Wilson', '2000-07-25', 'Male', '3344556677', 'chris@example.com', 'hashedpwd5');

-- Insert 5 sample rows into admin
INSERT INTO admin (F_name, M_name, L_name, Mail_id, Password, Contact_no) VALUES
('Alice', 'M', 'Brown', 'admin1@mess.com', 'adminpwd1', '9988776655'),
('Bob', NULL, 'White', 'admin2@mess.com', 'adminpwd2', '8877665544'),
('Charlie', 'P', 'Green', 'admin3@mess.com', 'adminpwd3', '7766554433'),
('Diana', NULL, 'Black', 'admin4@mess.com', 'adminpwd4', '6655443322'),
('Eve', 'S', 'Adams', 'admin5@mess.com', 'adminpwd5', '5544332211');

-- Insert 5 sample rows into meal_option
INSERT INTO meal_option (Meal_Type, Price, Availability_Status) VALUES
('Breakfast', 50.00, 'Available'),
('Lunch', 100.00, 'Available'),
('Dinner', 120.00, 'Available'),
('Breakfast', 60.00, 'Unavailable'),
('Lunch', 150.00, 'Available');

-- Insert 5 sample rows into meal_booking
INSERT INTO meal_booking (Stud_id, MealOption_id, Booking_date, Booking_time, Confirmation) VALUES
(1, 1, CURDATE(), '08:00:00', 'Confirmed'),
(2, 2, CURDATE(), '13:00:00', 'Confirmed'),
(3, 3, CURDATE(), '20:00:00', 'Pending'),
(4, 1, CURDATE() + INTERVAL 1 DAY, '08:30:00', 'Confirmed'),
(5, 5, CURDATE() + INTERVAL 1 DAY, '12:30:00', 'Cancelled');

-- Insert 5 sample rows into payment
INSERT INTO payment (Stud_id, Booking_id, Amount, Pay_date, Pay_method, Status) VALUES
(1, 1, 50.00, CURDATE(), 'UPI', 'Paid'),
(2, 2, 100.00, CURDATE(), 'Card', 'Paid'),
(3, 3, 120.00, CURDATE(), 'Cash', 'Pending'),
(4, 4, 50.00, CURDATE() + INTERVAL 1 DAY, 'Online', 'Paid'),
(5, 5, 150.00, CURDATE() + INTERVAL 1 DAY, 'UPI', 'Failed');
