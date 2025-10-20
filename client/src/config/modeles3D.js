/**
 * Configuration des modèles 3D disponibles
 * 
 * SYSTÈME SIMPLIFIÉ:
 * - 1 modèle GLB peut être utilisé par PLUSIEURS arbres
 * - Si le fichier GLB n'existe pas ou est trop lourd → Fallback automatique vers arbre procédural
 * - Fichiers organisés par type : cerisier/, erable/, magnolia/
 * 
 * LIMITE DE TAILLE: 5 MB recommandé (10 MB max)
 * Si > 10 MB : Le modèle ne sera pas chargé (trop lent)
 */

// Types de modèles disponibles
export const MODEL_TYPES = {
  PROCEDURAL: 'procedural', // Modèle généré par code (actuel)
  REAL_MODEL: 'real_model'   // Modèle 3D réel (GLB)
};

// Taille max en MB pour charger un modèle GLB
const MAX_MODEL_SIZE_MB = 10;

// Catalogue des modèles 3D disponibles
// Structure : /models/{type}/{type}-{nom}.glb
export const MODELES_ARBRES = {
  // === CERISIERS ===
  // NOTE: Les modèles actuels (12 MB) sont trop lourds
  // → Fallback automatique vers arbre procédural
  // → À remplacer par des modèles plus légers (< 5 MB)
  
  'cerisier-tree-1': {
    path: '/models/cerisier/cerisier-tree-1.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Cerisier Modèle 1',
    disabled: false  // ✅ Activé pour test (12 MB - chargement lent)
  },
  'cerisier-tree-2': {
    path: '/models/cerisier/cerisier-tree-2.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Cerisier Modèle 2',
    disabled: false  // ✅ Activé pour test (12 MB - chargement lent)
  },
  'cerisier-tree-3': {
    path: '/models/cerisier/cerisier-tree-3.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Cerisier Modèle 3',
    disabled: false  // ✅ Activé pour test (12 MB - chargement lent)
  },
  
  // Modèle générique léger (à ajouter)
  'cerisier-general': {
    path: '/models/cerisier/cerisier-general.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 8,
    nom: 'Cerisier (Générique)',
    disabled: true  // N'existe pas encore
  },
  
  // === ÉRABLES ===
  'erable-general': {
    path: '/models/erable/erable-general.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 8,
    nom: 'Érable (Générique)',
    disabled: true  // À ajouter
  },
  
  // === MAGNOLIAS ===
  'magnolia-general': {
    path: '/models/magnolia/magnolia-general.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Magnolia (Générique)',
    disabled: true  // À ajouter
  }
};

// Mapping des arbres de la base de données vers les modèles 3D
// Clé = ID de l'arbre dans arbustesData.js
// Valeur = ID du modèle dans MODELES_ARBRES
// 
// NOTE: Modèles activés temporairement pour test (même si lourds)
// Chargement lent attendu (12 MB par arbre)
export const ARBRE_TO_MODEL = {
  // ACTIVÉ pour test (attention : chargement lent, 12 MB par modèle)
  'cerisier-kanzan': 'cerisier-tree-1',
  'cerisier-accolade': 'cerisier-tree-1',
  'cerisier-sunset': 'cerisier-tree-2',
  'erable-japon': 'cerisier-tree-3',
};

/**
 * Obtenir le modèle 3D pour un arbre donné
 * @param {string} arbreId - ID de l'arbre (ex: 'cerisier-kanzan')
 * @returns {object|null} - Configuration du modèle ou null si procédural
 */
export function getModelPourArbre(arbreId) {
  const modelId = ARBRE_TO_MODEL[arbreId];
  if (!modelId) return null;
  
  const model = MODELES_ARBRES[modelId];
  if (!model) return null;
  
  // Ne pas charger si désactivé (trop lourd)
  if (model.disabled) {
    console.log(`[3D] Modèle ${modelId} désactivé (trop lourd), utilisation arbre procédural`);
    return null;
  }
  
  return {
    ...model,
    id: modelId
  };
}

/**
 * Vérifier si un arbre a un modèle 3D réel disponible
 * @param {string} arbreId - ID de l'arbre
 * @returns {boolean}
 */
export function hasRealModel(arbreId) {
  const model = getModelPourArbre(arbreId);
  return !!model;
}

/**
 * Liste de tous les arbres avec modèles 3D actifs
 * @returns {Array<string>}
 */
export function getArbresAvecModeles() {
  return Object.keys(ARBRE_TO_MODEL).filter(arbreId => {
    const model = getModelPourArbre(arbreId);
    return model && !model.disabled;
  });
}
