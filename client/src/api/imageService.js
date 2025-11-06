/**
 * Service API centralisé pour la gestion des images
 * Tous les appels API sont regroupés ici
 */

const API_BASE_URL = 'http://localhost:3001';

/**
 * Gestion des erreurs API
 * @param {Response} response - Réponse fetch
 * @returns {Promise<any>} Données JSON
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Liste toutes les images avec filtres optionnels
 * @param {Object} filters - Filtres { espece, type }
 * @returns {Promise<Array>} Liste des images
 */
export async function listImages(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE_URL}/list-images?${params}`);
  const data = await handleResponse(response);
  return data.images || [];
}

/**
 * Permute deux images
 * @param {Object} image1 - Première image
 * @param {Object} image2 - Deuxième image
 * @returns {Promise<Object>} Résultat
 */
export async function swapImages(image1, image2) {
  const response = await fetch(`${API_BASE_URL}/swap-images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image1, image2 })
  });
  return handleResponse(response);
}

/**
 * Change le numéro d'une image
 * @param {Object} imageData - Données de l'image
 * @returns {Promise<Object>} Résultat
 */
export async function changeImageNumber(imageData) {
  const response = await fetch(`${API_BASE_URL}/change-number`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(imageData)
  });
  return handleResponse(response);
}

/**
 * Renomme/déplace une image
 * @param {Object} renameData - Données du renommage
 * @returns {Promise<Object>} Résultat
 */
export async function renameImage(renameData) {
  const response = await fetch(`${API_BASE_URL}/rename-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(renameData)
  });
  return handleResponse(response);
}

/**
 * Supprime une image
 * @param {string} espece - ID de l'espèce
 * @param {string} filename - Nom du fichier
 * @returns {Promise<Object>} Résultat
 */
export async function deleteImage(espece, filename) {
  const response = await fetch(`${API_BASE_URL}/delete-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ espece, filename })
  });
  return handleResponse(response);
}

/**
 * Vérifie si une image existe
 * @param {string} espece - ID de l'espèce
 * @param {string} filename - Nom du fichier
 * @returns {Promise<boolean>} true si l'image existe
 */
export async function checkImageExists(espece, filename) {
  const params = new URLSearchParams({ espece, filename });
  const response = await fetch(`${API_BASE_URL}/check-image?${params}`);
  const data = await handleResponse(response);
  return data.exists || false;
}

/**
 * Upload d'images
 * @param {FormData} formData - Données du formulaire avec les fichiers
 * @returns {Promise<Object>} Résultat de l'upload
 */
export async function uploadImages(formData) {
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData // Ne pas définir Content-Type, le navigateur le fait automatiquement
  });
  return handleResponse(response);
}

/**
 * Charge l'inventaire JSON des images
 * @returns {Promise<Object>} Inventaire des images par espèce
 */
export async function loadImagesInventory() {
  const response = await fetch('/images.json');
  if (!response.ok) {
    throw new Error('Impossible de charger l\'inventaire des images');
  }
  return response.json();
}

/**
 * Récupère les images d'une plante spécifique
 * @param {string} planteId - ID de la plante
 * @returns {Promise<Array>} Liste des images de la plante
 */
export async function getPlantImages(planteId) {
  const inventory = await loadImagesInventory();
  const plantImages = inventory[planteId] || [];
  
  const typeLegends = {
    'vue_generale': 'Vue générale',
    'bourgeons': 'Bourgeons',
    'fleurs': 'Fleurs',
    'feuilles': 'Feuilles',
    'fruits': 'Fruits',
    'tronc': 'Tronc/Écorce',
    'automne': 'Automne',
    'hiver': 'Hiver'
  };
  
  return plantImages.map(filename => {
    const match = filename.match(/_([a-z_]+)_(\d+)\./i);
    const type = match ? match[1] : 'vue_generale';
    const number = match ? parseInt(match[2]) : 1;
    
    return {
      src: `/images/${planteId}/${filename}`,
      legend: `${typeLegends[type] || type} ${number > 1 ? `(${number})` : ''}`,
      alt: `${planteId} - ${typeLegends[type] || type} ${number}`,
      type,
      filename
    };
  });
}

/**
 * Service complet avec toutes les méthodes
 */
const imageService = {
  listImages,
  swapImages,
  changeImageNumber,
  renameImage,
  deleteImage,
  checkImageExists,
  uploadImages,
  loadImagesInventory,
  getPlantImages
};

export default imageService;

