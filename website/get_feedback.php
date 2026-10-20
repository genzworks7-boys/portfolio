<?php
/**
 * GEN-Z'WORKS - Fetch Client Inquiries Endpoint (JSON)
 * Connects to MySQL database 'genz_works_db' and retrieves all rows from 'client_feedback'
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'genz_works_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

try {
    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT            => 3
    ]);

    $stmt = $pdo->query("SELECT 
        id, 
        name, 
        email, 
        service_interest, 
        message, 
        ip_address, 
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS submitted_time 
        FROM client_feedback 
        ORDER BY created_at DESC");

    $rows = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'source' => 'mysql',
        'count'  => count($rows),
        'data'   => $rows
    ]);
} catch (PDOException $e) {
    // If MySQL server is offline or database table not yet created
    echo json_encode([
        'status'  => 'db_offline',
        'source'  => 'none',
        'message' => 'MySQL database connection not active. Ensure MySQL server is running in XAMPP/WAMP.',
        'data'    => []
    ]);
}
