/**
 * planDemo.js
 * Plan personnalisé par défaut avec LABELS COMPLETS
 * Plan généré le 22/10/2025 14:28:15
 * Dimensions: 30m × 30m, Orientation: nord-bas
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
  
  // ========== MAISON avec LABELS ==========
  const largeurMaison = 10.305;
  const hauteurMaison = 11.285;
  
  const maisonRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurMaison * echelle,
    height: hauteurMaison * echelle,
    fill: '#bdbdbd',
    stroke: '#757575',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconeMaison = Math.min(largeurMaison * echelle, hauteurMaison * echelle) * 0.4;
  const maisonIcone = new fabric.Text('🏠', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconeMaison, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const maisonGroup = new fabric.Group([maisonRect, maisonIcone], {
    left: 81.3,
    top: -163.0,
    customType: 'maison',
    profondeurFondations: 1.2,
    hauteurBatiment: 7,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(maisonGroup);
  
  // ========== CAISSON D'EAU avec LABELS ==========
  const largeurCaisson = 5;
  const profondeurCaisson = 3;
  const hauteurCaisson = 1;
  const volumeCaisson = (largeurCaisson * profondeurCaisson * hauteurCaisson).toFixed(1);
  
  const caissonRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurCaisson * echelle,
    height: profondeurCaisson * echelle,
    fill: 'rgba(33, 150, 243, 0.25)',
    stroke: '#1565c0',
    strokeWidth: 3,
    strokeDashArray: [5, 3],
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconeCaisson = Math.min(largeurCaisson * echelle, profondeurCaisson * echelle) * 0.4;
  const caissonIcone = new fabric.Text('💦', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconeCaisson, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const caissonGroup = new fabric.Group([caissonRect, caissonIcone], {
    left: 440.0,
    top: 162.0,
    customType: 'caisson-eau',
    largeurCaisson: largeurCaisson,
    profondeurCaisson: profondeurCaisson,
    hauteurCaisson: hauteurCaisson,
    profondeurEnterree: 1.0,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(caissonGroup);
  
  // ========== TERRASSE 1 avec LABELS ==========
  const largeurTerrasse1 = 2.01;
  const hauteurTerrasse1 = 2.32;
  
  const terrasse1Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurTerrasse1 * echelle,
    height: hauteurTerrasse1 * echelle,
    fill: 'rgba(158, 158, 158, 0.4)',
    stroke: '#757575',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconeTerrasse1 = Math.min(largeurTerrasse1 * echelle, hauteurTerrasse1 * echelle) * 0.4;
  const terrasse1Icone = new fabric.Text('🪵', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconeTerrasse1, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const terrasse1Group = new fabric.Group([terrasse1Rect, terrasse1Icone], {
    left: 246.2,
    top: -433.6,
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(terrasse1Group);
  
  // ========== TERRASSE 2 avec LABELS (ROTATED 90°) ==========
  const largeurTerrasse2 = 6.57;
  const hauteurTerrasse2 = 5.16;
  
  const terrasse2Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurTerrasse2 * echelle,
    height: hauteurTerrasse2 * echelle,
    fill: 'rgba(158, 158, 158, 0.4)',
    stroke: '#757575',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconeTerrasse2 = Math.min(largeurTerrasse2 * echelle, hauteurTerrasse2 * echelle) * 0.4;
  const terrasse2Icone = new fabric.Text('🪵', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconeTerrasse2, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const terrasse2Group = new fabric.Group([terrasse2Rect, terrasse2Icone], {
    left: 388.7,
    top: -350.8,
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3,
    angle: 90,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(terrasse2Group);
  
  // ========== TERRASSE 3 avec LABELS ==========
  const largeurTerrasse3 = 7.32;
  const hauteurTerrasse3 = 5.16;
  
  const terrasse3Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurTerrasse3 * echelle,
    height: hauteurTerrasse3 * echelle,
    fill: 'rgba(158, 158, 158, 0.4)',
    stroke: '#757575',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconeTerrasse3 = Math.min(largeurTerrasse3 * echelle, hauteurTerrasse3 * echelle) * 0.4;
  const terrasse3Icone = new fabric.Text('🪵', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconeTerrasse3, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const terrasse3Group = new fabric.Group([terrasse3Rect, terrasse3Icone], {
    left: 59.9,
    top: -491.0,
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(terrasse3Group);
  
  // ========== PAVÉ ENHERBÉ 1 avec LABELS ==========
  const largeurPaves = 6.18;
  const hauteurPaves = 8.15;
  
  const pavesRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurPaves * echelle,
    height: hauteurPaves * echelle,
    fill: 'rgba(139, 195, 74, 0.3)',
    stroke: '#7cb342',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconePaves = Math.min(largeurPaves * echelle, hauteurPaves * echelle) * 0.4;
  const pavesIcone = new fabric.Text('🌿', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconePaves, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const pavesGroup = new fabric.Group([pavesRect, pavesIcone], {
    left: -0.5,
    top: 225.8,
    customType: 'paves',
    hauteurPaves: 0.08,
    profondeurGravier: 0.15,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(pavesGroup);
  
  // NOTE: Les arbres seront ajoutés via la sélection d'arbres
  // Cerisier du Japon Kanzan (prunus-kanzan) - Position: 387.6,362.0 px | 9.69,9.05 m
  // Cerisier Accolade (prunus-accolade) - Position: 784.0,110.0 px | 19.60,2.75 m
  // Cerisier Sunset Boulevard (prunus-sunset-boulevard) - Position: 624.0,-349.0 px | 15.60,-8.72 m
  
  // Re-ajouter la grille
  if (ajouterGrille) ajouterGrille(canvas);
  
  canvas.renderAll();
  
  // NOTE: Cerisier du Japon Kanzan à ajouter via le menu Outils
  // Position suggérée: 1256.0,376.0 px | 31.40,9.40 m
  
  logger.info('Planificateur', '✅ Plan personnalisé chargé avec labels (maison, caisson, 3 terrasses, pavé enherbé)');
};
