-- Run this FIRST as postgres superuser:
-- psql -U postgres
-- Then paste these commands:

--CREATE DATABASE bloodbank;
--CREATE USER blooduser WITH PASSWORD 'bloodpass123';
--GRANT ALL PRIVILEGES ON DATABASE bloodbank TO blooduser;

-- Then connect to bloodbank and run the rest:
-- \c bloodbank
-- GRANT ALL ON SCHEMA public TO blooduser;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('DONOR','CAMP_COORDINATOR','HOSPITAL_ADMIN','SUPER_ADMIN')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150),
    age INTEGER,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    phone VARCHAR(15),
    city VARCHAR(100),
    last_donation_date DATE,
    total_donations INTEGER DEFAULT 0,
    is_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS camps (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200),
    location VARCHAR(255),
    city VARCHAR(100),
    camp_date DATE,
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    coordinator_id BIGINT REFERENCES users(id),
    attendance_count INTEGER DEFAULT 0,
    units_collected DECIMAL(8,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blood_stock (
    id BIGSERIAL PRIMARY KEY,
    blood_group VARCHAR(5) NOT NULL UNIQUE,
    units_available DECIMAL(8,2) DEFAULT 0,
    critical_level DECIMAL(8,2) DEFAULT 10,
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
    id BIGSERIAL PRIMARY KEY,
    donor_id BIGINT REFERENCES donors(id),
    camp_id BIGINT REFERENCES camps(id),
    donation_date DATE,
    units_donated DECIMAL(5,2) DEFAULT 1,
    blood_group VARCHAR(5),
    status VARCHAR(20) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(200),
    entity VARCHAR(100),
    entity_id BIGINT,
    created_at TIMESTAMP DEFAULT NOW()
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO blooduser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO blooduser;

INSERT INTO blood_stock (blood_group, units_available, critical_level) VALUES
('A+',45,10),('A-',8,5),('B+',38,10),('B-',6,5),
('AB+',22,8),('AB-',3,3),('O+',60,15),('O-',11,5)
ON CONFLICT (blood_group) DO NOTHING;
