-- Barber Booking database initialization
-- Session must be UTF-8 before any string literals; otherwise the mysql client
-- treats this file as latin1 and Polish text is double-encoded in the database.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS barber_booking
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE barber_booking;

-- --------------------------------------------------------
-- SERVICES
-- --------------------------------------------------------
CREATE TABLE services (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  description     TEXT,
  duration_minutes SMALLINT UNSIGNED NOT NULL,
  price           DECIMAL(8,2) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- TIME SLOT TEMPLATES (recurring by day of week)
-- day_of_week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
-- --------------------------------------------------------
CREATE TABLE time_slots (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  day_of_week  TINYINT UNSIGNED NOT NULL COMMENT '0=Sun 1=Mon ... 6=Sat',
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- SLOT OVERRIDES (date-specific blocks or additions)
-- is_available=0 means blocked for that date
-- is_available=1 means an extra one-off slot added for that date
-- --------------------------------------------------------
CREATE TABLE slot_overrides (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  date         DATE NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  is_available TINYINT(1) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- BOOKINGS
-- UNIQUE KEY on (time_slot_id, booking_date) prevents double booking at DB level
-- --------------------------------------------------------
CREATE TABLE bookings (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id     INT UNSIGNED NOT NULL,
  time_slot_id   INT UNSIGNED NOT NULL,
  customer_name  VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  booking_date   DATE NOT NULL,
  status         ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_service  FOREIGN KEY (service_id)   REFERENCES services(id),
  CONSTRAINT fk_booking_slot     FOREIGN KEY (time_slot_id) REFERENCES time_slots(id),
  CONSTRAINT uq_slot_date        UNIQUE KEY (time_slot_id, booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- SEED: Services
-- --------------------------------------------------------
INSERT INTO services (name, description, duration_minutes, price) VALUES
  ('Strzyżenie',        'Klasyczne strzyżenie włosów',        30, 50.00),
  ('Strzyżenie brody',  'Formowanie i strzyżenie brody',      20, 35.00),
  ('Pakiet kompletny',  'Strzyżenie + formowanie brody',      50, 75.00),
  ('Golenie brzytwą',   'Tradycyjne golenie brzytwą',         30, 60.00);

-- --------------------------------------------------------
-- SEED: Time slots Mon–Sat 09:00–17:00 in 30-min increments
-- Lunch break: 12:00–13:00 intentionally excluded
-- day_of_week: 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
-- --------------------------------------------------------
INSERT INTO time_slots (day_of_week, start_time, end_time) VALUES
  -- Monday
  (1,'09:00','09:30'),(1,'09:30','10:00'),(1,'10:00','10:30'),(1,'10:30','11:00'),
  (1,'11:00','11:30'),(1,'11:30','12:00'),
  (1,'13:00','13:30'),(1,'13:30','14:00'),(1,'14:00','14:30'),(1,'14:30','15:00'),
  (1,'15:00','15:30'),(1,'15:30','16:00'),(1,'16:00','16:30'),(1,'16:30','17:00'),
  -- Tuesday
  (2,'09:00','09:30'),(2,'09:30','10:00'),(2,'10:00','10:30'),(2,'10:30','11:00'),
  (2,'11:00','11:30'),(2,'11:30','12:00'),
  (2,'13:00','13:30'),(2,'13:30','14:00'),(2,'14:00','14:30'),(2,'14:30','15:00'),
  (2,'15:00','15:30'),(2,'15:30','16:00'),(2,'16:00','16:30'),(2,'16:30','17:00'),
  -- Wednesday
  (3,'09:00','09:30'),(3,'09:30','10:00'),(3,'10:00','10:30'),(3,'10:30','11:00'),
  (3,'11:00','11:30'),(3,'11:30','12:00'),
  (3,'13:00','13:30'),(3,'13:30','14:00'),(3,'14:00','14:30'),(3,'14:30','15:00'),
  (3,'15:00','15:30'),(3,'15:30','16:00'),(3,'16:00','16:30'),(3,'16:30','17:00'),
  -- Thursday
  (4,'09:00','09:30'),(4,'09:30','10:00'),(4,'10:00','10:30'),(4,'10:30','11:00'),
  (4,'11:00','11:30'),(4,'11:30','12:00'),
  (4,'13:00','13:30'),(4,'13:30','14:00'),(4,'14:00','14:30'),(4,'14:30','15:00'),
  (4,'15:00','15:30'),(4,'15:30','16:00'),(4,'16:00','16:30'),(4,'16:30','17:00'),
  -- Friday
  (5,'09:00','09:30'),(5,'09:30','10:00'),(5,'10:00','10:30'),(5,'10:30','11:00'),
  (5,'11:00','11:30'),(5,'11:30','12:00'),
  (5,'13:00','13:30'),(5,'13:30','14:00'),(5,'14:00','14:30'),(5,'14:30','15:00'),
  (5,'15:00','15:30'),(5,'15:30','16:00'),(5,'16:00','16:30'),(5,'16:30','17:00'),
  -- Saturday
  (6,'09:00','09:30'),(6,'09:30','10:00'),(6,'10:00','10:30'),(6,'10:30','11:00'),
  (6,'11:00','11:30'),(6,'11:30','12:00'),
  (6,'13:00','13:30'),(6,'13:30','14:00'),(6,'14:00','14:30'),(6,'14:30','15:00'),
  (6,'15:00','15:30'),(6,'15:30','16:00'),(6,'16:00','16:30'),(6,'16:30','17:00');
