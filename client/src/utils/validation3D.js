/**
 * validation3D.js
 * Validation 3D avec le système centralisé
 * SIMPLIFIÉ : Utilise le système unifié depuis utils/validation
 */

import { validerArbre3D } from './validation';

/**
 * Valider tous les arbres en 3D
 * Retourne un Map avec arbre index → validationStatus
 * 
 * @param {Array} tousLesArbres - Tous les arbres [{position, arbreData}, ...]
 * @param {Array} maisons - Tableau des maisons
 * @param {Array} canalisations - Liste des canalisations
 * @param {Array} citernes - Liste des citernes
 * @param {Array} clotures - Liste des clôtures
 * @param {Array} terrasses - Liste des terrasses
 * @param {Object} options - Options (couchesSol, orientation)
 * @returns {Map} Map(index → {status, messages})
 */
export const validerArbres3D = (tousLesArbres, maisons, canalisations, citernes, clotures, terrasses, options = {}) => {
  const validationMap = new Map();
  
  // Préparer la scène pour le système de validation
  const scene = {
    arbres: tousLesArbres,
    maisons,
    canalisations,
    citernes,
    clotures,
    terrasses
  };
  
  // Valider chaque arbre
  tousLesArbres.forEach((arbre, idx) => {
    const resultat = validerArbre3D(
      arbre.arbreData,
      arbre.position,
      idx,
      scene,
      options
    );
    
    validationMap.set(idx, {
      status: resultat.status,
      messages: resultat.messages,
      conseils: resultat.conseils,
      pourcentageMin: resultat.pourcentageMin
    });
  });
  
  return validationMap;
};
