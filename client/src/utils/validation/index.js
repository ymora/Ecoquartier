/**
 * index.js
 * Point d'entrée du système de validation unifié
 * Export de toutes les fonctions nécessaires
 */

// Import des fonctions pour usage interne
import { validerArbre } from './validationCore';
import { collecterCriteres2D, collecterCriteres3D } from './validationAdapter';

// Core validation logic (pure functions)
export {
  validerArbre,
  extraireDistancesMin,
  calculerDistanceMinEntreArbres,
  getCouleursPourStatut,
  getIconePourStatut
} from './validationCore';

// Adapters for 2D and 3D
export {
  collecterCriteres2D,
  collecterCriteres3D
} from './validationAdapter';

/**
 * Fonction helper pour valider un arbre en 2D
 * @param {Object} arbreGroup - Groupe Fabric.js
 * @param {Object} canvas - Canvas Fabric.js
 * @param {number} echelle - Échelle pixels par mètre
 * @param {Object} options - Options (couchesSol, orientation)
 * @returns {Object} Résultat de validation
 */
export function validerArbre2D(arbreGroup, canvas, echelle, options = {}) {
  if (!arbreGroup?.arbreData) {
    return {
      pourcentageMin: 100,
      status: 'ok',
      messages: ['✅ Position conforme'],
      conseils: [],
      pourcentageCritique: 100
    };
  }
  
  const criteres = collecterCriteres2D(arbreGroup, canvas, echelle);
  return validerArbre(arbreGroup.arbreData, criteres, options);
}

/**
 * Fonction helper pour valider un arbre en 3D
 * @param {Object} arbreData - Données de l'arbre
 * @param {Array} position - Position [x, y, z]
 * @param {number} arbreIndex - Index de l'arbre
 * @param {Object} scene - Objets de la scène 3D
 * @param {Object} options - Options (couchesSol, orientation)
 * @returns {Object} Résultat de validation
 */
export function validerArbre3D(arbreData, position, arbreIndex, scene, options = {}) {
  const criteres = collecterCriteres3D(
    arbreData,
    position,
    arbreIndex,
    scene.arbres,
    scene.maisons,
    scene.canalisations,
    scene.citernes,
    scene.clotures,
    scene.terrasses
  );
  return validerArbre(arbreData, criteres, options);
}

