/**
 * planDemo.js
 * Plan personnalisé par défaut - NOUVELLE VERSION JSON
 * Utilise un fichier JSON pour une gestion plus flexible
 * Dimensions: 30m × 30m, Orientation: nord-gauche
 * Position sud (boussole): droite ➡️
 */

import { chargerPlanFromJSON } from './planLoader';
import logger from '../logger';

/**
 * Charger le plan personnalisé par défaut (version JSON)
 * ✅ RÉUTILISE les fonctions existantes de creerObjets.js
 */
export const chargerPlanDemo = async (canvas, echelle, ajouterGrille) => {
  if (!canvas) return;
  
  logger.info('Plan', 'Chargement du plan personnalisé (version JSON)');
  
  // Forcer le rechargement en supprimant le localStorage
  localStorage.removeItem('planTerrain');
  
  // Utiliser le loader JSON qui réutilise le code existant
  await chargerPlanFromJSON(canvas, echelle, ajouterGrille);
};