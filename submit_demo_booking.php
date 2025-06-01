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
$first_name = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
$last_name = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$french_level = isset($_POST['frenchLevel']) ? trim($_POST['frenchLevel']) : '';
$notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';
$date = isset($_POST['date']) ? trim($_POST['date']) : '';
$time = isset($_POST['time']) ? trim($_POST['time']) : '';

// Validate required fields
if (empty($first_name) || empty($last_name) || empty($email) || empty($date) || empty($time)) {
    echo json_encode(['status' => 'error', 'message' => 'All required fields must be filled']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
    exit;
}

// Format the date and time for display
$formatted_date = date('F j, Y', strtotime($date));
$formatted_time = date('g:i A', strtotime($time));

// Prepare email content for admin
$subject = "New Demo Class Booking - $first_name $last_name";
$admin_message = "
New demo class booking received:

Student Information:
- Name: $first_name $last_name
- Email: $email
- French Level: $french_level

Booking Details:
- Date: $formatted_date
- Time: $formatted_time
- Notes: " . ($notes ? $notes : 'None provided') . "

Timestamp: " . date('Y-m-d H:i:s') . "

Please confirm this booking and add it to your calendar.

---
$site_name Demo Booking System
";

// Prepare confirmation email for student
$student_subject = "Demo Class Booking Confirmation - $site_name";
$student_message = "
Dear $first_name,

Thank you for booking a demo French class with $site_name!

Your booking details:
- Date: $formatted_date
- Time: $formatted_time
- Duration: 1 hour
- French Level: $french_level

What to expect:
- A friendly introduction to our teaching method
- Assessment of your current French level
- Personalized learning recommendations
- Q&A about our programs

We'll send you the meeting link 24 hours before your session.

If you need to reschedule or have any questions, please contact us at $admin_email or via WhatsApp.

Looking forward to meeting you!

Best regards,
The $site_name Team
";

// Email headers
$headers = "From: $site_name <noreply@frenchgta.ca>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$student_headers = "From: $site_name <noreply@frenchgta.ca>\r\n";
$student_headers .= "Reply-To: $admin_email\r\n";
$student_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send emails
$admin_email_sent = mail($admin_email, $subject, $admin_message, $headers);
$student_email_sent = mail($email, $student_subject, $student_message, $student_headers);

// Log the booking
$log_entry = date('Y-m-d H:i:s') . " - Demo Booking: $first_name $last_name ($email) - $formatted_date at $formatted_time\n";
file_put_contents('demo_bookings.log', $log_entry, FILE_APPEND | LOCK_EX);

if ($admin_email_sent && $student_email_sent) {
    echo json_encode([
        'status' => 'success', 
        'message' => 'Demo class booked successfully! Confirmation emails sent.',
        'booking_details' => [
            'name' => "$first_name $last_name",
            'date' => $formatted_date,
            'time' => $formatted_time,
            'level' => $french_level
        ]
    ]);
} else {
    echo json_encode([
        'status' => 'partial_success', 
        'message' => 'Booking recorded but there was an issue sending confirmation emails. We will contact you directly.'
    ]);
}
?> 