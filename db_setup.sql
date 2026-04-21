CREATE DATABASE IF NOT EXISTS mess_attendance;
USE mess_attendance;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  hostel_room VARCHAR(50),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  meal_type ENUM('Breakfast', 'Lunch', 'Dinner') NOT NULL,
  status ENUM('Present', 'Absent') NOT NULL,
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (student_id, date, meal_type)
);

-- Insert sample students
INSERT INTO students (name, roll_number, hostel_room, phone) VALUES
('John Doe', 'CS2023001', 'A-101', '1234567890'),
('Jane Smith', 'CS2023002', 'B-205', '0987654321'),
('Alice Johnson', 'EE2023015', 'A-102', '5551234567'),
('Bob Williams', 'ME2023042', 'C-301', '5559876543'),
('Charlie Brown', 'CE2023011', 'B-206', '5554443333')
ON DUPLICATE KEY UPDATE name=VALUES(name);
