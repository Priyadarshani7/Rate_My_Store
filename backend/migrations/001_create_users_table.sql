-- Drop existing tables and types if they exist
DO $$ 
BEGIN
    -- Drop table if exists
    DROP TABLE IF EXISTS users;
    
    -- Drop type if exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        DROP TYPE user_role;
    END IF;
END $$;

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('system_administrator', 'normal_user', 'store_owner');

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'normal_user',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create initial admin user (password: admin123)
INSERT INTO users (email, password_hash, role, first_name, last_name)
VALUES (
    'admin@ratestore.com',
    '$2a$10$rQJJwGT6jqx1eCtWjX0wfOaXyqb5PgHIhqYQdnqXfJ1QRRkJGmq1.',
    'system_administrator',
    'Admin',
    'User'
); 