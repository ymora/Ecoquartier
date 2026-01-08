<?php
// Activer l'affichage des erreurs
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Définir le type de contenu en JSON
header('Content-Type: application/json');

// Récupérer le chemin du répertoire depuis la requête
$directory = isset($_GET['directory']) ? $_GET['directory'] : '';
$directory = realpath($directory);

// Log du chemin du répertoire
error_log("Directory requested: " . $directory);

// Vérifiez si le répertoire est spécifié et existe
if (empty($directory)) {
    error_log("Error: Directory is empty.");
    http_response_code(400);
    echo json_encode(["error" => "Répertoire non spécifié."]);
    exit;
}

if (!is_dir($directory)) {
    error_log("Error: Directory does not exist.");
    http_response_code(400);
    echo json_encode(["error" => "Répertoire non trouvé."]);
    exit;
}

// Récupérer les fichiers dans le répertoire
$files = scandir($directory);

// Log des fichiers trouvés
error_log("Files in directory: " . print_r($files, true));

$imageFiles = [];

foreach ($files as $file) {
    // Vérifiez si le fichier est une image
    if (preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
        $filePath = $directory . DIRECTORY_SEPARATOR . $file;
        if (is_readable($filePath)) {
            $imageFiles[] = [
                "name" => $file,
                "size" => filesize($filePath) // Taille du fichier
            ];
        } else {
            error_log("Warning: File is not readable - " . $filePath);
        }
    }
}

// Vérifiez si des images ont été trouvées
if (empty($imageFiles)) {
    error_log("Error: No images found in directory.");
    http_response_code(404);
    echo json_encode(["error" => "Aucune image trouvée dans le répertoire."]);
    exit;
}

// Log des informations sur les images
error_log("Image files found: " . print_r($imageFiles, true));

// Retourner les informations des images en format JSON
echo json_encode($imageFiles);
?>
