<?php
/**
 * GEN-Z WORKS - Feedback & Contact Form Submission Handler
 * Technology: PHP 7.4+ / 8.x with PDO & MySQL
 * 
 * Handles client feedback and project inquiry submissions with strict input
 * sanitization, validation, prepared statements, and support for both AJAX
 * and standard HTTP POST submissions.
 */

// --------------------------------------------------------------------------
// 1. Database Configuration
// --------------------------------------------------------------------------
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'genz_works_db');
define('DB_USER', 'root');
define('DB_PASS', '');          // Set your MySQL password here (default is empty in XAMPP/MAMP/WAMP)
define('DB_CHARSET', 'utf8mb4');

// Set response header default
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
          || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

// --------------------------------------------------------------------------
// 2. Request Method Verification
// --------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    sendResponse(false, 'Method Not Allowed. This endpoint only accepts POST requests.', $isAjax);
    exit;
}

// --------------------------------------------------------------------------
// 3. Capture & Sanitize Form Input
// --------------------------------------------------------------------------
$rawName     = isset($_POST['client_name']) ? trim($_POST['client_name']) : '';
$rawEmail    = isset($_POST['client_email']) ? trim($_POST['client_email']) : '';
$rawService  = isset($_POST['service_interest']) ? trim($_POST['service_interest']) : '';
$rawMessage  = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation container
$errors = [];

// Validate Full Name
$clientName = htmlspecialchars(strip_tags($rawName), ENT_QUOTES, 'UTF-8');
if (empty($clientName)) {
    $errors['client_name'] = 'Full name is required.';
} elseif (mb_strlen($clientName) < 2 || mb_strlen($clientName) > 100) {
    $errors['client_name'] = 'Full name must be between 2 and 100 characters.';
}

// Validate Email Address
$clientEmail = filter_var($rawEmail, FILTER_SANITIZE_EMAIL);
if (empty($clientEmail)) {
    $errors['client_email'] = 'Email address is required.';
} elseif (!filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
    $errors['client_email'] = 'A valid email address is required (e.g., name@domain.com).';
} elseif (strlen($clientEmail) > 150) {
    $errors['client_email'] = 'Email address must not exceed 150 characters.';
}

// Validate Service of Interest (Strict Whitelist Check)
$allowedServices = [
    'Web Development',
    'College & Academic Projects',
    'Poster & Graphic Design',
    'Video Editing & Motion Graphics',
    'Content Writing & Copywriting',
    'Content Creation',
    'Video Editing',
    'Poster Design'
];

if (empty($rawService)) {
    $errors['service_interest'] = 'Please select a service of interest.';
} elseif (!in_array($rawService, $allowedServices, true)) {
    $errors['service_interest'] = 'Invalid service selection. Please choose from the available options.';
}
$serviceInterest = $rawService;

// Validate Message
$message = htmlspecialchars(strip_tags($rawMessage), ENT_QUOTES, 'UTF-8');
if (empty($message)) {
    $errors['message'] = 'Message is required.';
} elseif (mb_strlen($message) < 15) {
    $errors['message'] = 'Message must be at least 15 characters long.';
} elseif (mb_strlen($message) > 3000) {
    $errors['message'] = 'Message must not exceed 3000 characters.';
}

// Metadata capture
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$userAgent = mb_substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255);

// Check if any validation errors occurred
if (!empty($errors)) {
    http_response_code(422);
    sendResponse(false, 'Validation failed. Please correct the highlighted errors.', $isAjax, $errors);
    exit;
}

// --------------------------------------------------------------------------
// 4. Database Insertion (PDO with Prepared Statement)
// --------------------------------------------------------------------------
try {
    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 5,
    ];

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

    // SQL Insert Query with Named Placeholders
    $sql = "INSERT INTO client_feedback (
                name,
                email,
                service_interest,
                message,
                ip_address,
                user_agent,
                created_at
            ) VALUES (
                :name,
                :email,
                :service_interest,
                :message,
                :ip_address,
                :user_agent,
                NOW()
            )";

    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
        ':name'             => $clientName,
        ':email'            => $clientEmail,
        ':service_interest' => $serviceInterest,
        ':message'          => $message,
        ':ip_address'       => $ipAddress,
        ':user_agent'       => $userAgent,
    ]);

    $insertId = $pdo->lastInsertId();

    // Success response
    http_response_code(200);
    sendResponse(
        true,
        'Thank you! Your feedback and project inquiry have been successfully received. Reference ID: #' . $insertId . '. Our team will respond within 24 hours.',
        $isAjax,
        ['reference_id' => $insertId]
    );

} catch (PDOException $e) {
    // Log internal error safely without leaking credentials to client
    error_log('Database Error in submit.php: ' . $e->getMessage());

    http_response_code(500);
    $friendlyMsg = 'Database connection error: Unable to connect to MySQL. Please ensure the MySQL server is running and the "client_feedback" table has been imported using database.sql.';
    sendResponse(false, $friendlyMsg, $isAjax);
}

// --------------------------------------------------------------------------
// 5. Helper Function: Send Structured Response (JSON or HTML)
// --------------------------------------------------------------------------
function sendResponse($success, $message, $isAjax, $extra = []) {
    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array_merge([
            'status'  => $success ? 'success' : 'error',
            'message' => $message
        ], $extra));
        exit;
    }

    // Fallback for standard HTML form submissions (Non-AJAX)
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Submission Status | GEN-Z'WORKS</title>
      <link rel="stylesheet" href="css/style.css">
    </head>
    <body style="display:flex; align-items:center; justify-content:center; min-height:100vh; padding: 2rem;">
      <div class="feedback-card" style="max-width: 580px; width: 100%; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">
          <?php echo $success ? '🎉' : '⚠️'; ?>
        </div>
        <h2 style="margin-bottom: 1rem; color: <?php echo $success ? '#34d399' : '#fb7185'; ?>">
          <?php echo $success ? 'Submission Received!' : 'Submission Notice'; ?>
        </h2>
        <p style="margin-bottom: 2rem; color: var(--text-muted); line-height: 1.6;">
          <?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?>
        </p>
        <a href="feedback.html" class="btn btn-primary">Return to Website</a>
      </div>
    </body>
    </html>
    <?php
    exit;
}
