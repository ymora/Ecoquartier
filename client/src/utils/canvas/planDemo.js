/**
 * planDemo.js
 * Plan personnalisé par défaut avec LABELS COMPLETS
 * Plan généré le 23/10/2025 05:46:12
 * Dimensions: 30m × 30m, Orientation: nord-haut
 * Position sud (boussole): bas ⬇️
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Charger le plan personnalisé par défaut
 */
export const chargerPlanDemo = (canvas, echelle, ajouterGrille) => {
  if (!canvas) return;
  
  logger.info('Plan', 'Chargement du plan personnalisé');
  
  // Forcer le rechargement en supprimant le localStorage
  localStorage.removeItem('planTerrain');
  
  // Nettoyer le canvas (sauf grille, boussole, etc.)
  const objets = canvas.getObjects().filter(obj => 
    !obj.isGridLine && 
    !obj.measureLabel && 
    !obj.isBoussole && 
    !obj.isSolIndicator &&
    !obj.alignmentGuide &&
    !obj.isDimensionBox &&
    !obj.isAideButton &&
    !obj.isImageFond &&
    !obj.isCenterMark
  );
  objets.forEach(obj => canvas.remove(obj));
  
  // Calculer le centre du canvas pour positionner la maison 1
  const posMaison1X = canvas.width / 2;
  const posMaison1Y = canvas.height / 2;
  
  // Calculer le décalage nécessaire pour centrer la maison 1
  // L'ancienne position était à left: -318.0, top: -115.1
  const deltaX = posMaison1X - (-318.0);
  const deltaY = posMaison1Y - (-115.1);
  
  // ========== MAISON 1 avec LABELS ==========
  const largeurMaison1 = 10.15;
  const hauteurMaison1 = 10.15;
  
  const maison1Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurMaison1 * echelle,
    height: hauteurMaison1 * echelle,
    fill: '#bdbdbd',
    stroke: '#757575',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconeMaison1 = Math.min(largeurMaison1 * echelle, hauteurMaison1 * echelle) * 0.4;
  const maison1Icone = new fabric.Text('🏠', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconeMaison1, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const maison1Group = new fabric.Group([maison1Rect, maison1Icone], {
    left: posMaison1X,
    top: posMaison1Y,
    customType: 'maison',
    profondeurFondations: 1.2,
    hauteurBatiment: 7,
    elevationSol: 0,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(maison1Group);
  
  // ========== MAISON 2 avec LABELS ==========
  const largeurMaison2 = 10.185;
  const hauteurMaison2 = 10.18;
  
  const maison2Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurMaison2 * echelle,
    height: hauteurMaison2 * echelle,
    fill: '#bdbdbd',
    stroke: '#757575',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconeMaison2 = Math.min(largeurMaison2 * echelle, hauteurMaison2 * echelle) * 0.4;
  const maison2Icone = new fabric.Text('🏠', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconeMaison2, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const maison2Group = new fabric.Group([maison2Rect, maison2Icone], {
    left: 87.0 + deltaX,
    top: -187.2 + deltaY,
    customType: 'maison',
    profondeurFondations: 1.2,
    hauteurBatiment: 7,
    elevationSol: 0,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(maison2Group);
  
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
    left: 440.0 + deltaX,
    top: 162.0 + deltaY,
    customType: 'caisson-eau',
    largeurCaisson: largeurCaisson,
    profondeurCaisson: profondeurCaisson,
    hauteurCaisson: hauteurCaisson,
    profondeurEnterree: 1.0,
    elevationSol: 0,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(caissonGroup);
  
  // ========== TERRASSE 1 avec LABELS ==========
  const largeurTerrasse1 = 2.06;
  const hauteurTerrasse1 = 2.37;
  
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
  const terrasse1Icone = new fabric.Text('🪴', {
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
    left: 246.9 + deltaX,
    top: -438.3 + deltaY,
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3,
    elevationSol: 0,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(terrasse1Group);
  
  // ========== TERRASSE 2 avec LABELS (ROTATED 90°) ==========
  const largeurTerrasse2 = 6.62;
  const hauteurTerrasse2 = 5.21;
  
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
  const terrasse2Icone = new fabric.Text('🪴', {
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
    left: 394.1 + deltaX,
    top: -353.3 + deltaY,
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3,
    angle: 90,
    elevationSol: 0,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(terrasse2Group);
  
  // ========== TERRASSE 3 avec LABELS ==========
  const largeurTerrasse3 = 7.37;
  const hauteurTerrasse3 = 5.21;
  
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
  const terrasse3Icone = new fabric.Text('🪴', {
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
    left: 58.6 + deltaX,
    top: -495.3 + deltaY,
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3,
    elevationSol: 0,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(terrasse3Group);
  
  // ========== PAVÉ ENHERBÉ 1 avec LABELS ==========
  const largeurPaves1 = 5.1;
  const hauteurPaves1 = 5.1;
  
  const paves1Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurPaves1 * echelle,
    height: hauteurPaves1 * echelle,
    fill: 'rgba(139, 195, 74, 0.3)',
    stroke: '#7cb342',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconePaves1 = Math.min(largeurPaves1 * echelle, hauteurPaves1 * echelle) * 0.4;
  const paves1Icone = new fabric.Text('🌿', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconePaves1, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const paves1Group = new fabric.Group([paves1Rect, paves1Icone], {
    left: -215.7 + deltaX,
    top: 190.4 + deltaY,
    customType: 'paves',
    hauteurPaves: 0.08,
    profondeurGravier: 0.15,
    elevationSol: 0,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(paves1Group);
  
  // ========== PAVÉ ENHERBÉ 2 avec LABELS ==========
  const largeurPaves2 = 6.28;
  const hauteurPaves2 = 6.99;
  
  const paves2Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurPaves2 * echelle,
    height: hauteurPaves2 * echelle,
    fill: 'rgba(139, 195, 74, 0.3)',
    stroke: '#7cb342',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIconePaves2 = Math.min(largeurPaves2 * echelle, hauteurPaves2 * echelle) * 0.4;
  const paves2Icone = new fabric.Text('🌿', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIconePaves2, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const paves2Group = new fabric.Group([paves2Rect, paves2Icone], {
    left: 10.6 + deltaX,
    top: 152.5 + deltaY,
    customType: 'paves',
    hauteurPaves: 0.08,
    profondeurGravier: 0.15,
    elevationSol: 0,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(paves2Group);
  
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
