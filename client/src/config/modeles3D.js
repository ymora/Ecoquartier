/**
 * Configuration des modèles 3D disponibles
 * 
 * Pour ajouter un nouveau modèle :
 * 1. Placer le fichier .glb dans client/public/models/arbres/
 * 2. Ajouter une entrée dans MODELES_ARBRES ci-dessous
 * 3. Mapper l'ID de l'arbre dans ARBRE_TO_MODEL
 */

// Types de modèles disponibles
export const MODEL_TYPES = {
  PROCEDURAL: 'procedural', // Modèle généré par code (actuel)
  REAL_MODEL: 'real_model'   // Modèle 3D réel (GLB/OBJ)
};

// Catalogue des modèles 3D disponibles
export const MODELES_ARBRES = {
  // Format GLB (recommandé)
  'cherry-tree-glb': {
    path: '/models/arbres/cherry-tree.glb',
    type: 'glb',
    scale: 1.0, // Échelle de base
    rotation: [0, 0, 0], // Rotation si nécessaire
    hauteurReelle: 8, // Hauteur réelle en mètres (pour ajuster l'échelle)
    nom: 'Cerisier (modèle réaliste)'
  },
  
  // Format GLB (convertis depuis OBJ)
  'tree-1': {
    path: '/models/arbres/tree-1.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Arbre 1 (GLB)'
  },
  'tree-2': {
    path: '/models/arbres/tree-2.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Arbre 2 (GLB)'
  },
  'tree-3': {
    path: '/models/arbres/tree-3.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Arbre 3 (GLB)'
  }
};

// Mapping des arbres de la base de données vers les modèles 3D
// Clé = ID de l'arbre dans arbustesData.js
// Valeur = ID du modèle dans MODELES_ARBRES
export const ARBRE_TO_MODEL = {
  // Cerisiers
  'cerisier-kanzan': 'cherry-tree-glb', // ou 'tree-1' pour utiliser vos OBJ
  'cerisier-accolade': 'tree-1',
  'cerisier-sunset': 'tree-2',
  
  // Érables
  'erable-japon': 'tree-3',
  
  // Par défaut, utiliser le rendu procédural
  // Ajouter d'autres mappings au fur et à mesure
};

/**
 * Obtenir le modèle 3D pour un arbre donné
 * @param {string} arbreId - ID de l'arbre (ex: 'cerisier-kanzan')
 * @returns {object|null} - Configuration du modèle ou null si procédural
 */
export function getModelPourArbre(arbreId) {
  const modelId = ARBRE_TO_MODEL[arbreId];
  if (!modelId) return null;
  
  return {
    ...MODELES_ARBRES[modelId],
    id: modelId
  };
}

/**
 * Vérifier si un arbre a un modèle 3D réel disponible
 * @param {string} arbreId - ID de l'arbre
 * @returns {boolean}
 */
export function hasRealModel(arbreId) {
  return !!ARBRE_TO_MODEL[arbreId];
}

/**
 * Liste de tous les arbres avec modèles 3D
 * @returns {Array<string>}
 */
export function getArbresAvecModeles() {
  return Object.keys(ARBRE_TO_MODEL);
}

