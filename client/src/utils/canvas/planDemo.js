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
 * ✅ Utilise maintenant votre plan personnalisé par défaut
 */
export const chargerPlanDemo = async (canvas, echelle, ajouterGrille) => {
  if (!canvas) return;
  
  logger.info('Plan', 'Chargement de votre plan personnalisé par défaut');
  
  // Forcer le rechargement en supprimant le localStorage
  localStorage.removeItem('planTerrain');
  
  // Utiliser votre plan personnalisé par défaut
  await chargerPlanFromJSON(canvas, echelle, ajouterGrille, '/src/utils/canvas/planPersonnalise.json');
};