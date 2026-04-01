-- Connect to the database
--\c bloodbank;

-- USERS table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('DONOR','CAMP_COORDINATOR','HOSPITAL_ADMIN','SUPER_ADMIN')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- DONORS table
CREATE TABLE donors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 65),
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    phone VARCHAR(15),
    city VARCHAR(100),
    last_donation_date DATE,
    total_donations INTEGER DEFAULT 0,
    is_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CAMPS table
CREATE TABLE camps (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    camp_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    coordinator_id BIGINT REFERENCES users(id),
    attendance_count INTEGER DEFAULT 0,
    units_collected DECIMAL(8,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT NOW()
);

-- BLOOD STOCK table
CREATE TABLE blood_stock (
    id BIGSERIAL PRIMARY KEY,
    blood_group VARCHAR(5) NOT NULL UNIQUE,
    units_available DECIMAL(8,2) DEFAULT 0,
    critical_level DECIMAL(8,2) DEFAULT 10,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- DONATIONS table
CREATE TABLE donations (
    id BIGSERIAL PRIMARY KEY,
    donor_id BIGINT REFERENCES donors(id),
    camp_id BIGINT REFERENCES camps(id),
    donation_date DATE NOT NULL,
    units_donated DECIMAL(5,2) DEFAULT 1,
    blood_group VARCHAR(5),
    status VARCHAR(20) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT NOW()
);

-- PREDICTIONS table (stores ML results)
CREATE TABLE predictions (
    id BIGSERIAL PRIMARY KEY,
    prediction_type VARCHAR(50),
    input_data TEXT,
    output_data TEXT,
    confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT NOW()
);

-- AUDIT LOGS table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(200),
    entity VARCHAR(100),
    entity_id BIGINT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Initialize blood stock for all 8 blood groups
INSERT INTO blood_stock (blood_group, units_available, critical_level) VALUES
('A+', 45, 10), ('A-', 12, 5), ('B+', 38, 10), ('B-', 8, 5),
('AB+', 22, 8), ('AB-', 5, 3), ('O+', 60, 15), ('O-', 14, 5);