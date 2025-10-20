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
// Structure : /models/{type}/{type}-{nom}.glb
export const MODELES_ARBRES = {
  // === CERISIERS ===
  'cerisier-tree-1': {
    path: '/models/cerisier/cerisier-tree-1.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Cerisier Modèle 1'
  },
  'cerisier-tree-2': {
    path: '/models/cerisier/cerisier-tree-2.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Cerisier Modèle 2'
  },
  'cerisier-tree-3': {
    path: '/models/cerisier/cerisier-tree-3.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Cerisier Modèle 3'
  },
  'cerisier-general': {
    path: '/models/cerisier/cerisier-general.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 8,
    nom: 'Cerisier (Générique)'
  },
  
  // === ÉRABLES ===
  // À ajouter quand vous uploadez des érables
  'erable-general': {
    path: '/models/erable/erable-general.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 8,
    nom: 'Érable (Générique)'
  },
  
  // === MAGNOLIAS ===
  // À ajouter quand vous uploadez des magnolias
  'magnolia-general': {
    path: '/models/magnolia/magnolia-general.glb',
    type: 'glb',
    scale: 0.5,
    rotation: [0, 0, 0],
    hauteurReelle: 10,
    nom: 'Magnolia (Générique)'
  }
};

// Mapping des arbres de la base de données vers les modèles 3D
// Clé = ID de l'arbre dans arbustesData.js
// Valeur = ID du modèle dans MODELES_ARBRES
export const ARBRE_TO_MODEL = {
  // Cerisiers (modèles depuis upload/cerisier/)
  'cerisier-kanzan': 'cerisier-tree-1',
  'cerisier-accolade': 'cerisier-tree-1',
  'cerisier-sunset': 'cerisier-tree-2',
  
  // Érables (ajouter vos modèles dans upload/erable/)
  'erable-japon': 'cerisier-tree-3',
  
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

