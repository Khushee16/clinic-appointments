<?php
/**
 * BrightSmile Dental Care — appointment booking endpoint (DEMO / portfolio).
 *
 * Receives a POST from booking.html (sent via fetch() in assets/js/booking.js),
 * validates the fields, and appends the appointment to data/appointments.json.
 * Returns a JSON confirmation with a booking reference.
 *
 * ---------------------------------------------------------------------------
 * HOSTING NOTE — read before deploying:
 * This file is plain PHP. It runs on a PHP host (e.g. Apache/Nginx + PHP,
 * XAMPP, or any shared host with PHP 8+). It does NOT run on GitHub Pages
 * or any static-only host — GitHub Pages serves .php files as downloads or
 * plain text and never executes them.
 * On static hosting the front end detects the missing backend and shows a
 * clearly labelled "Demo mode — no backend connected" state instead of
 * faking a submission. See README.md for details.
 * ---------------------------------------------------------------------------
 */

header('Content-Type: application/json; charset=utf-8');

// Only POST requests are accepted.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed. Use POST.']);
    exit;
}

// ---- Allowed values (must match booking.html) ------------------------------
$allowedTreatments = [
    'Check-up & Cleaning',
    'Teeth Whitening',
    'Fillings & Restorations',
    'Clear Aligners Consultation',
    "Children's Dentistry",
    'Emergency Dental Care',
    'Root Canal Treatment',
    'Dental Implants Consultation',
];

$allowedDoctors = [
    'first-available',
    'dr-chen',
    'dr-okafor',
    'dr-ramirez',
    'dr-patel',
    'dr-novak',
    'dr-obrien',
];

$allowedTimes = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'];

// ---- Collect & trim input --------------------------------------------------
$treatment = trim($_POST['treatment'] ?? '');
$doctor    = trim($_POST['doctor'] ?? '');
$date      = trim($_POST['date'] ?? '');
$time      = trim($_POST['time'] ?? '');
$name      = trim($_POST['name'] ?? '');
$phone     = trim($_POST['phone'] ?? '');
$notes     = trim($_POST['notes'] ?? '');

// ---- Validate --------------------------------------------------------------
$errors = [];

if (!in_array($treatment, $allowedTreatments, true)) {
    $errors[] = 'Please choose a valid treatment.';
}
if (!in_array($doctor, $allowedDoctors, true)) {
    $errors[] = 'Please choose a valid dentist.';
}

// Date must be YYYY-MM-DD and today or later.
$dateObj = DateTime::createFromFormat('Y-m-d', $date);
if (!$dateObj || $dateObj->format('Y-m-d') !== $date) {
    $errors[] = 'Please provide a valid date (YYYY-MM-DD).';
} elseif ($dateObj < new DateTime('today')) {
    $errors[] = 'Date cannot be in the past.';
}

if (!in_array($time, $allowedTimes, true)) {
    $errors[] = 'Please choose a valid time slot.';
}
if (strlen($name) < 2 || strlen($name) > 80) {
    $errors[] = 'Please enter your full name (2–80 characters).';
}
if (!preg_match('/^[0-9+()\-.\s]{7,20}$/', $phone)) {
    $errors[] = 'Please enter a valid phone number.';
}
if (strlen($notes) > 500) {
    $errors[] = 'Notes must be 500 characters or fewer.';
}

if ($errors) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => implode(' ', $errors)]);
    exit;
}

// ---- Build the appointment record ------------------------------------------
$reference = 'BS-' . strtoupper(bin2hex(random_bytes(3))); // e.g. BS-A1B2C3

$appointment = [
    'reference'  => $reference,
    'treatment'  => $treatment,
    'doctor'     => $doctor,
    'date'       => $date,
    'time'       => $time,
    'name'       => $name,
    'phone'      => $phone,
    'notes'      => $notes,
    'created_at' => (new DateTime())->format(DateTime::ATOM),
];

// ---- Append to data/appointments.json (with file lock) ----------------------
$dataDir  = __DIR__ . '/data';
$dataFile = $dataDir . '/appointments.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$fp = fopen($dataFile, 'c+');
if ($fp === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not open the appointments file.']);
    exit;
}

flock($fp, LOCK_EX);
$contents = stream_get_contents($fp);
$appointments = [];
if ($contents !== false && trim($contents) !== '') {
    $decoded = json_decode($contents, true);
    if (is_array($decoded)) {
        $appointments = $decoded;
    }
}
$appointments[] = $appointment;

ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode($appointments, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

// ---- Success response -------------------------------------------------------
echo json_encode([
    'success'   => true,
    'reference' => $reference,
    'name'      => $name,
    'treatment' => $treatment,
    'date'      => $date,
    'time'      => $time,
]);
