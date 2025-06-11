-- ===============================================
-- FRENCH.GTA WEBSITE DATABASE SCHEMA
-- Complete database structure for all forms
-- ===============================================

-- Create database
CREATE DATABASE IF NOT EXISTS french_gta_website;
USE french_gta_website;

-- ===============================================
-- 1. CONTACT FORM SUBMISSIONS
-- ===============================================
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(100) NOT NULL,
    french_level VARCHAR(50),
    timeline VARCHAR(50),
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'responded', 'closed') DEFAULT 'new',
    responded_at TIMESTAMP NULL,
    notes TEXT,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);

-- ===============================================
-- 2. DEMO REGISTRATION SUBMISSIONS
-- ===============================================
CREATE TABLE demo_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    french_level VARCHAR(50) NOT NULL,
    learning_goals TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    google_meet_link VARCHAR(500) DEFAULT 'https://meet.google.com/bkc-qcrj-oai',
    special_requests TEXT,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    confirmation_sent BOOLEAN DEFAULT FALSE,
    demo_status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    ip_address VARCHAR(45),
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    demo_completed_at TIMESTAMP NULL,
    feedback TEXT,
    converted_to_paid BOOLEAN DEFAULT FALSE,
    notes TEXT,
    INDEX idx_email (email),
    INDEX idx_demo_status (demo_status),
    INDEX idx_preferred_date (preferred_date),
    INDEX idx_submitted_at (submitted_at)
);

-- ===============================================
-- 3. COURSE REGISTRATIONS
-- ===============================================
CREATE TABLE course_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Personal Information
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    -- Course Details
    course_type ENUM('group-learning', 'flexible-learning', 'one-on-one-intensive', 'personal-learning') NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_price DECIMAL(10,2) NOT NULL,
    
    -- Student Details
    french_level VARCHAR(50) NOT NULL,
    learning_goals VARCHAR(100) NOT NULL,
    timeline VARCHAR(50) NOT NULL,
    special_requests TEXT,
    
    -- Payment Information
    payment_method ENUM('paypal', 'interac') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    payment_transaction_id VARCHAR(255),
    payment_amount DECIMAL(10,2) NOT NULL,
    payment_completed_at TIMESTAMP NULL,
    
    -- Registration Status
    registration_status ENUM('submitted', 'payment_pending', 'enrolled', 'cancelled') DEFAULT 'submitted',
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    welcome_email_sent BOOLEAN DEFAULT FALSE,
    class_scheduled BOOLEAN DEFAULT FALSE,
    
    -- Tracking
    ip_address VARCHAR(45),
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Admin Notes
    admin_notes TEXT,
    assigned_instructor VARCHAR(255),
    class_schedule TEXT,
    
    INDEX idx_email (email),
    INDEX idx_course_type (course_type),
    INDEX idx_payment_status (payment_status),
    INDEX idx_registration_status (registration_status),
    INDEX idx_submitted_at (submitted_at)
);

-- ===============================================
-- 4. POPUP INQUIRIES (from index.html modals)
-- ===============================================
CREATE TABLE popup_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp_url TEXT,
    source_page VARCHAR(100) DEFAULT 'index',
    ip_address VARCHAR(45),
    user_agent TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'contacted', 'converted') DEFAULT 'new',
    follow_up_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);

-- ===============================================
-- 5. NEWSLETTER SUBSCRIPTIONS
-- ===============================================
CREATE TABLE newsletter_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    subscription_source VARCHAR(100),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
    unsubscribed_at TIMESTAMP NULL,
    ip_address VARCHAR(45),
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- ===============================================
-- 6. STUDENT PROGRESS TRACKING
-- ===============================================
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    course_type VARCHAR(100),
    starting_level VARCHAR(50),
    current_level VARCHAR(50),
    target_level VARCHAR(50),
    enrollment_date DATE,
    status ENUM('active', 'paused', 'completed', 'cancelled') DEFAULT 'active',
    instructor_assigned VARCHAR(255),
    classes_completed INT DEFAULT 0,
    total_classes_planned INT DEFAULT 0,
    next_class_date DATETIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES course_registrations(id),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_instructor (instructor_assigned)
);

-- ===============================================
-- 7. INSTRUCTORS MANAGEMENT
-- ===============================================
CREATE TABLE instructors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    specializations TEXT,
    languages_spoken VARCHAR(255),
    qualifications TEXT,
    experience_years INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- ===============================================
-- 8. CLASS SESSIONS TRACKING
-- ===============================================
CREATE TABLE class_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    instructor_id INT NOT NULL,
    session_date DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    session_type ENUM('individual', 'group', 'demo') NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    google_meet_link VARCHAR(500),
    lesson_plan TEXT,
    student_notes TEXT,
    instructor_notes TEXT,
    homework_assigned TEXT,
    next_session_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(id),
    INDEX idx_student_id (student_id),
    INDEX idx_instructor_id (instructor_id),
    INDEX idx_session_date (session_date),
    INDEX idx_status (status)
);

-- ===============================================
-- 9. PAYMENT TRACKING
-- ===============================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT,
    student_id INT,
    payment_method ENUM('paypal', 'interac', 'credit_card', 'cash') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'CAD',
    transaction_id VARCHAR(255),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL,
    payment_date DATETIME,
    description TEXT,
    paypal_details JSON,
    interac_details JSON,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES course_registrations(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_date (payment_date)
);

-- ===============================================
-- 10. ADMIN ACTIVITY LOG
-- ===============================================
CREATE TABLE admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_user VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    table_affected VARCHAR(100),
    record_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_user (admin_user),
    INDEX idx_action (action),
    INDEX idx_table_affected (table_affected),
    INDEX idx_created_at (created_at)
);

-- ===============================================
-- 11. WEBSITE ANALYTICS
-- ===============================================
CREATE TABLE page_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_url VARCHAR(500) NOT NULL,
    referrer VARCHAR(500),
    user_ip VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_page_url (page_url),
    INDEX idx_viewed_at (viewed_at),
    INDEX idx_session_id (session_id)
);

-- ===============================================
-- 12. WHATSAPP MESSAGE LOG
-- ===============================================
CREATE TABLE whatsapp_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_type ENUM('contact', 'demo', 'registration', 'popup') NOT NULL,
    related_id INT,
    recipient_phone VARCHAR(50) DEFAULT '+13653062049',
    message_content TEXT NOT NULL,
    message_sent BOOLEAN DEFAULT TRUE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_form_type (form_type),
    INDEX idx_related_id (related_id),
    INDEX idx_sent_at (sent_at)
);

-- ===============================================
-- SAMPLE DATA INSERTS (Optional)
-- ===============================================

-- Insert sample instructor
INSERT INTO instructors (name, email, phone, specializations, languages_spoken, qualifications, experience_years, hourly_rate) 
VALUES ('Sarah Johnson', 'sarah@frenchgta.ca', '+1-365-306-2049', 'TEF Preparation, Business French', 'French, English', 'DELF/DALF Certified, Masters in French Literature', 8, 45.00);

-- ===============================================
-- VIEWS FOR REPORTING
-- ===============================================

-- View for active registrations with payment status
CREATE VIEW active_registrations AS
SELECT 
    cr.id,
    CONCAT(cr.first_name, ' ', cr.last_name) as student_name,
    cr.email,
    cr.course_name,
    cr.course_price,
    cr.payment_method,
    cr.payment_status,
    cr.registration_status,
    cr.submitted_at
FROM course_registrations cr
WHERE cr.registration_status IN ('enrolled', 'payment_pending');

-- View for pending demo classes
CREATE VIEW pending_demos AS
SELECT 
    dr.id,
    dr.name,
    dr.email,
    dr.phone,
    dr.preferred_date,
    dr.preferred_time,
    dr.french_level,
    dr.demo_status,
    dr.submitted_at
FROM demo_registrations dr
WHERE dr.demo_status = 'scheduled'
AND dr.preferred_date >= CURDATE();

-- View for revenue tracking
CREATE VIEW revenue_summary AS
SELECT 
    DATE(payment_date) as payment_date,
    COUNT(*) as transactions,
    SUM(amount) as daily_revenue,
    payment_method
FROM payments 
WHERE payment_status = 'completed'
GROUP BY DATE(payment_date), payment_method
ORDER BY payment_date DESC;

-- ===============================================
-- STORED PROCEDURES
-- ===============================================

DELIMITER //

-- Procedure to update student progress
CREATE PROCEDURE UpdateStudentProgress(
    IN student_id INT,
    IN new_level VARCHAR(50),
    IN classes_completed INT,
    IN instructor_notes TEXT
)
BEGIN
    UPDATE students 
    SET 
        current_level = new_level,
        classes_completed = classes_completed,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = student_id;
    
    INSERT INTO admin_logs (admin_user, action, table_affected, record_id, details)
    VALUES ('system', 'student_progress_update', 'students', student_id, instructor_notes);
END //

-- Procedure to process successful payment
CREATE PROCEDURE ProcessPayment(
    IN reg_id INT,
    IN transaction_id VARCHAR(255),
    IN payment_method VARCHAR(50),
    IN amount DECIMAL(10,2)
)
BEGIN
    DECLARE student_email VARCHAR(255);
    DECLARE student_name VARCHAR(500);
    
    -- Update registration status
    UPDATE course_registrations 
    SET 
        payment_status = 'completed',
        payment_transaction_id = transaction_id,
        payment_completed_at = CURRENT_TIMESTAMP,
        registration_status = 'enrolled'
    WHERE id = reg_id;
    
    -- Insert payment record
    INSERT INTO payments (registration_id, payment_method, amount, transaction_id, payment_status, payment_date)
    VALUES (reg_id, payment_method, amount, transaction_id, 'completed', CURRENT_TIMESTAMP);
    
    -- Get student details
    SELECT email, CONCAT(first_name, ' ', last_name) 
    INTO student_email, student_name
    FROM course_registrations 
    WHERE id = reg_id;
    
    -- Create student record if not exists
    INSERT IGNORE INTO students (registration_id, first_name, last_name, email, phone, course_type, enrollment_date)
    SELECT reg_id, first_name, last_name, email, phone, course_type, CURDATE()
    FROM course_registrations 
    WHERE id = reg_id;
    
END //

DELIMITER ;

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- Additional indexes for better performance
CREATE INDEX idx_contact_email_date ON contact_submissions(email, submitted_at);
CREATE INDEX idx_demo_date_status ON demo_registrations(preferred_date, demo_status);
CREATE INDEX idx_registration_course_payment ON course_registrations(course_type, payment_status);
CREATE INDEX idx_students_status_level ON students(status, current_level);
CREATE INDEX idx_sessions_date_status ON class_sessions(session_date, status);

-- ===============================================
-- BACKUP AND MAINTENANCE COMMANDS
-- ===============================================

-- Regular backup command (run this daily):
-- mysqldump -u [username] -p french_gta_website > backup_$(date +%Y%m%d).sql

-- Clean up old logs (run monthly):
-- DELETE FROM admin_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
-- DELETE FROM page_views WHERE viewed_at < DATE_SUB(NOW(), INTERVAL 3 MONTH);

-- ===============================================
-- DATABASE MAINTENANCE NOTES
-- ===============================================

/*
IMPORTANT MAINTENANCE TASKS:

1. DAILY:
   - Backup database
   - Check for new registrations
   - Process pending payments
   - Send follow-up emails for demos

2. WEEKLY:
   - Review student progress
   - Update class schedules
   - Generate revenue reports
   - Clean temporary data

3. MONTHLY:
   - Archive old logs
   - Update analytics
   - Review database performance
   - Optimize tables if needed

4. SECURITY:
   - All passwords should be hashed
   - Use prepared statements in PHP
   - Validate all input data
   - Regular security audits

5. BACKUP STRATEGY:
   - Daily automated backups
   - Weekly full exports
   - Monthly off-site storage
   - Test restore procedures quarterly
*/ 