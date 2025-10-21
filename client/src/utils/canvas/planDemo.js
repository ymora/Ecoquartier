/**
 * planDemo.js
 * Plan personnalisé par défaut
 * Plan généré le 21/10/2025 23:23:30
 * Dimensions: 30m × 30m, Orientation: nord-haut
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Charger le plan personnalisé par défaut
 */
export const chargerPlanDemo = (canvas, echelle, ajouterGrille) => {
  if (!canvas) return;
  
  logger.info('Plan', 'Chargement du plan personnalisé');
  
  // Nettoyer le canvas (sauf grille, boussole, etc.)
  const objets = canvas.getObjects().filter(obj => 
    !obj.isGridLine && 
    !obj.measureLabel && 
    !obj.isBoussole && 
    !obj.isSolIndicator &&
    !obj.alignmentGuide &&
    !obj.isDimensionBox &&
    !obj.isAideButton &&
    !obj.isImageFond
  );
  objets.forEach(obj => canvas.remove(obj));
  
  // ========== MAISON ==========
  const maison = new fabric.Rect({
    left: 82.0,
    top: -187.0,
    width: 403.0,
    height: 403.0,
    fill: '#bdbdbd',
    stroke: '#757575',
    strokeWidth: 3,
    customType: 'maison',
    profondeurFondations: 1.2,
    hauteurBatiment: 7
  });
  canvas.add(maison);
  
  // ========== CITERNE 1 ==========
  canvas.add(new fabric.Circle({
    left: 520.0,
    top: 278.0,
    radius: 30.0,
    fill: 'rgba(33, 150, 243, 0.3)',
    stroke: '#1976d2',
    strokeWidth: 3,
    customType: 'citerne',
    profondeur: 2.5,
    diametre: 1.5,
    originX: 'center',
    originY: 'center'
  }));
  
  // ========== PAVÉ ENHERBÉ 1 ==========
  canvas.add(new fabric.Rect({
    left: 82.0,
    top: 210.0,
    width: 241.3,
    height: 279.3,
    fill: 'rgba(139, 195, 74, 0.3)',
    stroke: '#7cb342',
    strokeWidth: 2,
    customType: 'paves'
  }));
  
  // NOTE: Les arbres seront ajoutés via la sélection d'arbres
  // Cerisier du Japon Kanzan (prunus-kanzan) - Position: 387.6,362.0 px | 9.69,9.05 m
  // Cerisier Accolade (prunus-accolade) - Position: 784.0,110.0 px | 19.60,2.75 m
  // Cerisier Sunset Boulevard (prunus-sunset-boulevard) - Position: 624.0,-349.0 px | 15.60,-8.72 m
  
  // Re-ajouter la grille
  if (ajouterGrille) ajouterGrille(canvas);
  
  canvas.renderAll();
  
  logger.info('Planificateur', '✅ Plan personnalisé chargé (maison, citerne, pavé enherbé)');
};
