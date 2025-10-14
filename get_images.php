<?php
/**
 * API pour récupérer les images d'un arbuste
 * Version sécurisée avec validation stricte
 */

// Configuration de sécurité
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CORS (à ajuster selon vos besoins)
$allowed_origins = ['http://localhost:5173', 'http://localhost:3000', 'https://haies-bessancourt.onrender.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

// Activer l'affichage des erreurs en développement uniquement
$is_dev = ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === '127.0.0.1');
if ($is_dev) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Fonction de logging sécurisée
function logError($message) {
    global $is_dev;
    if ($is_dev) {
        error_log($message);
    }
}

// Liste blanche des arbustes autorisés
$allowed_arbustes = [
    'noisetier',
    'fusain',
    'troene',
    'osmanthe',
    'cornouiller',
    'seringat'
];

// Récupérer et valider le paramètre 'directory' (CORRECTION DU BUG: était 'subdir')
$directory = $_GET['directory'] ?? '';

// Validation stricte : doit être dans la liste blanche
if (!in_array($directory, $allowed_arbustes, true)) {
    logError("Invalid directory requested: " . $directory);
    http_response_code(400);
    echo json_encode([
        "error" => "Répertoire non autorisé",
        "message" => "Le répertoire demandé n'est pas valide"
    ]);
    exit;
}

// Construction du chemin sécurisé
$base_dir = __DIR__ . DIRECTORY_SEPARATOR . 'images';
$target_dir = $base_dir . DIRECTORY_SEPARATOR . $directory;

// Normaliser le chemin et vérifier qu'il ne sort pas du dossier de base
$real_base = realpath($base_dir);
$real_target = realpath($target_dir);

if ($real_target === false || strpos($real_target, $real_base) !== 0) {
    logError("Directory traversal attempt: " . $directory);
    http_response_code(403);
    echo json_encode([
        "error" => "Accès interdit",
        "message" => "Tentative d'accès non autorisée"
    ]);
    exit;
}

// Vérifier que le répertoire existe et est lisible
if (!is_dir($real_target) || !is_readable($real_target)) {
    logError("Directory not found or not readable: " . $real_target);
    http_response_code(404);
    echo json_encode([
        "error" => "Répertoire non trouvé",
        "message" => "Le répertoire demandé n'existe pas ou n'est pas accessible"
    ]);
    exit;
}

// Scanner le répertoire
$files = @scandir($real_target);
if ($files === false) {
    logError("Failed to scan directory: " . $real_target);
    http_response_code(500);
    echo json_encode([
        "error" => "Erreur serveur",
        "message" => "Impossible de lire le contenu du répertoire"
    ]);
    exit;
}

// Extensions d'images autorisées
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

$imageFiles = [];

foreach ($files as $file) {
    // Ignorer . et ..
    if ($file === '.' || $file === '..') {
        continue;
    }
    
    $file_path = $real_target . DIRECTORY_SEPARATOR . $file;
    
    // Vérifier que c'est un fichier (pas un dossier)
    if (!is_file($file_path)) {
        continue;
    }
    
    // Vérifier l'extension
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (!in_array($extension, $allowed_extensions, true)) {
        continue;
    }
    
    // Vérifier que le fichier est lisible
    if (!is_readable($file_path)) {
        logError("File not readable: " . $file_path);
        continue;
    }
    
    // Récupérer les informations du fichier
    $file_size = @filesize($file_path);
    $file_mtime = @filemtime($file_path);
    
    // Générer l'URL relative sécurisée
    $relative_url = 'images/' . $directory . '/' . basename($file);
    
    $imageFiles[] = [
        "name" => basename($file),
        "url" => $relative_url,
        "size" => $file_size !== false ? $file_size : 0,
        "modified" => $file_mtime !== false ? $file_mtime : 0,
        "extension" => $extension
    ];
}

// Trier par nom de fichier
usort($imageFiles, function($a, $b) {
    return strcmp($a['name'], $b['name']);
});

// Vérifier si des images ont été trouvées
if (empty($imageFiles)) {
    logError("No images found in directory: " . $real_target);
    http_response_code(404);
    echo json_encode([
        "error" => "Aucune image trouvée",
        "message" => "Aucune image n'a été trouvée dans le répertoire demandé",
        "directory" => $directory
    ]);
    exit;
}

// Réponse réussie
http_response_code(200);
echo json_encode([
    "success" => true,
    "directory" => $directory,
    "count" => count($imageFiles),
    "images" => $imageFiles
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
