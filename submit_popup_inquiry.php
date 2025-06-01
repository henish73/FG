<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Admin email configuration
$admin_email = 'frenchgta.ca@gmail.com';
$site_name = 'FRENCH.GTA';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$whatsapp_url = isset($_POST['whatsappUrl']) ? trim($_POST['whatsappUrl']) : '';

// Validate required fields
if (empty($name) || empty($email)) {
    echo json_encode(['status' => 'error', 'message' => 'Name and email are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
    exit;
}

// Prepare email content
$subject = "New Popup Inquiry from $name - $site_name";
$message = "
New inquiry received from the website popup form:

Name: $name
Email: $email
Timestamp: " . date('Y-m-d H:i:s') . "
WhatsApp Connection: $whatsapp_url

This inquiry was submitted through the popup form on the website.
The user has been directed to WhatsApp for immediate connection.

Please follow up as needed.

---
$site_name Website
";

// Email headers
$headers = "From: $site_name <noreply@frenchgta.ca>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Attempt to send email
$email_sent = mail($admin_email, $subject, $message, $headers);

// Database connection (optional - you can add database logging here)
// For now, we'll just use email notification

if ($email_sent) {
    // Log the inquiry (you can add database logging here if needed)
    $log_entry = date('Y-m-d H:i:s') . " - Popup Inquiry: $name ($email)\n";
    file_put_contents('inquiries.log', $log_entry, FILE_APPEND | LOCK_EX);
    
    echo json_encode([
        'status' => 'success', 
        'message' => 'Inquiry submitted successfully and admin notified'
    ]);
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Failed to send notification email'
    ]);
}
?> 