-- =====================================================================
-- Database Schema for AI-Powered Company Information Assistant
-- Engine: MySQL 8.0+ / MariaDB 10.5+
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS company_assistant_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE company_assistant_db;

-- 1. COMPANY PROFILE TABLE
DROP TABLE IF EXISTS company_profile;
CREATE TABLE company_profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    legal_name VARCHAR(200) NOT NULL,
    tagline VARCHAR(255) DEFAULT NULL,
    founding_year INT NOT NULL,
    industry VARCHAR(100) NOT NULL,
    headquarters_address TEXT NOT NULL,
    secondary_office_address TEXT DEFAULT NULL,
    official_email VARCHAR(150) NOT NULL,
    official_phone VARCHAR(50) NOT NULL,
    support_phone VARCHAR(50) DEFAULT NULL,
    working_hours VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'PST (UTC-8)',
    website VARCHAR(255) NOT NULL,
    mission TEXT NOT NULL,
    vision TEXT NOT NULL,
    overview TEXT NOT NULL,
    social_links_json JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. DEPARTMENTS TABLE
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    head_of_department VARCHAR(100) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    floor_location VARCHAR(100) NOT NULL,
    operating_hours VARCHAR(150) DEFAULT 'Mon-Fri 09:00 - 18:00 PST',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dept_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. USERS TABLE (Authentication & Role Based Access Control)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee', 'user') NOT NULL DEFAULT 'user',
    department_id INT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. EMPLOYEES TABLE (Directory with Public vs Confidential Fields)
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role_title VARCHAR(120) NOT NULL,
    official_email VARCHAR(150) NOT NULL UNIQUE,
    public_phone VARCHAR(50) DEFAULT NULL,
    internal_extension VARCHAR(20) DEFAULT NULL, -- Confidential: only authorized users can see
    office_location VARCHAR(100) NOT NULL,
    bio TEXT DEFAULT NULL,
    is_leadership BOOLEAN NOT NULL DEFAULT FALSE,
    is_confidential BOOLEAN NOT NULL DEFAULT FALSE, -- Confidential personnel records
    joined_date DATE NOT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    INDEX idx_emp_dept (department_id),
    INDEX idx_emp_name (full_name),
    INDEX idx_emp_leadership (is_leadership)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PRODUCTS TABLE
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    features_json JSON NOT NULL,
    pricing_tier VARCHAR(100) NOT NULL,
    target_audience VARCHAR(200) NOT NULL,
    status ENUM('active', 'upcoming', 'deprecated') NOT NULL DEFAULT 'active',
    documentation_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_prod_category (category),
    INDEX idx_prod_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SERVICES TABLE
DROP TABLE IF EXISTS services;
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    deliverables_json JSON NOT NULL,
    sla_details VARCHAR(255) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    pricing_model VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_service_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. FAQS TABLE (Frequently Asked Questions & Policy Snippets)
DROP TABLE IF EXISTS faqs;
CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    department_id INT DEFAULT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    INDEX idx_faq_category (category),
    INDEX idx_faq_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ANNOUNCEMENTS TABLE (Company News & Policy Updates)
DROP TABLE IF EXISTS announcements;
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority ENUM('info', 'normal', 'urgent') NOT NULL DEFAULT 'normal',
    published_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_announcement_priority (priority),
    INDEX idx_announcement_date (published_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. CHAT HISTORY TABLE (Auditing and grounded search telemetry)
DROP TABLE IF EXISTS chat_history;
CREATE TABLE chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    session_id VARCHAR(100) NOT NULL,
    user_query TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    retrieved_sources_json JSON DEFAULT NULL,
    is_demo_fallback BOOLEAN NOT NULL DEFAULT FALSE,
    response_time_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_chat_session (session_id),
    INDEX idx_chat_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
